export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Todo {
  id: number;  // Changed to number to match Prisma schema
  title: string;
  description?: string | null;  // Added null to match Prisma optional field
  completed: boolean;
  priority: Priority;
  dueDate?: Date | string | null;  // Made more flexible for API responses
  labels: string[];
  userId?: string | null;  // Made optional to match schema
  createdAt: Date | string;  // Made more flexible for API responses
  updatedAt: Date | string;  // Made more flexible for API responses
}

export type CreateTodoInput = {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | string;
  labels?: string[];
};

export type UpdateTodoInput = Partial<CreateTodoInput>;