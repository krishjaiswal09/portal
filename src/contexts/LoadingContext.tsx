import React, { createContext, useContext, useState, ReactNode } from 'react'
import { PageLoader } from '@/components/ui/loader'

interface LoadingContextType {
  isLoading: boolean
  loadingText: string
  showLoader: (text?: string) => void
  hideLoader: () => void
  setRouteLoading: (loading: boolean, text?: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const showLoader = (text: string = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const hideLoader = () => {
    setIsLoading(false)
  }

  const setRouteLoading = (loading: boolean, text: string = 'Loading...') => {
    if (loading) {
      showLoader(text)
    } else {
      hideLoader()
    }
  }

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingText,
      showLoader,
      hideLoader,
      setRouteLoading
    }}>
      {children}
      {isLoading && <PageLoader text={loadingText} />}
    </LoadingContext.Provider>
  )
}