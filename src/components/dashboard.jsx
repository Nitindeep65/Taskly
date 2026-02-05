import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DndContext, useDroppable, useDraggable, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "../hooks/useTheme";

function DroppableColumn({ id, children, title, count, color }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between p-4 rounded-t-xl border-b ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      } ${color}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${color.replace('border-l-4', 'bg')}`}></div>
          <h3 className={`font-semibold text-sm md:text-base ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>{title}</h3>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${color.includes('red') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : color.includes('yellow') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
          {count}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 rounded-b-xl min-h-[200px] md:min-h-[300px] transition-all duration-200 ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
        } ${
          isOver ? (isDarkMode ? "bg-blue-900/20 ring-2 ring-blue-400" : "bg-blue-50 ring-2 ring-blue-200") : ""
        }`}
        style={{touchAction: 'none'}}
      >
        {children}
      </div>
    </div>
  );
}

function DraggableTask({ todo, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: todo.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className={`select-none transition-all duration-200 ${isDragging ? 'opacity-50 scale-105' : ''}`}>
      <div className="relative group">
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-1 -right-1 w-8 h-8 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10"
          title="Drag to move"
          style={{touchAction: 'none'}}
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 6 10">
            <circle cx="1" cy="1" r="1"/>
            <circle cx="1" cy="5" r="1"/>
            <circle cx="1" cy="9" r="1"/>
            <circle cx="5" cy="1" r="1"/>
            <circle cx="5" cy="5" r="1"/>
            <circle cx="5" cy="9" r="1"/>
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
}
function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const [newTodo, setNewTodo] = useState("");
  const [newTodoStatus, setNewTodoStatus] = useState("ONGOING");
  const [addingTodo, setAddingTodo] = useState(false);

  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    let isMounted = true;

    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "https://taskly-backend-iutv.onrender.com/todo/getTodos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setTodos(res.data);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 401) {
            navigate("/login");
          } else {
            // setError("Failed to load tasks");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTodos();
    return () => (isMounted = false);
  }, [navigate]);

  const urgentTodos = todos.filter((t) => t.status === "URGENT");
  const ongoingTodos = todos.filter((t) => t.status === "ONGOING");
  const completedTodos = todos.filter((t) => t.status === "COMPLETED");

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setAddingTodo(true);
    try {
      const res = await axios.post(
        "https://taskly-backend-iutv.onrender.com/todo/addTodo",
        {
          title: newTodo,
          status: newTodoStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTodos((prev) => [...prev, res.data]);
      setNewTodo("");
      setNewTodoStatus("ONGOING");
    } catch {
      // setError("Failed to add task");
    } finally {
      setAddingTodo(false);
    }
  };

  const updateTodoStatus = async (id, status) => {
    try {
      await axios.put(
        `https://taskly-backend-iutv.onrender.com/todo/updateTodo/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // UI is already updated optimistically, no need to update state here
    } catch (error) {
      // If API fails, revert the optimistic update
      console.error("Failed to update task:", error);
      // Refetch todos to get the correct state from server
      setTodos((prev) => 
        prev.map((t) => t.id === id ? { ...t, status: t.originalStatus || t.status } : t)
      );
      // Alternatively, you could refetch all todos here
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Optimistic UI update - Update immediately
    setTodos((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    // Call API in background
    updateTodoStatus(taskId, newStatus);
  };

  /* ===================== DELETE ===================== */
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(
        `https://taskly-backend-iutv.onrender.com/todo/deleteTodo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // setError("Failed to delete task");
    }
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  /* ===================== SECTION COMPONENT ===================== */
  const TaskSection = ({ tasks }) => (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((todo) => (
            <DraggableTask key={todo.id} todo={todo}>
              <div className={`group p-4 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
              } ${
                todo.status === "URGENT" ? "border-red-500" : 
                todo.status === "ONGOING" ? "border-yellow-500" : 
                "border-green-500"
              }`}>
                <div className="flex items-start gap-3">
                  {todo.status !== "COMPLETED" && (
                    <button
                      onClick={() => updateTodoStatus(todo.id, "COMPLETED")}
                      className={`mt-0.5 w-5 h-5 border-2 rounded hover:border-green-500 transition-colors duration-200 flex-shrink-0 ${
                        isDarkMode 
                          ? 'border-gray-500 hover:bg-green-900/20' 
                          : 'border-gray-400 hover:bg-green-50'
                      }`}
                      title="Mark as completed"
                    >
                      <svg className="w-3 h-3 text-green-600 opacity-0 hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm md:text-base font-medium break-words ${
                      todo.status === "COMPLETED"
                        ? (isDarkMode ? "line-through text-gray-400" : "line-through text-gray-500")
                        : (isDarkMode ? "text-gray-100" : "text-gray-800")
                    }`}>
                      {todo.title}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        todo.status === "URGENT" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        todo.status === "ONGOING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {todo.status.toLowerCase()}
                      </span>
                      
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-red-400' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DraggableTask>
          ))}
        </div>
      )}
    </div>
  );

  /* ===================== RENDER ===================== */
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className={`sticky top-0 z-10 border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
          : 'bg-white/80 backdrop-blur-sm border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>Taskly</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {todos.length} total tasks
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Advanced Task Creator Button */}
              <button
                onClick={() => navigate('/index')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                title="Advanced Task Creator"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Advanced</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'text-gray-300 bg-gray-800 border-gray-600 hover:border-red-500 hover:text-red-400' 
                    : 'text-gray-700 bg-white border-gray-300 hover:border-red-500 hover:text-red-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add Task Form */}
        <div className="mb-6">
          <form
            onSubmit={handleAddTodo}
            className={`rounded-xl shadow-sm border p-4 md:p-6 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={newTodoStatus}
                  onChange={(e) => setNewTodoStatus(e.target.value)}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-100' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="URGENT">🔥 Urgent</option>
                  <option value="ONGOING">⏳ Ongoing</option>
                </select>
                <button
                  disabled={addingTodo || !newTodo.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {addingTodo ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="hidden sm:inline">Add Task</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Kanban Board */}
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DroppableColumn 
              id="URGENT" 
              title="Urgent" 
              count={urgentTodos.length}
              color="border-red-500"
            >
              <TaskSection tasks={urgentTodos} />
            </DroppableColumn>

            <DroppableColumn 
              id="ONGOING" 
              title="In Progress" 
              count={ongoingTodos.length}
              color="border-yellow-500"
            >
              <TaskSection tasks={ongoingTodos} />
            </DroppableColumn>

            <DroppableColumn 
              id="COMPLETED" 
              title="Completed" 
              count={completedTodos.length}
              color="border-green-500"
            >
              <TaskSection tasks={completedTodos} />
            </DroppableColumn>
          </div>
          
          <DragOverlay>
            {activeId ? (
              (() => {
                const draggedTodo = todos.find(todo => todo.id === activeId);
                if (!draggedTodo) return null;
                
                return (
                  <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } ${
                    draggedTodo.status === "URGENT" ? "border-red-500" : 
                    draggedTodo.status === "ONGOING" ? "border-yellow-500" : 
                    "border-green-500"
                  } opacity-90 transform rotate-2 scale-105`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm md:text-base font-medium break-words ${
                          draggedTodo.status === "COMPLETED"
                            ? (isDarkMode ? "line-through text-gray-400" : "line-through text-gray-500")
                            : (isDarkMode ? "text-gray-100" : "text-gray-800")
                        }`}>
                          {draggedTodo.title}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            draggedTodo.status === "URGENT" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            draggedTodo.status === "ONGOING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}>
                            {draggedTodo.status.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default Dashboard;
