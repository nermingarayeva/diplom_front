class Transactions {
    constructor() {
        this.api = new API();
        this.auth = new Auth();
        this.checkAuth();
        this.initializeTransactions();
    }

    checkAuth() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = '../pages/login.html';
        }
    }

    async initializeTransactions() {
        await this.loadTransactions();
        await this.loadAccounts();
        this.setupEventListeners();
    }

    async loadTransactions() {
        try {
            const response = await this.api.get('/transactions');
            if (response.success) {
                this.displayTransactions(response.data);
            }
        } catch (error) {
            console.error('Tranzaksiyalar yüklənmədi:', error);
        }
    }

    async loadAccounts() {
        try {
            const response = await this.api.get('/accounts');
            if (response.success) {
                this.populateAccountSelect(response.data);
            }
        } catch (error) {
            console.error('Hesablar yüklənmədi:', error);
        }
    }

    populateAccountSelect(accounts) {
        const accountSelect = document.getElementById('accountId');
        if (accountSelect) {
            accountSelect.innerHTML = '<option value="">Hesab seçin</option>';
            accounts.forEach(account => {
                accountSelect.innerHTML += `<option value="${account._id}">${account.name}</option>`;
            });
        }
    }

    displayTransactions(transactions) {
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '';
        
        transactions.forEach(transaction => {
            const transactionItem = `
                <div class="transaction-item ${transaction.type}" data-id="${transaction._id}">
                    <div class="transaction-info">
                        <h4>${transaction.description}</h4>
                        <p class="transaction-category">${transaction.category}</p>
                        <p class="transaction-date">${new Date(transaction.date).toLocaleDateString('az-AZ')}</p>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} ₼
                    </div>
                    <div class="transaction-actions">
                        <button onclick="transactions.editTransaction('${transaction._id}')" class="btn-edit">Redaktə et</button>
                        <button onclick="transactions.deleteTransaction('${transaction._id}')" class="btn-delete">Sil</button>
                    </div>
                </div>
            `;
            transactionsList.innerHTML += transactionItem;
        });
    }

    async createTransaction(transactionData) {
        try {
            const response = await this.api.post('/transactions', transactionData);
            if (response.success) {
                this.showMessage('Tranzaksiya uğurla yaradıldı!', 'success');
                await this.loadTransactions();
                this.clearForm();
            } else {
                this.showMessage(response.message, 'error');
            }
        } catch (error) {
            this.showMessage('Tranzaksiya yaradılarkən xəta baş verdi', 'error');
        }
    }

    async editTransaction(transactionId) {
        console.log('Tranzaksiya redaktə edilir:', transactionId);
    }

    async deleteTransaction(transactionId) {
        if (confirm('Bu tranzaksiyanı silmək istədiyinizdən əminsiniz?')) {
            try {
                const response = await this.api.delete(`/transactions/${transactionId}`);
                if (response.success) {
                    this.showMessage('Tranzaksiya uğurla silindi!', 'success');
                    await this.loadTransactions();
                } else {
                    this.showMessage(response.message, 'error');
                }
            } catch (error) {
                this.showMessage('Tranzaksiya silinərkən xəta baş verdi', 'error');
            }
        }
    }

    setupEventListeners() {
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(transactionForm);
                const transactionData = {
                    description: formData.get('description'),
                    amount: parseFloat(formData.get('amount')),
                    type: formData.get('type'),
                    category: formData.get('category'),
                    accountId: formData.get('accountId'),
                    date: formData.get('date')
                };
                
                await this.createTransaction(transactionData);
            });
        }
    }

    clearForm() {
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.reset();
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
}
export default Transactions