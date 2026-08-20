import React from 'react';
import type { Task, Priority } from '../types';
import { Trash2, Clock } from 'lucide-react';


// 1. Contrato de Props: qué datos y funciones exige recibir este componente
interface TaskCardProps {
  task: Task;
  onDeleteTask: (taskId: string) => void;
}

// 2. Diccionario visual de colores según la prioridad
const priorityStyles: Record<Priority, { label: string; badgeClass: string }> = {
  LOW: {
    label: 'Baja',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  MEDIUM: {
    label: 'Media',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  HIGH: {
    label: 'Alta',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDeleteTask }) => {
  const priority = priorityStyles[task.priority] || priorityStyles.MEDIUM;

  return (
    <div className="group bg-slate-800 hover:bg-slate-750 border border-slate-700/70 hover:border-slate-600 rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg flex flex-col gap-2">
      {/* Cabecera de la tarjeta: Título y Botón de eliminar */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100 leading-snug">
          {task.title}
        </h4>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-rose-500/10"
          title="Eliminar tarea"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Descripción (si existe) */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Pie de la tarjeta: Badge de Prioridad y Fecha */}
      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-700/40 text-[11px]">
        <span
          className={`px-2 py-0.5 rounded-full font-medium border ${priority.badgeClass}`}
        >
          {priority.label}
        </span>
        <span className="text-slate-500 flex items-center gap-1">
          <Clock size={12} />
          {new Date(task.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};