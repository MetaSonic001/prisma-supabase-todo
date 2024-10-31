import type { Todo } from '@/app/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleComplete = async () => {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    })
    onUpdate()
  }
  
  const handleDelete = async () => {
    await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
    onUpdate()
  }
  
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        bg-white rounded-lg shadow-md p-4
        ${todo.completed ? 'opacity-75' : ''}
        hover:shadow-lg transition-shadow
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleComplete}
            className="h-5 w-5 rounded border-gray-300"
          />
          <div>
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            {todo.dueDate && (
              <p className="text-sm text-gray-500">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={
            todo.priority === 'HIGH' ? 'destructive' :
            todo.priority === 'MEDIUM' ? 'warning' : 'default'
          }>
            {todo.priority}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {isExpanded && todo.description && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 text-gray-600"
        >
          <p>{todo.description}</p>
          {todo.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {todo.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.li>
  )
}