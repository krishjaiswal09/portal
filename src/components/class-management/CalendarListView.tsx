
import { Class } from "@/types/class";
import { ClassTable } from "./ClassTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock } from "lucide-react";

interface CalendarListViewProps {
  classes: Class[];
  onEdit: (classItem: Class) => void;
  onDelete: (classId: string) => void;
  onJoin?: (classId: string) => void;
  onCancel?: (classId: string) => void;
  onReschedule?: (classId: string) => void;
}

export function CalendarListView({ 
  classes, 
  onEdit, 
  onDelete, 
  onJoin, 
  onCancel, 
  onReschedule 
}: CalendarListViewProps) {
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, cls) => sum + cls.enrolledStudents, 0);
  const avgDuration = Math.round(classes.reduce((sum, cls) => sum + cls.duration, 0) / classes.length) || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{totalClasses}</p>
              <p className="text-muted-foreground">Total Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-muted-foreground">Enrolled Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{avgDuration}m</p>
              <p className="text-muted-foreground">Avg Duration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Table */}
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassTable
            classes={classes}
            onEdit={onEdit}
            onDelete={onDelete}
            onJoin={onJoin}
            onCancel={onCancel}
            onReschedule={onReschedule}
          />
        </CardContent>
      </Card>
    </div>
  );
}
