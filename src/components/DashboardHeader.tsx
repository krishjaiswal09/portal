
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User } from "lucide-react"
import { NotificationDropdown } from "./NotificationDropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ParentLearnerSelector } from "./parent/ParentLearnerSelector"

interface DashboardHeaderProps {
  title: string
  parent?: boolean
}

export function DashboardHeader({ title, parent }: DashboardHeaderProps) {
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="font-semibold text-foreground">{title}</h1>
        {
          parent && (<h1 className="font-semibold text-foreground">
            <ParentLearnerSelector />
          </h1>)
        }
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-border">
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
