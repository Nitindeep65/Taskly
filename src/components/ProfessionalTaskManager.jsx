import axios from "axios";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function ProfessionalTaskManager() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("ongoing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ===================== FETCH TODOS ===================== */
  const fetchTodos = useCallback(async () => {
    if (!token) return;

    try {
      setError("");
      const { data } = await axios.get(
        "https://taskly-backend-iutv.onrender.com/todo/getTodos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTodos(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /* ===================== CREATE TODO ===================== */
  const createTodo = async (e) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://taskly-backend-iutv.onrender.com/todo/createTodo",
        {
          name: name.trim(),
          title: title.trim(),
          description: description.trim(),
          priority,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ functional update (safe)
      setTodos((prev) => [response.data, ...prev]);

      setName("");
      setTitle("");
      setDescription("");
      setPriority("ongoing");
      setActiveTab("manage");
    } catch (err) {
      console.error(err);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DELETE TODO ===================== */
  const deleteTodo = async (id) => {
    try {
      setError("");

      await axios.delete(
        `https://taskly-backend-iutv.onrender.com/todo/deleteTodo/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ functional update
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ===================== FILTERED TODOS ===================== */
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const todoName = (todo.name || "").toLowerCase();
      const todoTitle = (todo.title || "").toLowerCase();
      const todoDesc = (todo.description || "").toLowerCase();

      const matchesSearch =
        todoName.includes(searchTerm.toLowerCase()) ||
        todoTitle.includes(searchTerm.toLowerCase()) ||
        todoDesc.includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || todo.priority === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [todos, searchTerm, selectedCategory]);

  /* ===================== AUTH GUARD ===================== */
  if (!token) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-8 transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-indigo-100 via-white to-purple-100"
        }`}
      >
        <div
          className={`text-center p-12 rounded-3xl shadow-2xl max-w-md transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

          <h3
            className={`text-lg font-medium mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Authentication Required
          </h3>

          <p
            className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Please log in to access your tasks
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-72" : "w-16"} transition-all duration-300 flex-shrink-0 ${
          isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        } border-r flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-6 border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              sidebarOpen ? "" : "justify-center"
            }`}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>

            {sidebarOpen && (
              <div>
                <h1
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Taskly
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Enterprise
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          {sidebarOpen && (
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
              Workspace
            </div>
          )}

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("create")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "create"
                  ? isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-blue-50 text-blue-700"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-gray-400">＋</span>
              {sidebarOpen && <span>Create Task</span>}
            </button>

            <button
              onClick={() => setActiveTab("manage")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "manage"
                  ? isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-blue-50 text-blue-700"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-gray-400">☑</span>
              {sidebarOpen && <span>Manage Tasks</span>}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-gray-400">▦</span>
              {sidebarOpen && <span>Kanban Board</span>}
            </button>
          </nav>
        </div>

        {/* User Profile */}
        {sidebarOpen && (
          <div
            className={`p-4 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 cursor-pointer transition-colors mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email || "user@example.com"}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md transition-colors mb-1"
            >
              <span className="text-gray-400">🌓</span>
              <span>Theme</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-md transition-colors"
            >
              <span className="text-gray-400">⎋</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className={`border-b px-6 py-4 ${
            isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((p) => !p)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                ☰
              </button>

              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {activeTab === "create" ? "Create New Task" : "Manage Tasks"}
                </h1>

                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {activeTab === "create"
                    ? "Add a new task to your workspace"
                    : `Manage your ${todos.length} tasks efficiently`}
                </p>
              </div>
            </div>

            {/* Search + Filter */}
            {activeTab === "manage" && (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`px-4 py-2 w-64 border rounded-lg text-sm ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400"
                      : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
                  }`}
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 border rounded-lg text-sm ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-gray-100"
                      : "border-gray-300 bg-gray-50 text-gray-900"
                  }`}
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">🚨 Urgent</option>
                  <option value="high">🔴 High</option>
                  <option value="ongoing">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {error && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 border-red-500 ${
                isDarkMode
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* CREATE TAB */}
          {activeTab === "create" && (
            <div
              className={`max-w-2xl mx-auto rounded-xl border p-8 shadow-sm ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Create a New Task
              </h2>

              <form onSubmit={createTodo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Task Name *
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isDarkMode
                          ? "border-gray-700 bg-gray-700 text-gray-100"
                          : "border-gray-300 bg-gray-50 text-gray-900"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isDarkMode
                          ? "border-gray-700 bg-gray-700 text-gray-100"
                          : "border-gray-300 bg-gray-50 text-gray-900"
                      }`}
                    >
                      <option value="low">🟢 Low</option>
                      <option value="ongoing">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                      <option value="urgent">🚨 Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Title *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-gray-100"
                        : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg resize-none ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-gray-100"
                        : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !name.trim() || !title.trim()}
                  className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>
              </form>
            </div>
          )}

          {/* MANAGE TAB */}
          {activeTab === "manage" && (
            <div className="max-w-6xl mx-auto">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-12">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    No tasks found
                  </h3>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`group p-6 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3
                              className={`font-bold text-lg ${
                                isDarkMode ? "text-gray-100" : "text-gray-900"
                              }`}
                            >
                              {todo.name}
                            </h3>

                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                todo.priority === "urgent"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : todo.priority === "high"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                  : todo.priority === "ongoing"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {todo.priority?.toUpperCase()}
                            </span>
                          </div>

                          <p
                            className={`font-medium text-base mb-3 ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {todo.title}
                          </p>

                          {todo.description && (
                            <p
                              className={`text-sm leading-relaxed ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className={`opacity-0 group-hover:opacity-100 p-3 rounded-xl transition-all duration-200 ${
                            isDarkMode
                              ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                          title="Delete task"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProfessionalTaskManager;
