import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// GET - Retrieve all todos for the authenticated user with filter and sort options
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Parse filter and sort parameters
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const sort = searchParams.get('sort') || 'dueDate'

    // Fetch todos with user filtering, optional filter, and sort
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
        ...(filter === 'active' ? { completed: false } : 
           filter === 'completed' ? { completed: true } : {})
      },
      orderBy: {
        [sort]: 'asc'
      }
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

// POST - Create a new todo
export async function POST(req: NextRequest) {
  const { user } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, priority, dueDate, labels } = await req.json()

  const newTodo = await prisma.todo.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      labels,
      userId: user.id
    }
  })

  return NextResponse.json(newTodo)
}
