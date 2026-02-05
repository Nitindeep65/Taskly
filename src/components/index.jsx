import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Todo() {
  const [todo, setTodo] = useState([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchTodo = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("https://taskly-backend-iutv.onrender.com/todo/getTodos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodo(data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  }, [token]);

  const createTodos = async (e) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) {
      setError('Name and title are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post("https://taskly-backend-iutv.onrender.com/todo/createTodo", {
        name: name.trim(),
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority.trim() || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodo([data, ...todo]);
      setName('');
      setTitle('');
      setDescription('');
      setPriority('ongoing');
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://taskly-backend-iutv.onrender.com/todo/deleteTodo/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodo(todo.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const dashboard = () => {
    navigate('/Dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-8">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md">
          <svg
            className="mx-auto h-20 w-20 text-indigo-600 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Todo App</h1>
          <p className="text-gray-600 mb-8">Please log in to manage your tasks</p>
          
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Todo Manager
              </h1>
              <p className="text-gray-600">
                Create and organize your tasks
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={dashboard}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
              >
                View Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Task
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="text-red-700 hover:text-red-900 font-bold"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={createTodos} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter task name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPriority('urgent')}
                    className={`px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
                      priority === 'urgent'
                        ? 'bg-red-100 border-2 border-red-500 text-red-700'
                        : 'bg-gray-50 border-2 border-gray-300 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Urgent
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('ongoing')}
                    className={`px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
                      priority === 'ongoing'
                        ? 'bg-yellow-100 border-2 border-yellow-500 text-yellow-700'
                        : 'bg-gray-50 border-2 border-gray-300 text-gray-700 hover:border-yellow-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ongoing
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about the task..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Tasks ({todo.length})
            </h2>

            {todo.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-20 w-20 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-500">
                  Create your first task to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {todo.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-50 hover:bg-gray-100 rounded-lg p-5 transition duration-200 border-l-4 ${
                      item.priority === 'urgent' 
                        ? 'border-red-500' 
                        : item.priority === 'ongoing'
                        ? 'border-yellow-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                            {item.name}
                          </span>
                          {item.priority && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                              item.priority === 'urgent' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.priority === 'urgent' ? (
                                <>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  Urgent
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Ongoing
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTodo(item.id)}
                        className="flex-shrink-0 ml-4 text-gray-400 hover:text-red-600 transition duration-200"
                        title="Delete task"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;