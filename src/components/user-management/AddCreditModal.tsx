
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, User, Clock, DollarSign } from "lucide-react"

interface AddCreditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  familyMembers: Array<{ id: string; name: string }>
  onAddCredit: (creditData: any) => void
}

export function AddCreditModal({ isOpen, onOpenChange, familyMembers, onAddCredit }: AddCreditModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    studentId: '',
    classType: '',
    numberOfCredits: '',
    amount: '',
    paymentMethod: '',
    transactionId: '',
    notes: ''
  })

  const classTypes = [
    { value: 'private-60', label: 'Private 60 min', price: 50 },
    { value: 'private-40', label: 'Private 40 min', price: 35 },
    { value: 'group-60', label: 'Group 60 min', price: 25 }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.studentId || !formData.classType || !formData.numberOfCredits) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const selectedClassType = classTypes.find(ct => ct.value === formData.classType)
    const totalAmount = selectedClassType ? selectedClassType.price * parseInt(formData.numberOfCredits) : 0

    const creditData = {
      ...formData,
      totalAmount,
      date: new Date().toISOString(),
      status: 'completed'
    }

    onAddCredit(creditData)
    toast({
      title: "Credits Added Successfully",
      description: `${formData.numberOfCredits} credits added for ${selectedClassType?.label}`,
    })
    onOpenChange(false)
    setFormData({
      studentId: '',
      classType: '',
      numberOfCredits: '',
      amount: '',
      paymentMethod: '',
      transactionId: '',
      notes: ''
    })
  }

  const selectedClassType = classTypes.find(ct => ct.value === formData.classType)
  const calculatedAmount = selectedClassType && formData.numberOfCredits 
    ? selectedClassType.price * parseInt(formData.numberOfCredits || '0') 
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Family Credits
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="student">Select Student *</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose family member" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Class Type Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Class Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="classType">Class Type *</Label>
                <Select
                  value={formData.classType}
                  onValueChange={(value) => setFormData({ ...formData, classType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                  <SelectContent>
                    {classTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} - ${type.price}/credit
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Credit Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numberOfCredits">Number of Credits *</Label>
                  <Input
                    id="numberOfCredits"
                    type="number"
                    min="1"
                    placeholder="Enter number of credits"
                    value={formData.numberOfCredits}
                    onChange={(e) => setFormData({ ...formData, numberOfCredits: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="calculatedAmount">Total Amount</Label>
                  <Input
                    id="calculatedAmount"
                    value={`$${calculatedAmount}`}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter transaction ID"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes (optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Add Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
