'use client'

import type { Todo } from '@/app/types'
import { useEffect, useState } from 'react'
import { TodoItem } from './TodoItem'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('dueDate')

  useEffect(() => {
    fetchTodos()
  }, [filter, sort])

  const fetchTodos = async () => {
    try {
      // Construct the query parameters based on `filter` and `sort` values
      const queryParams = new URLSearchParams({ filter, sort }).toString()
      const response = await fetch(`/api/todos?${queryParams}`)

      // Check if the response is okay and parse data
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()

      // Check if the returned data is an array
      if (!Array.isArray(data)) throw new Error('Invalid data format')
      setTodos(data)
    } catch (error) {
      console.error(error)
      setTodos([]) // Clear todos in case of an error
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded border p-2"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="createdAt">Sort by Created Date</option>
        </select>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
        ))}
      </ul>
    </div>
  )
}
