import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { InlineLoader } from "@/components/ui/loader";
import { fetchApi } from "@/services/api/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BASE_URL =
  import.meta.env.VITE_FRONTEND_URL || "http://31.97.232.41:8080";
let url = `${BASE_URL}/reset-password`;

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailNotExistError, setEmailNotExistError] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailNotExistError(false);

    forgotPasswordMutation.mutate(email, {
      onSuccess: (data) => {
        if (data.message) {
          setIsSuccess(true);
        }
        setIsLoading(false);
      },
      onError: (error: any) => {
        setIsLoading(false);
        if (error?.message === "Email not exist") {
          setEmailNotExistError(true);
          toast({
            title: "Email does not exist",
            description: "Failed to send Email",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Validation Error",
            description: "Failed to send Email",
            variant: "destructive",
          });
        }
      },
    });
  };

  const forgotPasswordMutation = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: (email: string) =>
      fetchApi<{ message: string }>({
        path: "auth/forgot-password",
        method: "POST",
        data: { email, resetURL: url },
      }),
  });

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to {email}
              </p>
              <Button asChild className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Didn’t receive the email? Check spam or{" "}
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (emailNotExistError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mx-auto h-16 w-16 text-red-500 mb-4 flex items-center justify-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-600">
                Email Does Not Exist
              </h2>
              <p className="text-muted-foreground mb-6">
                The email address you entered is not registered in our system.
                Please contact{" "}
                <a href="#" className="text-primary hover:underline">
                  support
                </a>{" "}
                for assistance.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Need help?{" "}
                <button
                  onClick={() => setEmailNotExistError(false)}
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <img
                alt="Art Gharana"
                className="w-16 h-16 object-contain"
                src="/lovable-uploads/d6611337-cc02-4c75-aa6b-b072423de40d.png"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              <span className="hidden text-white font-bold text-2xl">AG</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-white/90 text-lg">
            Enter your email to reset your password
          </p>
        </div>

        {/* Reset Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl w-full">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-foreground">
              Reset Password
            </CardTitle>
            <p className="text-muted-foreground text-center">
              We'll send you a link to reset your password
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 text-base"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <InlineLoader size="sm" />
                    <span className="ml-2">Sending Reset Link...</span>
                  </>
                ) : (
                  <>Send Reset Link</>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-sm text-white/80 mt-6">
          Art Gharana Management System © {currentYear}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
