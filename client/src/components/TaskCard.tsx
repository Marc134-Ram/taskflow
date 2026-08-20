import React from 'react';
import type { Task, Priority } from '../types';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, Clock, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onDeleteTask: (taskId: string) => void;
}

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

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDeleteTask }) => {
  const priority = priorityStyles[task.priority] || priorityStyles.MEDIUM;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-slate-800 border rounded-xl p-3.5 transition-shadow flex flex-col gap-2 select-none ${
            snapshot.isDragging
              ? 'border-indigo-500 shadow-2xl bg-slate-750 rotate-1 ring-2 ring-indigo-500/30'
              : 'border-slate-700/70 hover:border-slate-600 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 flex-1 min-w-0">
              <GripVertical
                size={14}
                className="text-slate-600 group-hover:text-slate-400 mt-0.5 flex-shrink-0 cursor-grab"
              />
              <h4 className="text-sm font-semibold text-slate-100 leading-snug break-words">
                {task.title}
              </h4>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-rose-500/10 flex-shrink-0 cursor-pointer"
              title="Eliminar tarea"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pl-5">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-700/40 text-[11px] pl-5">
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
      )}
    </Draggable>
  );
};