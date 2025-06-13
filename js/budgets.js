import API from '../js/api.js';
import Auth from '../js/auth.js';

export default class Budgets {
    constructor() {
        this.api = new API();
        this.auth = new Auth();
        this.checkAuth();
        this.initializeBudgets();
    }

    checkAuth() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = '../pages/login.html';
        }
    }

    async initializeBudgets() {
        await this.loadBudgets();
        this.setupEventListeners();
    }

    async loadBudgets() {
        try {
            const response = await this.api.get('/budgets');
            if (response.success) {
                this.displayBudgets(response.data);
            }
        } catch (error) {
            console.error('Büdcələr yüklənmədi:', error);
        }
    }

    displayBudgets(budgets) {
        const container = document.getElementById('budgetsList');
        if (!container) return;

        container.innerHTML = '';
        budgets.forEach(budget => {
            const spent = budget.spent || 0;
            const percentage = (spent / budget.amount) * 100;

            const item = `
                <div class="budget-item">
                    <h4>${budget.category}</h4>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p>${spent.toFixed(2)} / ${budget.amount.toFixed(2)} ₼</p>
                    </div>
                </div>
            `;
            container.innerHTML += item;
        });
    }

    setupEventListeners() {
        const form = document.getElementById('budgetForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const budgetData = {
                    category: formData.get('category'),
                    amount: parseFloat(formData.get('amount'))
                };
                await this.createBudget(budgetData);
            });
        }
    }

    async createBudget(data) {
        try {
            const response = await this.api.post('/budgets', data);
            if (response.success) {
                this.loadBudgets();
                document.getElementById('budgetForm').reset();
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Büdcə yaradılarkən xəta baş verdi:', error);
        }
    }
}
