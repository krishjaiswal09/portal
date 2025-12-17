import { UserRole } from "@/types/user";

export const rolesCheck = (roles: string[]) => {
  let role: UserRole = UserRole.STUDENT;
  if (roles.includes("super_admin")) {
    role = UserRole.SUPER_ADMIN;
  } else if (roles.includes("admin")) {
    role = UserRole.ADMIN;
  } else if (roles.includes("support_and_sales")) {
    role = UserRole.SUPPORT_STAFF;
  } else if (roles.includes("instructor")) {
    role = UserRole.INSTRUCTOR;
  } else if (roles.includes("parent")) {
    role = UserRole.PARENT;
  } else if (roles.includes("student")) {
    role = UserRole.STUDENT;
  }
  return role
}