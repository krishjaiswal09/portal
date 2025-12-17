import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { InlineLoader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/api/fetchApi";
import { useMutation, useQuery } from "@tanstack/react-query";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotExistError, setEmailNotExistError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const rolesQueries = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "configurations/roles",
      }),
    enabled: false,
  });

  useEffect(() => {
    if (
      !rolesQueries.isLoading &&
      rolesQueries.data &&
      rolesQueries.data.length > 0
    ) {
      localStorage.setItem("Roles", JSON.stringify(rolesQueries.data));
    }
  }, [rolesQueries.isLoading, rolesQueries.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginMutation = useMutation({
    mutationKey: [],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      fetchApi<any>({
        path: "auth/login",
        method: "POST",
        data: {
          email,
          password,
        },
      }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginMutation.mutate(
        {
          email: form.email,
          password: form.password,
        },
        {
          onSuccess: async (data: any) => {
            const success = await login(data);
            if (success) {
              localStorage.setItem("token", data?.access_token);
              toast({
                title: "Login successful!",
                description: "Welcome back to Art Gharana.",
              });
              navigate("/");
            } else {
              toast({
                title: "Login failed",
                description: "Invalid credentials. Please try again.",
                variant: "destructive",
              });
            }
          },
          onError: (error) => {
            if (error?.message === "Email not exist") {
              setEmailNotExistError(true);
              toast({
                title: "Email does not exist",
                description: "Failed to send Email",
                variant: "destructive",
              });
            }
            toast({
              title: "Login failed",
              description: "Invalid credentials. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                <button
                  type="button"
                  onClick={() => setEmailNotExistError(false)}
                  className="w-full flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </button>
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <img
                src="logo.png"
                alt="Art Gharana"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              <span className="hidden text-white font-bold text-lg">AG</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Sign in to your Art Gharana account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="remember" className="text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold text-base transition-all duration-200"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <InlineLoader size="sm" />
                    <span className="ml-2">Signing in...</span>
                  </>
                ) : (
                  <>Sign In</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Art Gharana. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
