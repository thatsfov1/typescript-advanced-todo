import React, {useEffect, useRef, useState} from 'react'
import './styles.css'
import {Todo} from "../model";
import {BiEditAlt, MdDone, RiDeleteBin7Line} from "react-icons/all";
import {Draggable} from "react-beautiful-dnd";

type Props = {
  index:number,
  todo: Todo,
  todos:Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

const SingleTodo = ({index, todo,todos,setTodos}:Props) => {

    const handleDone = (id:number) => {
        setTodos
        (todos.map(todo => todo.id === id ?
            {...todo,isDone:!todo.isDone}
            : todo))
    }

    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(todo.todo);

    const  handleDelete = (id:number) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const handleEdit = (e:React.FormEvent, id:number) => {
        e.preventDefault()
        setTodos(todos.map(todo => todo.id === id ? {...todo, todo:editTodo} : todo))
        setEdit(false)
    }

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus()
    }, [edit]);


    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {(provided)=>(
    <form className='single_todo' ref={provided.innerRef}
          {...provided.draggableProps} {...provided.dragHandleProps}
          onSubmit={(e) => handleEdit(e, todo.id)}>
        {
            edit ? (
                <input ref={inputRef} value={editTodo} onChange={(e) => setEditTodo(e.target.value)}
                       className='single_todo_text'/>
            )
                : (
                todo.isDone ?(
                    <s className='single_todo_text'>{todo.todo}</s>
                )
                :
                (
                    <span className='single_todo_text'>{todo.todo}</span>
                )
            )
        }
      <div style={{display:'flex'}}>
        <span className="icon edit" onClick={() => {
            if (!edit && !todo.isDone) setEdit(!edit)
        }}>
            <BiEditAlt/>
        </span>
        <span className="icon delete" onClick={() => handleDelete(todo.id)}>
            <RiDeleteBin7Line/>
        </span>
        <span className="icon done" onClick={() => handleDone(todo.id)}>
            <MdDone/>
        </span>
      </div>
    </form>
            )}
        </Draggable>
  )
}

export default SingleTodo
