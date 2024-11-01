'use client'

import { Priority } from '@/app/types'
import { Button } from '@/components/ui/button'
import { DatePickerDemo } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function TodoForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>(Priority.LOW)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate?.toISOString(),
          labels
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create todo')
      }

      toast({
        title: 'Success',
        description: 'Task created successfully'
      })

      // Reset form
      setTitle('')
      setDescription('')
      setPriority(Priority.LOW)
      setDueDate(null)
      setLabels([])
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={priority}
            onValueChange={(value: Priority) => setPriority(value)}
          >
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <DatePickerDemo
            selected={dueDate}
            onChange={setDueDate}
            placeholderText="Select due date"
          />
        </div>

        <div>
          <Label htmlFor="labels">Labels</Label>
          <Input
            id="labels"
            placeholder="Add labels (comma-separated)"
            onChange={(e) => setLabels(e.target.value.split(',').map(label => label.trim()).filter(Boolean))}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adding Task...' : 'Add Task'}
      </Button>
    </form>
  )
}
