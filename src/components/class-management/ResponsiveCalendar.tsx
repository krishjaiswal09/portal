
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useIsMobile } from '@/hooks/use-mobile'

interface ResponsiveCalendarProps {
  events: any[]
  onDateClick: (info: any) => void
  onEventClick: (info: any) => void
}

export function ResponsiveCalendar({ events, onDateClick, onEventClick }: ResponsiveCalendarProps) {
  const isMobile = useIsMobile()

  return (
    <div className="w-full">
      <style>{`
        .fc {
          font-size: ${isMobile ? '12px' : '14px'};
        }
        
        .fc-toolbar {
          flex-direction: ${isMobile ? 'column' : 'row'};
          gap: ${isMobile ? '8px' : '0'};
          margin-bottom: ${isMobile ? '16px' : '8px'};
        }
        
        .fc-toolbar-chunk {
          display: flex;
          justify-content: center;
          margin: ${isMobile ? '4px 0' : '0'};
        }
        
        .fc-button {
          padding: ${isMobile ? '4px 8px' : '6px 12px'};
          font-size: ${isMobile ? '11px' : '13px'};
          margin: ${isMobile ? '0 2px' : '0 4px'};
        }
        
        .fc-daygrid-day {
          min-height: ${isMobile ? '60px' : '80px'};
        }
        
        .fc-event {
          font-size: ${isMobile ? '10px' : '12px'};
          padding: ${isMobile ? '2px 4px' : '4px 6px'};
        }
        
        .fc-col-header-cell {
          padding: ${isMobile ? '4px 2px' : '8px 4px'};
        }
        
        .fc-daygrid-day-number {
          padding: ${isMobile ? '4px' : '8px'};
          font-size: ${isMobile ? '12px' : '14px'};
        }
        
        .fc-timegrid-slot {
          height: ${isMobile ? '30px' : '40px'};
        }
        
        .fc-timegrid-axis {
          width: ${isMobile ? '40px' : '60px'};
        }
        
        @media (max-width: 768px) {
          .fc-header-toolbar {
            flex-direction: column;
          }
          
          .fc-toolbar-chunk {
            margin: 4px 0;
          }
          
          .fc-button-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? "listWeek" : "dayGridMonth"}
        headerToolbar={{
          left: isMobile ? 'prev,next' : 'prev,next today',
          center: 'title',
          right: isMobile ? 'dayGridMonth,listWeek' : 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        height={isMobile ? 400 : 600}
        aspectRatio={isMobile ? 1.2 : 1.35}
        dayMaxEvents={isMobile ? 2 : 3}
        moreLinkClick="popover"
        eventDisplay="block"
        displayEventTime={!isMobile}
        allDaySlot={!isMobile}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        slotDuration="01:00:00"
        expandRows={true}
        stickyHeaderDates={!isMobile}
        nowIndicator={true}
        selectable={true}
        selectMirror={true}
        dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
      />
    </div>
  )
}
