import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ParentLearnerProvider } from '@/contexts/ParentLearnerContext'

import { Suspense, lazy } from 'react'
import Policies from './pages/Policies'
import ParentMyCourseDetails from './pages/parent/ParentMyCourseDetails'
import { LoadingProvider } from './contexts/LoadingContext'
import { PageLoader } from './components/ui/loader'

const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const UserManagement = lazy(() => import('./pages/UserManagement'))
const UserDetails = lazy(() => import('./pages/UserDetails'))
const AddUser = lazy(() => import('./pages/AddUser'))
const FamilyDetails = lazy(() => import('./pages/FamilyDetails'))
const ManageInstructors = lazy(() => import('./pages/admin/instructors/ManageInstructors'))
const AddInstructor = lazy(() => import('./pages/AddInstructor'))
const InstructorProfile = lazy(() => import('./pages/InstructorProfile'))
const InstructorWorkingHours = lazy(() => import('./pages/InstructorWorkingHours'))
const InstructorAvailability = lazy(() => import('./pages/InstructorAvailability'))
const InstructorVacation = lazy(() => import('./pages/InstructorVacation'))
const CourseManagement = lazy(() => import('./pages/CourseManagement'))
const CreateCourse = lazy(() => import('./pages/CreateCourse'))
const CourseSettings = lazy(() => import('./pages/CourseSettings'))
const CourseCatalog = lazy(() => import('./pages/CourseCatalog'))
const AdminCourseDetail = lazy(() => import('./pages/CourseDetail'))
const ClassManagement = lazy(() => import('./pages/ClassManagement'))
const CreateClass = lazy(() => import('./pages/CreateClass'))
const DemoManagement = lazy(() => import('./pages/DemoManagement'))
const CreateDemo = lazy(() => import('./pages/CreateDemo'))
const CreditPaymentManagement = lazy(() => import('./pages/CreditPaymentManagement'))
const InstructorPayments = lazy(() => import('./pages/finance/InstructorPayments'))
const StudentTransactions = lazy(() => import('./pages/StudentTransactions'))
const AdminSettings = lazy(() => import('./pages/AdminSettings'))

// Reports
const Reports = lazy(() => import('./pages/reports/Reports'))
const TimelineReport = lazy(() => import('./pages/reports/TimelineReport'))
const ILTReport = lazy(() => import('./pages/reports/ILTReport'))
const RecordingsReport = lazy(() => import('./pages/reports/RecordingsReport'))
const ClassCreditReport = lazy(() => import('./pages/reports/ClassCreditReport'))
const LateJoiningReport = lazy(() => import('./pages/reports/LateJoiningReport'))
const LeadSourceReport = lazy(() => import('./pages/reports/LeadSourceReport'))
const ReservedSlotManager = lazy(() => import('./pages/reports/ReservedSlotManager'))

// Instructor
const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard'))
const InstructorProfilePage = lazy(() => import('./pages/instructor/Profile'))
const InstructorClasses = lazy(() => import('./pages/instructor/Classes'))
const InstructorStudents = lazy(() => import('./pages/instructor/MyStudents'))
const InstructorCalendar = lazy(() => import('./pages/instructor/Availability'))
const InstructorWorkingHoursPage = lazy(() => import('./pages/instructor/WorkingHours'))
const InstructorVacationPage = lazy(() => import('./pages/instructor/Vacation'))
const InstructorResourceLibrary = lazy(() => import('./pages/instructor/Support'))
const InstructorTransactions = lazy(() => import('./pages/instructor/Transactions'))
const MessagesResources = lazy(() => import('./pages/instructor/MessagesResources'))
const StudentProgress = lazy(() => import('./pages/instructor/StudentProgress'))

// Student
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const MyClasses = lazy(() => import('./pages/student/MyClasses'))
const ClassHistory = lazy(() => import('./pages/student/ClassHistory'))
const ProgressReport = lazy(() => import('./pages/student/ProgressReport'))
const AssignmentsResources = lazy(() => import('./pages/student/AssignmentsResources'))
const EventsPerformances = lazy(() => import('./pages/student/EventsPerformances'))
const ExamsCertification = lazy(() => import('./pages/student/ExamsCertification'))
const FeedbackCenter = lazy(() => import('./pages/student/FeedbackCenter'))
const SupportQueries = lazy(() => import('./pages/student/SupportQueries'))
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'))
const MyCourses = lazy(() => import('./pages/student/MyCourses'))
const StudentCourseDetail = lazy(() => import('./pages/student/CourseDetail'))
const StudentCourseCatalog = lazy(() => import('./pages/student/CourseCatalog'))
const CatalogCourseDetail = lazy(() => import('./pages/student/CatalogCourseDetail'))
const StudentMessagesResources = lazy(() => import('./pages/student/MessagesResources'))
const CreditsTransactions = lazy(() => import('./pages/student/CreditsTransactions'))

