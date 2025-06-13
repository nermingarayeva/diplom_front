class Utils {
    // Tarixi formatlaşdırır
    static formatDate(date) {
        return new Date(date).toLocaleDateString('az-AZ');
    }

    // Məbləği formatlaşdırır
    static formatAmount(amount) {
        return `${amount.toFixed(2)} ₼`;
    }

    // Loading göstərir
    static showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading">Yüklənir...</div>';
        }
    }

    // Loading-i gizlədir
    static hideLoading(element) {
        if (element) {
            const loading = element.querySelector('.loading');
            if (loading) {
                loading.remove();
            }
        }
    }

    // Form validasiyası
    static validateForm(formData) {
        const errors = [];
        
        // Tələb olunan sahələri yoxla
        for (let [key, value] of formData.entries()) {
            if (!value.trim()) {
                errors.push(`${key} sahəsi tələb olunur`);
            }
        }
        
        return errors;
    }

    // Rəng generatoru
    static generateColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
}

// Global dəyişənlər
let auth, dashboard, accounts, transactions;

// Səhifə yükləndikdə
document.addEventListener('DOMContentLoaded', function() {
    // Hansı səhifədə olduğumuzu yoxlayırıq
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard')) {
        dashboard = new Dashboard();
    } else if (currentPage.includes('accounts')) {
        accounts = new Accounts();
    } else if (currentPage.includes('transactions')) {
        transactions = new Transactions();
    } else if (currentPage.includes('login') || currentPage.includes('register')) {
        auth = new Auth();
    }
});