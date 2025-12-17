
import { StudentSidebar } from "./StudentSidebar"
import { DashboardHeader } from "./DashboardHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface StudentDashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function StudentDashboardLayout({ children, title }: StudentDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StudentSidebar />
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            <DashboardHeader title={title} />
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto w-full space-y-4 md:space-y-6">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
