class Accounts {
    constructor() {
        this.api = new API();
        this.auth = new Auth();
        this.checkAuth();
        this.initializeAccounts();
    }

    checkAuth() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = '../pages/login.html';
        }
    }

    async initializeAccounts() {
        await this.loadAccounts();
        this.setupEventListeners();
    }

    async loadAccounts() {
        try {
            const response = await this.api.get('/accounts');
            if (response.success) {
                this.displayAccounts(response.data);
            }
        } catch (error) {
            console.error('Hesablar yüklənmədi:', error);
        }
    }

    displayAccounts(accounts) {
        const accountsList = document.getElementById('accountsList');
        accountsList.innerHTML = '';
        
        accounts.forEach(account => {
            const accountItem = `
                <div class="account-item" data-id="${account._id}">
                    <div class="account-info">
                        <h3>${account.name}</h3>
                        <p class="account-type">${account.type}</p>
                        <p class="account-balance">${account.balance.toFixed(2)} ₼</p>
                    </div>
                    <div class="account-actions">
                        <button onclick="accounts.editAccount('${account._id}')" class="btn-edit">Redaktə et</button>
                        <button onclick="accounts.deleteAccount('${account._id}')" class="btn-delete">Sil</button>
                    </div>
                </div>
            `;
            accountsList.innerHTML += accountItem;
        });
    }

    async createAccount(accountData) {
        try {
            const response = await this.api.post('/accounts', accountData);
            if (response.success) {
                this.showMessage('Hesab uğurla yaradıldı!', 'success');
                await this.loadAccounts();
                this.clearForm();
            } else {
                this.showMessage(response.message, 'error');
            }
        } catch (error) {
            this.showMessage('Hesab yaradılarkən xəta baş verdi', 'error');
        }
    }

    async editAccount(accountId) {
        // Redaktə funksiyası
        console.log('Hesab redaktə edilir:', accountId);
    }

    async deleteAccount(accountId) {
        if (confirm('Bu hesabı silmək istədiyinizdən əminsiniz?')) {
            try {
                const response = await this.api.delete(`/accounts/${accountId}`);
                if (response.success) {
                    this.showMessage('Hesab uğurla silindi!', 'success');
                    await this.loadAccounts();
                } else {
                    this.showMessage(response.message, 'error');
                }
            } catch (error) {
                this.showMessage('Hesab silinərkən xəta baş verdi', 'error');
            }
        }
    }

    setupEventListeners() {
        const accountForm = document.getElementById('accountForm');
        if (accountForm) {
            accountForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(accountForm);
                const accountData = {
                    name: formData.get('name'),
                    type: formData.get('type'),
                    balance: parseFloat(formData.get('balance'))
                };
                
                await this.createAccount(accountData);
            });
        }
    }

    clearForm() {
        const accountForm = document.getElementById('accountForm');
        if (accountForm) {
            accountForm.reset();
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
