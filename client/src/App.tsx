import React, { useEffect, useState } from 'react';
import {
  fetchColumns,
  createColumn,
  deleteColumn as apiDeleteColumn,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
} from './services/api';
import type { Column, Priority } from './types';
import { ColumnContainer } from './components/ColumnContainer';
import { LayoutDashboard, Plus, Loader2 } from 'lucide-react';

function App() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newColumnTitle, setNewColumnTitle] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchColumns();
      setColumns(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Crear Columna
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      const created = await createColumn(newColumnTitle.trim());
      setColumns([...columns, { ...created, tasks: [] }]);
      setNewColumnTitle('');
    } catch (error) {
      console.error('Error al crear columna:', error);
    }
  };

  // 2. Eliminar Columna
  const handleDeleteColumn = async (columnId: string) => {
    try {
      await apiDeleteColumn(columnId);
      // Filtramos la columna eliminada fuera del estado de React
      setColumns(columns.filter((c) => c.id !== columnId));
    } catch (error) {
      console.error('Error al eliminar columna:', error);
    }
  };

  // 3. Crear Tarea dentro de una Columna
  const handleAddTask = async (
    columnId: string,
    title: string,
    description?: string,
    priority: Priority = 'MEDIUM'
  ) => {
    const newTask = await apiCreateTask(columnId, title, description, priority);
    // Inyectamos la nueva tarea dentro del array de la columna correspondiente
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      })
    );
  };

  // 4. Eliminar Tarea
  const handleDeleteTask = async (taskId: string, columnId: string) => {
    try {
      await apiDeleteTask(taskId);
      // Removemos la tarea del estado local de React
      setColumns(
        columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== taskId),
            };
          }
          return col;
        })
      );
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/25">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">TaskFlow</h1>
            <p className="text-xs text-slate-400">Kanban Board</p>
          </div>
        </div>

        <form onSubmit={handleAddColumn} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nueva columna..."
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-48"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={15} /> Añadir Columna
          </button>
        </form>
      </header>

      {/* Tablero Kanban */}
      <main className="flex-1 p-6 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-xs">Cargando tablero...</p>
          </div>
        ) : columns.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-base font-medium">No hay columnas todavía</p>
            <p className="text-xs mt-1">Crea tu primera columna arriba a la derecha para empezar a organizar tareas.</p>
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                column={column}
                onDeleteColumn={handleDeleteColumn}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;