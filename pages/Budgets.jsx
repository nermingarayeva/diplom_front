import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Budgets = () => {
    const dispatch = useDispatch();
    const { budgets } = useSelector(state => state.budgets);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      amount: 0,
      category: 'food',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const newBudget = {
        _id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        spent: 0
      };
      dispatch(addBudget(newBudget));
      setFormData({
        name: '',
        amount: 0,
        category: 'food',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
      setShowForm(false);
    };
  
    const handleDelete = (id) => {
      if (window.confirm('Bu büdcəni silmək istədiyinizdən əminsiniz?')) {
        dispatch(removeBudget(id));
      }
    };
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Büdcələr</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            Yeni Büdcə
          </button>
        </div>
  
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Məbləğ</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kateqoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border"
                  >
                    <option value="food">Yemək</option>
                    <option value="transport">Nəqliyyat</option>
                    <option value="entertainment">Əyləncə</option>
                    <option value="health">Sağlamlıq</option>
                    <option value="other">Digər</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Başlama tarixi</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bitmə tarixi</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Yadda saxla
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Ləğv et
                </button>
              </div>
            </form>
          </div>
        )}
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => {
            const percentage = (budget.spent / budget.amount) * 100;
            return (
              <div key={budget._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{budget.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{budget.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                  </button>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Xərclənib</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {budget.spent.toFixed(2)} / {budget.amount.toFixed(2)} ₼
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default Budgets