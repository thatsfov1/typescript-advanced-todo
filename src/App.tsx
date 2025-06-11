import React, { useState, useEffect } from 'react';
import './App.css';
import Input from './components/Input';
import { Todo } from './model';
import TodosList from './components/TodosList';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const App: React.FC = () => {
    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [completed, setCompleted] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/todos`);
                setTodos(data.todos);
                setCompleted(data.completed);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };
        fetchTodos();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (todo) {
            try {
                const { data } = await axios.post(`${API_URL}/api/todos`, { todo });
                setTodos([...todos, { id: data._id, todo: data.todo, isDone: data.isDone }]);
                setTodo('');
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        let add: Todo,
            active = [...todos],
            complete = [...completed];

        if (source.droppableId === 'TodosList') {
            add = active[source.index];
            active.splice(source.index, 1);
        } else {
            add = complete[source.index];
            complete.splice(source.index, 1);
        }

        if (destination.droppableId === 'TodosList') {
            active.splice(destination.index, 0, { ...add, isDone: false });
            try {
                await axios.put(`${API_URL}/api/todos/${add.id}`, { todo: add.todo, isDone: false });
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        } else {
            complete.splice(destination.index, 0, { ...add, isDone: true });
            try {
                await axios.put(`${API_URL}/api/todos/${add.id}`, { todo: add.todo, isDone: true });
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }

        setTodos(active);
        setCompleted(complete);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='app'>
                <span className='heading'>Your goals.</span>
                <Input handleAdd={handleAdd} todo={todo} setTodo={setTodo} />
                <TodosList completed={completed} setCompleted={setCompleted} todos={todos} setTodos={setTodos} />
            </div>
        </DragDropContext>
    );
};

export default App;