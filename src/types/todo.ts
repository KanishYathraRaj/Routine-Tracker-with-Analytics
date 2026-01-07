export type TodoStatus = 'todo' | 'in-progress' | 'done';
export type TodoPriority = 'none' | 'low' | 'medium' | 'high';

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    status: TodoStatus;
    priority: TodoPriority;
    startTime: number | null; // timestamp when task was set to in-progress
    elapsedTime: number; // total elapsed time in milliseconds
}