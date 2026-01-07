import { useState, useEffect } from "react";
import TodoList from "../../components/todolist/TodoList";
import { TaskCompletionTrend } from "../../components/analytics/TaskCompletionTrend";
import type { Todo, DailyStats, TodoStatus, TodoPriority } from "../../types/todo";
import { arrayMove } from "@dnd-kit/sortable";

const Home = () => {
    // Tasks State
    const [tasks, setTasks] = useState<Todo[]>(() => {
        try {
            const saved = localStorage.getItem('todo-storage');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load tasks', e);
            return [];
        }
    });

    // Analytics State
    const [dailyStats, setDailyStats] = useState<DailyStats[]>(() => {
        try {
            const saved = localStorage.getItem('todo-analytics');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load analytics', e);
            return [];
        }
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('todo-storage', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('todo-analytics', JSON.stringify(dailyStats));
    }, [dailyStats]);

    // Sync Analytics with current tasks state
    useEffect(() => {
        const d = new Date();
        const today = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        
        const currentTotal = tasks.length;
        const currentCompleted = tasks.filter(t => t.status === 'done').length;

        setDailyStats(prev => {
            const existingIndex = prev.findIndex(d => d.date === today);
            
            // If entry exists
            if (existingIndex >= 0) {
                const existing = prev[existingIndex];
                // Avoid unnecessary updates if values are identical
                if (existing.total === currentTotal && existing.completed === currentCompleted) {
                    return prev;
                }
                
                const newStats = [...prev];
                newStats[existingIndex] = {
                    ...existing,
                    total: currentTotal,
                    completed: currentCompleted
                };
                return newStats;
            }

            // New Day Entry
            const newStats = [...prev, {
                date: today,
                total: currentTotal,
                completed: currentCompleted
            }];
            return newStats.slice(-7); // Keep last 7 days history
        });
    }, [tasks]);

    // Handlers
    const handleAddTask = (taskText: string) => {
        const newTask: Todo = {
            id: Date.now(),
            text: taskText,
            completed: false,
            status: 'todo',
            priority: 'none',
            startTime: null,
            elapsedTime: 0,
            completedAt: null
        };
        setTasks(prev => [...prev, newTask]);
    };

    const handleToggle = (id: number) => {
        setTasks(prev => {
            const updatedTasks = prev.map(t => {
                if (t.id !== id) return t;

                // Cycle status logic
                let newStatus: TodoStatus;
                if (t.status === 'todo') newStatus = 'in-progress';
                else if (t.status === 'in-progress') newStatus = 'done';
                else newStatus = 'todo';

                let newStartTime = t.startTime;
                let newElapsedTime = t.elapsedTime;
                let newCompletedAt = t.completedAt;

                if (newStatus === 'in-progress' && t.status !== 'in-progress') {
                    newStartTime = Date.now();
                } else if (newStatus === 'done' && t.status !== 'done') {
                    if (t.startTime) {
                        newElapsedTime = t.elapsedTime + (Date.now() - t.startTime);
                    }
                    newStartTime = null;
                    newCompletedAt = Date.now();
                } else if (newStatus === 'todo') {
                    newStartTime = null;
                    newElapsedTime = 0;
                    newCompletedAt = null;
                }

                return {
                    ...t,
                    status: newStatus,
                    completed: newStatus === 'done',
                    startTime: newStartTime,
                    elapsedTime: newElapsedTime,
                    completedAt: newCompletedAt
                };
            });

            // Sort
            return updatedTasks.sort((a, b) => {
                if (a.status === 'done' && b.status !== 'done') return 1;
                if (a.status !== 'done' && b.status === 'done') return -1;
                return 0;
            });
        });
    };

    const handleDelete = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handlePriorityChange = (id: number, priority: TodoPriority) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
    };

    const handleResetTimer = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? {
            ...t,
            startTime: t.status === 'in-progress' ? Date.now() : null,
            elapsedTime: 0
        } : t));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setTasks(items => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="min-h-screen flex items-start bg-gray-100 p-4">
          
            
            <TodoList 
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onPriorityChange={handlePriorityChange}
                onResetTimer={handleResetTimer}
                onDragEnd={handleDragEnd}
            />
            <div className="w-1/2 h-[calc(100vh-3rem)] flex flex-col gap-4 p-4">
                <TaskCompletionTrend data={dailyStats} />
            </div>
        </div>
    );
};

export default Home;