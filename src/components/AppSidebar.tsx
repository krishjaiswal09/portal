
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Calendar,
  Users,
  Settings,
  User,
  BookOpen,
  Library,
  CreditCard,
  ChevronRight,
  Plus,
  List,
  Clock,
  UserCheck,
  Plane,
  GraduationCap,
  FileText,
  BarChart3,
  PlayCircle,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useQuery } from "@tanstack/react-query"
import { fetchApi } from "@/services/api/fetchApi"
import { hasAnyPermission, hasPermission } from "@/utils/checkPermission"

interface MenuItem {
  title: string
  icon: any
  url?: string
  permission?: boolean
  items?: Array<{
    title: string
    url: string
    icon?: any
    permission?: boolean
  }>
}



export function AppSidebar() {
  const location = useLocation()
  const currentPath = location.pathname
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openItems, setOpenItems] = useState<string[]>(
    isMobile ? [] : ["User Management", "Instructors", "Course Management", "Class Management"]
  )

  const sidebarItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      permission: hasPermission("HAS_READ_DASHBOARD")
    },
    {
      title: "User Management",
      icon: Users,
      permission: hasAnyPermission("User Management"),
      items: [
        {
          title: "Manage Users",
          url: "/users",
          icon: Users,
          permission: hasPermission("HAS_READ_USER")
        },
        {
          title: "Add User",
          url: "/users/add",
          icon: Plus,
          permission: hasPermission("HAS_CREATE_USER")
        },
      ],
    },
    {
      title: "Instructors",
      icon: GraduationCap,
      permission: hasAnyPermission("Instructor Management"),
      items: [
        {
          title: "Manage Instructors",
          url: "/admin/instructors",
          icon: Users,
          permission: hasPermission("HAS_READ_INSTRUCTOR")
        },
        {
          title: "Add Instructor",
          url: "/admin/instructors/add",
          icon: Plus,
          permission: hasPermission("HAS_CREATE_INSTRUCTOR")
        },
        {
          title: "Working Hours",
          url: "/admin/instructors/working-hours",
          icon: Clock,
          permission: hasPermission("HAS_READ_WORKING_HOURS")
        },
        {
          title: "Availability",
          url: "/admin/instructors/availability",
          icon: Calendar,
          permission: hasPermission("HAS_READ_AVAILABILITY")
        },
        {
          title: "Vacation",
          url: "/admin/instructors/vacation",
          icon: Plane,
          permission: hasPermission("HAS_READ_VACATION")
        },
      ],
    },
    {
      title: "Course Management",
      icon: BookOpen,
      permission: hasAnyPermission("Course Management"),
      items: [
        {
          title: "Manage Courses",
          url: "/courses",
          icon: BookOpen,
          permission: hasPermission("HAS_READ_COURSE")
        },
        {
          title: "Add Course",
          url: "/courses/create",
          icon: Plus,
          permission: hasPermission("HAS_CREATE_COURSE")
        },
        {
          title: "Course Catalog",
          url: "/courses/catalog",
          icon: Library,
          permission: hasPermission("HAS_READ_COURSE_CATALOG")
        },
      ],
    },
    {
      title: "Class Management",
      icon: Calendar,
      permission: hasAnyPermission("Class Management"),
      items: [
        {
          title: "Manage Classes",
          url: "/classes",
          icon: Calendar,
          permission: hasPermission("HAS_READ_CLASS")
        },
        {
          title: "Create Class",
          url: "/classes/create",
          icon: Plus,
          permission: hasPermission("HAS_CREATE_CLASS")
        },
        {
          title: "Manage Demos",
          url: "/demos",
          icon: PlayCircle,
          permission: hasPermission("HAS_READ_DEMO_CLASS")
        },
      ],
    },
    {
      title: "Finance",
      icon: CreditCard,
      permission: hasAnyPermission("Finance Management"),
      items: [
        {
          title: "Credit & Payment",
          url: "/payments",
          icon: CreditCard,
          permission: hasPermission("HAS_READ_TRANSACTION_HISTORY")
        },
        {
          title: "Instructor Payments",
          url: "/payments/instructors",
          icon: UserCheck,
          permission: hasPermission("HAS_READ_INSTRUCTOR_PAYMENT")
        },
        {
          title: "Student Transactions",
          url: "/payments/students",
          icon: List,
          permission: hasPermission("HAS_READ_STUDENT_TRANSACTION_HISTORY")
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      permission: hasPermission("HAS_READ_REPORTS")
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      permission: hasAnyPermission("Settings")
    },
  ]

  const generalSettingsQueries = useQuery({
    queryKey: ["generalSettingsQueries"],
    queryFn: () =>
      fetchApi<any>({
        path: "setting/portal-settings",
      }),
  });

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  const toggleItem = (title: string) => {
    if (isCollapsed && !isMobile) return // Don't toggle dropdowns when collapsed
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (url: string) => currentPath === url
  const isParentActive = (items?: Array<{ url: string }>) =>
    items?.some(item => currentPath === item.url) || false

  return (
    <Sidebar className={`border-r border-sidebar-border transition-all duration-300 ${!isMobile && isCollapsed ? 'w-16' : ''
      }`}>
      <SidebarHeader className={`p-3 md:p-4 border-b border-sidebar-border transition-all duration-300 ${!isMobile && isCollapsed ? 'px-2' : ''
        }`}>
        <div className="flex items-center gap-3 px-2">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ${!isMobile && isCollapsed ? 'w-8 h-8' : ''
            }`}>
            <img
              src={generalSettingsQueries?.data?.logo_url || "/art-gharana-logo.png"}
              alt="Art Gharana"
              className="w-full h-full object-cover"
              loading="eager"
            // onError={(e) => {
            //   e.currentTarget.style.display = 'none';
            //   e.currentTarget.nextElementSibling?.classList.remove('hidden');
            // }}
            />
            <span className="hidden text-white font-bold text-xs md:text-sm">AG</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm md:text-base font-bold text-sidebar-foreground truncate">
                {generalSettingsQueries?.data?.portal_name || "Art Gharana"}
              </h2>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                Management System
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto p-2 md:p-3 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sidebar-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-sidebar-foreground/50 [&::-webkit-scrollbar-thumb]:transition-colors">
        <SidebarGroup>
          {(!isCollapsed || isMobile) && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs mb-3 tracking-widest px-2">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarItems.map((item) => {
                if (!item.permission) return
                if (item.items) {
                  const isOpen = openItems.includes(item.title)
                  const hasActiveChild = isParentActive(item.items)


                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible open={isOpen && (!isCollapsed || isMobile)} onOpenChange={() => toggleItem(item.title)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2.5 md:py-2 rounded-md text-sm font-medium transition-all w-full min-h-[44px] ${hasActiveChild ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                              } ${!isMobile && isCollapsed ? 'justify-center px-2' : ''}`}
                            title={!isMobile && isCollapsed ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {(!isCollapsed || isMobile) && (
                              <>
                                <span className="flex-1 text-left text-sm">{item.title}</span>
                                <ChevronRight className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(subItem.url)}
                                  className={!isMobile && isCollapsed ? 'justify-center' : ''}
                                  title={!isMobile && isCollapsed ? subItem.title : undefined}
                                >
                                  <Link to={subItem.url} className={`flex items-center gap-2 text-sm py-2.5 min-h-[44px] ${!isMobile && isCollapsed ? 'justify-center px-2' : ''
                                    }`}>
                                    {subItem.icon && <subItem.icon className="w-4 h-4 flex-shrink-0" />}
                                    {(!isCollapsed || isMobile) && <span className="truncate">{subItem.title}</span>}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url!)}
                      className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2.5 md:py-2 rounded-md text-sm font-medium transition-all min-h-[44px] ${!isMobile && isCollapsed ? 'justify-center px-2' : ''
                        }`}
                      title={!isMobile && isCollapsed ? item.title : undefined}
                    >
                      <Link to={item.url!} className="flex items-center w-full">
                        <item.icon className="w-5 h-5 mr-2 flex-shrink-0" />
                        {(!isCollapsed || isMobile) && <span className="text-sm truncate">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`p-2 md:p-3 border-t border-sidebar-border transition-all duration-300 ${!isMobile && isCollapsed ? 'px-2' : ''
        }`}>
        <div className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-md bg-sidebar-accent min-h-[60px] transition-all duration-300 ${!isMobile && isCollapsed ? 'justify-center p-2' : ''
          }`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">System Administrator</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
