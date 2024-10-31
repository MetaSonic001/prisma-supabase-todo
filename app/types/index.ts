export interface Todo {
    id: number
    title: string
    description?: string
    completed: boolean
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    dueDate?: Date
    labels: string[]
    userId: string
    createdAt: Date
    updatedAt: Date
  }