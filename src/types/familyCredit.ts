
export interface ClassType {
  id: string
  name: string
  purchased: number
  used: number
  free: number
  balance: number
}

export interface CreditTransaction {
  id: string
  date: string
  studentName: string
  activity: string
  credit: number
  comments: string
  classTypeId: string
}

export interface FamilyMember {
  id: string
  name: string
  roles: string[]
  creditBalance: number
  avatar?: string
  email: string
}

export interface FamilyData {
  id: string
  name: string
  members: FamilyMember[]
  classTypes: ClassType[]
  transactions: CreditTransaction[]
  primaryContact: FamilyMember
}
