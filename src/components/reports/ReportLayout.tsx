
import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReportLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ReportLayout({ title, description, children }: ReportLayoutProps) {
  const navigate = useNavigate()
  return (
    <DashboardLayout title={title}>
      <div className="space-y-6">
        <div>
          <div className='flex gap-2'>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/reports")}
            >
              <ArrowLeft className="mr-2 h-4 w-5" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          </div>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}
