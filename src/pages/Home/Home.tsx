import TodoList from '../../components/todolist/TodoList';

const Home = () => {
    return (
        <div className="min-h-screen flex items-start bg-gray-100 p-4">
            <TodoList />
        </div>
    );
};

export default Home;