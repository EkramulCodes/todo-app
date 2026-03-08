import { useState, useEffect } from 'react'

const App = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editInput, setEditInput] = useState('')

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])


  const addTodo = () => {
    if (input.trim() === '') return
    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }])
    setInput('')
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditInput(todo.text)
  }

  const saveEdit = (id) => {
    if (editInput.trim() === '') return
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editInput.trim() } : todo
    ))
    setEditingId(null)
    setEditInput('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditInput('')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Todo App</h1>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            +
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
              <input
                type="checkbox"
                checked={todo.completed || false}
                onChange={() => toggleComplete(todo.id)}
                className="w-5 h-5 text-green-500 rounded focus:ring-green-500 cursor-pointer"
              />
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                  className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none"
                  autoFocus
                />
              ) : (
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.text}
                </span>
              )}
              <div className="flex gap-1">
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="px-2 py-1 text-green-500 hover:bg-green-100 rounded transition-all"
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded transition-all"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(todo)}
                      className="px-2 py-1 text-blue-500 opacity-0 group-hover:opacity-100 hover:bg-blue-100 rounded transition-all"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-2 py-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-gray-400 text-center py-4">No todos yet. Add one above!</p>
        )}
        
        <p className="text-gray-500 text-sm mt-4">{todos.filter(t => t.completed).length} of {todos.length} completed</p>
      </div>
    </div>
  )
}

export default App
