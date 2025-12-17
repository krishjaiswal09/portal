
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneInput } from "@/components/ui/phone-input"
import { MultiSelect } from "@/components/ui/multi-select"
import { User, UserRole, countries } from "./mockData"
import { artForms } from "@/data/artForms"
import { toast } from "sonner"

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (user: User) => void
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onOpenChange,
  onAddUser
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roles: [] as UserRole[],
    ageType: 'adult' as 'kid' | 'adult',
    gender: 'male' as 'male' | 'female' | 'other',
    country: '',
    timezone: 'UTC',
    bio: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    familyId: '',
    artForms: [] as string[],
    sameAsParent: false
  })

  const isStudent = formData.roles.includes("student");
  const isKid = formData.ageType === 'kid';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || formData.roles.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    const selectedCountry = countries.find(c => c.name === formData.country)
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      roles: formData.roles,
      status: 'active',
      ageType: formData.ageType,
      gender: formData.gender,
      country: formData.country,
      countryFlag: selectedCountry?.flag || '🌍',
      timezone: formData.timezone,
      bio: formData.bio,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      creditBalance: 0,
      parentName: formData.ageType === 'kid' ? formData.parentName : undefined,
      familyId: formData.familyId || undefined
    }

    onAddUser(newUser)
    toast.success('User added successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      roles: [],
      ageType: 'adult',
      gender: 'male',
      country: '',
      timezone: 'UTC',
      bio: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      familyId: '',
      artForms: [],
      sameAsParent: false
    })
  }

  const toggleRole = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
  }

  const handleSameAsParentToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsParent: checked,
      email: checked ? prev.parentEmail : prev.email,
      phone: checked ? prev.parentPhone : prev.phone
    }));
  };

  // Convert art forms to options for MultiSelect
  const artFormOptions = artForms.map(form => ({
    label: form,
    value: form
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={isStudent && isKid && formData.sameAsParent}
              />
            </div>
            <div className="space-y-2">
              <PhoneInput
                label="Phone"
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                className={isStudent && isKid && formData.sameAsParent ? 'opacity-50 pointer-events-none' : ''}
              />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role(s) *</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="student"
                    checked={formData.roles.includes('student')}
                    onCheckedChange={() => toggleRole('student')}
                  />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="instructor"
                    checked={formData.roles.includes('instructor')}
                    onCheckedChange={() => toggleRole('instructor')}
                  />
                  <Label htmlFor="instructor">Instructor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parent"
                    checked={formData.roles.includes('parent')}
                    onCheckedChange={() => toggleRole('parent')}
                  />
                  <Label htmlFor="parent">Parent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin"
                    checked={formData.roles.includes('admin')}
                    onCheckedChange={() => toggleRole('admin')}
                  />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="support"
                    checked={formData.roles.includes('support')}
                    onCheckedChange={() => toggleRole('support')}
                  />
                  <Label htmlFor="support">Support</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Art Forms</Label>
              <MultiSelect
                options={artFormOptions}
                selected={formData.artForms}
                onChange={(selected) => setFormData(prev => ({ ...prev, artForms: selected }))}
                placeholder="Select art forms..."
              />
            </div>
          </div>

          {/* Parent Details - Show when student and kid */}
          {isStudent && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Age Type</Label>
                <Select value={formData.ageType} onValueChange={(value: 'kid' | 'adult') => setFormData(prev => ({ ...prev, ageType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="kid">Kid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(value: 'male' | 'female' | 'other') => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {isStudent && isKid && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium">Parent Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Parent Full Name"
                  value={formData.parentName}
                  onChange={e => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                />
                <Input
                  placeholder="Parent Email"
                  type="email"
                  value={formData.parentEmail}
                  onChange={e => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                />
                <div className="md:col-span-2">
                  <PhoneInput
                    label="Parent Phone"
                    value={formData.parentPhone}
                    onChange={val => setFormData(prev => ({ ...prev, parentPhone: val }))}
                  />
                </div>
              </div>
              
              {/* Same as Parent checkbox */}
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Checkbox
                  id="sameAsParent"
                  checked={formData.sameAsParent}
                  onCheckedChange={handleSameAsParentToggle}
                />
                <Label htmlFor="sameAsParent" className="text-sm">
                  Same as Parent (Use parent's email and phone)
                </Label>
              </div>
            </div>
          )}

          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Description</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            />
          </div>

          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
