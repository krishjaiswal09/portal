
import React, { useState } from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Star, Upload, Play, Users, Trophy, Music } from "lucide-react"

const EventsPerformances = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const mockEvents = [
    {
      id: "event-1",
      name: "Annual Classical Music Festival",
      date: "2024-07-15",
      description: "Showcase your classical music skills in our biggest annual event",
      status: "registered",
      canSubmitPerformance: true,
      hasSubmitted: false,
      registrationDeadline: "2024-07-10",
      venue: "Art Gharana Main Hall"
    },
    {
      id: "event-2", 
      name: "Bharatanatyam Dance Competition",
      date: "2024-08-20",
      description: "Compete with fellow dancers in this prestigious competition",
      status: "upcoming",
      canSubmitPerformance: false,
      hasSubmitted: false,
      registrationDeadline: "2024-08-15",
      venue: "Cultural Center Stage"
    },
    {
      id: "event-3",
      name: "Monthly Student Showcase",
      date: "2024-06-15", 
      description: "Monthly platform for students to showcase their progress",
      status: "closed",
      canSubmitPerformance: false,
      hasSubmitted: true,
      registrationDeadline: "2024-06-10",
      venue: "Online Platform"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'registered': return 'bg-green-100 text-green-800 border-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <StudentDashboardLayout title="Events & Performances">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Events & Performances</h1>
            <p className="text-gray-600 mt-1">Participate in events and showcase your talents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-4">
            {mockEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                    <div className="flex gap-1">
                      {event.hasSubmitted && <Trophy className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Event: {event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {event.registrationDeadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Venue: {event.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {event.status === 'upcoming' && (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Register Now
                      </Button>
                    )}
                    {event.canSubmitPerformance && !event.hasSubmitted && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Performance
                      </Button>
                    )}
                    {event.hasSubmitted && (
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        View Submission
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Submission Panel */}
          <div className="space-y-6">
            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Submit Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Performance Title</label>
                    <Input placeholder="Enter your performance title..." />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload Video</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI (Max 100MB)</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Performance Notes</label>
                    <Textarea 
                      placeholder="Add notes about your performance..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                      Submit Performance
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedEvent(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Performances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bharatanatyam Solo</p>
                      <p className="text-xs text-gray-500">June Showcase • Submitted</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Classical Vocal</p>
                      <p className="text-xs text-gray-500">May Competition • 2nd Place</p>
                    </div>
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}

export default EventsPerformances
