
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type User } from "../user-management/mockData";
import { MessagesResourcesToggle } from "./MessagesResourcesToggle";
import { ProfileTab } from "./ProfileTab";
import { FamilyManagementTab } from "./FamilyManagementTab";

interface GeneralUserDetailsPageProps {
  user: User;
}

export function GeneralUserDetailsPage({ user }: GeneralUserDetailsPageProps) {
  // Check if user is a parent to show family management tab
  const isParent = user.roles.includes('parent');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`${isParent ? 'grid w-full grid-cols-3' : 'grid w-full grid-cols-2'} bg-muted/50 h-12 p-1 rounded-lg border`}>
          <TabsTrigger value="profile" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Profile
          </TabsTrigger>
          {isParent && (
            <TabsTrigger value="family-management" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Family Management
            </TabsTrigger>
          )}
          <TabsTrigger value="messages" className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-0">
          <ProfileTab user={user} />
        </TabsContent>

        {isParent && (
          <TabsContent value="family-management" className="mt-6 space-y-0">
            <FamilyManagementTab user={user} />
          </TabsContent>
        )}

        <TabsContent value="messages" className="mt-6 space-y-0">
          <div className="h-[calc(100vh-200px)]">
            <MessagesResourcesToggle user={user} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
