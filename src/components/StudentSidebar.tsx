import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

import {
  Home,
  BookOpen,
  BookOpenCheck,
  Compass,
  MessageSquare,
  User,
  CreditCard,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { fetchApi } from "@/services/api/fetchApi"

interface MenuItem {
  title: string
  icon: any
  url: string
}

const studentMenuItems: MenuItem[] = [
  { title: "Dashboard", icon: Home, url: "/student" },
  { title: "My Classes", icon: BookOpen, url: "/student/classes" },
  { title: "My Courses", icon: BookOpenCheck, url: "/student/courses" },
  { title: "Course Catalog", icon: Compass, url: "/student/catalog" },
  { title: "Messages & Resources", icon: MessageSquare, url: "/student/messages-resources" },
  { title: "Credits & Transactions", icon: CreditCard, url: "/student/credits-transactions" },
  { title: "Profile", icon: User, url: "/student/profile" },
]

export function StudentSidebar() {
  const location = useLocation()
  const currentPath = location.pathname
  const { user } = useAuth()

  const generalSettingsQueries = useQuery({
    queryKey: ["generalSettingsQueries"],
    queryFn: () =>
      fetchApi<any>({
        path: "setting/portal-settings",
      }),
  });

  const isActive = (url: string) => currentPath === url

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-3 md:p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={generalSettingsQueries?.data?.logo_url || "/art-gharana-logo.png"}
              alt="Art Gharana"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-white font-bold text-xs md:text-sm">AG</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm md:text-base font-bold text-sidebar-foreground truncate">
              {generalSettingsQueries?.data?.portal_name || "Art Gharana"}
            </h2>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              Student Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto p-2 md:p-3 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sidebar-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-sidebar-foreground/50 [&::-webkit-scrollbar-thumb]:transition-colors">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs mb-3 tracking-widest px-2">
            Learning Hub
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2.5 md:py-2 rounded-md text-sm font-medium transition-all min-h-[44px]"
                  >
                    <Link to={item.url} className="flex items-center w-full">
                      <item.icon className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 md:p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-md bg-sidebar-accent min-h-[60px]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user?.email || 'student@artgharana.com'}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">Learning Journey</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
