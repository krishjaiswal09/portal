
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SUPPORT_STAFF = 'support_and_sales',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  PARENT = 'parent'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  timezone?: string;
  city?: string;
  credits?: string;
  state?: string;
  gender?: string;
  notes?: string;
  art_form?: string;
  address?: string;
  email_notification?: boolean;
  whatsapp_notification?: boolean;
  is_active?: boolean;
  age_type?: string;
  languages?: string[];
  age_group?: number[];
  certifications?: any[];
  roles?: string[];
  permissions?: any[];
}

export interface ReportPermissions {
  canViewReports: boolean;
  canExportReports: boolean;
  canViewAllData: boolean;
}
