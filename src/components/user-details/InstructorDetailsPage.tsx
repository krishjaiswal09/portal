import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type User } from "../user-management/mockData";
import { MessagesResourcesToggle } from "./MessagesResourcesToggle";
import { ProfileTab } from "./ProfileTab";
import { TimelineTab } from "./TimelineTab";
import { AssignedStudentsTab } from "./AssignedStudentsTab";
import { PayrollTab } from "./PayrollTab";
import { AssignedCoursesTab } from "./AssignedCoursesTab";

interface InstructorDetailsPageProps {
  user: User;
}

export function InstructorDetailsPage({ user }: InstructorDetailsPageProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 h-12 p-1 rounded-lg border">
          <TabsTrigger value="profile" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Profile
          </TabsTrigger>
          <TabsTrigger value="assigned-students" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Assigned Students
          </TabsTrigger>
          <TabsTrigger value="payroll" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Payroll
          </TabsTrigger>
          <TabsTrigger value="assigned-courses" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Assigned Courses
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Messages & Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-0">
          <ProfileTab user={user} />
        </TabsContent>

        <TabsContent value="assigned-students" className="space-y-6 mt-6">
          <AssignedStudentsTab user={user} />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6 mt-6">
          <PayrollTab user={user} />
        </TabsContent>

        <TabsContent value="assigned-courses" className="space-y-6 mt-6">
          <AssignedCoursesTab user={user} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6 space-y-0">
          <TimelineTab user={user} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6 space-y-0">
          <div className="h-[calc(100vh-200px)]">
            <MessagesResourcesToggle user={user} role="instructor" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
