import { useAuth } from "@/contexts/AuthContext"

export const hasPermission = (permissionCode: string): boolean => {
  const { user } = useAuth()
  const permissions = user?.permissions || []
  return !!permissions.find(p => p.code === permissionCode)
}


export const hasAnyPermission = (group: string): boolean => {
  const { user } = useAuth()
  const permissions = user?.permissions || []
  return permissions.some(p => p.group === group)
}