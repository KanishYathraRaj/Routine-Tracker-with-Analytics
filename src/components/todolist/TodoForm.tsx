import { Plus } from "lucide-react";

interface TodoFormProps {
    onSubmit: (task: string) => void;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const task = formData.get('task') as string;
        
        if (task) {
            onSubmit(task);
            e.currentTarget.reset();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-2">
            <input 
                type="text" 
                name="task" 
                placeholder="Add a new task..." 
                className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all" 
            />
            <button 
                type="submit" 
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-all active:scale-95"
            >
                <Plus size={18} />
            </button>
        </form>
    );
};
