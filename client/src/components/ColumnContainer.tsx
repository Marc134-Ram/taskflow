import React, { useState } from 'react';
import type { Column, Task, Priority } from '../types';
import { TaskCard } from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Trash2, X } from 'lucide-react';

interface ColumnContainerProps {
  column: Column;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (
    columnId: string,
    title: string,
    description?: string,
    priority?: Priority
  ) => Promise<void>;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  onDeleteColumn,
  onAddTask,
  onDeleteTask,
  onTaskClick,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddTask(column.id, title.trim(), description.trim() || undefined, priority);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setIsAddingTask(false);
    } catch (error) {
      console.error('Error creando tarea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl w-84 flex-shrink-0 flex flex-col max-h-[calc(100vh-130px)] shadow-xl">
      {/* Cabecera */}
      <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
            {column.title}
          </h3>
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
          title="Eliminar columna"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Droppable */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 flex-1 overflow-y-auto flex flex-col gap-2.5 min-h-[120px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-indigo-950/20' : ''
            }`}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDeleteTask={() => onDeleteTask(task.id, column.id)}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}

            {column.tasks.length === 0 && !isAddingTask && (
              <div className="h-28 border-2 border-dashed border-slate-700/60 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                Arrastra una tarea aquí
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Formulario / Botón de Añadir */}
      <div className="p-3 border-t border-slate-700/60">
        {isAddingTask ? (
          <form onSubmit={handleSubmit} className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 flex flex-col gap-2 shadow-inner">
            <input
              type="text"
              placeholder="Título de la tarea..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <textarea
              placeholder="Descripción (opcional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex items-center justify-between gap-2 mt-1">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full bg-slate-700/40 hover:bg-slate-700 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-transparent hover:border-slate-600 cursor-pointer"
          >
            <Plus size={15} /> Añadir Tarea
          </button>
        )}
      </div>
    </div>
  );
};