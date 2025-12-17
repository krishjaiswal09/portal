import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Users, Settings, Trash2, Pencil, Plus, Percent, ToggleLeft } from "lucide-react";
import { FamilyData } from "@/types/familyCredit";
import { SetupAutoPaymentModal } from "./SetupAutoPaymentModal";
import { EditTransactionModal } from "./EditTransactionModal";
import { AddTransactionModal } from "./AddTransactionModal";
import { toast } from "sonner";

interface FamilyDetailsPanelProps {
  family: FamilyData | null;
  isOpen: boolean;
  onClose: () => void;
  onRemoveMember: (familyId: string, memberId: string) => void;
}

export function FamilyDetailsPanel({ family, isOpen, onClose, onRemoveMember }: FamilyDetailsPanelProps) {
  const [isAutoPaymentModalOpen, setIsAutoPaymentModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [assignedClassTypes, setAssignedClassTypes] = useState<string[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(false);

  if (!family) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-purple-500 text-white';
      case 'student':
        return 'bg-pink-500 text-white';
      case 'parent':
        return 'bg-blue-500 text-white';
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'support':
        return 'bg-green-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const availableClassTypes = [
    'Private 60min',
    'Private 40min',
    'Group Classes',
    'Trial Classes',
    'Workshop Classes',
    'Performance Classes'
  ];

  const handleClassTypeToggle = (classType: string) => {
    setAssignedClassTypes(prev =>
      prev.includes(classType)
        ? prev.filter(type => type !== classType)
        : [...prev, classType]
    );
  };

  const handleSetupAutoPayment = (autoPaymentData: any) => {
    console.log('Setting up auto payment:', autoPaymentData);
  };

  const handleAddTransaction = (transactionData: any) => {
    console.log('Adding transaction:', transactionData);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction: any) => {
    console.log('Updating transaction:', updatedTransaction);
    setEditingTransaction(null);
  };

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setDiscountPercentage(numValue);
    }
  };

  const handleAutoPaymentToggle = (enabled: boolean) => {
    setAutoPaymentEnabled(enabled);
    toast.success(`Auto payment ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Mock transactions for demo
  const mockTransactions = [
    { id: '1', date: '2024-01-15', studentName: 'Sarah Smith', activity: 'Private 60min Class', credit: -2, comments: 'Regular lesson' },
    { id: '2', date: '2024-01-14', studentName: 'John Smith', activity: 'Credit Purchase', credit: 10, comments: 'Monthly package' },
    { id: '3', date: '2024-01-13', studentName: 'Sarah Smith', activity: 'Group Class', credit: -1, comments: 'Group session' },
    { id: '4', date: '2024-01-12', studentName: 'John Smith', activity: 'Private 40min Class', credit: -1, comments: 'Practice session' },
  ];

  // Filter transactions by selected class type
  const filteredTransactions = selectedClassType
    ? mockTransactions.filter(t => t.activity.toLowerCase().includes(selectedClassType.toLowerCase()))
    : mockTransactions;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-6xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {family.name}
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Family Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {family.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex gap-1 mt-1">
                          {member.roles.map((role) => (
                            <Badge key={role} className={`${getRoleColor(role)} text-xs`}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-medium">${member.creditBalance}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveMember(family.id, member.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Family Discount Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Family Discount Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="discount">Discount Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discountPercentage}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apply discount percentage to all family transactions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Save Discount
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Auto Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ToggleLeft className="h-5 w-5" />
                  Auto Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-payment">Auto Payment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically charge payment method when credits are low
                    </p>
                  </div>
                  <Switch
                    id="auto-payment"
                    checked={autoPaymentEnabled}
                    onCheckedChange={handleAutoPaymentToggle}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Class Type Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assign Class Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableClassTypes.map((classType) => (
                    <div key={classType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`class-${classType}`}
                        checked={assignedClassTypes.includes(classType)}
                        onCheckedChange={() => handleClassTypeToggle(classType)}
                      />
                      <Label htmlFor={`class-${classType}`} className="text-sm">
                        {classType}
                      </Label>
                    </div>
                  ))}
                </div>
                {assignedClassTypes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Assigned Class Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {assignedClassTypes.map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Class Types and Transactions Layout - 1/4 and 3/4 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column: Class Types (1/4) */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Class Credits
                      <Button
                        onClick={() => setIsAddTransactionModalOpen(true)}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Transaction
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {family.classTypes.map((classType) => (
                      <div
                        key={classType.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedClassType === classType.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'hover:bg-muted/50'
                          }`}
                        onClick={() => setSelectedClassType(
                          selectedClassType === classType.name ? null : classType.name
                        )}
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{classType.name}</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Purchased</p>
                              <p className="font-medium">{classType.purchased}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Used</p>
                              <p className="font-medium">{classType.used}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Free</p>
                              <p className="font-medium">{classType.free}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Balance</p>
                              <p className="font-semibold text-lg">{classType.balance}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Transactions (3/4) */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Transaction History
                      {selectedClassType && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          - {selectedClassType}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredTransactions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead className="text-center">Credit</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.date}</TableCell>
                              <TableCell>{transaction.studentName}</TableCell>
                              <TableCell>{transaction.activity}</TableCell>
                              <TableCell className="text-center">
                                <span className={`font-semibold ${transaction.credit > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                  {transaction.credit > 0 ? '+' : ''}{transaction.credit}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{transaction.comments}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTransaction(transaction)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        {selectedClassType
                          ? `No transactions found for ${selectedClassType}`
                          : 'No transactions yet'
                        }
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SetupAutoPaymentModal
        isOpen={isAutoPaymentModalOpen}
        onClose={() => setIsAutoPaymentModalOpen(false)}
        familyName={family.name}
        onSetupAutoPayment={handleSetupAutoPayment}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        familyName={family.name}
        familyId={family.id}
        onAddTransaction={handleAddTransaction}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
    </>
  );
}
