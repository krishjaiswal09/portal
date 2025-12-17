
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { hasPermission } from '@/utils/checkPermission';

interface FamilyActionsProps {
  onCreateFamily: () => void;
}

export function FamilyActions({ onCreateFamily }: FamilyActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Family Management</h2>
        <p className="text-muted-foreground">Manage family groups and their relationships</p>
      </div>
      {
        hasPermission("HAS_CREATE_FAMILY") && <Button
          className="flex items-center gap-2"
          onClick={onCreateFamily}
        >
          <UserPlus className="h-4 w-4" />
          Create Family
        </Button>
      }
    </div>
  );
}
