
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Download, Eye } from 'lucide-react';

const revenueData = [{
  month: 'Jan',
  revenue: 45000,
  students: 120
}, {
  month: 'Feb',
  revenue: 52000,
  students: 135
}, {
  month: 'Mar',
  revenue: 48000,
  students: 128
}, {
  month: 'Apr',
  revenue: 61000,
  students: 156
}, {
  month: 'May',
  revenue: 55000,
  students: 142
}, {
  month: 'Jun',
  revenue: 67000,
  students: 178
}];

const classData = [{
  day: 'Mon',
  classes: 12,
  attendance: 85
}, {
  day: 'Tue',
  classes: 15,
  attendance: 92
}, {
  day: 'Wed',
  classes: 18,
  attendance: 88
}, {
  day: 'Thu',
  classes: 14,
  attendance: 90
}, {
  day: 'Fri',
  classes: 16,
  attendance: 87
}, {
  day: 'Sat',
  classes: 22,
  attendance: 95
}, {
  day: 'Sun',
  classes: 8,
  attendance: 82
}];

const courseDistribution = [{
  name: 'Dance',
  value: 35,
  color: '#e56636'
}, {
  name: 'Music',
  value: 30,
  color: '#7d3b50'
}, {
  name: 'Art',
  value: 20,
  color: '#d2527c'
}, {
  name: 'Drama',
  value: 15,
  color: '#a855f7'
}];

export function ReportsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue & Student Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="students" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Course Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Classes */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Class Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="classes" fill="#8884d8" />
                <Bar dataKey="attendance" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
