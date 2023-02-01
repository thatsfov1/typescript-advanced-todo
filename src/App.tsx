import React, {useState} from 'react'
import './App.css'
import Input from "./components/Input";
import {Todo} from "./model";
import TodosList from "./components/TodosList";


const App: React.FC = () => {

    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);

    const handleAdd = (e: React.FormEvent) =>{
        e.preventDefault()

        if(todo){
            setTodos([...todos,{id:Date.now(), isDone:false, todo}])
        }
        setTodo("")
    }

    return (
        <div className='app'>
            <span className='heading'>Your goals.</span>
            <Input handleAdd={handleAdd} todo={todo} setTodo={setTodo}/>
            <TodosList todos={todos} setTodos={setTodos} />
        </div>
    )
}

export default App
