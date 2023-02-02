import React from 'react'
import './styles.css'
import {Todo} from "../model";
import SingleTodo from "./SingleTodo";
import {Droppable} from "react-beautiful-dnd";

interface Props {
    todos: Todo[],
    setTodos:  React.Dispatch<React.SetStateAction<Todo[]>>
    completed: Todo[],
    setCompleted:React.Dispatch<React.SetStateAction<Todo[]>>
}


const TodosList: React.FC<Props> = ({todos,setTodos,completed,setCompleted }  ) => {
  return (
      <div className="container">
          <Droppable droppableId='TodosList'>{
              (provided,snapshot) => (
                  <div className={`todos ${snapshot.isDraggingOver ? 'active' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                      <span className='todos_header'>Active</span>
                      {todos.map((todo,index) => <SingleTodo index={index} key={todo.id} todo={todo} todos={todos} setTodos={setTodos}/>)}
                      {provided.placeholder}
                  </div>
              )
          }</Droppable>
            <Droppable droppableId='TodosRemove'>{
                (provided,snapshot) => (
                    <div className={`todos remove ${snapshot.isDraggingOver ? 'active_remove' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                        <span className='todos_header'>Completed</span>
                        {completed.map((todo ,index)=> <SingleTodo index={index} key={todo.id} todo={todo} todos={completed} setTodos={setCompleted}/>)}
                        {provided.placeholder}
                    </div>
                )
            }
            </Droppable>
      </div>


  )
}

export default TodosList
