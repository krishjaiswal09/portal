
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout"
import { CourseProgressTab } from '@/components/user-details/CourseProgressTab'
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  type User as UserType,
} from "@/components/user-management/mockData";

export default function StudentProgress() {
  const { id } = useParams<{ id: string }>();
  const [user, setUsers] = useState<UserType>();

  const usersQueries = useQuery({
    queryKey: ["userWithId"],
    queryFn: () =>
      fetchApi<UserType>({
        path: "users/" + id,
      }),
  });

  useEffect(() => {
    if (!usersQueries.isLoading && usersQueries.data) {
      setUsers(usersQueries.data);
    }
  }, [usersQueries.isLoading, usersQueries.data]);
  return (
    <InstructorDashboardLayout title="Support">
      <div className="space-y-6">
        {user?.id && <CourseProgressTab user={user} />}
      </div>
    </InstructorDashboardLayout>
  )
}
