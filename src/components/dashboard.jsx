import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DndContext, useDroppable, useDraggable , PointerSensor ,useSensor ,useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";


function DroppableColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[250px] transition ${
        isOver ? "bg-indigo-50" : ""
      }`}
    >
      {children}
    </div>
  );
}

function DraggableTask({ todo, children }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: todo.id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} className="select-none">
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-sm text-gray-400 mb-1"
      >
        ⠿ Drag
      </div>

      {children}
    </div>
  );
}
function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTodo, setNewTodo] = useState("");
  const [newTodoStatus, setNewTodoStatus] = useState("ONGOING");
  const [addingTodo, setAddingTodo] = useState(false);

  const navigate = useNavigate();
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, 
    },
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

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status } : t
        )
      );
    } catch {
      // setError("Failed to update task");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

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
  const TaskSection = ({ title, tasks, color }) => (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-bold mb-4">
        {title} <span className="text-gray-400">({tasks.length})</span>
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm">No tasks</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((todo) => (
  <DraggableTask key={todo.id} todo={todo}>
    <div
      className={`p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 ${color}`}
    >

              <div className="flex items-center gap-3">
                {todo.status !== "COMPLETED" && (
                  <button
                    onClick={() =>
                      updateTodoStatus(todo.id, "COMPLETED")
                    }
                    className="w-5 h-5 border-2 border-gray-400 rounded"
                  />
                )}

                <span
                  className={`flex-1 ${
                    todo.status === "COMPLETED"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {todo.title}
                </span>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-gray-500">{todos.length} total</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleAddTodo}
          className="bg-white rounded-xl shadow p-6 flex gap-3"
        >
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New task..."
            className="flex-1 px-4 py-3 border rounded"
          />
          <select
            value={newTodoStatus}
            onChange={(e) => setNewTodoStatus(e.target.value)}
            className="px-4 py-3 border rounded"
          >
            <option value="URGENT">Urgent</option>
            <option value="ONGOING">Ongoing</option>
          </select>
          <button
            disabled={addingTodo}
            className="px-6 py-3 bg-indigo-600 text-white rounded"
          >
            {addingTodo ? "Adding..." : "Add"}
          </button>
        </form>

         <DndContext 
         sensors={sensors}
         onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DroppableColumn id="URGENT">
              <TaskSection
                title="Urgent"
                tasks={urgentTodos}
                color="border-red-500"
              />
            </DroppableColumn>

            <DroppableColumn id="ONGOING">
              <TaskSection
                title="Ongoing"
                tasks={ongoingTodos}
                color="border-yellow-500"
              />
            </DroppableColumn>

            <DroppableColumn id="COMPLETED">
              <TaskSection
                title="Completed"
                tasks={completedTodos}
                color="border-green-500"
              />
            </DroppableColumn>
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default Dashboard;
