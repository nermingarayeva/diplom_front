import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, Trash2, CreditCard, Banknote, Wallet, TrendingUp, 
  LogIn, Eye, Edit, Lock, User 
} from "lucide-react";
import { 
  getAccountsThunk, 
  postAccountThunk, 
  deleteAccountThunk,
  updateAccountThunk,
  loginThunk,
  clearError,
  logout,
  setAuthFromStorage
} from "../redux/reducers/accountSlice";
import "../css/Accounts.css"
const Accounts = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error, isAuthenticated, user } = useSelector(state => state.accounts);
  
  const [showForm, setShowForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editMode, setEditMode] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'checking', 
    balance: 0,
    currency: 'AZN',
    bankName: '',
    accountNumber: '',
    creditLimit: 0,
    color: '#3B82F6'
  });

  useEffect(() => {
    dispatch(setAuthFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAccountsThunk());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      showMessage(`Xəta: ${error}`, 'error');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      showMessage('Email və parol daxil edin', 'error');
      return;
    }
  
    try {
      await dispatch(loginThunk(loginData)).unwrap();
      localStorage.setItem('isAuthenticated', 'true'); // ✅ YENİ SƏTİR
  
      setLoginData({ email: '', password: '' });
      setShowLoginForm(false);
      showMessage('Uğurla daxil oldunuz!', 'success');
    } catch (error) {
      showMessage(`Giriş xətası: ${error}`, 'error');
    }
  };
  

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('isAuthenticated'); 
    showMessage('Sistemdən çıxdınız', 'success');
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showMessage('Hesab adı daxil edin', 'error');
      return;
    }

    const accountData = {
      ...formData,
      name: formData.name.trim(),
      balance: parseFloat(formData.balance) || 0,
      creditLimit: formData.type === 'credit' ? parseFloat(formData.creditLimit) || 0 : 0,
      isActive: true
    };

    try {
      if (editMode && selectedAccount) {
        await dispatch(updateAccountThunk({ id: selectedAccount.id, ...accountData })).unwrap();
        showMessage('Hesab uğurla yeniləndi!', 'success');
        setEditMode(false);
        setSelectedAccount(null);
      } else {
        await dispatch(postAccountThunk(accountData)).unwrap();
        showMessage('Hesab uğurla əlavə edildi!', 'success');
      }
      
      setFormData({ 
        name: '', 
        type: 'checking', 
        balance: 0,
        currency: 'AZN',
        bankName: '',
        accountNumber: '',
        creditLimit: 0,
        color: '#3B82F6'
      });
      setShowForm(false);
    } catch (error) {
      showMessage(`Hesab ${editMode ? 'yeniləmə' : 'yaratma'} xətası: ${error}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu hesabı silmək istədiyinizdən əminsiniz?')) {
      try {
        await dispatch(deleteAccountThunk(id)).unwrap();
        showMessage('Hesab uğurla silindi!', 'success');
      } catch (error) {
        showMessage('Hesab silmə xətası baş verdi', 'error');
      }
    }
  };

  const handleEdit = (account) => {
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      bankName: account.bankName || '',
      accountNumber: account.accountNumber || '',
      creditLimit: account.creditLimit || 0,
      color: account.color || '#3B82F6'
    });
    setSelectedAccount(account);
    setEditMode(true);
    setShowForm(true);
  };

  const handleAccountLogin = (account) => {
    setSelectedAccount(account);
    setShowAccountDetails(true);
    showMessage(`${account.name} hesabına giriş edildi`, 'success');
  };

  const closeAccountDetails = () => {
    setSelectedAccount(null);
    setShowAccountDetails(false);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      type: 'checking', 
      balance: 0,
      currency: 'AZN',
      bankName: '',
      accountNumber: '',
      creditLimit: 0,
      color: '#3B82F6'
    });
    setEditMode(false);
    setSelectedAccount(null);
    setShowForm(false);
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'credit':
        return <CreditCard className="w-6 h-6" />;
      case 'savings':
        return <TrendingUp className="w-6 h-6" />;
      case 'checking':
        return <Banknote className="w-6 h-6" />;
      case 'investment':
        return <Wallet className="w-6 h-6" />;
      default:
        return <Banknote className="w-6 h-6" />;
    }
  };

  const getAccountTypeLabel = (type) => {
    const types = {
      checking: 'Cari hesab',
      savings: 'Yığım hesabı',
      credit: 'Kredit kartı',
      investment: 'İnvestisiya'
    };
    return types[type] || type;
  };

  const getAvailableBalance = (account) => {
    if (account.type === 'credit') {
      return account.creditLimit + account.balance;
    }
    return account.balance;
  };

  const totalBalance = accounts
    .filter(acc => acc.type !== 'credit')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalCredit = accounts
    .filter(acc => acc.type === 'credit')
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  if (!isAuthenticated) {
    return (
      <div className="wrappper">
        <div className="wrappper2">
          <div>
            <div className="wrappper3">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Hesabınıza daxil olun
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Maliyyə hesablarınızı görmək üçün daxil olun
            </p>
          </div>

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

          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email ünvanı
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email ünvanınızı daxil edin"
                  />
                </div>
              </div>

              <div  className="mt-1">
                <label className="block text-sm font-medium text-gray-700">
                  Parol
                </label>
                <div>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Parolunuzu daxil edin"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Daxil ol
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* User info və logout */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {user?.name || user?.email || 'İstifadəçi'}
            </p>
            <p className="text-sm text-gray-500">Daxil olunub</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Çıxış
        </button>
      </div>

      {/* Hesab təfərrüatları modal */}
      {showAccountDetails && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Hesab Təfərrüatları</h3>
              <button
                onClick={closeAccountDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="p-3 rounded-lg text-white"
                  style={{ backgroundColor: selectedAccount.color }}
                >
                  {getAccountIcon(selectedAccount.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{selectedAccount.name}</h4>
                  <p className="text-gray-500">{getAccountTypeLabel(selectedAccount.type)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Balans:</span>
                  <span className={`font-semibold ${selectedAccount.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedAccount.balance.toFixed(2)} {selectedAccount.currency}
                  </span>
                </div>
                
                {selectedAccount.type === 'credit' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kredit Limiti:</span>
                      <span className="font-semibold">{selectedAccount.creditLimit.toFixed(2)} {selectedAccount.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mövcud Limit:</span>
                      <span className="font-semibold text-blue-600">
                        {getAvailableBalance(selectedAccount).toFixed(2)} {selectedAccount.currency}
                      </span>
                    </div>
                  </>
                )}
                
                {selectedAccount.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-semibold">{selectedAccount.bankName}</span>
                  </div>
                )}
                
                {selectedAccount.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hesab Nömrəsi:</span>
                    <span className="font-semibold">{selectedAccount.accountNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeAccountDetails}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Bağla
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedAccount);
                    closeAccountDetails();
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Redaktə et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Başlıq və əlavə et düyməsi */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hesablar</h2>
          <p className="text-gray-600 mt-1">Maliyyə hesablarınızı idarə edin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center transition-colors duration-200 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Hesab
        </button>
      </div>

      {/* Ümumi balans kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Ümumi Balans</h3>
          <p className="text-3xl font-bold">{totalBalance.toFixed(2)} ₼</p>
          <p className="text-green-100 text-sm mt-1">{accounts.filter(acc => acc.type !== 'credit').length} hesab</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Kredit Borcu</h3>
          <p className="text-3xl font-bold">{totalCredit.toFixed(2)} ₼</p>
          <p className="text-red-100 text-sm mt-1">{accounts.filter(acc => acc.type === 'credit').length} kredit kartı</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {editMode ? 'Hesabı Redaktə Et' : 'Yeni Hesab'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hesab Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hesab adını daxil edin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hesab Növü</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="checking">Cari hesab</option>
                  <option value="savings">Yığım hesabı</option>
                  <option value="credit">Kredit kartı</option>
                  <option value="investment">İnvestisiya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Balans (₼)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valyuta</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AZN">AZN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Adı</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bank adını daxil edin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hesab Nömrəsi</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hesab nömrəsini daxil edin"
                />
              </div>
              
              {formData.type === 'credit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kredit Limiti (₼)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rəng</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ləğv et
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                ) : (
                  editMode ? 'Yenilə' : 'Əlavə et'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hesab kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div 
              className="h-2"
              style={{ backgroundColor: account.color || '#3B82F6' }}
            ></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg text-white"
                    style={{ backgroundColor: account.color || '#3B82F6' }}
                  >
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{account.name}</h3>
                    <p className="text-sm text-gray-500">{getAccountTypeLabel(account.type)}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Redaktə et"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Balans:</span>
                  <span className={`font-bold text-lg ${account.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {account.balance.toFixed(2)} {account.currency}
                  </span>
                </div>
                
                {account.type === 'credit' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Mövcud limit:</span>
                    <span className="font-semibold text-blue-600">
                      {getAvailableBalance(account).toFixed(2)} {account.currency}
                    </span>
                  </div>
                )}
                
                {account.bankName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Bank:</span>
                    <span className="font-medium text-gray-800">{account.bankName}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleAccountLogin(account)}
                className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Təfərrüatları gör
              </button>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Wallet className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hesab tapılmadı</h3>
          <p className="text-gray-500 mb-4">İlk hesabınızı yaratmaq üçün "Yeni Hesab" düyməsini basın</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center mx-auto transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Hesab Yarat
          </button>
        </div>
      )}
    </div>
  );
};

export default Accounts;