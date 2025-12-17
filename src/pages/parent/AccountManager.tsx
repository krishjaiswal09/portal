
import React from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Phone, Mail, MessageCircle, Calendar, Star, Clock } from "lucide-react"

export default function AccountManager() {
  const accountManager = {
    name: "Ms. Kavita Sharma",
    role: "Senior Parent Manager",
    email: "kavita.sharma@artgharana.com",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    avatar: null,
    experience: "5+ years",
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Mon-Fri, 9 AM - 6 PM",
    rating: 4.8,
    totalParents: 150
  }

  const recentInteractions = [
    {
      id: 1,
      date: "2024-01-18",
      type: "call",
      duration: "15 min",
      topic: "Schedule adjustment for vacation",
      status: "resolved"
    },
    {
      id: 2,
      date: "2024-01-10",
      type: "email",
      topic: "Progress report discussion",
      status: "resolved"
    },
    {
      id: 3,
      date: "2024-01-05",
      type: "whatsapp",
      topic: "Class timings query",
      status: "resolved"
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      date: "2024-01-25",
      time: "10:00 AM",
      type: "Progress Review Meeting",
      duration: "30 min",
      mode: "Video Call"
    }
  ]

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-green-500" />
      case 'email':
        return <Mail className="w-4 h-4 text-blue-500" />
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-600" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <ParentDashboardLayout title="Account Manager">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Your Account Manager
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Connect with your dedicated support manager
          </p>
        </div>

        {/* Account Manager Profile */}
        <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={accountManager.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xl font-semibold">
                  {accountManager.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-gray-900">{accountManager.name}</h2>
                  <p className="text-gray-600">{accountManager.role}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{accountManager.rating}</span>
                    <span className="text-gray-500">rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{accountManager.totalParents}+ parents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{accountManager.experience} experience</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {accountManager.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-playfair font-bold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">{accountManager.phone}</p>
                  <p className="text-sm text-gray-500">Direct phone line</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">{accountManager.email}</p>
                  <p className="text-sm text-gray-500">Email support</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">{accountManager.whatsapp}</p>
                  <p className="text-sm text-gray-500">WhatsApp messaging</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-playfair font-bold">Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">{accountManager.availability}</p>
                  <p className="text-sm text-gray-500">IST (Indian Standard Time)</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Available Now</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Typically responds within 1 hour</p>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Interactions & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-playfair font-bold">Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {getInteractionIcon(interaction.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{interaction.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(interaction.date).toLocaleDateString()}
                        </span>
                        {interaction.duration && (
                          <span className="text-xs text-gray-500">• {interaction.duration}</span>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                      {interaction.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-playfair font-bold">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-blue-900">{appointment.type}</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                            <span>Duration: {appointment.duration}</span>
                            <span>Mode: {appointment.mode}</span>
                          </div>
                        </div>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <Button size="sm" variant="outline" className="mt-3 border-blue-200 text-blue-700 hover:bg-blue-100">
                        Join Meeting
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Button size="sm" className="mt-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Schedule a Meeting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  )
}
