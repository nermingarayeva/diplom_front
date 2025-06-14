const DashboardContent = () => {
    const { accounts } = useSelector(state => state.accounts);
    const { transactions } = useSelector(state => state.transactions);
    const { budgets } = useSelector(state => state.budgets);
    const { goals } = useSelector(state => state.goals);
  
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const recentTransactions = transactions.slice(-5).reverse();
  
    return (
      <div className="space-y-6">
        {/* Statistik kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Toplam Balans</h3>
            <p className="text-2xl font-bold text-green-600">{totalBalance.toFixed(2)} ₼</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Hesablar</h3>
            <p className="text-2xl font-bold text-blue-600">{accounts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Bu ay tranzaksiyalar</h3>
            <p className="text-2xl font-bold text-purple-600">{transactions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Aktiv məqsədlər</h3>
            <p className="text-2xl font-bold text-orange-600">{goals.length}</p>
          </div>
        </div>
  
        {/* Son tranzaksiyalar */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Son Tranzaksiyalar</h2>
          </div>
          <div className="p-6">
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map(tx => (
                  <div key={tx._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('az-AZ')}</p>
                    </div>
                    <div className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2)} ₼
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Hələ tranzaksiya yoxdur</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  