
import { BarChart, Calendar, PlayCircle, BookOpen, Coins, AlertTriangle, Activity, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { Link, useNavigate } from 'react-router-dom';
import { hasPermission } from '@/utils/checkPermission';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

const reportCards = [
  {
    title: 'Timeline Report',
    description: 'Centralized activity log and system events',
    icon: Activity,
    path: '/reports/timeline',
    color: 'text-blue-500',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_STAFF]
  },
  {
    title: 'ILT Report',
    description: 'Instructor-Led Training detailed logs',
    icon: BookOpen,
    path: '/reports/ilt',
    color: 'text-emerald-600',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_STAFF]
  },
  {
    title: 'Online Class Recordings',
    description: 'Track recording availability and quality',
    icon: PlayCircle,
    path: '/reports/recordings',
    color: 'text-red-600',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_STAFF]
  },
  {
    title: 'Class Credit Report',
    description: 'Track credit purchases and usage',
    icon: Coins,
    path: '/reports/class-credits',
    color: 'text-amber-600',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_STAFF]
  },
  {
    title: 'Late Joining Report',
    description: 'Monitor late arrivals and take action',
    icon: AlertTriangle,
    path: '/reports/late-joining',
    color: 'text-red-500',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    title: 'Lead Source Report',
    description: 'Track and analyze student lead sources',
    icon: TrendingUp,
    path: '/reports/lead-source',
    color: 'text-green-600',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_STAFF]
  },
  {
    title: 'Reserved Slot Manager',
    description: 'View and bulk release reserved time slots',
    icon: Clock,
    path: '/reports/reserved-slots',
    color: 'text-purple-600',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPPORT_STAFF]
  }
];

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!hasPermission("HAS_READ_REPORTS")) {
    return (
      <DashboardLayout title="No Permission">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Provide default user if not available to prevent errors
  const currentUser = user || { role: UserRole.ADMIN };

  const accessibleReports = reportCards.filter(report =>
    report.roles.includes(currentUser.role)
  );

  return (
    <ReportLayout
      title="Reports Dashboard"
      description="Access various reports and analytics for your organization"
    >
      {accessibleReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleReports.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.path} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-8 w-8 ${report.color}`} />
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {report.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link to={report.path}>
                      View Report
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              You don't have permission to view reports. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </ReportLayout>
  );
}
