import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://playground.4geeks.com/todo';
const USERNAME = 'alesanchezr'; // Cambia esto por tu usuario si es necesario

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${USERNAME}`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos || []);
      } else if (response.status === 404) {
        await createUser();
        setTodos([]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createUser = async () => {
    try {
      await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      label: newTodo,
      is_done: false,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${USERNAME}`, {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const createdTodo = await response.json();
        setTodos([...todos, createdTodo]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== todoId));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const clearAllTodos = async () => {
    try {
      await Promise.all(
        todos.map((todo) =>
          fetch(`${API_BASE_URL}/todos/${todo.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        )
      );
      setTodos([]);
    } catch (error) {
      console.error('Error clearing todos:', error);
    }
  };

  return (
    <div className="todo-container">
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.label}
            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button className="clear-btn" onClick={clearAllTodos}>
          Clear All Tasks
        </button>
      )}
    </div>
  );
}

export default TodoList;