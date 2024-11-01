import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { Priority } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

type SortField = 'dueDate' | 'createdAt' | 'priority' | 'title'

// GET - Retrieve all todos with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const sortField = (searchParams.get('sort') || 'dueDate') as SortField

    // Validate sort field
    const validSortFields: SortField[] = ['dueDate', 'createdAt', 'priority', 'title']
    if (!validSortFields.includes(sortField)) {
      return NextResponse.json({ error: 'Invalid sort field' }, { status: 400 })
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
        ...(filter === 'active' ? { completed: false } : 
           filter === 'completed' ? { completed: true } : {})
      },
      orderBy: {
        [sortField]: 'asc'
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
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate priority if provided
    if (body.priority && !Object.values(Priority).includes(body.priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 })
    }

    const newTodo = await prisma.todo.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        priority: body.priority || Priority.LOW,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        labels: Array.isArray(body.labels) ? body.labels : [],
        userId: user.id
      }
    })

    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}
