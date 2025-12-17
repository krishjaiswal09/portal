export interface RoleCreateInterface {
  name: string;
  description: string;
  users: number;
  permissions: PermissionInterface[];
  role_id?: number;
}


export interface PermissionInterface {
  permission_id: string
  permission_value: string
  permission_code: string
}
