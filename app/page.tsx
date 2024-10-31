'use client'

import { TodoForm } from '@/components/todo/TodoForm'
import { TodoList } from '@/components/todo/TodoList'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Task Master</h1>
          <p className="mt-2 text-gray-600">Organize your life, one task at a time</p>
        </header>
        <TodoForm />
        <TodoList />
      </div>
    </main>
  )
}
