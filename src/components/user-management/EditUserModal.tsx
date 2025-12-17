
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneInput } from "@/components/ui/phone-input"
import { countries, type User, type UserRole, type UserStatus, type AgeType } from "./mockData"
import { UserPlus, Save } from "lucide-react"
import { useArtForm } from '@/hooks/use-artForms'
import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/services/api/fetchApi'

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdate: (user: User) => void
}

export function EditUserModal({ user, isOpen, onOpenChange, onUserUpdate }: EditUserModalProps) {
  const { data: artForms } = useArtForm();
  const [parentDetails, setParentDetails] = useState<User>(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    age_type: 'adult' as AgeType,
    bio: '',
    meeting_link: '',
    country: '',
    state: '',
    city: '',
    postal_code: '',
    address_line: '',
    timezone: 'Asia/Kolkata',
    roles: [] as UserRole[],
    status: 'active' as UserStatus,
    is_active: true,
    credit_balance: 0,
    username: '',
    account_manager: '',
    communication_preferences: {
      whatsapp: true
    },
    profile_photo: null as File | null,
    art_form: '',
    art_forms: [] as string[],
    same_as_parent: false,
    ...user
  })

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || user.name?.split(' ')[0] || '',
        last_name: user.last_name || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || '',
        phone_number: user.phone_number || user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        age_type: user.age_type || user.ageType || 'adult',
        bio: user.notes || '',
        meeting_link: user.meeting_link || '',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
        postal_code: user.pin || '',
        address_line: user.address || '',
        timezone: user.timezone || '',
        roles: user.roles || [],
        status: user.status || 'active',
        is_active: user.is_active ?? (user.status === 'active'),
        credit_balance: user.credit_balance || user.creditBalance || 0,
        username: user.username || '',
        parent_id: user.parent_id,
        account_manager: user.account_manager || '',
        communication_preferences: user.communication_preferences || {
          whatsapp: user.whatsapp_notification ?? true
        },
        profile_photo: null,
        art_form: user.art_form || '',
        art_forms: [],
        same_as_parent: user.same_as_parent || false
      })
    }
  }, [user, isOpen])

  const isStudent = formData.roles.includes("student");
  const isKid = formData.age_type === 'kid';

  const usersQueries = useQuery({
    queryKey: ["getUsers"],
    queryFn: () =>
      fetchApi<User>({
        path: `users/${formData.parent_id}`,
      }),
    enabled: !!formData.parent_id
  });

  useEffect(() => {
    if (
      !usersQueries.isLoading &&
      usersQueries.data
    ) {
      setParentDetails(usersQueries.data)
    }
  }, [usersQueries.isLoading, usersQueries.data]);

  const handleRoleToggle = (role: UserRole) => {
    const updatedRoles = formData.roles.includes(role)
      ? formData.roles.filter(r => r !== role)
      : [...formData.roles, role];
    setFormData({
      ...formData,
      roles: updatedRoles
    });
  };

  const handleSameAsParentToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      same_as_parent: checked,
      email: checked ? prev.parent_email : prev.email,
      phone: checked ? prev.parent_phone : prev.phone
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const updatedUser: User = {
      ...user,
      name: `${formData.first_name} ${formData.last_name}`,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      phone_number: formData.phone_number,
      roles: formData.roles,
      status: formData.status,
      is_active: formData.is_active,
      country: formData.country,
      countryFlag: countries.find(c => c.name === formData.country)?.flag || user.countryFlag,
      age_type: formData.age_type,
      ageType: formData.age_type,
      gender: formData.gender as 'male' | 'female' | 'other',
      bio: formData.bio,
      meeting_link: formData.meeting_link,
      credit_balance: formData.credit_balance,
      creditBalance: formData.credit_balance,
      timezone: formData.timezone,
      parentName: isKid ? `${formData.parent_first_name} ${formData.parent_last_name}` : undefined,
      parent_first_name: formData.parent_first_name,
      parent_last_name: formData.parent_last_name
    }
    console.log(updatedUser, "updatedUsera")
    onUserUpdate(updatedUser)
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Edit User Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role & Account */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {([
                  'student',
                  'instructor',
                  'parent',
                  'admin',
                  'support'
                ] as UserRole[]).map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={formData.roles.includes(role)}
                      onCheckedChange={() => handleRoleToggle(role)}
                    />
                    <Label htmlFor={role}>
                      {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(val: UserStatus) => setFormData({
                    ...formData,
                    status: val
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Account Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {isStudent && (
                  <Select
                    value={formData.age_type}
                    onValueChange={(value: AgeType) => setFormData({
                      ...formData,
                      age_type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Age Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kid">Kid</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Select
                  value={formData.art_form}
                  onValueChange={val => setFormData({
                    ...formData,
                    art_form: val
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Art Form" />
                  </SelectTrigger>
                  <SelectContent>
                    {artForms?.map(art => (
                      <SelectItem key={`${art.name}_${art.value}`} value={art.value.toString()}>
                        {art.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="creditBalance">Credit Balance</Label>
                <Input
                  id="creditBalance"
                  type="number"
                  value={formData.credit_balance}
                  onChange={(e) => setFormData(prev => ({ ...prev, credit_balance: parseInt(e.target.value) || 0 }))}
                />
              </div>

              {/* Parent Details - Show when student and kid */}
              {isStudent && isKid && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium">Parent Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Parent First Name"
                      value={parentDetails.first_name}
                      disabled
                    // onChange={e => setFormData({
                    //   ...formData,
                    //   parent_first_name: e.target.value
                    // })}
                    />
                    <Input
                      placeholder="Parent Last Name"
                      value={parentDetails.last_name}
                      disabled
                    // onChange={e => setFormData({
                    //   ...formData,
                    //   parent_last_name: e.target.value
                    // })}
                    />
                    <Input
                      placeholder="Parent Email"
                      type="email"
                      disabled
                      value={parentDetails.email}
                    // onChange={e => setFormData({
                    //   ...formData,
                    //   parent_email: e.target.value
                    // })}
                    />
                    <div>
                      <PhoneInput
                        label="Parent Phone"

                        value={parentDetails.phone_number}
                      // onChange={val => setFormData({
                      //   ...formData,
                      //   parent_phone: val
                      // })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Account Manager Name"
                        disabled
                        value={formData.account_manager}
                        onChange={e => setFormData({
                          ...formData,
                          account_manager: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                  onChange={e => setFormData({
                    ...formData,
                    first_name: e.target.value
                  })}
                />
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={e => setFormData({
                    ...formData,
                    last_name: e.target.value
                  })}
                />
              </div>

              {/* Same as Parent checkbox for students who are kids */}
              {isStudent && isKid && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Checkbox
                    id="sameAsParent"
                    checked={formData.same_as_parent}
                    onCheckedChange={handleSameAsParentToggle}
                  />
                  <Label htmlFor="sameAsParent" className="text-sm">
                    Same as Parent (Use parent's email and phone)
                  </Label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })}
                  disabled={isStudent && isKid && formData.same_as_parent}
                />
                <div>
                  <PhoneInput
                    value={formData.phone}
                    onChange={val => setFormData({
                      ...formData,
                      phone: val
                    })}
                    placeholder="Phone Number"
                    className={isStudent && isKid && formData.same_as_parent ? 'opacity-50 pointer-events-none' : ''}
                  />
                </div>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={e => setFormData({
                    ...formData,
                    date_of_birth: e.target.value
                  })}
                  placeholder="Date of Birth (Optional)"
                />
                <Select
                  value={formData.gender}
                  onValueChange={value => setFormData({
                    ...formData,
                    gender: value
                  })}
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
                <Input
                  id="meetingLink"
                  placeholder="Meeting Link"
                  value={formData.meeting_link}
                  onChange={e => setFormData({
                    ...formData,
                    meeting_link: e.target.value
                  })}
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
                onValueChange={val => setFormData({
                  ...formData,
                  country: val
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="State"
                value={formData.state}
                onChange={e => setFormData({
                  ...formData,
                  state: e.target.value
                })}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={e => setFormData({
                  ...formData,
                  city: e.target.value
                })}
              />
              <Input
                placeholder="Postal Code"
                value={formData.postal_code}
                onChange={e => setFormData({
                  ...formData,
                  postal_code: e.target.value
                })}
              />
              <Input
                placeholder="Address Line"
                value={formData.address_line}
                onChange={e => setFormData({
                  ...formData,
                  address_line: e.target.value
                })}
              />
            </CardContent>
          </Card>

          {/* Bio & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Bio & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.communication_preferences.whatsapp}
                  onCheckedChange={checked =>
                    setFormData({
                      ...formData,
                      communication_preferences: {
                        whatsapp: checked
                      }
                    })
                  }
                />
                <Label>Receive WhatsApp Notifications</Label>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
