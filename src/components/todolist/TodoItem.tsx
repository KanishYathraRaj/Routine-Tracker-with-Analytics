import type { Todo } from '../../types/todo';
import { CheckCircle, Trash2, Circle, Clock } from "lucide-react";

interface TodoItemProps {
    task: Todo;
}

const getStatusConfig = (status: Todo['status']) => {
    switch (status) {
        case 'done':
            return { bg: 'bg-green-100', text: 'text-green-700', label: 'Done', icon: CheckCircle };
        case 'in-progress':
            return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: Clock };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'To Do', icon: Circle };
    }
};

const getPriorityDotColor = (priority: Todo['priority']) => {
    switch (priority) {
        case 'high':
            return 'bg-red-500';
        case 'medium':
            return 'bg-yellow-500';
        case 'low':
            return 'bg-green-500';
        default:
            return 'bg-gray-400';
    }
};

const getPriorityLabel = (priority: Todo['priority']) => {
    switch (priority) {
        case 'high':
            return 'High';
        case 'medium':
            return 'Medium';
        case 'low':
            return 'Low';
        default:
            return 'None';
    }
};

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};

export const TodoItem = ({ task }: TodoItemProps) => {
    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;
    const priorityDotColor = getPriorityDotColor(task.priority);
    const priorityLabel = getPriorityLabel(task.priority);
    const showTimer = task.status === 'in-progress' || task.elapsedTime > 0;

    return (
        <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 cursor-grabbing">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 p-1 rounded-lg ${statusConfig.bg}`}>
                    <StatusIcon size={14} className={statusConfig.text} />
                </div>
                <span className={`text-sm font-medium truncate ${task.status === 'done' ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {task.text}
                </span>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.label}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-gray-200 bg-white text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityDotColor}`}></span>
                    <span>{priorityLabel}</span>
                </div>
                {showTimer && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700">
                        <Clock size={12} />
                        {formatTime(task.elapsedTime)}
                    </span>
                )}
                <button className="p-1.5 text-gray-400 ml-1">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
