import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Field, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
];

function ProjectForm({ isOpen, onClose, onSubmit, initialData, isEdit = false }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [color, setColor] = useState(initialData?.color || '#3B82F6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const newName = initialData?.name || '';
      const newDescription = initialData?.description || '';
      const newColor = initialData?.color || '#3B82F6';
      
      setName(newName);
      setDescription(newDescription);
      setColor(newColor);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (name.length > 100) {
      setError('Project name must be 100 characters or less');
      return;
    }

    if (description.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      color
    });

    setLoading(false);

    if (result.success) {
      setName('');
      setDescription('');
      setColor('#3B82F6');
      onClose();
    } else {
      setError(result.error || 'Failed to save project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Project Name */}
          <Field>
            <FieldLabel htmlFor="project-name">
              Project Title <span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., E-commerce Platform"
                maxLength={100}
                required
              />
              <FieldDescription>
                {name.length}/100 characters
              </FieldDescription>
            </FieldContent>
          </Field>

          {/* Project Description */}
          <Field>
            <FieldLabel htmlFor="project-description">
              Description
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project goals, features, and constraints..."
                rows={5}
                maxLength={1000}
                className="resize-none"
              />
              <FieldDescription>
                {description.length}/1000 characters
              </FieldDescription>
            </FieldContent>
          </Field>

          {/* Color Picker */}
          <Field>
            <FieldLabel>Project Color</FieldLabel>
            <FieldContent>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    onClick={() => setColor(presetColor)}
                    className={`w-10 h-10 rounded-lg transition ${
                      color === presetColor
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105'
                    } ring-offset-background`}
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
            </FieldContent>
          </Field>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition bg-muted text-muted-foreground hover:bg-muted/80"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEdit ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
