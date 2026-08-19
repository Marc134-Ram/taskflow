// 1. Tipos de prioridad posibles
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// 2. Interfaz de una Tarea individual
export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  order: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Interfaz de una Columna (incluye el array de tareas asociadas)
export interface Column {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}