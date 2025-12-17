
import { useState } from 'react';
import { mockUsers, type User } from "../mockData";
import { FamilyData } from "@/types/familyCredit";
import { mockClassTypes } from "@/data/familyCreditData";

interface Family {
  id: string;
  name: string;
  members: User[];
  totalCredits: number;
  primaryContact: User;
}

export function useFamilyManagement() {
  const [families, setFamilies] = useState<Family[]>(() => {
    // Group users by families
    const familyGroups = new Map<string, User[]>();
    mockUsers.filter(user => user.familyId).forEach(user => {
      if (user.familyMembers) {
        const familyKey = user.familyMembers.sort().join(',');
        if (!familyGroups.has(familyKey)) {
          familyGroups.set(familyKey, []);
        }
        familyGroups.get(familyKey)?.push(user);
      }
    });
    return Array.from(familyGroups.entries()).map(([key, members], index) => {
      const primaryContact = members.find(m => m.roles.includes('parent')) || members[0];
      return {
        id: `family-${index + 1}`,
        name: `${primaryContact.name.split(' ')[0]} Family`,
        members,
        totalCredits: members.reduce((sum, member) => sum + member.creditBalance, 0),
        primaryContact
      };
    });
  });

  const handleCreateFamily = (familyData: { name: string; students: any[] }) => {
    const newFamilyId = `family-${families.length + 1}`;

    // Create new users for the students with all required properties
    const newMembers: User[] = familyData.students.map((student, index) => ({
      id: `user-${Date.now()}-${index}`,
      name: student.name,
      email: student.email,
      roles: student.roles,
      creditBalance: 0,
      ageType: student.ageType,
      status: 'active' as const,
      avatar: '',
      country: 'US',
      countryFlag: '🇺🇸',
      familyId: newFamilyId,
      familyMembers: [newFamilyId],
      gender: 'other', // Fixed: changed from "not-specified" to "other"
      timezone: 'UTC',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    }));

    const primaryContact = newMembers[0];

    const newFamily: Family = {
      id: newFamilyId,
      name: familyData.name,
      members: newMembers,
      totalCredits: 0,
      primaryContact
    };

    setFamilies(prev => [...prev, newFamily]);
  };

  const handleAddMembers = (familyId: string, students: any[]) => {
    console.log({ students, familyId }, "students");
    // setFamilies(prev => prev.map(family => {
    //   if (family.id === familyId) {
    //     const newMembers: User[] = students.map((student, index) => ({
    //       id: `user-${Date.now()}-${index}`,
    //       name: student.name,
    //       email: student.email,
    //       roles: student.roles,
    //       creditBalance: 0,
    //       ageType: student.ageType,
    //       status: 'active' as const,
    //       avatar: '',
    //       country: 'US',
    //       countryFlag: '🇺🇸',
    //       familyId: familyId,
    //       familyMembers: [familyId],
    //       gender: 'other', // Fixed: changed from "not-specified" to "other"
    //       timezone: 'UTC',
    //       joinedDate: new Date().toISOString().split('T')[0],
    //       lastActive: new Date().toISOString().split('T')[0]
    //     }));

    //     return {
    //       ...family,
    //       members: [...family.members, ...newMembers]
    //     };
    //   }
    //   return family;
    // }));
  };

  const handleRemoveMember = (familyId: string, memberId: string) => {
    setFamilies(prev => prev.map(family => {
      if (family.id === familyId) {
        const updatedMembers = family.members.filter(member => member.id !== memberId);
        const updatedTotalCredits = updatedMembers.reduce((sum, member) => sum + member.creditBalance, 0);
        return {
          ...family,
          members: updatedMembers,
          totalCredits: updatedTotalCredits
        };
      }
      return family;
    }));
  };

  const convertToFamilyData = (family: Family): FamilyData => ({
    id: family.id,
    name: family.name,
    members: family.members.map(member => ({
      id: member.id,
      name: member.name,
      roles: member.roles,
      creditBalance: member.creditBalance,
      avatar: member.avatar,
      email: member.email
    })),
    classTypes: mockClassTypes,
    transactions: [],
    primaryContact: {
      id: family.primaryContact.id,
      name: family.primaryContact.name,
      roles: family.primaryContact.roles,
      creditBalance: family.primaryContact.creditBalance,
      avatar: family.primaryContact.avatar,
      email: family.primaryContact.email
    }
  });

  return {
    families,
    handleCreateFamily,
    handleAddMembers,
    handleRemoveMember,
    convertToFamilyData
  };
}
