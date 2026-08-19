import React, { useEffect, useState } from 'react';
import { fetchColumns, createColumn } from './services/api';
import type { Column } from './types';
import { LayoutDashboard, Plus, Loader2 } from 'lucide-react';

function App() {
  // Estado para guardar las columnas que vienen del backend
  const [columns, setColumns] = useState<Column[]>([]);
  // Estado para saber si estamos esperando la respuesta de la red (cargando)
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para el texto del input al crear una nueva columna
  const [newColumnTitle, setNewColumnTitle] = useState<string>('');

  // 1. Cargar las columnas cuando el componente aparece en pantalla
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchColumns();
      setColumns(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejador para crear una nueva columna
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      const created = await createColumn(newColumnTitle.trim());
      // Añadimos la nueva columna al estado local junto con un array tasks vacío
      setColumns([...columns, { ...created, tasks: [] }]);
      setNewColumnTitle(''); // Limpiamos el campo de texto
    } catch (error) {
      console.error('Error al crear columna:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Barra de Navegación Superior */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
            <p className="text-xs text-slate-400">Tablero Kanban Full-Stack</p>
          </div>
        </div>

        {/* Formulario rápido para añadir columna */}
        <form onSubmit={handleAddColumn} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nueva columna..."
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors shadow-sm"
          >
            <Plus size={16} /> Añadir
          </button>
        </form>
      </header>

      {/* Área Principal del Tablero */}
      <main className="flex-1 p-6 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-sm">Cargando tablero desde la base de datos...</p>
          </div>
        ) : columns.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No hay columnas todavía.</p>
            <p className="text-sm">Crea tu primera columna arriba a la derecha para empezar.</p>
          </div>
        ) : (
          <div className="flex gap-6 items-start">
            {columns.map((col) => (
              <div
                key={col.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-140px)] shadow-xl"
              >
                {/* Cabecera de la columna */}
                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200">{col.title}</h3>
                  <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                    {col.tasks?.length || 0}
                  </span>
                </div>

                {/* Lista de tareas */}
                <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-2">
                  {col.tasks && col.tasks.length > 0 ? (
                    col.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/40 rounded-lg p-3 transition-colors shadow-sm"
                      >
                        <p className="text-sm font-medium text-slate-100">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">Sin tareas aún</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
