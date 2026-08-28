'use client'

import { useEffect, useState } from 'react'
import UrbanTurfLoader from '@/app/loading'

const LOADER_DELAY_MS = 3200

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLoader(false), LOADER_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return showLoader ? <UrbanTurfLoader /> : children
}
