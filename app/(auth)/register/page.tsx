'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm mode="register" />
        </CardContent>
      </Card>
    </div>
  )
}
