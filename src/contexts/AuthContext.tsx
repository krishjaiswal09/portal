import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole, User, ReportPermissions } from "@/types/user";
import { rolesCheck } from "@/utils/rolesCheck";
import { useLoading } from '@/contexts/LoadingContext'

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: any) => Promise<boolean>;
  logout: () => void;
  getReportPermissions: () => ReportPermissions;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true" || false);
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("user")) || null);
  const { showLoader, hideLoader } = useLoading()

  const login = async (data: any): Promise<boolean> => {
    showLoader('Signing you in...')
    // Accepts data from API, expects data.user and data.user.roles (array of strings)
    if (data.user) {
      const userObj = data.user;
      const email: string = userObj.email || "";
      // roles is an array of strings, e.g. ["super_admin"]
      const roles: string[] = Array.isArray(userObj.roles) ? userObj.roles : [];
      // Map backend role string to UserRole enum
      let role: UserRole = rolesCheck(roles);
      // Name logic: use userObj.name if present, else fallback to email
      let name: string = `${userObj.first_name} ${userObj.last_name}`;
      if (!userObj.first_name && email) {
        name = email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }
      if (!name) name = "User";
      const userData: User = {
        ...data?.user,
        email,
        name,
        role,
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      hideLoader()
      return true;
    }
    return false;
  };

  const logout = () => {
    showLoader('Signing you out...')
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    hideLoader()
  };

  const getReportPermissions = (): ReportPermissions => {
    if (!user) {
      return {
        canViewReports: false,
        canExportReports: false,
        canViewAllData: false,
      };
    }

    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return {
          canViewReports: true,
          canExportReports: true,
          canViewAllData: true,
        };
      case UserRole.ADMIN:
        return {
          canViewReports: true,
          canExportReports: false,
          canViewAllData: true,
        };
      case UserRole.SUPPORT_STAFF:
        return {
          canViewReports: true,
          canExportReports: false,
          canViewAllData: false,
        };
      case UserRole.INSTRUCTOR:
        return {
          canViewReports: true,
          canExportReports: false,
          canViewAllData: false,
        };
      case UserRole.STUDENT:
        return {
          canViewReports: true,
          canExportReports: false,
          canViewAllData: false,
        };
      case UserRole.PARENT:
        return {
          canViewReports: true,
          canExportReports: false,
          canViewAllData: false,
        };
      default:
        return {
          canViewReports: false,
          canExportReports: false,
          canViewAllData: false,
        };
    }
  };

  // Check localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");
    if (stored === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, getReportPermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
};
