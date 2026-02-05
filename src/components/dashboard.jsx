import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  DndContext,
  useDroppable,
  useDraggable,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTheme } from "../hooks/useTheme";

/* ===================== DROPPABLE COLUMN ===================== */
function DroppableColumn({ id, children, title, count, color }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center justify-between p-4 rounded-t-xl border-b ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-100"
        } ${color}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${color
              .replace("border-l-4", "bg")
              .replace("border-", "bg-")}`}
          ></div>
          <h3
            className={`font-semibold text-sm md:text-base ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
        </div>

        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            color.includes("red")
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : color.includes("yellow")
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-4 rounded-b-xl min-h-[200px] md:min-h-[300px] transition-all duration-200 ${
          isDarkMode ? "bg-gray-900/80" : "bg-gray-50"
        } ${
          isOver
            ? isDarkMode
              ? "bg-blue-950/40 ring-2 ring-blue-500"
              : "bg-blue-50 ring-2 ring-blue-200"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* ===================== DRAGGABLE TASK ===================== */
function DraggableTask({ todo, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: todo.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`select-none transition-all duration-150 ${
        isDragging ? "opacity-40 scale-[1.02]" : ""
      }`}
    >
      <div className="relative group">
        {/* ✅ Drag handle (touch-none ONLY here) */}
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-1 -right-1 w-8 h-8 bg-gray-300 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10 touch-none"
          title="Drag to move"
        >
          <svg
            className="w-4 h-4 text-gray-600 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 6 10"
          >
            <circle cx="1" cy="1" r="1" />
            <circle cx="1" cy="5" r="1" />
            <circle cx="1" cy="9" r="1" />
            <circle cx="5" cy="1" r="1" />
            <circle cx="5" cy="5" r="1" />
            <circle cx="5" cy="9" r="1" />
          </svg>
        </div>

        {children}
      </div>
    </div>
  );
}

/* ===================== DASHBOARD ===================== */
function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const [newTodo, setNewTodo] = useState("");
  const [newTodoStatus, setNewTodoStatus] = useState("ONGOING");
  const [addingTodo, setAddingTodo] = useState(false);

  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  /* ===================== SENSORS (FIXED) ===================== */
  // ✅ IMPORTANT: Do NOT use TouchSensor together with PointerSensor
  // PointerSensor handles touch + mouse both.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // smooth mobile long press
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* ===================== FETCH TODOS ===================== */
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
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isMounted) setTodos(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTodos();
    return () => (isMounted = false);
  }, [navigate]);

  /* ===================== DERIVED LISTS ===================== */
  const urgentTodos = useMemo(
    () => todos.filter((t) => t.status === "URGENT"),
    [todos]
  );

  const ongoingTodos = useMemo(
    () => todos.filter((t) => t.status === "ONGOING"),
    [todos]
  );

  const completedTodos = useMemo(
    () => todos.filter((t) => t.status === "COMPLETED"),
    [todos]
  );

  /* ===================== CREATE TODO ===================== */
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setAddingTodo(true);

    try {
      const res = await axios.post(
        "https://taskly-backend-iutv.onrender.com/todo/createTodo",
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
    } catch (err) {
      console.log(err);
    } finally {
      setAddingTodo(false);
    }
  };

  /* ===================== UPDATE STATUS (SERVER ONLY) ===================== */
  const updateTodoStatus = async (id, status) => {
    await axios.put(
      `https://taskly-backend-iutv.onrender.com/todo/updateTodo/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
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
    } catch (err) {
      console.log(err);
    }
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ===================== DND HANDLERS ===================== */
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const draggedTodo = todos.find((t) => t.id === taskId);
    if (!draggedTodo) return;

    // ✅ dropped in same column => no work
    if (draggedTodo.status === newStatus) return;

    // ✅ Save old state for revert if API fails
    const previousTodos = todos;

    // ✅ Optimistic update (instant UI)
    setTodos((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      // ✅ update server in background
      await updateTodoStatus(taskId, newStatus);
    } catch (err) {
      console.log("Update failed, reverting:", err);

      // ❌ Revert UI if API fails
      setTodos(previousTodos);
    }
  };

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  /* ===================== TASK SECTION ===================== */
  const TaskSection = ({ tasks }) => (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No tasks yet
          </p>
        </div>
      ) : (
        tasks.map((todo) => (
          <DraggableTask key={todo.id} todo={todo}>
            <div
              className={`group p-4 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${
                isDarkMode ? "bg-black hover:bg-gray-900" : "bg-white"
              } ${
                todo.status === "URGENT"
                  ? "border-red-500"
                  : todo.status === "ONGOING"
                  ? "border-yellow-500"
                  : "border-green-500"
              }`}
            >
              <div className="flex items-start gap-3">
                {todo.status !== "COMPLETED" && (
                  <button
                    onClick={() => {
                      const prev = todos;
                      setTodos((p) =>
                        p.map((t) =>
                          t.id === todo.id ? { ...t, status: "COMPLETED" } : t
                        )
                      );

                      updateTodoStatus(todo.id, "COMPLETED").catch(() => {
                        setTodos(prev);
                      });
                    }}
                    className={`mt-0.5 w-5 h-5 border-2 rounded flex-shrink-0 ${
                      isDarkMode ? "border-gray-500" : "border-gray-400"
                    }`}
                    title="Mark as completed"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm md:text-base font-medium break-words ${
                      todo.status === "COMPLETED"
                        ? "line-through text-gray-500"
                        : isDarkMode
                        ? "text-gray-50"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        todo.status === "URGENT"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : todo.status === "ONGOING"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {todo.status.toLowerCase()}
                    </span>

                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-red-400"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </DraggableTask>
        ))
      )}
    </div>
  );

  /* ===================== DRAG OVERLAY CARD ===================== */
  const activeTodo = activeId ? todos.find((t) => t.id === activeId) : null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Top */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Task Dashboard
            </h1>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {todos.length} total tasks
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 dark:text-white"
            >
              Toggle Theme
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add */}
        <form
          onSubmit={handleAddTodo}
          className={`rounded-xl shadow-sm border p-4 md:p-6 mb-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              }`}
            />

            <select
              value={newTodoStatus}
              onChange={(e) => setNewTodoStatus(e.target.value)}
              className={`px-4 py-3 border rounded-lg ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-gray-100"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="URGENT">🔥 Urgent</option>
              <option value="ONGOING">⏳ Ongoing</option>
            </select>

            <button
              disabled={addingTodo || !newTodo.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-400"
            >
              {addingTodo ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>

        {/* Board */}
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

          {/* Overlay */}
          <DragOverlay>
            {activeTodo ? (
              <div
                className={`p-4 rounded-lg shadow-lg border-l-4 ${
                  isDarkMode ? "bg-black" : "bg-white"
                } ${
                  activeTodo.status === "URGENT"
                    ? "border-red-500"
                    : activeTodo.status === "ONGOING"
                    ? "border-yellow-500"
                    : "border-green-500"
                } opacity-95 rotate-2 scale-105`}
              >
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {activeTodo.title}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default Dashboard;
