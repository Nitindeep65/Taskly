import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  useDroppable,
  useDraggable,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "../hooks/useTheme";
import { useTags } from "../hooks/useTags";
import TagSelector from "./TagSelector";
import Toast from "./Toast";
import { exportToMarkdown, copyToClipboard, downloadMarkdown, sanitizeFilename } from "../utils/exportUtils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_URL = "https://taskly-backend-iutv.onrender.com";

function DroppableColumn({ id, children, title, count, color }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center justify-between p-4 rounded-t-xl border-b ${
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
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
              ? "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-400"
              : color.includes("yellow")
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-400"
              : "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-400"
          }`}
        >
          {count}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 rounded-b-xl min-h-[200px] md:min-h-[300px] transition-all duration-200 ${
          isDarkMode ? "bg-gray-700/80" : "bg-gray-50"
        } ${
          isOver
            ? isDarkMode
              ? "bg-blue-700/40 ring-2 ring-blue-500"
              : "bg-blue-50 ring-2 ring-blue-200"
            : ""
        }`}
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
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-1 -right-1 w-8 h-8 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10 touch-none"
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

function ProjectDashboard() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Add task form
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("ONGOING");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [addingTask, setAddingTask] = useState(false);

  // AI Summary
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { tags, createTag } = useTags();
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch project and its todos
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(data);
        setTodos(data.todos || []);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        if (err.response?.status === 401) navigate("/login");
        if (err.response?.status === 404) navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, token, navigate]);

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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskTitle.trim()) return;

    setAddingTask(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/todo/createTodo`,
        {
          name: taskName.trim(),
          title: taskTitle.trim(),
          description: taskDescription.trim() || null,
          status: taskStatus,
          projectId: parseInt(projectId),
          tagIds: selectedTagIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodos((prev) => [data, ...prev]);
      setTaskName("");
      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("ONGOING");
      setSelectedTagIds([]);
      setShowAddForm(false);
      setToast({ message: "Task added successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to add task:", err);
      setToast({ message: "Failed to add task", type: "error" });
    } finally {
      setAddingTask(false);
    }
  };

  const handleDragStart = () => {
    // Drag started
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const todoId = active.id;
    const newStatus = over.id;

    const todo = todos.find((t) => t.id === todoId);
    if (!todo || todo.status === newStatus) return;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, status: newStatus } : t))
    );

    try {
      await axios.put(
        `${API_URL}/todo/updateTodo/${todoId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? { ...t, status: todo.status } : t))
      );
      setToast({ message: "Failed to update task status", type: "error" });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`${API_URL}/todo/deleteTodo/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos((prev) => prev.filter((t) => t.id !== taskId));
      setToast({ message: "Task deleted", type: "success" });
    } catch (err) {
      console.error("Failed to delete task:", err);
      setToast({ message: "Failed to delete task", type: "error" });
    }
  };

  const handleExportMarkdown = () => {
    if (!project) return;
    const markdown = exportToMarkdown(project, todos);
    const filename = sanitizeFilename(project.name);
    const result = downloadMarkdown(markdown, filename);
    setToast({ message: result.message, type: result.success ? "success" : "error" });
  };

  const handleCopyToClipboard = async () => {
    if (!project) return;
    const markdown = exportToMarkdown(project, todos);
    const result = await copyToClipboard(markdown);
    setToast({ message: result.message, type: result.success ? "success" : "error" });
  };

  const handleGenerateAISummary = async () => {
    if (!project) return;
    
    setLoadingSummary(true);
    setShowAISummary(true);
    setAiSummary("");
    
    try {
      const { data } = await axios.post(
        `${API_URL}/ai/generate-summary`,
        {
          projectName: project.name,
          projectDescription: project.description,
          tasks: todos.map(t => ({
            name: t.name,
            title: t.title,
            status: t.status
          }))
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Clean up the summary - remove citation brackets and extra formatting
      let cleanSummary = data.summary
        .replace(/\[\d+\]/g, '') // Remove [1], [2], etc.
        .replace(/\*\*/g, '')    // Remove bold markdown
        .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
        .trim();
      setAiSummary(cleanSummary);
    } catch (err) {
      console.error("Failed to generate AI summary:", err);
      setAiSummary(
        err.response?.status === 503 
          ? "AI service is not configured. Please contact the administrator."
          : "Failed to generate AI summary. Please try again later."
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="text-center">
          <p className={`text-xl mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Project not found</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" collapsible="offcanvas" className="border-r">
        <SidebarHeader>
          <div className="p-4">
            <h2 className="text-lg font-semibold">Project Info</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Details</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3 px-3">
                <div className="p-3 rounded-lg bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                  <p className="font-medium text-sm">{todos.length}</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Statistics</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-3">
                <div className="p-3 rounded-lg border-l-4 border-red-500 bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">🚨 Urgent</p>
                  <p className="text-2xl font-bold">{urgentTodos.length}</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-yellow-500 bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">🟡 Ongoing</p>
                  <p className="text-2xl font-bold">{ongoingTodos.length}</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-green-500 bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">✅ Completed</p>
                  <p className="text-2xl font-bold">{completedTodos.length}</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Progress</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3">
                <div className="p-3 rounded-lg bg-sidebar-accent">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Completion</span>
                    <span className="text-xs font-medium">
                      {todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="px-3 space-y-2">
                <div className="p-3 rounded-lg bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">Logged in as</p>
                  <p className="font-medium text-sm">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full p-3 rounded-lg text-left flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <button
            onClick={() => navigate("/projects")}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1
              className="text-xl font-bold flex items-center gap-3"
              style={{ borderLeft: `4px solid ${project.color}`, paddingLeft: "12px" }}
            >
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-muted-foreground ml-4">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>

            <button
              onClick={handleGenerateAISummary}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Summary
            </button>

            <div className="relative group">
              <button className="px-4 py-2 rounded-lg border hover:bg-accent">
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border bg-background opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={handleCopyToClipboard}
                  className="w-full text-left px-4 py-2 hover:bg-accent rounded-t-lg"
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="w-full text-left px-4 py-2 hover:bg-accent rounded-b-lg"
                >
                  📥 Download Markdown
                </button>
              </div>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent">
              {isDarkMode ? "🌞" : "🌙"}
            </button>
          </div>
        </header>

        {/* Add Task Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-background">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add New Task</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 rounded-lg hover:bg-accent"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddTask} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Task Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="e.g., Setup Database"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    >
                      <option value="ONGOING">🟡 Ongoing</option>
                      <option value="URGENT">🚨 Urgent</option>
                      <option value="COMPLETED">✅ Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Brief description of the task"
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Detailed description of what needs to be done..."
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg resize-none bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <TagSelector
                    selectedTagIds={selectedTagIds}
                    onChange={setSelectedTagIds}
                    availableTags={tags}
                    onCreateTag={createTag}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold bg-muted hover:bg-muted/80"
                    disabled={addingTask}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                    disabled={addingTask}
                  >
                    {addingTask ? "Adding..." : "Add Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <main className="flex-1 overflow-auto p-8">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DroppableColumn id="URGENT" title="🚨 Urgent" count={urgentTodos.length} color="border-l-4 border-red-500">
                <div className="space-y-3">
                  {urgentTodos.map((todo) => (
                    <DraggableTask key={todo.id} todo={todo}>
                      <TaskCard todo={todo} onDelete={handleDeleteTask} isDarkMode={isDarkMode} />
                    </DraggableTask>
                  ))}
                </div>
              </DroppableColumn>

              <DroppableColumn id="ONGOING" title="🟡 Ongoing" count={ongoingTodos.length} color="border-l-4 border-yellow-500">
                <div className="space-y-3">
                  {ongoingTodos.map((todo) => (
                    <DraggableTask key={todo.id} todo={todo}>
                      <TaskCard todo={todo} onDelete={handleDeleteTask} isDarkMode={isDarkMode} />
                    </DraggableTask>
                  ))}
                </div>
              </DroppableColumn>

              <DroppableColumn id="COMPLETED" title="✅ Completed" count={completedTodos.length} color="border-l-4 border-green-500">
                <div className="space-y-3">
                  {completedTodos.map((todo) => (
                    <DraggableTask key={todo.id} todo={todo}>
                      <TaskCard todo={todo} onDelete={handleDeleteTask} isDarkMode={isDarkMode} />
                    </DraggableTask>
                  ))}
                </div>
              </DroppableColumn>
            </div>
          </DndContext>
        </main>
      </SidebarInset>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* AI Summary Alert Dialog */}
      <AlertDialog open={showAISummary} onOpenChange={setShowAISummary}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-Powered Project Summary
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-4">
                {loadingSummary ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-muted-foreground">Generating AI insights...</span>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm">
                    {aiSummary.split(/\n\n+/).map((section, idx) => {
                      const isHeader = section.match(/^(OVERVIEW|KEY RECOMMENDATIONS|POTENTIAL CHALLENGES):/i);
                      if (isHeader) {
                        const [title, ...content] = section.split(':');
                        return (
                          <div key={idx} className="space-y-2">
                            <h4 className="font-semibold text-primary flex items-center gap-2">
                              {title.includes('OVERVIEW') && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              )}
                              {title.includes('RECOMMENDATIONS') && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              )}
                              {title.includes('CHALLENGES') && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              )}
                              {title.trim()}
                            </h4>
                            <div className="text-muted-foreground leading-relaxed pl-6">
                              {content.join(':').split('\n').map((line, lineIdx) => (
                                <p key={lineIdx} className={line.trim().startsWith('•') ? 'flex items-start gap-2 mb-1' : 'mb-2'}>
                                  {line.trim().startsWith('•') ? (
                                    <>
                                      <span className="text-primary mt-0.5">•</span>
                                      <span>{line.replace('•', '').trim()}</span>
                                    </>
                                  ) : (
                                    line.trim()
                                  )}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return section.trim() ? (
                        <p key={idx} className="text-muted-foreground leading-relaxed">{section}</p>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAISummary(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}

function TaskCard({ todo, onDelete, isDarkMode }) {
  return (
    <div className="p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-card">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold">{todo.name}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="text-red-600 hover:text-red-700 p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{todo.title}</p>
      {todo.description && (
        <p className="text-xs text-muted-foreground mb-3">{todo.description}</p>
      )}
     {todo.tags && todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {todo.tags.map((t) => (
            <span
              key={t.tag.id}
              className="px-2 py-1 text-xs rounded-md"
              style={{
                backgroundColor: isDarkMode ? `${t.tag.color}20` : `${t.tag.color}15`,
                color: t.tag.color,
                borderLeft: `3px solid ${t.tag.color}`,
              }}
            >
              {t.tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectDashboard;
