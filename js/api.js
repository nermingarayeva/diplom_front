class API {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = localStorage.getItem('token');
    }

    // Headers yaradır
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Token-i yeniləyir
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Token-i təmizləyir
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // GET sorğusu
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('GET xətası:', error);
            throw error;
        }
    }

    // POST sorğusu
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('POST xətası:', error);
            throw error;
        }
    }

    // PUT sorğusu
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('PUT xətası:', error);
            throw error;
        }
    }

    // DELETE sorğusu
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('DELETE xətası:', error);
            throw error;
        }
    }
}
export default API