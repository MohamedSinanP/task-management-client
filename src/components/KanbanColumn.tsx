import React from 'react';
import TaskCard from './TaskCard';
import type { KanbanTask } from '../types/type';



const KanbanColumn: React.FC<{
  title: string;
  status: KanbanTask['status'];
  tasks: KanbanTask[];
  onEdit: (task: KanbanTask) => void;
  onDelete?: (id: string) => void;
  onView: (task: KanbanTask) => void;
  onDragStart: (taskId: string) => void;
  onDrop: (status: KanbanTask['status']) => void;
  isDraggingOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}> = ({ title, status, tasks, onEdit, onDelete, onView, onDragStart, onDrop, isDraggingOver, onDragOver, onDragLeave }) => {
  const statusColors = {
    'Todo': 'bg-gray-100 border-gray-300',
    'In-Progress': 'bg-blue-50 border-blue-300',
    'Done': 'bg-green-50 border-green-300'
  };

  const dragOverColors = {
    'Todo': 'bg-gray-200 border-gray-400',
    'In-Progress': 'bg-blue-100 border-blue-400',
    'Done': 'bg-green-100 border-green-400'
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={() => onDrop(status)}
      className={`rounded-lg border-2 ${isDraggingOver ? dragOverColors[status] : statusColors[status]} p-4 min-h-[500px] transition-all ${isDraggingOver ? 'scale-105 shadow-xl' : ''
        }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-700">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onDragStart={onDragStart}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-gray-400 text-center py-8 text-sm border-2 border-dashed border-gray-300 rounded-lg">
            {isDraggingOver ? 'Drop task here' : 'No tasks'}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;