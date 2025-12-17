
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, ArrowRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'

interface CreditBalanceCardProps {
  creditBalance: number
}

export function CreditBalanceCard({ creditBalance }: CreditBalanceCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
          <Coins className="w-5 h-5" />
          Your Credits
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* <div className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-1">{creditBalance}</div>
            <div className="text-sm text-blue-600 font-medium">credits remaining</div>
          </div> */}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400 transition-colors"
            onClick={() => navigate('/student/credits-transactions')}
          >
            View full credit history
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
