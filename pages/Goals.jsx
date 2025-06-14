import React, { useState, useEffect } from 'react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: ''
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('İstifadəçi giriş etməyib');
      return false;
    }
    return true;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setGoals(data.data || []);
      } else {
        throw new Error(data.message || 'Məqsədlər yüklənmədi');
      }
    } catch (err) {
      console.error('Məqsədlər yüklənmədi:', err);
      setError('Məqsədlər yüklənmədi: ' + err.message);
      
      const mockGoals = [
        {
          id: 1,
          title: 'Yeni avtomobil almaq',
          targetAmount: 25000,
          currentAmount: 8500,
          deadline: '2025-12-31'
        },
        {
          id: 2,
          title: 'Təhsil fondu',
          targetAmount: 15000,
          currentAmount: 4200,
          deadline: '2026-06-30'
        }
      ];
      setGoals(mockGoals);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: goalData.title,
          targetAmount: parseFloat(goalData.targetAmount),
          deadline: goalData.deadline,
          currentAmount: 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await loadGoals();
        setFormData({ title: '', targetAmount: '', deadline: '' });
        console.log('Məqsəd uğurla yaradıldı');
      } else {
        throw new Error(data.message || 'Məqsəd yaradılarkən xəta baş verdi');
      }
    } catch (err) {
      console.error('Məqsəd yaradılarkən xəta baş verdi:', err);
      setError('Məqsəd yaradılarkən xəta baş verdi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateGoalAmount = async (goalId, newAmount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentAmount: parseFloat(newAmount)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Məqsədləri yenidən yüklə
        await loadGoals();
      } else {
        throw new Error(data.message || 'Məqsəd yenilənmədi');
      }
    } catch (err) {
      console.error('Məqsəd yenilənmədi:', err);
      setError('Məqsəd yenilənmədi: ' + err.message);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!window.confirm('Bu məqsədi silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await loadGoals();
      } else {
        throw new Error(data.message || 'Məqsəd silinmədi');
      }
    } catch (err) {
      console.error('Məqsəd silinmədi:', err);
      setError('Məqsəd silinmədi: ' + err.message);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      setError('Bütün sahələri doldurun');
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      setError('Hədəf məbləği 0-dan böyük olmalıdır');
      return;
    }

    await createGoal(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('az-AZ');
  };

  const calculatePercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  useEffect(() => {
    if (checkAuth()) {
      loadGoals();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Məqsədlər yüklənir...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Başlıq */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maliyyə Məqsədlərim</h1>
        <p className="text-gray-600">Pul yığım məqsədlərinizi müəyyən edin və irəliləyişinizi izləyin</p>
      </div>

      {/* Xəta mesajı */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Yeni məqsəd əlavə etmə formu */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Yeni Məqsəd Əlavə Et</h2>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Məqsəd adı *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Məsələn: Yeni avtomobil"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hədəf məbləği (₼) *
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son tarix *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {submitting ? 'Əlavə edilir...' : 'Məqsəd Əlavə Et'}
            </button>
          </div>
        </div>
      </div>

      {/* Məqsədlər statistikası */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">Ümumi Məqsədlər</h3>
            <p className="text-2xl font-bold text-blue-600">{goals.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800">Tamamlanan</h3>
            <p className="text-2xl font-bold text-green-600">
              {goals.filter(goal => calculatePercentage(goal.currentAmount, goal.targetAmount) >= 100).length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800">Davam edən</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {goals.filter(goal => calculatePercentage(goal.currentAmount, goal.targetAmount) < 100).length}
            </p>
          </div>
        </div>
      )}

      {/* Məqsədlər siyahısı */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Məqsədləriniz</h2>
          <button
            onClick={loadGoals}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yenilə
          </button>
        </div>
        
        {goals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-lg mb-2">📊</div>
            <p className="text-gray-600">Hələ heç bir məqsədınız yoxdur</p>
            <p className="text-gray-500 text-sm">Yuxarıdakı formdan yeni məqsəd əlavə edin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
              const deadlinePassed = isDeadlinePassed(goal.deadline);
              
              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Məqsədi sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          percentage >= 100 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : deadlinePassed 
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-blue-500 to-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    {/* Məbləğ məlumatı */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>İrəliləyiş: {percentage.toFixed(1)}%</span>
                    </div>
                    
                    <div className="text-lg font-medium text-gray-800">
                      {(goal.currentAmount || 0).toFixed(2)} / {goal.targetAmount.toFixed(2)} ₼
                    </div>
                    
                    <div className={`text-sm mt-2 ${deadlinePassed ? 'text-red-600' : 'text-gray-500'}`}>
                      Son tarix: {formatDate(goal.deadline)}
                      {deadlinePassed && <span className="ml-1">(Keçmişdə)</span>}
                    </div>
                  </div>
                  
                  {/* Status badge və əməliyyatlar */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      percentage >= 100 
                        ? 'bg-green-100 text-green-800' 
                        : percentage >= 50 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : deadlinePassed
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {percentage >= 100 ? 'Tamamlandı' : 
                       deadlinePassed ? 'Müddət bitib' :
                       percentage >= 50 ? 'Yaxşı irəliləyiş' : 'Başlanğıc mərhələ'}
                    </span>
                    
                    {percentage < 100 && (
                      <input
                        type="number"
                        placeholder="Məbləğ əlavə et"
                        min="0"
                        step="0.01"
                        className="text-xs px-2 py-1 border rounded w-24"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = e.target.value;
                            if (value && parseFloat(value) > 0) {
                              const newAmount = (goal.currentAmount || 0) + parseFloat(value);
                              updateGoalAmount(goal.id, newAmount);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;