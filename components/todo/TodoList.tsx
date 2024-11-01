'use client'

import type { Todo } from '@/app/types'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { TodoItem } from './TodoItem'

type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title'
type FilterType = 'all' | 'active' | 'completed'

export function TodoList() {
  const { toast } = useToast()
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortField>('dueDate')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [filter, sort])

  const fetchTodos = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({ filter, sort }).toString()
      const response = await fetch(`/api/todos?${queryParams}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch todos')
      }

      const data = await response.json()
      setTodos(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch tasks',
        variant: 'destructive'
      })
      setTodos([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="rounded border p-2"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortField)}
          className="rounded border p-2"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="createdAt">Sort by Created Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {todos.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
        </ul>
      )}
    </div>
  )
}