import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "./UserTable";
import { FilterToolbar } from "./FilterToolbar";
import { BulkUploadModal } from "./BulkUploadModal";
import { PendingTasksPanel } from "./PendingTasksPanel";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { type User, type UserFilters } from "./mockData";
import { UserPlus, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { Plus } from "lucide-react";
import { hasPermission } from "@/utils/checkPermission";
import { SectionLoader } from "@/components/ui/loader";

export function UserManagementContent() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isPendingTasksOpen, setIsPendingTasksOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({
    roles: [],
    status: [],
    ageType: [],
    countries: [],
  });

  const buildApiUrl = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());

    if (filters.roles.length > 0) {
      params.append('roles', filters.roles.join(','));
    }
    if (filters.status.length > 0) {
      params.append('status', filters.status.join(','));
    }
    if (filters.ageType.length > 0) {
      const ageTypes = filters.ageType;
      params.append('age_type', ageTypes.join(','));
    }
    if (filters.countries.length > 0) {
      params.append('countries', filters.countries.join(','));
    }
    if (debouncedSearchQuery.trim()) {
      params.append('search', debouncedSearchQuery.trim());
    }

    return `users?${params.toString()}`;
  };

  const usersQueries = useQuery({
    queryKey: ["usersStudentRole", currentPage, pageSize, filters, debouncedSearchQuery],
    queryFn: () =>
      fetchApi<{ data: User[]; totalRecords: number }>({
        path: buildApiUrl(),
      }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      fetchApi<any>({
        path: `users/${userId}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      usersQueries.refetch();
      toast({
        title: "User Deleted Successfully",
        duration: 3000
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting User",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (
      !usersQueries.isLoading &&
      usersQueries.data &&
      usersQueries.data.data
    ) {
      const usersData: User[] = usersQueries.data.data?.map((v) => ({
        name: `${v.first_name} ${v.last_name}`,
        email: v.email,
        timezone: v.timezone,
        country: v.country,
        roles: v.roles,
        id: v.id,
        is_active: v.is_active,
        age_type: v.age_type,
        created_at: v.created_at,
        status: v.status
        // ...v,
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setUsers(usersData);
      setTotalUsers(usersQueries.data.totalRecords || usersData.length);
    }
  }, [usersQueries.isLoading, usersQueries.data]);

  // Since filtering is now done server-side, we just use the users directly
  const filteredUsers = users;

  const handleUserClick = (user: User) => {
    // Navigate to user details page instead of opening drawer
    navigate(`/user-details/${user.id}`);
  };

  const handleEditUser = (id: number) => {
    navigate(`add/${id}`);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete?.id) {
      deleteUserMutation.mutate(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  const handleAddNewUser = () => {
    navigate("/users/add");
  };

  const handleDownloadData = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Roles",
      "Status",
      "Age Type",
      "Country",
      "Credit Balance",
      "Bio",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          `"${user.name}"`,
          `"${user.email}"`,
          `"${user.phone_number || ""}"`,
          `"${user.roles.join(", ")}"`,
          `"${user.status}"`,
          `"${user.age_type}"`,
          `"${user.country}"`,
          user.credit_balance,
          `"${user.bio || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded ${filteredUsers.length} user records.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-playfair font-bold text-foreground">
            User Management
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Manage users, families, and their relationships efficiently.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          {
            hasPermission("HAS_CREATE_USER") && <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkUploadOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
          }
          {
            hasPermission("HAS_CREATE_USER") && <Button
              onClick={handleAddNewUser}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl shadow-lg"
            >
              <UserPlus className="h-5 w-5" />
              Add New User
            </Button>
          }
        </div>
      </div>

      {/* Search & Toolbar */}
      <div className="rounded-xl border border-border bg-background p-6 shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 mb-4">
          <Input
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring flex-1"
          />
          <Button
            onClick={() => navigate("/classes/create")}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Create Class
          </Button>
        </div>
        <FilterToolbar filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Table Section */}
      <section className="rounded-xl border border-border bg-background p-6 shadow-md">
        {usersQueries.isLoading ? (
          <SectionLoader text="Loading users..." />
        ) : (
          <UserTable
            users={filteredUsers}
            onUserClick={handleUserClick}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            currentPage={currentPage}
            pageSize={pageSize}
            totalUsers={totalUsers}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </section>

      <DeleteConfirmDialog
        user={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        isLoading={deleteUserMutation.isPending}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />

      <PendingTasksPanel
        isOpen={isPendingTasksOpen}
        onOpenChange={setIsPendingTasksOpen}
      />
    </div>
  );
}

export default UserManagementContent;
