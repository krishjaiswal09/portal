
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, ArrowRight, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface CreditBalance {
  learnerId: string
  learnerName: string
  credits: number
  isLow: boolean
}

const mockCreditBalances: CreditBalance[] = [
  { learnerId: "parent", learnerName: "Sarah Johnson", credits: 12, isLow: false },
  { learnerId: "child1", learnerName: "Emma Johnson", credits: 8, isLow: false },
  { learnerId: "child2", learnerName: "Liam Johnson", credits: 2, isLow: true }
]

export function ParentCreditsCard() {
  const navigate = useNavigate()
  
  const totalCredits = mockCreditBalances.reduce((sum, balance) => sum + balance.credits, 0)
  const hasLowCredits = mockCreditBalances.some(balance => balance.isLow)
  
  const handleViewHistory = () => {
    navigate('/parent/credits')
  }

  return (
    <Card className={`shadow-sm hover:shadow-md transition-all duration-300 ${
      hasLowCredits ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hasLowCredits ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <CreditCard className={`w-6 h-6 ${
                hasLowCredits ? 'text-red-600' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-bold text-gray-900">Your Credits</h2>
              <p className="text-gray-600">Manage your family's class credits</p>
            </div>
          </div>
          {hasLowCredits && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Low Credits</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {mockCreditBalances.map((balance) => (
            <div 
              key={balance.learnerId}
              className={`p-4 rounded-lg border-2 transition-colors ${
                balance.isLow 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">{balance.learnerName}</h3>
                <div className={`text-3xl font-bold mb-1 ${
                  balance.isLow ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {balance.credits}
                </div>
                <p className="text-sm text-gray-600">
                  Credit{balance.credits !== 1 ? 's' : ''} Remaining
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${
              hasLowCredits ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <span className={`text-lg font-bold ${
                hasLowCredits ? 'text-red-700' : 'text-blue-700'
              }`}>
                Total: {totalCredits} Credits
              </span>
            </div>
            {hasLowCredits && (
              <p className="text-red-600 text-sm font-medium">
                Consider purchasing more credits soon
              </p>
            )}
          </div>
          <Button 
            onClick={handleViewHistory}
            variant="outline" 
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            View Full Credit History
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
