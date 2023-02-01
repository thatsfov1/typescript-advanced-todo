import React from 'react'
import './styles.css'


interface Props {
    todo:string,
    setTodo: React.Dispatch<React.SetStateAction<string>>,
    handleAdd: (e:React.FormEvent) => void
}

const Input = ({todo,setTodo,handleAdd}:Props) => {
  return (
    <form className='input_box' onSubmit={(e) => handleAdd(e)}>
        <input value={todo} onChange={(e) => setTodo(e.target.value)}
               className='input' placeholder='Add a task' />
        <button className='input_button' type='submit'>
            I Got This!
        </button>
    </form>
  )
}

export default Input
