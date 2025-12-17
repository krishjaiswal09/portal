
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, BookOpen, CreditCard, Settings, MessageSquare } from "lucide-react";
import { type User as UserType } from "@/components/user-management/mockData";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { SectionLoader } from "@/components/ui/loader";
import { format } from "date-fns";

interface TimelineTabProps {
  user: UserType;
}

interface ActivityData {
  id: number;
  activity_description: string;
  user_id: number;
  performed_by: number;
  created_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  performed_by_first_name: string;
  performed_by_last_name: string;
  performed_by_email: string;
}

const getActivityIcon = (description: string) => {
  if (description.includes('user created')) return User;
  if (description.includes('class') || description.includes('lesson')) return BookOpen;
  if (description.includes('credit') || description.includes('payment')) return CreditCard;
  if (description.includes('message')) return MessageSquare;
  return Settings;
};

const getActivityColor = (description: string) => {
  if (description.includes('user created')) return { color: 'text-blue-600', bgColor: 'bg-blue-100' };
  if (description.includes('class') || description.includes('lesson')) return { color: 'text-purple-600', bgColor: 'bg-purple-100' };
  if (description.includes('credit') || description.includes('payment')) return { color: 'text-green-600', bgColor: 'bg-green-100' };
  if (description.includes('message')) return { color: 'text-orange-600', bgColor: 'bg-orange-100' };
  return { color: 'text-gray-600', bgColor: 'bg-gray-100' };
};

export function TimelineTab({ user }: TimelineTabProps) {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('');

  const { data: activities, isLoading } = useQuery({
    queryKey: ['userActivities', user.id],
    queryFn: () => fetchApi<ActivityData[]>({
      path: `activity/user/${user.id}`
    })
  });

  const transformedActivities = activities?.map(activity => ({
    id: activity.id.toString(),
    date: format(new Date(activity.created_at), 'MMM dd'),
    time: format(new Date(activity.created_at), 'h:mm a'),
    title: activity.activity_description.split(':')[0] || 'Activity',
    description: activity.activity_description,
    studentName: `${activity.user_first_name} ${activity.user_last_name}`,
    performedBy: `${activity.performed_by_first_name} ${activity.performed_by_last_name}`,
    icon: getActivityIcon(activity.activity_description),
    ...getActivityColor(activity.activity_description)
  })) || [];

  const studentFilterOptions = [
    { label: 'All Activities', value: '' },
    { label: user.name, value: user.name }
  ];

  const filteredTimelineData = selectedStudentFilter 
    ? transformedActivities.filter(activity => activity.studentName === selectedStudentFilter)
    : transformedActivities;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="student-timeline-filter" className="text-sm font-medium">Filter by Family Member</Label>
              <SearchableSelect
                options={studentFilterOptions}
                value={selectedStudentFilter}
                onValueChange={setSelectedStudentFilter}
                placeholder="Select family member..."
                searchPlaceholder="Search family members..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Timeline
            {selectedStudentFilter && (
              <span className="text-sm font-normal text-muted-foreground">
                - {selectedStudentFilter}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionLoader text="Loading activities..." />
          ) : filteredTimelineData.length > 0 ? (
            <div className="space-y-6">
              {filteredTimelineData.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-4 relative">
                    {index !== filteredTimelineData.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                    )}
                    
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${activity.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-muted">
                              {getInitials(activity.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{activity.studentName}</span>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {activity.date}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-muted-foreground text-lg">
                {selectedStudentFilter 
                  ? `No activities found for ${selectedStudentFilter}` 
                  : 'No timeline activities yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
