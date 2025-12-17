
import { Calendar, Clock, Users, User, Settings, BarChart3, Briefcase, CreditCard, MessageSquare } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { fetchApi } from "@/services/api/fetchApi"
import { useQuery } from "@tanstack/react-query"

interface MenuItem {
  title: string
  url: string
  icon: any
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/instructor",
    icon: BarChart3,
  },
  {
    title: "My Students",
    url: "/instructor/students",
    icon: Users,
  },
  {
    title: "Classes",
    url: "/instructor/classes",
    icon: Calendar,
  },
  {
    title: "Messages & Resources",
    url: "/instructor/messages-resources",
    icon: MessageSquare,
  },
  {
    title: "Working Hours",
    url: "/instructor/working-hours",
    icon: Briefcase,
  },
  {
    title: "Vacation",
    url: "/instructor/vacation",
    icon: Settings,
  },
  {
    title: "Transactions",
    url: "/instructor/transactions",
    icon: CreditCard,
  },
  {
    title: "Profile",
    url: "/instructor/profile",
    icon: User,
  },
]

export function InstructorSidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const generalSettingsQueries = useQuery({
    queryKey: ["generalSettingsQueries"],
    queryFn: () =>
      fetchApi<any>({
        path: "setting/portal-settings",
      }),
  });

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-6">
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
              Instructor Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-3 py-4 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sidebar-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-sidebar-foreground/50 [&::-webkit-scrollbar-thumb]:transition-colors">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wide">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="w-full h-10 px-3 rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
            {user?.first_name?.charAt(0) || 'I'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user?.email || 'instructor@artgharana.com'}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
