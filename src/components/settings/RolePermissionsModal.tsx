import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { RoleCreateInterface } from "@/types/settings";
import { hasPermission } from "@/utils/checkPermission";

interface Permission {
  id: number;
  code: string;
  value: string;
  group: string;
  created_at: string;
  updated_at: string;
}

interface RolePermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleCreateInterface;
  currentPermissions: any;
  onSave?: (permissions: number[], role_name: string, role_id: number) => void; // store selected IDs
}

// mapping for nicer category display
const categoryLabels: Record<string, string> = {
  USER: "User Management",
  COURSE: "Course Management",
  CLASS: "Class Management",
  ENROLLMENT: "Enrollment",
  STAFF: "Staff Management",
  TEACHER: "Teacher Management",
  STUDENT: "Student Management",
  PARENT: "Parent Management",
  FAMILY: "Family Management",
  PAYROLL: "Payroll",
  SETTING: "System Settings",
  NOTIFICATION: "Notification Settings",
  VACATION: "Vacation",
  WORKING: "Working Hours",
  UNAVAILIBILITY: "Unavailability",
  ROLES: "Roles",
  PERMISSIONS: "Permissions",
  DASHBOARD: "Dashboard",
  REPORTS: "Reports",
};

export function RolePermissionsModal({
  open,
  onOpenChange,
  role,
  currentPermissions = [],
  onSave,
}: RolePermissionsModalProps) {
  // Fetch all permissions from API
  const allPermissions = useQuery({
    queryKey: ["getPermissions"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "permissions",
      }),
    enabled: open,
  });

  // Local state of selected permissions (IDs)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    currentPermissions.map((p) => p.permission_id)
  );

  const [roleNameEdited, setRoleNameEdited] = useState<string>(role?.name || "");

  useEffect(() => {
    setRoleNameEdited(role?.name)
    setSelectedPermissions(currentPermissions.map((p) => p.permission_id))
  }, [role?.name, currentPermissions])

  // Group permissions by category dynamically
  const groupedPermissions = useMemo(() => {
    if (!allPermissions.data) return {};

    const grouped: Record<string, Permission[]> = allPermissions.data.reduce((acc, perm) => {
      const category = perm.group;
      if (!acc[category]) acc[category] = [];
      acc[category].push(perm);
      return acc;
    }, {} as { [category: string]: Permission[] });

    return Object.fromEntries(
      Object.entries(grouped)
    );
  }, [allPermissions.data]);


  const handlePermissionChange = (id: number, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, id] : prev.filter((p) => p !== id)
    );
  };

  const handleSave = () => {
    console.log(selectedPermissions)
    onSave(selectedPermissions, roleNameEdited, role.role_id);
    onOpenChange(false);
  };

  const handleSelectAll = (categoryPerms: Permission[]) => {
    const ids = categoryPerms.map((p) => p.id);
    const allSelected = ids.every((id) => selectedPermissions.includes(id));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Permissions - {role?.name}</span>
            <Badge variant="outline">
              {selectedPermissions.length} permissions selected
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Configure what actions this role can perform in the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card key={"role_edit"}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">Role Name</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  defaultValue={roleNameEdited}
                  onChange={(e) => setRoleNameEdited(e.target.value)}
                  placeholder="Enter role name"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
          {Object.entries(groupedPermissions).map(([category, permissions]) => {
            const label = categoryLabels[category] || category;

            const selectedInCategory = permissions.filter((p) =>
              selectedPermissions.includes(p.id)
            ).length;

            const allSelected = selectedInCategory === permissions.length;
            const someSelected = selectedInCategory > 0;

            return (
              <Card key={category}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg capitalize">{label}</CardTitle>
                      <Badge
                        variant={
                          allSelected
                            ? "default"
                            : someSelected
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {selectedInCategory}/{permissions.length}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(permissions)}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions?.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border"
                      >
                        <Switch
                          id={permission.code}
                          checked={selectedPermissions.includes(permission.id)}
                          disabled={!hasPermission("HAS_EDIT_PERMISSIONS")}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, checked)
                          }
                        />
                        <div className="flex-1 space-y-1">
                          <Label
                            htmlFor={permission.code}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {permission.value}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedPermissions.length} permissions selected for {role?.name}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Permissions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
