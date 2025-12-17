
import { FamilyData, ClassType, CreditTransaction } from "@/types/familyCredit"

export const mockClassTypes: ClassType[] = [
  {
    id: "private-60",
    name: "Private 60 Min Session",
    purchased: 10,
    used: 3,
    free: 2,
    balance: 9
  },
  {
    id: "private-40", 
    name: "Private 40 Min Session",
    purchased: 8,
    used: 2,
    free: 1,
    balance: 7
  },
  {
    id: "group-60",
    name: "Group 60 Min Session", 
    purchased: 15,
    used: 5,
    free: 0,
    balance: 10
  }
]

export const mockTransactions: CreditTransaction[] = [
  {
    id: "t1",
    date: "2024-01-15",
    studentName: "Emma Johnson",
    activity: "class completed",
    credit: -1,
    comments: "Classical Dance Session - Excellent performance",
    classTypeId: "private-60"
  },
  {
    id: "t2", 
    date: "2024-01-14",
    studentName: "Emma Johnson",
    activity: "credit purchase",
    credit: 10,
    comments: "Monthly package purchase - Family plan",
    classTypeId: "private-60"
  },
  {
    id: "t3",
    date: "2024-01-13",
    studentName: "Liam Johnson",
    activity: "class missed",
    credit: 0,
    comments: "Student was sick - No credit deducted",
    classTypeId: "private-40"
  },
  {
    id: "t4",
    date: "2024-01-12", 
    studentName: "Emma Johnson",
    activity: "free class",
    credit: 0,
    comments: "Free trial session for new student",
    classTypeId: "group-60"
  },
  {
    id: "t5",
    date: "2024-01-11",
    studentName: "Liam Johnson",
    activity: "makeup class",
    credit: -1,
    comments: "Makeup session for previously missed class",
    classTypeId: "private-40"
  },
  {
    id: "t6",
    date: "2024-01-10",
    studentName: "Emma Johnson",
    activity: "bonus class",
    credit: 0,
    comments: "Bonus class for excellent progress",
    classTypeId: "private-60"
  },
  {
    id: "t7",
    date: "2024-01-09",
    studentName: "Liam Johnson",
    activity: "class completed",
    credit: -1,
    comments: "Guitar lesson completed successfully",
    classTypeId: "group-60"
  },
  {
    id: "t8",
    date: "2024-01-08",
    studentName: "Emma Johnson",
    activity: "class missed",
    credit: -1,
    comments: "Missed class - Emergency at home",
    classTypeId: "private-60"
  }
]
