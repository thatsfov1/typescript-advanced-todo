import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { Todo } from '../model';
import { BiEditAlt, MdDone, RiDeleteBin7Line } from 'react-icons/all';
import { Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

type Props = {
    index: number;
    todo: Todo;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const SingleTodo = ({ index, todo, todos, setTodos }: Props) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(todo.todo);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDone = async (id: string) => {
        const updatedTodo = { ...todo, isDone: !todo.isDone };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, updatedTodo);
        setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
    };

    const handleDelete = async (id: string) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/todos/${id}`);
        setTodos(todos.filter(t => t.id !== id));
    };

    const handleEdit = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const updatedTodo = { ...todo, todo: editTodo };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, updatedTodo);
        setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
        setEdit(false);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [edit]);

    return (
        <Draggable draggableId={todo?.id && todo.id.toString()} index={index}>
            {(provided) => (
                <form
                    className='single_todo'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onSubmit={(e) => handleEdit(e, todo.id)}
                >
                    {edit ? (
                        <input
                            ref={inputRef}
                            value={editTodo}
                            onChange={(e) => setEditTodo(e.target.value)}
                            className='single_todo_text'
                        />
                    ) : todo.isDone ? (
                        <s className='single_todo_text'>{todo.todo}</s>
                    ) : (
                        <span className='single_todo_text'>{todo.todo}</span>
                    )}
                    <div style={{ display: 'flex' }}>
            <span
                className='icon edit'
                onClick={() => {
                    if (!edit && !todo.isDone) setEdit(!edit);
                }}
            >
              <BiEditAlt />
            </span>
                        <span className='icon delete' onClick={() => handleDelete(todo.id)}>
              <RiDeleteBin7Line />
            </span>
                        <span className='icon done' onClick={() => handleDone(todo.id)}>
              <MdDone />
            </span>
                    </div>
                </form>
            )}
        </Draggable>
    );
};

export default SingleTodo;