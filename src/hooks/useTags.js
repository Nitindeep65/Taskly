import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'https://taskly-backend-iutv.onrender.com';

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchTags = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(`${API_URL}/tag/getTags`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTags(data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = async (name, color) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/tag/create`,
        { name, color },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTags(prev => [...prev, data]);
      return { success: true, tag: data };
    } catch (err) {
      console.error('Failed to create tag:', err);
      const errorMsg = err.response?.data?.error || 'Failed to create tag';
      return { success: false, error: errorMsg };
    }
  };

  const deleteTag = async (tagId) => {
    try {
      await axios.delete(`${API_URL}/tag/${tagId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete tag:', err);
      const errorMsg = err.response?.data?.error || 'Failed to delete tag';
      return { success: false, error: errorMsg };
    }
  };

  return {
    tags,
    loading,
    error,
    createTag,
    deleteTag,
    refetchTags: fetchTags
  };
};
