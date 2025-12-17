
import { AppSidebar } from "./AppSidebar"
import { DashboardHeader } from "./DashboardHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <DashboardHeader title={title} />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto w-full space-y-4 md:space-y-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
