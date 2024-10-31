import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Update a specific todo item
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { completed } = await req.json()

  const updatedTodo = await prisma.todo.update({
    where: { id: params.id },
    data: { completed }
  })

  return NextResponse.json(updatedTodo)
}

// DELETE - Remove a specific todo item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.todo.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Todo deleted successfully' })
}
