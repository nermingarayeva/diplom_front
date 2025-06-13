class Dashboard {
    constructor() {
        this.api = new API();
        this.auth = new Auth();
        this.checkAuth();
        this.initializeDashboard();
    }

    // Autentifikasiyanı yoxlayır
    checkAuth() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = '../pages/login.html';
        }
    }

    // Dashboard-u başladır
    async initializeDashboard() {
        await this.loadUserInfo();
        await this.loadDashboardData();
        this.setupEventListeners();
    }

    // İstifadəçi məlumatlarını yükləyir
    async loadUserInfo() {
        try {
            const response = await this.api.get('/users/me');
            if (response.success) {
                document.getElementById('userName').textContent = response.data.name;
                document.getElementById('userEmail').textContent = response.data.email;
            }
        } catch (error) {
            console.error('İstifadəçi məlumatları yüklənmədi:', error);
        }
    }

    // Dashboard məlumatlarını yükləyir
    async loadDashboardData() {
        try {
            // Hesabları yüklə
            const accountsResponse = await this.api.get('/accounts');
            if (accountsResponse.success) {
                this.displayAccounts(accountsResponse.data);
            }

            // Son tranzaksiyaları yüklə
            const transactionsResponse = await this.api.get('/transactions?limit=5');
            if (transactionsResponse.success) {
                this.displayRecentTransactions(transactionsResponse.data);
            }

            // Büdcələri yüklə
            const budgetsResponse = await this.api.get('/budgets');
            if (budgetsResponse.success) {
                this.displayBudgets(budgetsResponse.data);
            }

            // Məqsədləri yüklə
            const goalsResponse = await this.api.get('/goals');
            if (goalsResponse.success) {
                this.displayGoals(goalsResponse.data);
            }

        } catch (error) {
            console.error('Dashboard məlumatları yüklənmədi:', error);
        }
    }

    // Hesabları göstərir
    displayAccounts(accounts) {
        const accountsContainer = document.getElementById('accountsContainer');
        let totalBalance = 0;
        
        accountsContainer.innerHTML = '';
        
        accounts.forEach(account => {
            totalBalance += account.balance;
            const accountCard = `
                <div class="account-card">
                    <h3>${account.name}</h3>
                    <p class="balance">${account.balance.toFixed(2)} ₼</p>
                    <p class="account-type">${account.type}</p>
                </div>
            `;
            accountsContainer.innerHTML += accountCard;
        });
        
        document.getElementById('totalBalance').textContent = `${totalBalance.toFixed(2)} ₼`;
    }

    // Son tranzaksiyaları göstərir
    displayRecentTransactions(transactions) {
        const transactionsContainer = document.getElementById('recentTransactions');
        transactionsContainer.innerHTML = '';
        
        transactions.forEach(transaction => {
            const transactionItem = `
                <div class="transaction-item ${transaction.type}">
                    <div class="transaction-info">
                        <h4>${transaction.description}</h4>
                        <p>${new Date(transaction.date).toLocaleDateString('az-AZ')}</p>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} ₼
                    </div>
                </div>
            `;
            transactionsContainer.innerHTML += transactionItem;
        });
    }

    // Büdcələri göstərir
    displayBudgets(budgets) {
        const budgetsContainer = document.getElementById('budgetsContainer');
        budgetsContainer.innerHTML = '';
        
        budgets.forEach(budget => {
            const spent = budget.spent || 0;
            const percentage = (spent / budget.amount) * 100;
            
            const budgetCard = `
                <div class="budget-card">
                    <h4>${budget.category}</h4>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p>${spent.toFixed(2)} / ${budget.amount.toFixed(2)} ₼</p>
                    </div>
                </div>
            `;
            budgetsContainer.innerHTML += budgetCard;
        });
    }

    // Məqsədləri göstərir
    displayGoals(goals) {
        const goalsContainer = document.getElementById('goalsContainer');
        goalsContainer.innerHTML = '';
        
        goals.forEach(goal => {
            const currentAmount = goal.currentAmount || 0;
            const percentage = (currentAmount / goal.targetAmount) * 100;
            
            const goalCard = `
                <div class="goal-card">
                    <h4>${goal.title}</h4>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p>${currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)} ₼</p>
                    </div>
                    <p class="goal-deadline">Tarix: ${new Date(goal.deadline).toLocaleDateString('az-AZ')}</p>
                </div>
            `;
            goalsContainer.innerHTML += goalCard;
        });
    }

    // Event listener-ləri qurur
    setupEventListeners() {
        // Çıxış düyməsi
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.auth.logout();
            });
        }

        // Yeniləmə düyməsi
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadDashboardData();
            });
        }
    }
}
export default Dashboard