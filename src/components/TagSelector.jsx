import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

function TagSelector({ selectedTagIds, onChange, availableTags, onCreateTag }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const { isDarkMode } = useTheme();

  const selectedTags = availableTags.filter(tag => selectedTagIds.includes(tag.id));

  const toggleTag = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const removeTag = (tagId) => {
    onChange(selectedTagIds.filter(id => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;
    
    // Generate a random color for the custom tag
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const result = await onCreateTag(newTagName.trim(), randomColor);
    if (result.success) {
      setNewTagName('');
      setShowNewTagInput(false);
      // Auto-select the newly created tag
      onChange([...selectedTagIds, result.tag.id]);
    }
  };

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
              }`}
              style={{ borderLeft: `3px solid ${tag.color}` }}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-750'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="text-sm">
          {selectedTags.length === 0 
            ? 'Select tags...' 
            : `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
          }
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          {/* Predefined Tags */}
          <div className={`p-2 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Predefined Tags
          </div>
          {availableTags.filter(tag => tag.type === 'PREDEFINED').map(tag => (
            <label
              key={tag.id}
              className={`flex items-center px-3 py-2 cursor-pointer hover:bg-opacity-10 ${
                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
                className="mr-2"
              />
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {tag.name}
                </span>
              </div>
            </label>
          ))}

          {/* Custom Tags */}
          {availableTags.filter(tag => tag.type === 'CUSTOM').length > 0 && (
            <>
              <div className={`p-2 text-xs font-semibold border-t ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
                Custom Tags
              </div>
              {availableTags.filter(tag => tag.type === 'CUSTOM').map(tag => (
                <label
                  key={tag.id}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-opacity-10 ${
                    isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="mr-2"
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {tag.name}
                    </span>
                  </div>
                </label>
              ))}
            </>
          )}

          {/* Create New Tag */}
          {onCreateTag && (
            <div className={`border-t p-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {!showNewTagInput ? (
                <button
                  type="button"
                  onClick={() => setShowNewTagInput(true)}
                  className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-opacity-10 ${
                    isDarkMode ? 'text-blue-400 hover:bg-blue-400' : 'text-blue-600 hover:bg-blue-600'
                  }`}
                >
                  + Create New Tag
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                    placeholder="Tag name..."
                    className={`flex-1 px-2 py-1 text-sm border rounded ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300'
                    }`}
                    maxLength={30}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagInput(false);
                      setNewTagName('');
                    }}
                    className={`px-2 py-1 text-sm rounded ${
                      isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TagSelector;
