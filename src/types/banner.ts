
export interface Banner {
  id: string;
  title?: string;
  imageUrl?: string;
  ctaButton: {
    text?: string;
    url?: string;
  };
  // dateRange: {
  //   startDate?: string;
  //   endDate?: string;
  // };
  audience: {
    userRoles?: string[];
    courses?: string[];
    artForms?: string[];
    ageGroups?: string[];
    timezones?: string[];
    countries?: string[];
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerFormData {
  title?: string;
  image: File | null;
  ctaButton?: {
    text?: string;
    url?: string;
  };
  // dateRange: {
  //   startDate?: Date | undefined;
  //   endDate?: Date | undefined;
  // };
  audience: {
    userRoles?: string[];
    courses?: string[];
    artForms?: string[];
    ageGroups?: string[];
    timezones?: string[];
    countries?: string[];
  };
  isActive?: boolean;
}
