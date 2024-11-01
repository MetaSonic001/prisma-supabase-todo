import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { Priority } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = { params: { id: string } }

// GET - Retrieve a specific todo
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const todoId = parseInt(params.id)
    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 })
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId,
        userId: user.id
      }
    })

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error fetching todo:', error)
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 })
  }
}

// PUT - Update a specific todo
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const todoId = parseInt(params.id)
    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 })
    }

    const body = await req.json()

    // Verify todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: {
        id: todoId,
        userId: user.id
      }
    })

    if (!existingTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    // Validate priority if provided
    if (body.priority && !Object.values(Priority).includes(body.priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 })
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId
      },
      data: {
        title: body.title?.trim() || existingTodo.title,
        description: body.description?.trim() ?? existingTodo.description,
        completed: typeof body.completed === 'boolean' ? body.completed : existingTodo.completed,
        priority: body.priority || existingTodo.priority,
        dueDate: body.dueDate ? new Date(body.dueDate) : existingTodo.dueDate,
        labels: Array.isArray(body.labels) ? body.labels : existingTodo.labels
      }
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

// DELETE - Delete a specific todo
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const todoId = parseInt(params.id)
    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 })
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId,
        userId: user.id
      }
    })

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    await prisma.todo.delete({
      where: {
        id: todoId
      }
    })

    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}