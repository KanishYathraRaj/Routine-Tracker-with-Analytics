import { useState, useEffect } from "react";
import type { Todo, TodoStatus, TodoPriority } from '../../types/todo';
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";

const TodoList = () => {
    // Initialize tasks from localStorage
    const [tasks, setTasks] = useState<Todo[]>(() => {
        try {
            const saved = localStorage.getItem('todo-storage');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load tasks from local storage', e);
            return [];
        }
    });
    
    
    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('todo-storage', JSON.stringify(tasks));
    }, [tasks]);

    const [activeId, setActiveId] = useState<number | null>(null);

    const handleAddTask = (taskText: string) => {
        setTasks((prev) => [...prev, 
            { 
                id: Date.now(),
                text: taskText, 
                completed: false,
                status: 'todo',
                priority: 'none',
                startTime: null,
                elapsedTime: 0
            }
        ]);
    };

    const handleDelete = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleToggle = (id: number) => {
        setTasks((prev) => {
            const updatedTasks = prev.map((t) => {
                if (t.id === id) {
                    // Cycle through statuses: todo -> in-progress -> done -> todo
                    let newStatus: TodoStatus;
                    if (t.status === 'todo') newStatus = 'in-progress';
                    else if (t.status === 'in-progress') newStatus = 'done';
                    else newStatus = 'todo';
                    
                    let newStartTime = t.startTime;
                    let newElapsedTime = t.elapsedTime;
                    
                    // Starting timer: set startTime when moving to in-progress
                    if (newStatus === 'in-progress' && t.status !== 'in-progress') {
                        newStartTime = Date.now();
                    }
                    // Stopping timer: calculate elapsed time when moving to done
                    else if (newStatus === 'done' && t.startTime !== null) {
                        newElapsedTime = t.elapsedTime + (Date.now() - t.startTime);
                        newStartTime = null;
                    }
                    // Reset timer: clear everything when moving to todo
                    else if (newStatus === 'todo') {
                        newStartTime = null;
                        newElapsedTime = 0;
                    }
                    
                    return { 
                        ...t, 
                        status: newStatus,
                        completed: newStatus === 'done',
                        startTime: newStartTime,
                        elapsedTime: newElapsedTime
                    };
                }
                return t;
            });

            // Sort tasks: done tasks go to bottom
            return updatedTasks.sort((a, b) => {
                if (a.status === 'done' && b.status !== 'done') return 1;
                if (a.status !== 'done' && b.status === 'done') return -1;
                return 0;
            });
        });
    };

    const handlePriorityChange = (id: number, newPriority: TodoPriority) => {
        setTasks((prev) => prev.map((t) => {
            if (t.id === id) {
                return { ...t, priority: newPriority };
            }
            return t;
        }));
    };

    const handleResetTimer = (id: number) => {
        setTasks((prev) => prev.map((t) => {
            if (t.id === id) {
                return {
                    ...t,
                    startTime: t.status === 'in-progress' ? Date.now() : null,
                    elapsedTime: 0
                };
            }
            return t;
        }));
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        
        setActiveId(null);
    };

    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <div className="w-1/2 h-[calc(100vh-3rem)] flex flex-col bg-gray-200 p-4 mx-4 my-2 border border-gray-300 rounded-3xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Make 2026 Yours!🔥🔥🔥</h1>
            
            <TodoForm onSubmit={handleAddTask} />
            
            <div className="mt-6 space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={tasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task) => (
                            <SortableItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onPriorityChange={handlePriorityChange}
                                onResetTimer={handleResetTimer}
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
