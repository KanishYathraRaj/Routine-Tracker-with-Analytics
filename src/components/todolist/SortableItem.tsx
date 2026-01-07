import { useState, useEffect } from 'react';
import type { Todo } from '../../types/todo';
import { CheckCircle, Trash2, Circle, Clock, RotateCcw } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
    task: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onPriorityChange: (id: number, priority: Todo['priority']) => void;
    onResetTimer: (id: number) => void;
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

export const SortableItem = ({ task, onToggle, onDelete, onPriorityChange, onResetTimer }: SortableItemProps) => {
    const [currentTime, setCurrentTime] = useState(0);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        opacity: isDragging ? 0.5 : 1,
    };

    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;
    const priorityDotColor = getPriorityDotColor(task.priority);

    // Update timer every second when task is in progress
    useEffect(() => {
        if (task.status === 'in-progress' && task.startTime !== null) {
            const interval = setInterval(() => {
                setCurrentTime(Date.now() - task.startTime!);
            }, 1000);
            
            return () => clearInterval(interval);
        } else {
            setCurrentTime(0);
        }
    }, [task.status, task.startTime]);

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        onPriorityChange(task.id, e.target.value as Todo['priority']);
    };

    const displayTime = task.status === 'in-progress' && task.startTime !== null
        ? task.elapsedTime + currentTime
        : task.elapsedTime;

    const showTimer = task.status === 'in-progress' || task.elapsedTime > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(task.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`flex-shrink-0 p-1 rounded-lg transition-colors ${statusConfig.bg}`}
                >
                    <StatusIcon size={14} className={statusConfig.text} />
                </button>
                <span className={`text-sm font-medium truncate ${task.status === 'done' ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {task.text}
                </span>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.label}
                </span>
                <div className="relative">
                    <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${priorityDotColor} pointer-events-none`}></span>
                    <select
                        value={task.priority}
                        onChange={handlePriorityChange}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs pl-4 pr-2 py-0.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                    >
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                {showTimer && (
                    <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700">
                            <Clock size={12} />
                            {formatTime(displayTime)}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onResetTimer(task.id);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Reset timer"
                        >
                            <RotateCcw size={12} />
                        </button>
                    </>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 ml-1"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
