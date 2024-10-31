'use client'

import va from '@vercel/analytics'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    va.track('pageview', { path: url })
  }, [pathname, searchParams])

  return null
}
