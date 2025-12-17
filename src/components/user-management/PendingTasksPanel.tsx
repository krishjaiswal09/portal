
import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Clock, User, CreditCard, UserCheck, AlertCircle, CheckCircle } from "lucide-react"

interface PendingTasksPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface PendingTask {
  id: string
  type: 'approval' | 'verification' | 'payment' | 'review'
  title: string
  description: string
  user: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  dueDate: string
}

export function PendingTasksPanel({ isOpen, onOpenChange }: PendingTasksPanelProps) {
  const mockTasks: PendingTask[] = [
    {
      id: '1',
      type: 'approval',
      title: 'Instructor Application',
      description: 'Priya Sharma has applied to become a Bharatanatyam instructor',
      user: 'Priya Sharma',
      priority: 'high',
      createdAt: '2024-01-15',
      dueDate: '2024-01-20'
    },
    {
      id: '2',
      type: 'verification',
      title: 'Identity Verification',
      description: 'John Smith requires identity verification for adult account',
      user: 'John Smith',
      priority: 'medium',
      createdAt: '2024-01-14',
      dueDate: '2024-01-21'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Issue',
      description: 'Emma Johnson payment failed - requires manual review',
      user: 'Emma Johnson',
      priority: 'high',
      createdAt: '2024-01-13',
      dueDate: '2024-01-18'
    },
    {
      id: '4',
      type: 'review',
      title: 'Class Content Review',
      description: 'New Madhubani painting course content needs approval',
      user: 'Admin Review',
      priority: 'low',
      createdAt: '2024-01-12',
      dueDate: '2024-01-25'
    }
  ]

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'approval': return <UserCheck className="w-5 h-5" />
      case 'verification': return <User className="w-5 h-5" />
      case 'payment': return <CreditCard className="w-5 h-5" />
      case 'review': return <AlertCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'approval': return 'bg-blue-500 text-white'
      case 'verification': return 'bg-purple-500 text-white'
      case 'payment': return 'bg-primary text-primary-foreground'
      case 'review': return 'bg-green-500 text-white'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const handleApprove = (taskId: string) => {
    console.log('Approved task:', taskId)
  }

  const handleReject = (taskId: string) => {
    console.log('Rejected task:', taskId)
  }

  const handleReview = (taskId: string) => {
    console.log('Review task:', taskId)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-2xl font-playfair text-foreground flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Pending Tasks
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold text-red-500">
                      {mockTasks.filter(t => t.priority === 'high').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{mockTasks.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Active Tasks</h3>
            
            {mockTasks.map((task) => (
              <Card key={task.id} className="border-border bg-card hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Task Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(task.type)}`}>
                          {getTaskIcon(task.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.user}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>

                    {/* Task Description */}
                    <p className="text-sm text-muted-foreground pl-12">
                      {task.description}
                    </p>

                    {/* Task Meta */}
                    <div className="flex items-center justify-between pl-12">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {task.createdAt}</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pl-12">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(task.id)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      
                      {task.type === 'approval' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(task.id)}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReview(task.id)}
                        className="border-border text-foreground hover:bg-accent"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {mockTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-foreground font-medium">All caught up!</p>
              <p className="text-muted-foreground text-sm">No pending tasks at the moment.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
