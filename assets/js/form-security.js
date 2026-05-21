/**
 * Enhanced Form Security & Validation - Essentials Creative
 * Comprehensive form protection with rate limiting, validation, and security features
 * Version 2.0
 */

(function() {
    'use strict';
    
    const FormSecurity = {
        config: {
            maxSubmissions: 3,
            cooldownPeriod: 300000, // 5 minutes
            maxFieldLength: 5000,
            blockedPatterns: [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi
            ],
            requiredHoneypotTime: 3000, // Minimum time before form can be submitted
            selectors: {
                forms: 'form[action*="formspree"], form[data-secure="true"]',
                emailFields: 'input[type="email"]',
                textAreas: 'textarea',
                submitButtons: 'button[type="submit"], input[type="submit"]'
            },
            classes: {
                error: 'form-error',
                success: 'form-success',
                loading: 'form-loading',
                disabled: 'form-disabled'
            },
            messages: {
                rateLimit: 'Please wait before submitting another form. Try again in a few minutes.',
                invalidEmail: 'Please enter a valid email address.',
                fieldTooLong: 'This field exceeds the maximum length allowed.',
                suspiciousContent: 'Your message contains content that appears to be spam. Please revise and try again.',
                networkError: 'Network error. Please check your connection and try again.',
                generalError: 'An error occurred. Please try again later.',
                success: 'Thank you! Your message has been sent successfully.'
            }
        },
        
        state: {
            submissions: new Map(),
            formStartTimes: new Map(),
            isInitialized: false
        },
        
        init() {
            if (this.state.isInitialized) return;
            
            this.createStyles();
            this.addHoneypots();
            this.bindEvents();
            this.initRateLimiting();
            this.addSecurityHeaders();
            this.state.isInitialized = true;
            
            console.log('[FormSecurity] Enhanced form security initialized');
        },
        
        createStyles() {
            if (document.getElementById('form-security-styles')) return;
            
            const styles = document.createElement('style');
            styles.id = 'form-security-styles';
            styles.textContent = `
                /* Form security styles */
                .honeypot {
                    position: absolute !important;
                    left: -9999px !important;
                    width: 1px !important;
                    height: 1px !important;
                    overflow: hidden !important;
                    clip: rect(0,0,0,0) !important;
                    white-space: nowrap !important;
                    border: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                .form-error {
                    display: block;
                    color: #dc2626;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    margin-bottom: 1rem;
                    padding: 0.75rem 1rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 6px;
                    font-weight: 500;
                }
                
                .form-success {
                    display: block;
                    color: #059669;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    margin-bottom: 1rem;
                    padding: 0.75rem 1rem;
                    background: #ecfdf5;
                    border: 1px solid #a7f3d0;
                    border-radius: 6px;
                    font-weight: 500;
                }
                
                .form-loading {
                    opacity: 0.7;
                    pointer-events: none;
                    position: relative;
                }
                
                .form-loading::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 20px;
                    height: 20px;
                    margin: -10px 0 0 -10px;
                    border: 2px solid #f0f0f0;
                    border-top: 2px solid #333;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                .form-disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
                
                .field-error {
                    border-color: #dc2626 !important;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
                }
                
                .field-success {
                    border-color: #059669 !important;
                    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
                }
                
                .character-counter {
                    font-size: 0.75rem;
                    color: #6b7280;
                    text-align: right;
                    margin-top: 0.25rem;
                }
                
                .character-counter.warning {
                    color: #d97706;
                }
                
                .character-counter.error {
                    color: #dc2626;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        },
        
        addHoneypots() {
            const forms = document.querySelectorAll(this.config.selectors.forms);
            
            forms.forEach(form => {
                // Skip if honeypot already exists
                if (form.querySelector('.honeypot')) return;
                
                // Create honeypot field
                const honeypot = document.createElement('input');
                honeypot.type = 'text';
                honeypot.name = 'website'; // Common spam bot target
                honeypot.className = 'honeypot';
                honeypot.tabIndex = -1;
                honeypot.autocomplete = 'off';
                honeypot.setAttribute('aria-hidden', 'true');
                
                // Insert honeypot near the beginning of the form
                const firstInput = form.querySelector('input, textarea');
                if (firstInput) {
                    form.insertBefore(honeypot, firstInput);
                } else {
                    form.appendChild(honeypot);
                }
                
                // Track form start time
                this.state.formStartTimes.set(form, Date.now());
            });
        },
        
        bindEvents() {
            // Form submission handler
            document.addEventListener('submit', (e) => {
                if (e.target.matches(this.config.selectors.forms)) {
                    this.handleFormSubmit(e);
                }
            });
            
            // Real-time email validation
            document.addEventListener('blur', (e) => {
                if (e.target.matches(this.config.selectors.emailFields)) {
                    this.validateEmail(e.target);
                }
            });
            
            // Character counting for text areas
            document.addEventListener('input', (e) => {
                if (e.target.matches(this.config.selectors.textAreas)) {
                    this.updateCharacterCounter(e.target);
                }
            });
            
            // Content validation on input
            document.addEventListener('input', (e) => {
                if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
                    this.validateContent(e.target);
                }
            });
        },
        
        handleFormSubmit(e) {
            e.preventDefault();
            const form = e.target;
            
            // Clear previous messages
            this.clearMessages(form);
            
            // Run security checks
            if (!this.performSecurityChecks(form)) {
                return false;
            }
            
            // Validate all fields
            if (!this.validateForm(form)) {
                return false;
            }
            
            // Check rate limiting
            if (!this.checkRateLimit(form)) {
                this.showError(form, this.config.messages.rateLimit);
                return false;
            }
            
            // Submit form
            this.submitForm(form);
        },
        
        performSecurityChecks(form) {
            // Check honeypot
            const honeypot = form.querySelector('.honeypot');
            if (honeypot && honeypot.value) {
                console.warn('[FormSecurity] Honeypot triggered');
                return false; // Silently fail for bots
            }
            
            // Check minimum time spent on form
            const startTime = this.state.formStartTimes.get(form);
            if (startTime && (Date.now() - startTime) < this.config.requiredHoneypotTime) {
                console.warn('[FormSecurity] Form submitted too quickly');
                this.showError(form, 'Please take a moment to review your message before submitting.');
                return false;
            }
            
            // Check for suspicious patterns
            const fields = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
            for (const field of fields) {
                if (this.containsSuspiciousContent(field.value)) {
                    this.showError(form, this.config.messages.suspiciousContent);
                    this.highlightField(field, 'error');
                    return false;
                }
            }
            
            return true;
        },
        
        validateForm(form) {
            let isValid = true;
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    this.highlightField(field, 'error');
                    isValid = false;
                }
            });
            
            // Validate email fields
            const emailFields = form.querySelectorAll(this.config.selectors.emailFields);
            emailFields.forEach(field => {
                if (field.value && !this.isValidEmail(field.value)) {
                    this.highlightField(field, 'error');
                    this.showFieldError(field, this.config.messages.invalidEmail);
                    isValid = false;
                }
            });
            
            // Check field lengths
            const textFields = form.querySelectorAll('input[type="text"], textarea');
            textFields.forEach(field => {
                if (field.value.length > this.config.maxFieldLength) {
                    this.highlightField(field, 'error');
                    this.showFieldError(field, this.config.messages.fieldTooLong);
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        checkRateLimit(form) {
            const formId = this.getFormId(form);
            const now = Date.now();
            const submissions = this.state.submissions.get(formId) || [];
            
            // Clean old submissions
            const recentSubmissions = submissions.filter(
                time => now - time < this.config.cooldownPeriod
            );
            
            if (recentSubmissions.length >= this.config.maxSubmissions) {
                return false;
            }
            
            // Record this submission
            recentSubmissions.push(now);
            this.state.submissions.set(formId, recentSubmissions);
            
            return true;
        },
        
        async submitForm(form) {
            const submitBtn = form.querySelector(this.config.selectors.submitButtons);
            const originalText = submitBtn ? submitBtn.textContent : '';
            
            try {
                // Add loading state
                form.classList.add(this.config.classes.loading);
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }
                
                // Create FormData
                const formData = new FormData(form);
                
                // Remove honeypot from submission
                formData.delete('website');
                
                // Add timestamp
                formData.append('_timestamp', new Date().toISOString());
                formData.append('_user_agent', navigator.userAgent);
                formData.append('_referrer', document.referrer);
                
                // Submit form
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    this.handleSubmitSuccess(form);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    this.handleSubmitError(form, errorData.message || this.config.messages.generalError);
                }
                
            } catch (error) {
                console.error('[FormSecurity] Submit error:', error);
                this.handleSubmitError(form, this.config.messages.networkError);
            } finally {
                // Remove loading state
                form.classList.remove(this.config.classes.loading);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        },
        
        handleSubmitSuccess(form) {
            this.showSuccess(form, this.config.messages.success);
            form.reset();
            
            // Reset start time
            this.state.formStartTimes.set(form, Date.now());
            
            // Dispatch success event
            form.dispatchEvent(new CustomEvent('formSubmitSuccess', {
                detail: { form }
            }));
        },
        
        handleSubmitError(form, message) {
            this.showError(form, message);
            
            // Dispatch error event
            form.dispatchEvent(new CustomEvent('formSubmitError', {
                detail: { form, message }
            }));
        },
        
        validateEmail(field) {
            const isValid = this.isValidEmail(field.value);
            
            if (field.value && !isValid) {
                this.highlightField(field, 'error');
                this.showFieldError(field, this.config.messages.invalidEmail);
            } else if (field.value && isValid) {
                this.highlightField(field, 'success');
                this.clearFieldError(field);
            } else {
                this.clearFieldHighlight(field);
                this.clearFieldError(field);
            }
            
            return isValid;
        },
        
        validateContent(field) {
            const value = field.value;
            const isSuspicious = this.containsSuspiciousContent(value);
            const isTooLong = value.length > this.config.maxFieldLength;
            
            if (isSuspicious) {
                this.highlightField(field, 'error');
                this.showFieldError(field, this.config.messages.suspiciousContent);
            } else if (isTooLong) {
                this.highlightField(field, 'error');
                this.showFieldError(field, this.config.messages.fieldTooLong);
            } else {
                this.clearFieldHighlight(field);
                this.clearFieldError(field);
            }
        },
        
        updateCharacterCounter(field) {
            const maxLength = this.config.maxFieldLength;
            const currentLength = field.value.length;
            const remaining = maxLength - currentLength;
            
            let counter = field.parentNode.querySelector('.character-counter');
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'character-counter';
                field.parentNode.appendChild(counter);
            }
            
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            // Update counter styling based on usage
            counter.classList.remove('warning', 'error');
            if (remaining < 100) {
                counter.classList.add('error');
            } else if (remaining < 500) {
                counter.classList.add('warning');
            }
        },
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        containsSuspiciousContent(text) {
            return this.config.blockedPatterns.some(pattern => pattern.test(text));
        },
        
        highlightField(field, type) {
            field.classList.remove('field-error', 'field-success');
            field.classList.add(`field-${type}`);
        },
        
        clearFieldHighlight(field) {
            field.classList.remove('field-error', 'field-success');
        },
        
        showFieldError(field, message) {
            this.clearFieldError(field);
            
            const error = document.createElement('div');
            error.className = this.config.classes.error;
            error.textContent = message;
            error.setAttribute('role', 'alert');
            
            field.parentNode.appendChild(error);
        },
        
        clearFieldError(field) {
            const errors = field.parentNode.querySelectorAll(`.${this.config.classes.error}`);
            errors.forEach(error => error.remove());
        },
        
        showError(form, message) {
            this.clearMessages(form);
            
            const error = document.createElement('div');
            error.className = this.config.classes.error;
            error.textContent = message;
            error.setAttribute('role', 'alert');
            
            form.appendChild(error);
        },
        
        showSuccess(form, message) {
            this.clearMessages(form);
            
            const success = document.createElement('div');
            success.className = this.config.classes.success;
            success.textContent = message;
            success.setAttribute('role', 'status');
            
            form.appendChild(success);
        },
        
        clearMessages(form) {
            const messages = form.querySelectorAll(`.${this.config.classes.error}, .${this.config.classes.success}`);
            messages.forEach(msg => msg.remove());
        },
        
        getFormId(form) {
            return form.action + form.method + Array.from(form.elements).map(el => el.name).join('');
        },
        
        initRateLimiting() {
            // Clean up old submissions periodically
            setInterval(() => {
                const now = Date.now();
                this.state.submissions.forEach((submissions, formId) => {
                    const recent = submissions.filter(
                        time => now - time < this.config.cooldownPeriod
                    );
                    this.state.submissions.set(formId, recent);
                });
            }, 60000); // Clean every minute
        },
        
        addSecurityHeaders() {
            // Add meta tag for content security if not present
            if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
                const meta = document.createElement('meta');
                meta.setAttribute('http-equiv', 'Content-Security-Policy');
                meta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
                document.head.appendChild(meta);
            }
        },
        
        // Public API
        validateFormById(formId) {
            const form = document.getElementById(formId);
            return form ? this.validateForm(form) : false;
        },
        
        resetForm(formSelector) {
            const form = document.querySelector(formSelector);
            if (form) {
                form.reset();
                this.clearMessages(form);
                this.state.formStartTimes.set(form, Date.now());
            }
        },
        
        getSecurityStats() {
            return {
                formsProtected: document.querySelectorAll(this.config.selectors.forms).length,
                totalSubmissions: Array.from(this.state.submissions.values())
                    .reduce((total, submissions) => total + submissions.length, 0),
                honeypotFields: document.querySelectorAll('.honeypot').length
            };
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => FormSecurity.init());
    } else {
        FormSecurity.init();
    }
    
    // Expose for external use
    window.FormSecurity = FormSecurity;
    
})();