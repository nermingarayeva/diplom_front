import API from '../js/api.js';
import Auth from '../js/auth.js';

export default class Goals {
    constructor() {
        this.api = new API();
        this.auth = new Auth();
        this.checkAuth();
        this.initializeGoals();
    }

    checkAuth() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = '../pages/login.html';
        }
    }

    async initializeGoals() {
        await this.loadGoals();
        this.setupEventListeners();
    }

    async loadGoals() {
        try {
            const response = await this.api.get('/goals');
            if (response.success) {
                this.displayGoals(response.data);
            }
        } catch (error) {
            console.error('Məqsədlər yüklənmədi:', error);
        }
    }

    displayGoals(goals) {
        const container = document.getElementById('goalsList');
        if (!container) return;

        container.innerHTML = '';
        goals.forEach(goal => {
            const currentAmount = goal.currentAmount || 0;
            const percentage = (currentAmount / goal.targetAmount) * 100;

            const item = `
                <div class="goal-item">
                    <h4>${goal.title}</h4>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p>${currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)} ₼</p>
                        <p class="goal-deadline">Son tarix: ${new Date(goal.deadline).toLocaleDateString('az-AZ')}</p>
                    </div>
                </div>
            `;
            container.innerHTML += item;
        });
    }

    setupEventListeners() {
        const form = document.getElementById('goalForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const goalData = {
                    title: formData.get('title'),
                    targetAmount: parseFloat(formData.get('targetAmount')),
                    deadline: formData.get('deadline')
                };
                await this.createGoal(goalData);
            });
        }
    }

    async createGoal(data) {
        try {
            const response = await this.api.post('/goals', data);
            if (response.success) {
                this.loadGoals();
                document.getElementById('goalForm').reset();
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Məqsəd yaradılarkən xəta baş verdi:', error);
        }
    }
}
