import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User, Plus, X, Loader2, RefreshCw } from 'lucide-react';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    category: 'Layihə'
  });

  // Real-time tarixi göstərmək üçün
  const [currentTime, setCurrentTime] = useState(new Date());

  // API base URL
  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Xəbərləri API-dən əldə et
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/news`);
      const result = await response.json();
      
      if (result.success) {
        setNews(result.data);
      } else {
        setError(result.message || 'Xəbərləri yükləməkdə xəta');
      }
    } catch (err) {
      setError('Server ilə əlaqə qurulmadı. Backend serverin işlədiyinə əmin olun.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} saniyə əvvəl`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} dəqiqə əvvəl`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat əvvəl`;
    } else if (diffInDays < 7) {
      return `${diffInDays} gün əvvəl`;
    } else {
      return date.toLocaleDateString('az-AZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    
    if (!newNews.title.trim() || !newNews.content.trim()) {
      alert('Başlıq və məzmun boş ola bilməz');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(`${API_BASE}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNews)
      });

      const result = await response.json();

      if (result.success) {
        // Yeni xəbəri siyahının əvvəlinə əlavə et
        setNews([result.data, ...news]);
        setNewNews({ title: '', content: '', category: 'Layihə' });
        setShowAddForm(false);
        alert('Xəbər uğurla əlavə edildi!');
      } else {
        alert(result.message || 'Xəbər əlavə etməkdə xəta');
      }
    } catch (err) {
      alert('Server ilə əlaqə qurulmadı');
      console.error('Add news error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Layihə': 'bg-blue-100 text-blue-800',
      'Texnologiya': 'bg-green-100 text-green-800',
      'Dizayn': 'bg-purple-100 text-purple-800',
      'Şəxsi': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleRefresh = () => {
    fetchNews();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Xəbərlər yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Xəbərlər & Yeniliklər
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
            <Clock className="w-5 h-5" />
            <span>
              {currentTime.toLocaleString('az-AZ', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Yenilə
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Add News Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Yeni Xəbər Əlavə Et
          </button>
        </div>

        {/* Add News Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Başlıq</label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Xəbər başlığını daxil edin..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Kateqoriya</label>
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Layihə">Layihə</option>
                  <option value="Texnologiya">Texnologiya</option>
                  <option value="Dizayn">Dizayn</option>
                  <option value="Şəxsi">Şəxsi</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Məzmun</label>
                <textarea
                  value={newNews.content}
                  onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Xəbər məzmununu yazın..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Əlavə edilir...
                    </>
                  ) : (
                    'Əlavə Et'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Ləğv Et
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="space-y-6">
          {news.map((item) => (
            <article
              key={item._id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h2>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                {item.content}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{item.author || 'Admin'}</span>
                </div>
                <span>
                  {new Date(item.date).toLocaleString('az-AZ', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              Hələ ki xəbər yoxdur. İlk xəbəri siz əlavə edin!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;