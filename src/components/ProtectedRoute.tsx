
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/user'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Role-based routing
  if (user) {
    const isStudentRoute = location.pathname.startsWith('/student')
    const isInstructorRoute = location.pathname.startsWith('/instructor')
    const isParentRoute = location.pathname.startsWith('/parent')
    const isAdminRoute = !isStudentRoute && !isInstructorRoute && !isParentRoute

    // Redirect based on user role and current route
    if (user.role === UserRole.STUDENT) {
      // Students can only access student routes
      if (!isStudentRoute && location.pathname !== '/student') {
        return <Navigate to="/student" replace />
      }
    } else if (user.role === UserRole.INSTRUCTOR) {
      // Instructors can only access instructor routes
      if (!isInstructorRoute && location.pathname !== '/instructor') {
        return <Navigate to="/instructor" replace />
      }
    } else if (user.role === UserRole.PARENT) {
      // Parents can only access parent routes
      if (!isParentRoute && location.pathname !== '/parent') {
        return <Navigate to="/parent" replace />
      }
    } else {
      // Admins and other roles can access admin routes
      if (isStudentRoute || isInstructorRoute || isParentRoute) {
        return <Navigate to="/" replace />
      }
    }
  }

  return <>{children}</>
}
