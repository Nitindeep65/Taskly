import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';
import ProjectForm from './ProjectForm';
import Toast from './Toast';
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

const API_URL = 'https://taskly-backend-iutv.onrender.com';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [toast, setToast] = useState(null);
  const { isDarkMode, toggleTheme} = useTheme();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProjects = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(`${API_URL}/project/getProjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (projectData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/project/create`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(prev => [data, ...prev].slice(0, 5));
      setToast({ message: 'Project created successfully!', type: 'success' });
      return { success: true };
    } catch (err) {
      console.error('Failed to create project:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to create project' };
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/project/${editingProject.id}`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(prev => prev.map(p => p.id === data.id ? data : p));
      setToast({ message: 'Project updated successfully!', type: 'success' });
      setEditingProject(null);
      return { success: true };
    } catch (err) {
      console.error('Failed to update project:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to update project' };
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? Tasks will not be deleted but will become unassigned.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setToast({ message: 'Project deleted successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to delete project:', err);
      setToast({ message: 'Failed to delete project', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" collapsible="offcanvas" className="border-r">
        <SidebarHeader>
          <div className="p-4">
            <h2 className="text-lg font-semibold">Account</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>User Info</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-3">
                <div className="p-3 rounded-lg bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">Logged in as</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-3">
                <div className="p-3 rounded-lg border-l-4 border-blue-500 bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-sidebar-accent">
                  <p className="text-xs text-muted-foreground">Recent Projects</p>
                  <p className="font-medium">Last 5 shown</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowForm(true);
                  }}
                  className="w-full p-3 rounded-lg text-left flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">New Project</span>
                </button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="px-3">
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
            onClick={() => navigate('/index')}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">My Projects</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Create Button and Description */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <p className="text-lg text-muted-foreground">
                Your last 5 projects
              </p>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg flex items-center gap-2 justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Project
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="rounded-xl p-6 animate-pulse bg-card"
                >
                  <div className="h-6 rounded mb-4 bg-muted" />
                  <div className="h-4 rounded mb-2 bg-muted" />
                  <div className="h-4 rounded w-2/3 bg-muted" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 rounded-xl bg-card">
              <svg className="w-20 h-20 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">
                No projects yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Create your first project to get started
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
              >
                Create Project
              </button>
            </div>
          ) : (
            /* Project Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-l-4 bg-card"
                  style={{ borderLeftColor: project.color }}
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm line-clamp-2 text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg hover:bg-accent"
                        title="Edit project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-sm text-muted-foreground">
                        {project._count?.todos || 0} tasks
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject}
        isEdit={!!editingProject}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </SidebarProvider>
  );
}

export default ProjectManagement;
