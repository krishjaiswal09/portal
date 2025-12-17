
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mockUsers } from "@/components/user-management/mockData";
import { FamilyManagementTab } from "@/components/user-details/FamilyManagementTab";

const UserFamilyManagement = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Find user by ID
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <DashboardLayout title="User Not Found">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">User Not Found</h2>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Family Management - ${user.name}`}>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/user-details/${userId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to User Details</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Family Management Content */}
        <div className="bg-card border border-border rounded-lg">
          <FamilyManagementTab user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserFamilyManagement;
