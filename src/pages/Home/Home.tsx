import TodoList from '../../components/todolist/TodoList';
import MotivationPlayer from '../../components/MotivationPlayer/MotivationPlayer';

const Home = () => {
    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 p-4 gap-2">
            <TodoList />
            <MotivationPlayer />
        </div>
    );
};

export default Home;