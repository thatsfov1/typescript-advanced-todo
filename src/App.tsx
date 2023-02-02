import React, {useState} from 'react'
import './App.css'
import Input from "./components/Input";
import {Todo} from "./model";
import TodosList from "./components/TodosList";
import {DragDropContext, DropResult} from "react-beautiful-dnd";


const App: React.FC = () => {

    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [completed, setCompleted] = useState<Todo[]>([]);

    const handleAdd = (e: React.FormEvent) =>{
        e.preventDefault()

        if(todo){
            setTodos([...todos,{id:Date.now(), isDone:false, todo}])
        }
        setTodo("")
    }

    const onDragEnd = (result:DropResult) =>{
        const {destination,source} = result

        if(destination?.droppableId === source.droppableId
            && destination?.index === source.index ) return
        if(!destination) return

        let add,
            active= todos,
            complete=completed

        if(source.droppableId === 'TodosList'){
            add = active[source.index];
            active.splice(source.index,1)
        }else{
            add = complete[source.index];
            complete.splice(source.index,1)
        }
        if(destination.droppableId === 'TodosList'){
            active.splice(destination.index,0,add)
        }else{
            complete.splice(destination.index,0,add)
        }
        setTodos(active)
        setCompleted(complete)

    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        <div className='app'>
            <span className='heading'>Your goals.</span>
            <Input handleAdd={handleAdd} todo={todo} setTodo={setTodo}/>
            <TodosList completed={completed} setCompleted={setCompleted} todos={todos} setTodos={setTodos} />
        </div>
        </DragDropContext>
    )
}

export default App
