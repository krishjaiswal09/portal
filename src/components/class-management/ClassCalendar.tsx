
import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Class } from '@/types/class';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ClassCalendarProps {
  classes: Class[];
  onClassClick: (classItem: Class) => void;
  onClassUpdate: (id: string, updates: any) => void;
}

export function ClassCalendar({ classes, onClassClick, onClassUpdate }: ClassCalendarProps) {
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const calendarRef = useRef<FullCalendar>(null);
  const { toast } = useToast();

  // Convert classes to FullCalendar events with proper date formatting
  const events = classes.map((classItem) => {
    const startDateTime = new Date(`${classItem.startDate}T${classItem.startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + classItem.duration * 60000);
    
    console.log('Creating event:', {
      title: classItem.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    });

    return {
      id: classItem.id,
      title: classItem.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      backgroundColor: getCategoryColor(classItem.category),
      borderColor: getCategoryColor(classItem.category),
      textColor: '#ffffff',
      extendedProps: {
        classData: classItem,
        instructor: classItem.instructor,
        category: classItem.category,
        enrolledStudents: classItem.enrolledStudents,
        maxStudents: classItem.maxStudents
      }
    };
  });

  function getCategoryColor(category: string) {
    const colorMap = {
      'DANCE': '#8B5CF6',
      'VOCAL': '#10B981', 
      'INSTRUMENT': '#F59E0B',
      'WORKSHOP': '#EF4444'
    };
    return colorMap[category] || '#6B7280';
  }

  const handleEventClick = (info: any) => {
    const classData = info.event.extendedProps.classData;
    onClassClick(classData);
  };

  const handleEventDrop = (info: any) => {
    const classData = info.event.extendedProps.classData;
    const newStart = info.event.start;
    const newDate = newStart.toISOString().split('T')[0];
    const newTime = newStart.toTimeString().slice(0, 5);
    
    onClassUpdate(classData.id, {
      startDate: newDate,
      startTime: newTime
    });

    toast({
      title: "Class Rescheduled",
      description: `${classData.title} moved to ${newDate} at ${newTime}`,
    });
  };

  const changeView = (view: string) => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  const navigateCalendar = (direction: 'prev' | 'next' | 'today') => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      if (direction === 'prev') api.prev();
      else if (direction === 'next') api.next();
      else api.today();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Class Calendar
          </CardTitle>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Navigation Controls */}
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateCalendar('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateCalendar('today')}
                className="px-3"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateCalendar('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* View Controls */}
            <div className="flex rounded-md border bg-muted p-1">
              <Button
                variant={currentView === 'dayGridMonth' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeView('dayGridMonth')}
                className="text-xs"
              >
                Month
              </Button>
              <Button
                variant={currentView === 'timeGridWeek' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeView('timeGridWeek')}
                className="text-xs"
              >
                Week
              </Button>
              <Button
                variant={currentView === 'timeGridDay' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeView('timeGridDay')}
                className="text-xs"
              >
                Day
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Color Legend */}
        <div className="flex flex-wrap gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8B5CF6' }}></div>
            <span className="text-sm">Dance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-sm">Vocal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
            <span className="text-sm">Instrument</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div>
            <span className="text-sm">Workshop</span>
          </div>
        </div>

        <div className="calendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            headerToolbar={false}
            events={events}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            editable={true}
            droppable={true}
            height="auto"
            dayMaxEvents={3}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            nowIndicator={true}
            weekends={true}
            eventDidMount={(info) => {
              const event = info.event;
              const props = event.extendedProps;
              
              // Add tooltip with class details
              info.el.setAttribute('title', 
                `${event.title}\nInstructor: ${props.instructor}\nStudents: ${props.enrolledStudents}/${props.maxStudents}`
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
