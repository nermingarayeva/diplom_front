class Auth {
    constructor() {
        this.api = new API();
    }

    // Qeydiyyat
    async register(userData) {
        try {
            const response = await this.api.post('/auth/register', userData);
            
            if (response.success) {
                this.api.setToken(response.data.token);
                this.showMessage('Uğurla qeydiyyatdan keçdiniz!', 'success');
                window.location.href = 'pages/dashboard.html';
            } else {
                this.showMessage(response.message, 'error');
            }
            
            return response;
        } catch (error) {
            this.showMessage('Qeydiyyat zamanı xəta baş verdi', 'error');
            throw error;
        }
    }

    // Giriş
    async login(credentials) {
        try {
            const response = await this.api.post('/auth/login', credentials);
            
            if (response.success) {
                this.api.setToken(response.data.token);
                this.showMessage('Uğurla daxil oldunuz!', 'success');
                window.location.href = 'pages/dashboard.html';
            } else {
                this.showMessage(response.message, 'error');
            }
            
            return response;
        } catch (error) {
            this.showMessage('Giriş zamanı xəta baş verdi', 'error');
            throw error;
        }
    }

    // Çıxış
    logout() {
        this.api.clearToken();
        this.showMessage('Uğurla çıxış etdiniz', 'success');
        window.location.href = '../index.html';
    }

    // İstifadəçinin daxil olub-olmadığını yoxlayır
    isAuthenticated() {
        return !!this.api.token;
    }

    // Mesaj göstərir
    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3001);
        }
    }
}
export default Auth