
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Filter } from 'lucide-react';
import { fetchApi } from '@/services/api/fetchApi';
import { type User } from "@/components/user-management/mockData";
import { useQuery } from '@tanstack/react-query';
import { useArtForm } from '@/hooks/use-artForms';
import { SectionLoader } from '@/components/ui/loader';

const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Santali', 'Kashmiri', 'Nepali', 'Konkani', 'Sindhi', 'Dogri', 'Manipuri (Meitei)', 'Bodo', 'Rajasthani', 'Haryanvi', 'Chhattisgarhi', 'Bhojpuri', 'Awadhi', 'Magahi', 'Marwari', 'Garhwali', 'Kumaoni', 'Tulu'];



export function DemoEligibleInstructorsSection() {
  const { data: artForms = [] } = useArtForm();
  const [ageGroupsOptions, setAgeGroupsOptions] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  const ageGroupQueries = useQuery({
    queryKey: ["ageGroupGet"],
    queryFn: () => fetchApi<any[]>({ path: "age-groups" }),
  });

  const certificationsQueries = useQuery({
    queryKey: ["getCertifications"],
    queryFn: () => fetchApi<any[]>({ path: "certification" }),
  });

  useEffect(() => {
    if (!ageGroupQueries.isLoading && ageGroupQueries.data) {
      setAgeGroupsOptions(ageGroupQueries.data?.map((v: { id: number; name: string }) => ({
        name: v.name,
        value: v.id,
      })));
    }
  }, [ageGroupQueries.isLoading, ageGroupQueries.data]);

  useEffect(() => {
    if (!certificationsQueries.isLoading && certificationsQueries.data) {
      setCertifications(certificationsQueries.data);
    }
  }, [certificationsQueries.isLoading, certificationsQueries.data]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedKidFriendly, setSelectedKidFriendly] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedCertification, setSelectedCertification] = useState<string>('all');
  const [instructors, setInstructors] = useState<User[]>([]);

  const usersQueries = useQuery({
    queryKey: ["usersInstructorRole"],
    queryFn: () =>
      fetchApi<{ data: User[] }>({
        path: "users",
        params: { roles: 'instructor' },
      }),
  });

  useEffect(() => {
    if (
      !usersQueries.isLoading &&
      usersQueries.data &&
      usersQueries.data.data
    ) {
      const usersData: User[] = usersQueries.data.data?.map((v) => ({
        name: `${v.first_name} ${v.last_name}`,
        email: v.email,
        timezone: v.timezone,
        country: v.country,
        roles: v.roles,
        id: v.id,
        status: v.is_active ? "active" : "inactive",
        is_active: v.is_active,
        age_type: v.age_type,
        ...v
      }));
      setInstructors(usersData)
    }
  }, [usersQueries.isLoading, usersQueries.data]);

  // Filter instructors who can assign demos
  const demoEligibleInstructors = instructors.filter(instructor => instructor.assign_demos);

  // Apply filters
  const filteredInstructors = demoEligibleInstructors.filter(instructor => {
    // Course/Art Form filter
    const courseMatch = selectedCourse === 'all' ||
      (instructor.art_form && Array.isArray(instructor.art_form) &&
        instructor.art_form.some(artFormId =>
          artForms.find(af => af.value === +artFormId)?.name.toLowerCase().includes(selectedCourse.toLowerCase()) ||
          selectedCourse === String(artFormId)
        ));

    // Gender filter
    const genderMatch = selectedGender === 'all' || instructor.gender === selectedGender.toLowerCase();

    // Status filter - handle both 'active'/'inactive' and 'Active'/'Inactive'
    const statusMatch = selectedStatus === 'all' ||
      instructor.status.toLowerCase() === selectedStatus.toLowerCase();

    // Kid Friendly filter - check if age_group includes kids (typically age group 1)
    const kidFriendlyMatch = selectedKidFriendly === 'all' ||
      (selectedKidFriendly === 'yes' && instructor.kid_friendly) ||
      (selectedKidFriendly === 'no' && (!instructor.kid_friendly));

    // Language filter
    const languageMatch = selectedLanguage === 'all' ||
      (instructor.languages && instructor.languages.includes(selectedLanguage));

    // Age Group filter
    const ageGroupMatch = selectedAgeGroup === 'all' ||
      (instructor.age_group && instructor.age_group.includes(+selectedAgeGroup));

    // Certification filter
    const certificationMatch = selectedCertification === 'all' ||
      (instructor.certifications && instructor.certifications.some((cert: any) => 
        typeof cert === 'string' ? cert === selectedCertification : cert.id === +selectedCertification
      ));

    return courseMatch && genderMatch && statusMatch && kidFriendlyMatch && languageMatch && ageGroupMatch && certificationMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Demo-Eligible Instructors
        </h2>
        <Badge variant="secondary">
          {filteredInstructors.length} Available
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {artForms.map(artForm => (
                    <SelectItem key={`${artForm.value}_${artForm.name}`} value={artForm.value.toString()}>
                      {artForm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kid Friendly</label>
              <Select value={selectedKidFriendly} onValueChange={setSelectedKidFriendly}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age Group</label>
              <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="All Age Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Age Groups</SelectItem>
                  {ageGroupsOptions.map(group => (
                    <SelectItem key={group.value} value={group.value.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Certification</label>
              <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                <SelectTrigger>
                  <SelectValue placeholder="All Certifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                  {certifications.map(cert => (
                    <SelectItem key={cert.id} value={cert.id.toString()}>
                      {cert.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructors List */}
      <Card>
        <CardContent className="p-4">
          {usersQueries.isLoading ? (
            <SectionLoader text="Loading instructors..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredInstructors.map((instructor) => (
                <div key={instructor.id} className="p-4 border rounded-lg hover:shadow-md transition-all hover:bg-muted/50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{instructor.name}</h4>
                        <p className="text-xs text-muted-foreground">{instructor.country}</p>
                      </div>
                      <Badge
                        variant={instructor.is_active ? 'default' : 'secondary'}
                        className={`text-xs ${instructor.is_active ? 'bg-green-500' : ''}`}
                      >
                        {instructor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Art Forms</p>
                        <div className="flex flex-wrap gap-1">
                          {(instructor.art_form as unknown as any[])?.map((form) => (
                            <Badge key={form} variant="secondary" className="text-xs">
                              {artForms.find(v => v.value == form)?.name}
                            </Badge>
                          ))}
                          {instructor.art_form?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{instructor.art_form.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Languages</p>
                          <div className="flex flex-wrap gap-1">
                            {instructor.languages?.slice(0, 2).map((lang: string) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                            {instructor.languages?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{instructor.languages.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {instructor.kid_friendly && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-600">
                                Kid Friendly
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!usersQueries.isLoading && filteredInstructors.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No demo-eligible instructors found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
