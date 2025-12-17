import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Search } from "lucide-react";
import { mockUsers, type User } from "./mockData";
import { CreateFamilyModal } from "./CreateFamilyModal";
import { AddFamilyMemberModal } from "./AddFamilyMemberModal";
import { FamilyCard } from "./FamilyCard";
import { FamilyActions } from "./FamilyActions";
import { useFamilyManagement } from "./hooks/useFamilyManagement";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface FamilyManagementProps {
  onUserClick: (user: User) => void;
}

export function FamilyManagement({ onUserClick }: FamilyManagementProps) {
  const navigate = useNavigate();
  const { handleCreateFamily, handleAddMembers } =
    useFamilyManagement();

  const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedFamilyForAddMember, setSelectedFamilyForAddMember] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alreadyAddedUsers, setAlreadyAddedUsers] = useState<any>(null);

  const getFamiliesDataMutation = useQuery({
    queryKey: ["getFamiliesData"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "family",
        method: "GET",
      }),
  });

  const handleAddMemberClick = (family: any) => {
    setAlreadyAddedUsers(family);
    // setAlreadyAddedUsers(family?.users?.map((item: any) => item.id));
    setSelectedFamilyForAddMember({ id: family.id, name: family.name });
    setIsAddMemberModalOpen(true);
  };

  const handleFamilyClick = (family: any) => {
    navigate(`/family/${family.id}`);
  };

  const familiesData = getFamiliesDataMutation?.data as any;

  const filteredFamilies = familiesData?.filter((family) => {
    const nameMatch = family?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const members = family?.members || family?.users || [];
    const memberMatch =
      Array.isArray(members) &&
      members.some(
        (member) =>
          member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return nameMatch || memberMatch;
  });

  return (
    <div className="space-y-6">
      <FamilyActions onCreateFamily={() => setIsCreateFamilyModalOpen(true)} />

      {/* Search Field */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search families by name or member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFamilies?.length > 0 &&
          filteredFamilies?.map((family1) => {
            return (
              <FamilyCard
                key={family1.id}
                family={family1}
                onFamilyClick={handleFamilyClick}
                onAddMemberClick={handleAddMemberClick}
                onUserClick={onUserClick}
              />
            );
          })}
      </div>

      {filteredFamilies?.length === 0 && filteredFamilies?.length > 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No families found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              No families match your search criteria. Try adjusting your search
              terms.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {filteredFamilies?.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No families found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first family group to start managing family
              relationships.
            </p>
            <Button
              className="flex items-center gap-2"
              onClick={() => setIsCreateFamilyModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Create First Family
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateFamilyModal
        isOpen={isCreateFamilyModalOpen}
        onClose={() => setIsCreateFamilyModalOpen(false)}
        onCreateFamily={handleCreateFamily}
        existingUsers={mockUsers}
      />

      <AddFamilyMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        familyId={selectedFamilyForAddMember?.id || ""}
        familyName={selectedFamilyForAddMember?.name || ""}
        onAddMembers={handleAddMembers}
        existingUsers={mockUsers}
        alreadyAddedUsers={alreadyAddedUsers}
        getFamiliesDataMutation={getFamiliesDataMutation}
      />
    </div>
  );
}
