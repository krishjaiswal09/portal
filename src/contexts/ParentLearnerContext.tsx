
import { fetchApi } from '@/services/api/fetchApi'
import { User } from "@/components/user-management/mockData";
import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext';

interface Learner {
  id: string
  name: string
}

interface ParentLearnerContextType {
  selectedLearner: Learner | null
  setSelectedLearner: (learner: Learner | null) => void
  learners: Learner[]
}

const ParentLearnerContext = createContext<ParentLearnerContextType | undefined>(undefined)

export function ParentLearnerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [student, setStudents] = useState<Learner[]>([])

  const getUserByParent = useQuery({
    queryKey: ["getUserByParent"],
    queryFn: () =>
      fetchApi<User[]>({
        path: `users/parent/${user.id}`
      }),
  });

  useEffect(() => {
    if (
      !getUserByParent.isLoading &&
      getUserByParent.data
    ) {
      setStudents(getUserByParent.data.map((v) => ({
        id: v.id,
        name: `${v.first_name} ${v.last_name}`
      })));
    }
  }, [getUserByParent.isLoading, getUserByParent.data]);


  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null)

  useEffect(() => {
    if (student.length > 0 && !selectedLearner) {
      setSelectedLearner(student[0])
    }
  }, [student, selectedLearner])

  return (
    <ParentLearnerContext.Provider value={{
      selectedLearner,
      setSelectedLearner,
      learners: student
    }}>
      {children}
    </ParentLearnerContext.Provider>
  )
}

export function useParentLearner() {
  const context = useContext(ParentLearnerContext)
  if (context === undefined) {
    throw new Error('useParentLearner must be used within a ParentLearnerProvider')
  }
  return context
}
