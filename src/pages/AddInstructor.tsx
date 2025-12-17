import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole, AgeType, countries, timezones, languages } from "@/components/user-management/mockData";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useArtForm } from '@/hooks/use-artForms'; // Assuming this hook fetches art forms
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { fetchApi } from '@/services/api/fetchApi';
import { format } from 'date-fns';
import { getCurrentCountryAndTimeZone } from '@/utils/currentCoutryAndTimeZone';
import { hasPermission } from '@/utils/checkPermission';
import { SectionLoader, InlineLoader } from '@/components/ui/loader';

export enum UserRoleType {
  Admin = 'admin',
  Instructor = 'instructor',
  Student = 'student',
  Parent = 'parent',
  Support = 'support',
  AccountManager = 'account_manager',
  ContentManager = 'content_manager',
}

const AddInstructor = () => {
  const { id } = useParams<{ id: string }>();

  const requiredPermission = id
    ? "HAS_EDIT_INSTRUCTOR" // Edit mode
    : "HAS_CREATE_INSTRUCTOR"; // Create mode
  if (!hasPermission(requiredPermission)) {
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

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Initialize query client
  const { data: artForms = [] } = useArtForm(); // Renamed to artForms for clarity
  const [ageGroupsOptions, setAgeGroupsOptions] = useState<any[]>([]);
  const [newCertification, setNewCertification] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [showCertificationsDropdown, setShowCertificationsDropdown] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    countryName: '',
    countryCode: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    utcOffset: '',
  });

  const ageGroupQueries = useQuery({
    queryKey: ["ageGroupGet"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "age-groups",
      }),
  });

  // Query to fetch user data if `id` exists (for editing)
  const usersQueries = useQuery({
    queryKey: ["getUser", id], // Include id in query key
    queryFn: () =>
      fetchApi<User>({
        path: `users/${id}`,
      }),
    enabled: !!id, // Only run this query if `id` is present
  });

  // Query to fetch user data if `id` exists (for editing)
  const certificationsQueries = useQuery({
    queryKey: ["getCertifications", id], // Include id in query key
    queryFn: () =>
      fetchApi<any[]>({
        path: `certification`,
      }),
  });

  const initialFormData: User = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'male',
    age_type: 'adult' as AgeType,
    bio: '',
    meeting_link: '',
    country: countries.find(v => v.code === currentLocation.countryCode)?.code || "",
    state: '',
    city: '',
    postal_code: '',
    address_line: '',
    timezone: timezones.find(v => v.name === currentLocation.timeZone)?.code || "",
    roles: [3] as unknown as UserRole[],
    is_active: true,
    credit_balance: 0,
    username: '',
    parentCheck: "New",
    parent_id: undefined,
    parent_first_name: '',
    parent_last_name: '',
    parent_email: '',
    parent_phone: '',
    account_manager_id: '',
    whatsapp_notification: true,
    special_requirements: '',
    profile_photo: null as File | null,
    art_form: '', // Consider making this an array
    same_as_parent: false,
    languages: [] as string[],
    certifications: [] as string[],
    age_group: [] as number[],
    assign_demos: false,
    transfer_students: false,
    preference: '',
    status: 'Active', // Add initial status
  };

  const [formData, setFormData] = useState<User>(initialFormData);

  // Use useEffect to update formData when usersQueries.data changes
  useEffect(() => {
    if (id && usersQueries.data) {
      // Deep merge to ensure all fields are covered,
      // but only if usersQueries.data has loaded
      setFormData(prev => ({
        ...initialFormData, // Start with initial state to clear old data if navigating from edit to add
        ...prev, // Keep existing form changes if any
        ...usersQueries.data, // Apply fetched data
        // Map backend fields to frontend form fields if names differ
        country: usersQueries.data.country || countries.find(v => v.code === currentLocation.countryCode)?.code || "",
        timezone: usersQueries.data.timezone || timezones.find(v => v.name === currentLocation.timeZone)?.code || "",
        phone: usersQueries.data.phone_number || '', // Assuming phone_number from backend
        address_line: usersQueries.data.address?.split(',')[0]?.trim() || '', // Example: splitting address
        // You might need more sophisticated parsing for address if it's a single string
        status: usersQueries.data.is_active ? 'Active' : 'Inactive', // Map boolean to UserStatus
        roles: usersQueries.data.roles,
        // Ensure array fields are initialized correctly if they might be null/undefined from API
        languages: usersQueries.data.languages || [],
        certifications: (usersQueries.data.certifications as unknown as { id: number }[])?.map(crt => crt.id) || [],
        age_group: usersQueries.data.age_group || [],
        assign_demos: usersQueries.data.assign_demos,
        transfer_students: usersQueries.data.transfer_students,
        // Handle parent details if they exist on the fetched user
        parentCheck: usersQueries.data.parent_id ? "Existing" : "New",
        bio: usersQueries.data.notes,
        postal_code: usersQueries.data.pin || ''
      }));
    } else if (!id) {
      // Reset form when navigating from edit to add (id becomes null)
      setFormData(initialFormData);
    }
  }, [usersQueries.data, id]);

  useEffect(() => {
    if (!id) {
      setFormData((prev) => ({
        ...prev,
        country: countries.find(v => v.code === currentLocation.countryCode)?.code || "",
        timezone: timezones.find(v => v.name === currentLocation.timeZone)?.code || "",
      }))
    }
  }, [id, currentLocation])

  useEffect(() => {
    getCurrentCountryAndTimeZone().then((data) => {
      setCurrentLocation(data)
    });
  }, [])

  useEffect(() => {
    if (!certificationsQueries.isLoading && certificationsQueries.data) {
      setCertifications(certificationsQueries.data);
    }
  }, [certificationsQueries.isLoading, certificationsQueries.data]);

  useEffect(() => {
    if (!ageGroupQueries.isLoading && ageGroupQueries.data) {
      const ageGroupData = ageGroupQueries.data?.map((v: { id: number; name: string }) => ({
        name: v.name,
        value: v.id,
      }));
      setAgeGroupsOptions(ageGroupData);
    }
  }, [ageGroupQueries.isLoading, ageGroupQueries.data]);


  // Combined mutation for creating and updating a user
  const userMutation = useMutation({
    mutationFn: (userData: User) => {
      if (id) {
        // Update user
        return fetchApi<any>({
          path: `users/${id}`,
          method: 'PUT',
          data: userData,
        });
      } else {
        // Create user
        return fetchApi<any>({
          path: 'users/register',
          method: 'POST',
          data: userData,
        });
      }
    },
    onSuccess: (data) => {
      toast({
        title: id ? "User Updated Successfully" : "User Created Successfully",
        description: `${formData.first_name} ${formData.last_name} ${id ? 'updated' : 'added'}.`,
        duration: 3000,
      });
      // Invalidate queries to refetch fresh data after mutation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userParentRole"] }); // Invalidate if parents are affected
      queryClient.invalidateQueries({ queryKey: ["accountManagerRole"] }); // Invalidate if account managers are affected

      navigate('/admin/instructors');
    },
    onError: (error: any) => {
      console.error(`Error ${id ? 'updating' : 'creating'} user:`, error);
      toast({
        title: `Error ${id ? 'Updating' : 'Creating'} User`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const toggleArrayField = (field: keyof User, value: string | number) => {
    setFormData(prev => {
      const currentArray = (prev[field] || []) as (string | number)[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [field]: updatedArray,
      };
    });
  };

  const addCertification = () => {
    if (typeof newCertification === "string") {
      if (newCertification.trim()) {
        setFormData(prev => ({
          ...prev,
          certifications: [...(prev.certifications || []), newCertification.trim()],
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification],
      }));
    }
    setNewCertification('');
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: keyof User, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email || formData.roles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in First Name, Last Name, Email, and select at least one Role.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    const payload: User = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: "Admin@1234", // This should be handled securely, possibly only on create or via a separate password reset
      phone_number: formData.phone,
      date_of_birth: formData.date_of_birth,
      art_form: formData.art_form, // Still a single string here, consider array if multiple
      address: `${formData.address_line || ''}, ${formData.city || ''}, ${formData.state || ''}, ${formData.postal_code || ''}`.trim(),
      is_active: formData.is_active,
      roles: [3] as unknown as UserRole[], // Cast back to UserRole[] for type consistency
      age_type: formData.age_type,
      notes: `${formData.bio || ''} ${formData.special_requirements || ''}`.trim(),
      whatsapp_notification: formData.whatsapp_notification,
      gender: formData.gender as "male" | "female" | "other",
      age_group: formData.age_group,
      country: formData.country,
      city: formData.city,
      timezone: formData.timezone,
      state: formData.state,
      pin: formData.postal_code,
      languages: formData.languages,
      certifications: formData.certifications,
      assign_demos: formData.assign_demos,
      transfer_students: formData.transfer_students,
      preference: formData.preference,
    };
    // Trigger the combined mutation
    userMutation.mutate(payload);
  };

  const filteredCertification = certifications.filter(
    (crt) =>
      (crt.name?.toLowerCase() || "").includes(
        typeof newCertification === "string" && newCertification.toLowerCase()
      )
  );

  const filteredLanguages = languages.filter(
    (language) =>
      language.toLowerCase().includes(newLanguage.toLowerCase()) &&
      !(formData.languages || []).includes(language)
  );

  const handleAddLanguage = (language: string) => {
    if (!(formData.languages || []).includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...(prev.languages || []), language],
      }));
    }
    setNewLanguage('');
    setShowLanguageDropdown(false);
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(lang => lang !== language),
    }));
  };

  return (
    <DashboardLayout title={id ? "Edit User" : "Add New User"}>
      <div className=" mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin/instructors/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{id ? "Edit Instructor" : "Add New Instructor"}</h1>
              <p className="text-muted-foreground">{id ? "Manage user profile" : "Create a new instructor profile with personal and professional details"}</p>
            </div>
          </div>
          <Button form="add-user-form" type="submit" className="gap-2" disabled={userMutation.isPending}>
            {userMutation.isPending ? (
              <>
                <InlineLoader size="sm" />
                <span className="ml-2">{id ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {id ? "Update Instructor" : "Create Instructor"}
              </>
            )}
          </Button>
        </div>

        {id && usersQueries.isLoading ? (
          <SectionLoader text="Loading instructor data..." />
        ) : (
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={e => updateField('first_name', e.target.value)}
                  />
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={e => updateField('last_name', e.target.value)}
                  />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                  />
                  <div>
                    <PhoneInput
                      value={formData.phone}
                      onChange={val => updateField('phone', val)}
                      placeholder="Phone Number"
                    />
                  </div>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={
                      formData?.date_of_birth
                        ? format(new Date(formData.date_of_birth), 'yyyy-MM-dd')
                        : ''
                    }
                    onChange={e => updateField('date_of_birth', e.target.value)}
                    placeholder="Date of Birth (Optional)"
                  />
                  <Select
                    value={formData.gender}
                    onValueChange={value => updateField('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>

                  <Textarea
                    rows={3}
                    placeholder="Special Requirements or Notes"
                    value={formData.bio}
                    onChange={e => updateField('bio', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address & Location</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={formData.country}
                  onValueChange={val => updateField('country', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={`country${c.code}_${c.name}`} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.timezone}
                  onValueChange={val => updateField('timezone', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz, i) => (
                      <SelectItem key={`tz_${tz.code}_${tz.name}_${tz.code}`} value={tz.code}>
                        {tz.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={e => updateField('state', e.target.value)}
                />
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={e => updateField('city', e.target.value)}
                />
                <Input
                  placeholder="Postal Code"
                  value={formData.postal_code}
                  onChange={e => updateField('postal_code', e.target.value)}
                />
                <Input
                  placeholder="Address Line"
                  value={formData.address_line}
                  onChange={e => updateField('address_line', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Section 2: Professional Details */}
            {
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Languages Known */}
                  <div className="space-y-3">
                    <Label>Languages Known</Label>
                    <div className="relative">
                      <Input
                        value={newLanguage}
                        onChange={(e) => {
                          setNewLanguage(e.target.value);
                          setShowLanguageDropdown(true);
                        }}
                        onFocus={() => setShowLanguageDropdown(true)}
                        placeholder="Search and select languages..."
                      />
                      {showLanguageDropdown && (
                        <div className="absolute z-50 top-full mt-1 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {(newLanguage ? filteredLanguages : languages?.filter(lang => !(formData.languages || [])?.includes(lang)))?.length > 0 ? (
                            (newLanguage ? filteredLanguages : languages?.filter(lang => !(formData.languages || [])?.includes(lang)))?.map((language) => (
                              <div
                                key={language}
                                className="p-2 hover:bg-muted cursor-pointer"
                                onClick={() => handleAddLanguage(language)}
                              >
                                <p className="font-medium">{language}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-muted-foreground">
                              No languages found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Languages */}
                    {(formData.languages || [])?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Selected Languages ({(formData.languages || [])?.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(formData.languages || [])?.map((language) => (
                            <Badge
                              key={language}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {language}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemoveLanguage(language)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator />

                  {/* Art Forms */}
                  <div className="space-y-3">
                    <Label>Art Forms they can teach</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[...new Map(artForms.map(f => [f.name.toLowerCase(), f])).values()]?.map(form => <div key={`${form.value}_${form.name}`} className="flex items-center space-x-2">
                        {/* Assuming art_form is an array of strings (art form IDs/values) */}
                        <Checkbox id={`art-${form.value}_${form.name}`} checked={(formData.art_form || '').includes(form.value.toString())} onCheckedChange={() => toggleArrayField('art_form', form.value.toString())} />
                        <Label htmlFor={`art-${form.value}_${form.name}`} className="text-sm">
                          {form.name}
                        </Label>
                      </div>)}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Teaching Preference</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="indian-preference" 
                          checked={(formData.preference || []).includes('indian')} 
                          onCheckedChange={() => toggleArrayField('preference', 'indian')} 
                        />
                        <Label htmlFor="indian-preference">Indian</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="overseas-preference" 
                          checked={(formData.preference || []).includes('overseas')} 
                          onCheckedChange={() => toggleArrayField('preference', 'overseas')} 
                        />
                        <Label htmlFor="overseas-preference">Overseas</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Certifications */}
                  <div className="space-y-3">
                    <Label>Certifications</Label>
                    {/* <div className="flex gap-2">
                      <Input value={newCertification} onChange={e => setNewCertification(e.target.value)} placeholder="Enter certification" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCertification())} />
                      <Button type="button" onClick={addCertification} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div> */}
                    <div className="relative">
                      <div className="flex gap-2">
                        <Input
                          value={typeof newCertification === "string" ? newCertification : certifications.filter(v => v.id === newCertification)[0].name}
                          onChange={(e) => {
                            setNewCertification(e.target.value);
                            setShowCertificationsDropdown(true);
                          }}
                          onFocus={() => setShowCertificationsDropdown(true)}
                          placeholder="Enter certification"
                        />
                        <Button type="button" onClick={addCertification} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {showCertificationsDropdown && newCertification && (
                        <div className="absolute z-50 top-full mt-1 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredCertification.length > 0 ? (
                            filteredCertification.map((crt) => (
                              <div
                                key={crt.id}
                                className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                                onClick={() => { setNewCertification(crt.id); setShowCertificationsDropdown(false) }}
                              >
                                <div>
                                  <p className="font-medium">
                                    {crt.name}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-muted-foreground">
                              No students found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {(formData.certifications || []).length > 0 && <div className="flex flex-wrap gap-2">
                      {(formData.certifications || []).map((cert, index) => <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {typeof cert === "string" ? cert : certifications.filter(v => v.id === cert)[0]?.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(index)} />
                      </Badge>)}
                    </div>}
                  </div>

                  <Separator />

                  {/* Age Groups */}
                  <div className="space-y-3">
                    <Label>Comfortable Teaching Age Groups</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ageGroupsOptions.map(group => <div key={`${group.name}_${group.value}`} className="flex items-center space-x-2">
                        <Checkbox id={`age-${group.name}_${group.value}`} checked={(formData.age_group || []).includes(group.value)} onCheckedChange={() => toggleArrayField('age_group', group.value)} />
                        <Label htmlFor={`age-${group.name}_${group.value}`}>
                          {group.name}
                        </Label>
                      </div>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            }

            {/* Section 3: Account Settings & Teaching Permissions */}
            {
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Account Settings & Teaching Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Status</Label>
                        <p className="text-sm text-muted-foreground">
                          Set instructor account as active or inactive
                        </p>
                      </div>
                      <Switch checked={formData.is_active} onCheckedChange={checked => updateField('is_active', checked)} />
                    </div>
                    <Separator />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Teaching Permissions</h4>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="assign_demos">Can Assign Demos</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow this instructor to be assigned for demo classes
                        </p>
                      </div>
                      <Switch id="assign_demos" checked={formData.assign_demos} onCheckedChange={checked => updateField('assign_demos', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="canTransferStudents">Can Transfer Students</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow students from other instructors to be transferred to this instructor
                        </p>
                      </div>
                      <Switch id="canTransferStudents" checked={formData.transfer_students} onCheckedChange={checked => updateField('transfer_students', checked)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            }

          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddInstructor;