// Parent
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'))
const ClassSchedule = lazy(() => import('./pages/parent/ClassSchedule'))
const FeedbackPerformance = lazy(() => import('./pages/parent/FeedbackPerformance'))
const Attendance = lazy(() => import('./pages/parent/Attendance'))
const LeaveRequest = lazy(() => import('./pages/parent/LeaveRequest'))
const Certificates = lazy(() => import('./pages/parent/Certificates'))
const AccountManager = lazy(() => import('./pages/parent/AccountManager'))
const Support = lazy(() => import('./pages/parent/Support'))
const MyChildProgress = lazy(() => import('./pages/parent/MyChildProgress'))
const ParentClasses = lazy(() => import('./pages/parent/ParentClasses'))
const ParentCourses = lazy(() => import('./pages/parent/ParentCourses'))
const ParentCourseCatalog = lazy(() => import('./pages/parent/ParentCourseCatalog'))
const ParentMessages = lazy(() => import('./pages/parent/ParentMessages'))
const ParentCredits = lazy(() => import('./pages/parent/ParentCredits'))
const ParentProfile = lazy(() => import('./pages/parent/ParentProfile'))
const ParentCourseDetail = lazy(() => import('./pages/parent/ParentCourseDetail'))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<PageLoader text={"Loading....."} />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/policies" element={<Policies />} />

                  {/* Protected Admin Routes */}
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                  <Route path="/user-details/:userId" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
                  <Route path="/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                  <Route path="/users/add/:id" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                  <Route path="/family/:familyId" element={<ProtectedRoute><FamilyDetails /></ProtectedRoute>} />

                  {/* Instructor Management */}
                  <Route path="/admin/instructors" element={<ProtectedRoute><ManageInstructors /></ProtectedRoute>} />
                  <Route path="/admin/instructors/add" element={<ProtectedRoute><AddInstructor /></ProtectedRoute>} />
                  <Route path="/admin/instructors/add/:id" element={<ProtectedRoute><AddInstructor /></ProtectedRoute>} />
                  <Route path="/admin/instructors/:id" element={<ProtectedRoute><InstructorProfile /></ProtectedRoute>} />
                  <Route path="/admin/instructors/working-hours" element={<ProtectedRoute><InstructorWorkingHours /></ProtectedRoute>} />
                  <Route path="/admin/instructors/availability" element={<ProtectedRoute><InstructorAvailability /></ProtectedRoute>} />
                  <Route path="/admin/instructors/vacation" element={<ProtectedRoute><InstructorVacation /></ProtectedRoute>} />

                  {/* Course Management */}
                  <Route path="/courses" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
                  <Route path="/courses/create" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
                  <Route path="/courses/update/:id" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
                  <Route path="/courses/create/settings" element={<ProtectedRoute><CourseSettings /></ProtectedRoute>} />
                  <Route path="/courses/catalog" element={<ProtectedRoute><CourseCatalog /></ProtectedRoute>} />
                  <Route path="/courses/catalog/:courseId" element={<ProtectedRoute><AdminCourseDetail /></ProtectedRoute>} />

                  {/* Class Management */}
                  <Route path="/classes" element={<ProtectedRoute><ClassManagement /></ProtectedRoute>} />
                  <Route path="/classes/create" element={<ProtectedRoute><CreateClass /></ProtectedRoute>} />
                  <Route path="/demos" element={<ProtectedRoute><DemoManagement /></ProtectedRoute>} />
                  <Route path="/demos/create" element={<ProtectedRoute><CreateDemo /></ProtectedRoute>} />

                  {/* Finance */}
                  <Route path="/payments" element={<ProtectedRoute><CreditPaymentManagement /></ProtectedRoute>} />
                  <Route path="/payments/instructors" element={<ProtectedRoute><InstructorPayments /></ProtectedRoute>} />
                  <Route path="/payments/students" element={<ProtectedRoute><StudentTransactions /></ProtectedRoute>} />

                  {/* Reports - Only the remaining ones */}
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/reports/timeline" element={<ProtectedRoute><TimelineReport /></ProtectedRoute>} />
                  <Route path="/reports/ilt" element={<ProtectedRoute><ILTReport /></ProtectedRoute>} />
                  <Route path="/reports/recordings" element={<ProtectedRoute><RecordingsReport /></ProtectedRoute>} />
                  <Route path="/reports/class-credits" element={<ProtectedRoute><ClassCreditReport /></ProtectedRoute>} />
                  <Route path="/reports/late-joining" element={<ProtectedRoute><LateJoiningReport /></ProtectedRoute>} />
                  <Route path="/reports/lead-source" element={<ProtectedRoute><LeadSourceReport /></ProtectedRoute>} />
                  <Route path="/reports/reserved-slots" element={<ProtectedRoute><ReservedSlotManager /></ProtectedRoute>} />

                  {/* Settings */}
                  <Route path="/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

                  {/* Instructor Routes */}
                  <Route path="/instructor" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
                  <Route path="/instructor/profile" element={<ProtectedRoute><InstructorProfilePage /></ProtectedRoute>} />
                  <Route path="/instructor/classes" element={<ProtectedRoute><InstructorClasses /></ProtectedRoute>} />
                  <Route path="/instructor/students" element={<ProtectedRoute><InstructorStudents /></ProtectedRoute>} />
                  <Route path="/instructor/students/:id" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
                  <Route path="/instructor/messages-resources" element={<ProtectedRoute><MessagesResources /></ProtectedRoute>} />
                  <Route path="/instructor/availability" element={<ProtectedRoute><InstructorCalendar /></ProtectedRoute>} />
                  <Route path="/instructor/working-hours" element={<ProtectedRoute><InstructorWorkingHoursPage /></ProtectedRoute>} />
                  <Route path="/instructor/vacation" element={<ProtectedRoute><InstructorVacationPage /></ProtectedRoute>} />
                  <Route path="/instructor/transactions" element={<ProtectedRoute><InstructorTransactions /></ProtectedRoute>} />
                  <Route path="/instructor/support" element={<ProtectedRoute><InstructorResourceLibrary /></ProtectedRoute>} />

                  {/* Student Routes */}
                  <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/student/classes" element={<ProtectedRoute><MyClasses /></ProtectedRoute>} />
                  <Route path="/student/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
                  <Route path="/student/courses/:courseId" element={<ProtectedRoute><StudentCourseDetail /></ProtectedRoute>} />
                  <Route path="/student/catalog" element={<ProtectedRoute><StudentCourseCatalog /></ProtectedRoute>} />
                  <Route path="/student/catalog/:courseId" element={<ProtectedRoute><CatalogCourseDetail /></ProtectedRoute>} />
                  <Route path="/student/messages-resources" element={<ProtectedRoute><StudentMessagesResources /></ProtectedRoute>} />
                  <Route path="/student/credits-transactions" element={<ProtectedRoute><CreditsTransactions /></ProtectedRoute>} />
                  <Route path="/student/history" element={<ProtectedRoute><ClassHistory /></ProtectedRoute>} />
                  <Route path="/student/progress" element={<ProtectedRoute><ProgressReport /></ProtectedRoute>} />
                  <Route path="/student/assignments" element={<ProtectedRoute><AssignmentsResources /></ProtectedRoute>} />
                  <Route path="/student/events" element={<ProtectedRoute><EventsPerformances /></ProtectedRoute>} />
                  <Route path="/student/exams" element={<ProtectedRoute><ExamsCertification /></ProtectedRoute>} />
                  <Route path="/student/feedback" element={<ProtectedRoute><FeedbackCenter /></ProtectedRoute>} />
                  <Route path="/student/support" element={<ProtectedRoute><SupportQueries /></ProtectedRoute>} />
                  <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />

                  {/* Parent Routes - Wrapped with ParentLearnerProvider */}
                  <Route path="/parent/*" element={
                    <ProtectedRoute>
                      <ParentLearnerProvider>
                        <Routes>
                          <Route index element={<ParentDashboard />} />
                          <Route path="classes" element={<ParentClasses />} />
                          <Route path="courses" element={<ParentCourses />} />
                          <Route path="courses/:courseId" element={<ParentMyCourseDetails />} />
                          <Route path="catalog" element={<ParentCourseCatalog />} />
                          <Route path="catalog/:courseId" element={<ParentCourseDetail />} />
                          <Route path="messages" element={<ParentMessages />} />
                          <Route path="credits" element={<ParentCredits />} />
                          <Route path="profile" element={<ParentProfile />} />
                          <Route path="schedule" element={<ClassSchedule />} />
                          <Route path="feedback" element={<FeedbackPerformance />} />
                          <Route path="attendance" element={<Attendance />} />
                          <Route path="leave" element={<LeaveRequest />} />
                          <Route path="certificates" element={<Certificates />} />
                          <Route path="account-manager" element={<AccountManager />} />
                          <Route path="support" element={<Support />} />
                          <Route path="progress" element={<MyChildProgress />} />
                        </Routes>
                      </ParentLearnerProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  )
}

export default App
