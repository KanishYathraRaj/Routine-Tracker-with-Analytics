import type { Todo, TodoPriority } from '../../types/todo';
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { useState } from 'react';

interface TodoListProps {
    tasks: Todo[];
    onAddTask: (text: string) => void;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onPriorityChange: (id: number, priority: TodoPriority) => void;
    onResetTimer: (id: number) => void;
    onDragEnd: (event: any) => void;
}

const TodoList = ({ 
    tasks, 
    onAddTask, 
    onToggle, 
    onDelete, 
    onPriorityChange, 
    onResetTimer, 
    onDragEnd 
}: TodoListProps) => {
    const [activeId, setActiveId] = useState<number | null>(null);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <div className="w-1/2 h-[calc(100vh-3rem)] flex flex-col bg-gray-200 p-4 mx-4 my-2 border border-gray-300 rounded-3xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Make 2026 Yours!🔥🔥🔥</h1>
            
            <TodoForm onSubmit={onAddTask} />
            
            <div className="mt-6 space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={tasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task) => (
                            <SortableItem
                                key={task.id}
                                task={task}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onPriorityChange={onPriorityChange}
                                onResetTimer={onResetTimer}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeTask && <TodoItem task={activeTask} />}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

export default TodoList;
