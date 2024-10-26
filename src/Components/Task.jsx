import React, { useState, useEffect } from 'react';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ name: '', description: '', status: 'Not Completed' });
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const handleCreateTodo = () => {
    const newTodoItem = { ...newTodo, id: Date.now() };
    setTodos([...todos, newTodoItem]);
    setNewTodo({ name: '', description: '', status: 'Not Completed' });
    localStorage.setItem('todos', JSON.stringify([...todos, newTodoItem]));
  };

  const handleEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setNewTodo(todoToEdit);
    setEditing(id);
  };

  const handleUpdateTodo = () => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === editing) {
        return { ...newTodo, id: editing };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setNewTodo({ name: '', description: '', status: 'Not Completed' });
    setEditing(null);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleStatusChange = (id, status) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, status };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  return (
    <div>
      <h1>My Todo</h1>
      <form>
        <input className='input'
          type="text"
          value={newTodo.name}
          onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
          placeholder="Task Name"
        />
        <input className='input'
          type="text"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          placeholder="Description"
        />
        {editing ? (
          <button className='todo' onClick={handleUpdateTodo}>Update Todo</button>
        ) : (
          <button className='todo' onClick={handleCreateTodo}>Add Todo</button>
        )}
      </form>
      <div >
        <p className='head' >My Todos</p>
        <p className='filter'>Filter Status: </p>
        
        <button className='filter' onClick={() => handleFilterChange('all')}>All</button>
        <button className='filter' onClick={() => handleFilterChange('completed')}>Completed</button>
        <button className='filter' onClick={() => handleFilterChange('not completed')}>Not Completed</button>
        
      </div>

        

      <div >
        {todos
          .filter((todo) => {
            if (filter === 'all') return true;
            if (filter === 'completed') return todo.status === 'Completed';
            if (filter === 'not completed') return todo.status === 'Not Completed';
            return false;
          })

          

          .map((todo) => (
            <div className='task' key={todo.id} >
              <h2>Name : {todo.name}</h2>
              <p style={{margin:"0% 2% 0% 0%"}}>Description : {todo.description}</p>
              <p>
                Status:   
                <select className="status"  style={{backgroundColor : todo.status === "Completed" ? "green" : "pink"}}
                  value={todo.status}
                  onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                  
                >
                  <option style={{backgroundColor : "pink"}} value="Not Completed">Not Completed</option>
                  <option  style={{backgroundColor : "green"}} value="Completed">Completed</option>
                </select>
              </p>
              <div className='update'>
              <button className='edit' onClick={() => handleEditTodo(todo.id)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </div>
              
            </div>
          ))}
      </div>
    </div>
  );
}

export default Todo;