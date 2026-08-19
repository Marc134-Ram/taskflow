import type { Column, Task, Priority } from '../types';

// La URL base donde corre nuestro servidor Express
const API_URL = 'http://localhost:5000/api';

// 1. Obtener todas las columnas con sus tareas
export const fetchColumns = async (): Promise<Column[]> => {
  const response = await fetch(`${API_URL}/columns`);
  if (!response.ok) {
    throw new Error('Error al cargar las columnas');
  }
  return response.json();
};

// 2. Crear una nueva columna
export const createColumn = async (title: string): Promise<Column> => {
  const response = await fetch(`${API_URL}/columns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Error al crear la columna');
  }
  return response.json();
};

// 3. Eliminar una columna
export const deleteColumn = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/columns/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la columna');
  }
};

// 4. Crear una nueva tarea
export const createTask = async (
  columnId: string,
  title: string,
  description?: string,
  priority: Priority = 'MEDIUM'
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ columnId, title, description, priority }),
  });
  if (!response.ok) {
    throw new Error('Error al crear la tarea');
  }
  return response.json();
};

// 5. Eliminar una tarea
export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la tarea');
  }
};