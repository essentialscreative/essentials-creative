// Essentials Creative Email Collection System
// Manages newsletter signups and contact collection

class EmailCollector {
    constructor() {
        this.contacts = this.loadContacts();
        this.segments = {
            newsletter: [],
            artists: [],
            collectors: [],
            press: [],
            general: []
        };
        this.init();
    }
    
    init() {
        // Enhance all newsletter forms
        this.enhanceForms();
        
        // Create admin panel (hidden by default)
        this.createAdminPanel();
        
        // Track form analytics
        this.trackFormViews();
    }
    
    enhanceForms() {
        // Find all newsletter forms
        const forms = document.querySelectorAll('form[action*="formspree"]');
        
        forms.forEach(form => {
            // Add segment selection (hidden for now)
            const segmentField = document.createElement('input');
            segmentField.type = 'hidden';
            segmentField.name = 'segment';
            segmentField.value = 'newsletter';
            form.appendChild(segmentField);
            
            // Enhance form submission
            form.addEventListener('submit', (e) => {
                const email = form.querySelector('input[type="email"]').value;
                const segment = segmentField.value;
                
                // Store locally (for admin use)
                this.addContact(email, segment);
                
                // Track submission
                this.trackSubmission(email, segment);
                
                // Show success message
                this.showSuccessMessage(form);
            });
        });
    }
    
    addContact(email, segment = 'newsletter') {
        const contact = {
            email: email,
            segment: segment,
            date: new Date().toISOString(),
            source: window.location.pathname,
            language: localStorage.getItem('language') || 'en'
        };
        
        this.contacts.push(contact);
        this.saveContacts();
        
        // Add to segment
        if (!this.segments[segment].includes(email)) {
            this.segments[segment].push(email);
        }
    }
    
    loadContacts() {
        const stored = localStorage.getItem('ec_contacts');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveContacts() {
        localStorage.setItem('ec_contacts', JSON.stringify(this.contacts));
    }
    
    exportContacts(format = 'csv') {
        if (format === 'csv') {
            const csv = this.convertToCSV(this.contacts);
            this.downloadFile(csv, 'contacts.csv', 'text/csv');
        } else if (format === 'json') {
            const json = JSON.stringify(this.contacts, null, 2);
            this.downloadFile(json, 'contacts.json', 'application/json');
        }
    }
    
    convertToCSV(data) {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => 
            headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }
    
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
    
    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'form-success-message';
        message.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Successfully subscribed!</span>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .form-success-message {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background: #4caf50;
                color: white;
                border-radius: 8px;
                margin-top: 16px;
                animation: slideInUp 0.3s ease;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        if (!document.querySelector('style[data-email-collector]')) {
            style.setAttribute('data-email-collector', 'true');
            document.head.appendChild(style);
        }
        
        form.appendChild(message);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    createAdminPanel() {
        // Create hidden admin panel (activated with keyboard shortcut)
        const panel = document.createElement('div');
        panel.className = 'email-admin-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="admin-panel-content">
                <h3>Email Collection Admin</h3>
                <div class="stats">
                    <div class="stat">
                        <span class="stat-label">Total Contacts:</span>
                        <span class="stat-value">${this.contacts.length}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Newsletter:</span>
                        <span class="stat-value">${this.segments.newsletter.length}</span>
                    </div>
                </div>
                <div class="actions">
                    <button onclick="window.emailCollector.exportContacts('csv')">Export CSV</button>
                    <button onclick="window.emailCollector.exportContacts('json')">Export JSON</button>
                    <button onclick="window.emailCollector.viewSegments()">View Segments</button>
                </div>
                <button class="close-panel" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .email-admin-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 10000;
                min-width: 400px;
            }
            
            .admin-panel-content h3 {
                margin: 0 0 20px;
                font-size: 20px;
                color: #1a1a1a;
            }
            
            .stats {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-bottom: 20px;
            }
            
            .stat {
                padding: 12px;
                background: #f8f8f8;
                border-radius: 8px;
            }
            
            .stat-label {
                display: block;
                font-size: 12px;
                color: #666;
                margin-bottom: 4px;
            }
            
            .stat-value {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #1a1a1a;
            }
            
            .actions {
                display: flex;
                gap: 8px;
            }
            
            .actions button {
                flex: 1;
                padding: 10px;
                background: #1a1a1a;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .close-panel {
                position: absolute;
                top: 12px;
                right: 12px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(panel);
        
        // Keyboard shortcut to open panel (Ctrl+Shift+E)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                this.updateStats();
            }
        });
    }
    
    updateStats() {
        const panel = document.querySelector('.email-admin-panel');
        if (panel) {
            panel.querySelector('.stats').innerHTML = `
                <div class="stat">
                    <span class="stat-label">Total Contacts:</span>
                    <span class="stat-value">${this.contacts.length}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Newsletter:</span>
                    <span class="stat-value">${this.segments.newsletter.length}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">This Week:</span>
                    <span class="stat-value">${this.getWeeklyCount()}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">This Month:</span>
                    <span class="stat-value">${this.getMonthlyCount()}</span>
                </div>
            `;
        }
    }
    
    getWeeklyCount() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return this.contacts.filter(c => new Date(c.date) > weekAgo).length;
    }
    
    getMonthlyCount() {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return this.contacts.filter(c => new Date(c.date) > monthAgo).length;
    }
    
    viewSegments() {
        console.log('Email Segments:', this.segments);
        alert(`Segments:\n\nNewsletter: ${this.segments.newsletter.length}\nArtists: ${this.segments.artists.length}\nCollectors: ${this.segments.collectors.length}\nPress: ${this.segments.press.length}`);
    }
    
    trackFormViews() {
        // Track when forms come into view
        const forms = document.querySelectorAll('form[action*="formspree"]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Newsletter form viewed');
                        // Could send to analytics here
                    }
                });
            });
            
            forms.forEach(form => observer.observe(form));
        }
    }
    
    trackSubmission(email, segment) {
        console.log(`Email submitted: ${email} (${segment})`);
        // Could send to analytics here
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.emailCollector = new EmailCollector();
    });
} else {
    window.emailCollector = new EmailCollector();
}