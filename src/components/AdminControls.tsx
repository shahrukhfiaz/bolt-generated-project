import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Website {
  id: string;
  url: string;
  name: string;
  position: number;
}

const AdminControls: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [newWebsite, setNewWebsite] = useState({ url: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newWebsite.url.trim()) {
      setError('URL is required');
      return;
    }

    let formattedUrl;
    try {
      formattedUrl = new URL(
        newWebsite.url.startsWith('http') ? newWebsite.url : `https://${newWebsite.url}`
      ).toString();
    } catch {
      setError('Invalid URL format');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('popular_websites')
        .insert([{
          url: formattedUrl,
          name: newWebsite.name || formattedUrl.replace(/^https?:\/\//, ''),
          position: websites.length + 1
        }])
        .select();
      
      if (error) throw error;
      
      setWebsites([...websites, data[0]]);
      setNewWebsite({ url: '', name: '' });
    } catch (error) {
      console.error('Error adding website:', error);
      setError(error.message || 'Failed to add website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-controls">
      <form onSubmit={handleAddWebsite}>
        <input
          type="text"
          value={newWebsite.url}
          onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
          placeholder="Enter website URL"
        />
        <input
          type="text"
          value={newWebsite.name}
          onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
          placeholder="Enter website name (optional)"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Website'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default AdminControls;
