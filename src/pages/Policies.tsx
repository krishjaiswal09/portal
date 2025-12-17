import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/services/api/fetchApi";
import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

const Policies = () => {
  const [policies, setPolicies] = useState<any>({
    terms_of_service: "",
    privacy_policy: "",
    refund_cancellation_policy: "",
    consent_checkboxes_for_registration: true
  })
  const policiesQueries = useQuery({
    queryKey: ["policiesQueries"],
    queryFn: () =>
      fetchApi<any>({
        path: "setting/policy",
      }),
  });

  useEffect(() => {
    if (
      !policiesQueries.isLoading &&
      policiesQueries.data
    ) {
      setPolicies(policiesQueries.data);
    }
  }, [policiesQueries.isLoading, policiesQueries.data]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[80%] mx-auto pt-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Terms of Service</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3 text-gray-700">
              <p>
                {policies.terms_of_service}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-[80%] mx-auto pt-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Privacy Policy</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3 text-gray-700">
              <p>
                {policies.privacy_policy}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-[80%] mx-auto pt-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Refund/Cancellation Policy</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3 text-gray-700">
              <p>
                {policies.refund_cancellation_policy}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-[80%] mx-auto pt-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Privacy Policy</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3 text-gray-700">
              {policies.consent_checkboxes_for_registration && (
                <div className="bg-blue-50 p-4 rounded border border-blue-200 mt-4">
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-blue-800">
                      Consent checkboxes are required during registration to ensure compliance with our terms.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Policies;
