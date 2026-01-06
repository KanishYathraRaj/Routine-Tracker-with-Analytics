import { useState } from "react";
import type { Todo } from '../types/todo';
import { CheckCircle, Trash2, Plus } from "lucide-react";

const TodoList = () => {
    const [tasks, setTasks] = useState<Todo[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const task = formData.get('task') as string;
        
        if (task) {
            setTasks((prev) => [...prev, 
                { 
                    id: Date.now(),
                    text: task, 
                    completed: false 
                }
            ]);
            e.currentTarget.reset();
        }
    }

    const handleDelete = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        console.log(tasks);
    }

    const handleToggle = (id: number) => {
        setTasks((prev) => prev.map(
            (t) => t.id === id ? { ...t, completed: !t.completed } : t
        ));
        console.log(tasks);
    }

    return (
        <div className="w-1/3 h-[calc(100vh-3rem)] flex flex-col bg-gray-200 p-4 mx-4 my-2 border border-gray-300 rounded-3xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Daily Tasks</h1>
            <form onSubmit={handleSubmit} className="flex gap-3 mb-2">
                <input type="text" name="task" placeholder="Add a new task..." 
                className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all" />
                <button 
                type="submit" className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                    <Plus size={18} />
                </button>
            </form>
            <div className="mt-6 space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map((task) => (
                    <div key={task.id} className="py-1 flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <button onClick={() => handleToggle(task.id)} className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    task.completed ? "bg-green-400 border-green-400" : "border-gray-400 hover:border-blue-500"
                                }`}>
                                {task.completed && <CheckCircle size={14} className="text-white" />}
                            </button>
                            <span className={`text-sm font-medium truncate ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                {task.text}
                            </span>
                        </div>
                        <button onClick={() => handleDelete(task.id)} className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
