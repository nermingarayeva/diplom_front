import React, { useState, useEffect } from 'react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    type: 'expense',
    category: 'food',
    accountId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadDemoData = () => {
    const demoAccounts = [
      { _id: '1', name: 'Əsas hesab', balance: 1500 },
      { _id: '2', name: 'Yığım hesabı', balance: 3200 },
      { _id: '3', name: 'İş hesabı', balance: 850 }
    ];

    const demoTransactions = [
      {
        _id: '1',
        description: 'Market alış-verişi',
        amount: 45.50,
        type: 'expense',
        category: 'food',
        accountId: '1',
        date: '2025-06-10T00:00:00Z'
      },
      {
        _id: '2',
        description: 'Maaş',
        amount: 2500.00,
        type: 'income',
        category: 'salary',
        accountId: '3',
        date: '2025-06-01T00:00:00Z'
      },
      {
        _id: '3',
        description: 'Metro kartı',
        amount: 15.00,
        type: 'expense',
        category: 'transport',
        accountId: '1',
        date: '2025-06-12T00:00:00Z'
      },
      {
        _id: '4',
        description: 'Kino bileti',
        amount: 8.00,
        type: 'expense',
        category: 'entertainment',
        accountId: '2',
        date: '2025-06-13T00:00:00Z'
      }
    ];

    setAccounts(demoAccounts);
    setTransactions(demoTransactions);
    setLoading(false);
  };

  useEffect(() => {
    loadDemoData();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.accountId) {
      showMessage('Bütün məcburi sahələri doldurun', 'error');
      return;
    }

    const newTransaction = {
      _id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    setFormData({
      description: '',
      amount: 0,
      type: 'expense',
      category: 'food',
      accountId: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    setShowForm(false);
    showMessage('Tranzaksiya uğurla əlavə edildi!', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu tranzaksiyanı silmək istədiyinizdən əminsiniz?')) {
      setTransactions(prev => prev.filter(tx => tx._id !== id));
      showMessage('Tranzaksiya uğurla silindi!', 'success');
    }
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}${amount.toFixed(2)} ₼`;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      food: 'Yemək',
      transport: 'Nəqliyyat',
      entertainment: 'Əyləncə',
      health: 'Sağlamlıq',
      salary: 'Maaş',
      other: 'Digər'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Mesaj göstərmə */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Başlıq və əlavə et düyməsi */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Tranzaksiyalar</h2>
          <p className="text-gray-600 mt-1">Gəlir və xərclərinizi idarə edin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center transition-colors duration-200 font-medium"
        >
          Yeni Tranzaksiya
        </button>
      </div>

      {/* Statistika kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Ümumi Gəlir</h3>
          <p className="text-2xl font-bold text-green-600">
            +{transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)} ₼
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Ümumi Xərc</h3>
          <p className="text-2xl font-bold text-red-600">
            -{transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)} ₼
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Balans</h3>
          <p className="text-2xl font-bold text-blue-600">
            {(transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0) - 
              transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)).toFixed(2)} ₼
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Yeni Tranzaksiya</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tranzaksiya təsvirini daxil edin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Məbləğ (₼) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Növ</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Xərc</option>
                  <option value="income">Gəlir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="food">Yemək</option>
                  <option value="transport">Nəqliyyat</option>
                  <option value="entertainment">Əyləncə</option>
                  <option value="health">Sağlamlıq</option>
                  <option value="salary">Maaş</option>
                  <option value="other">Digər</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hesab *</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Hesab seçin</option>
                  {accounts.map(account => (
                    <option key={account._id} value={account._id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarix</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
              >
                Yadda saxla
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Ləğv et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tranzaksiyalar cədvəli */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Son Tranzaksiyalar</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <p className="text-gray-600 text-lg">Hələ tranzaksiya yoxdur</p>
            <p className="text-gray-500">Yuxarıdakı düyməni basaraq yeni tranzaksiya əlavə edin</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Təsvir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Məbləğ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kateqoriya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesab</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(tx => {
                  const account = accounts.find(acc => acc._id === tx.accountId);
                  return (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {tx.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatAmount(tx.amount, tx.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {getCategoryLabel(tx.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account ? account.name : 'Bilinməyən hesab'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(tx.date).toLocaleDateString('az-AZ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          title="Sil"
                        >
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;