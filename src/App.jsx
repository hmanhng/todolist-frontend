import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      })
      const todo = await res.json()
      setTodos([todo, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditValue(todo.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const saveEdit = async (id) => {
    if (!editValue.trim()) return
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editValue })
      })
      const updatedTodo = await res.json()
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
      setEditingId(null)
      setEditValue('')
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const toggleComplete = async (todo) => {
    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      })
      const updatedTodo = await res.json()
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>

      <form onSubmit={addTodo} style={styles.form}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="hello world"
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add</button>
      </form>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : todos.length === 0 ? (
        <p style={styles.empty}>No todos yet. Add one above!</p>
      ) : (
        <ul style={styles.list}>
          {todos.map(todo => (
            <li key={todo.id} style={styles.item}>
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={styles.editInput}
                  />
                  <button onClick={() => saveEdit(todo.id)} style={styles.saveButton}>Save</button>
                  <button onClick={cancelEdit} style={styles.cancelButton}>Cancel</button>
                </>
              ) : (
                <>
                  <div style={styles.todoContent}>
                    <input
                      type="checkbox"
                      checked={todo.completed || false}
                      onChange={() => toggleComplete(todo)}
                      style={styles.checkbox}
                    />
                    <span style={todo.completed ? styles.completedText : styles.todoText}>
                      {todo.title}
                    </span>
                  </div>
                  <div style={styles.actions}>
                    <button onClick={() => startEdit(todo)} style={styles.editButton}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    outline: 'none',
  },
  addButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4a90d9',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    marginBottom: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  todoText: {
    fontSize: '16px',
    color: '#333',
  },
  completedText: {
    fontSize: '16px',
    color: '#999',
    textDecoration: 'line-through',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  deleteButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  editInput: {
    flex: 1,
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginRight: '10px',
  },
  saveButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  cancelButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}

export default App
