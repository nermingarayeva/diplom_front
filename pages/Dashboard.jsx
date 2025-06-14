import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAccounts, addAccount, removeAccount } from './store/accountSlice';
import { setTransactions, addTransaction, removeTransaction } from './store/transactionSlice';
import { setBudgets, addBudget, removeBudget } from './store/budgetSlice';
import { setGoals, addGoal, removeGoal } from './store/goalSlice';
import { setUser, clearUser } from './store/userSlice';
import { Plus, Trash2, Edit3, DollarSign, Target, CreditCard, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector(state => state.accounts);
  const { transactions } = useSelector(state => state.transactions);
  const { budgets } = useSelector(state => state.budgets);
  const { goals } = useSelector(state => state.goals);
  const { data: user } = useSelector(state => state.user);

  const [activeTab, setActiveTab] = useState('dashboard');

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Maliyyə İdarəçisi</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Xoş gəldiniz, {user?.name || 'İstifadəçi'}</span>
              <button 
                onClick={() => dispatch(clearUser())}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'accounts', name: 'Hesablar', icon: CreditCard },
              { id: 'transactions', name: 'Tranzaksiyalar', icon: DollarSign },
              { id: 'budgets', name: 'Büdcələr', icon: Target },
              { id: 'goals', name: 'Məqsədlər', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'accounts' && <AccountsTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'budgets' && <BudgetsTab />}
        {activeTab === 'goals' && <GoalsTab />}
      </main>
    </div>
  );
};

