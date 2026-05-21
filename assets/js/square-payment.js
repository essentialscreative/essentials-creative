/**
 * Square Payment Integration for Essentials Creative Shop
 * Uses Square Web Payments SDK with sandbox credentials for testing
 */

class SquarePayment {
    constructor() {
        // Check if we're in a secure context (HTTPS or localhost)
        this.isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // Sandbox credentials for testing
        this.applicationId = 'sandbox-sq0idb-_nTrVH7O3p4j_0v1u5G9Sw'; // Square sandbox app ID
        this.locationId = 'sandbox-location-1234567890'; // Square sandbox location ID
        
        this.payments = null;
        this.card = null;
        this.paymentForm = null;
        this.isInitialized = false;
        
        if (this.isSecureContext) {
            this.init();
        } else {
            console.warn('Square Payments SDK requires HTTPS. Running in demo mode.');
            this.isInitialized = 'demo';
        }
    }

    /**
     * Initialize Square Payments SDK
     */
    async init() {
        try {
            // Wait for Square SDK to load
            await this.waitForSquareSDK();
            
            // Initialize payments
            this.payments = Square.payments(this.applicationId, this.locationId);
            
            this.isInitialized = true;
            console.log('Square Payment SDK initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Square Payment SDK:', error);
            this.showError('Payment system unavailable. Please try again later.');
        }
    }

    /**
     * Wait for Square SDK to load
     */
    waitForSquareSDK() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkSquare = () => {
                attempts++;
                if (window.Square) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    setTimeout(checkSquare, 100);
                } else {
                    reject(new Error('Square SDK failed to load'));
                }
            };
            
            checkSquare();
        });
    }

    /**
     * Create payment form
     */
    async createPaymentForm(orderData) {
        if (!this.isInitialized) {
            throw new Error('Square Payment SDK not initialized');
        }

        // For demo mode (HTTP), create a demo payment form
        if (this.isInitialized === 'demo') {
            this.createDemoPaymentForm(orderData);
            return;
        }

        // Create payment form container
        const paymentContainer = this.createPaymentContainer(orderData);
        document.body.appendChild(paymentContainer);

        // Initialize card payment method
        try {
            this.card = await this.payments.card();
            await this.card.attach('#square-card-container');
            
            this.setupPaymentForm(orderData);
            
        } catch (error) {
            console.error('Failed to create card payment method:', error);
            this.showError('Failed to load payment form. Please try again.');
        }
    }

    /**
     * Create demo payment form for HTTP testing
     */
    createDemoPaymentForm(orderData) {
        const container = this.createDemoContainer(orderData);
        document.body.appendChild(container);
        this.setupDemoForm(orderData);
    }

    /**
     * Create payment form container
     */
    createPaymentContainer(orderData) {
        const container = document.createElement('div');
        container.className = 'square-payment-modal';
        container.innerHTML = `
            <div class="square-payment-content">
                <div class="square-payment-header">
                    <h2>Complete Your Payment</h2>
                    <button class="square-payment-close" type="button">&times;</button>
                </div>
                
                <div class="square-order-summary">
                    <h3>Order Summary</h3>
                    <div class="square-order-items">
                        ${this.renderOrderItems(orderData.items)}
                    </div>
                    <div class="square-order-total">
                        <strong>Total: $${orderData.total}</strong>
                    </div>
                </div>

                <div class="square-payment-form">
                    <form id="square-payment-form">
                        <div class="square-form-group">
                            <label for="square-cardholder-name">Cardholder Name</label>
                            <input type="text" id="square-cardholder-name" name="cardholderName" required>
                        </div>
                        
                        <div class="square-form-group">
                            <label>Card Details</label>
                            <div id="square-card-container"></div>
                        </div>
                        
                        <div class="square-form-group">
                            <label for="square-email">Email Address</label>
                            <input type="email" id="square-email" name="email" required>
                        </div>
                        
                        <div class="square-billing-section">
                            <h4>Billing Address</h4>
                            <div class="square-form-row">
                                <div class="square-form-group">
                                    <label for="square-address">Address</label>
                                    <input type="text" id="square-address" name="address" required>
                                </div>
                            </div>
                            <div class="square-form-row">
                                <div class="square-form-group">
                                    <label for="square-city">City</label>
                                    <input type="text" id="square-city" name="city" required>
                                </div>
                                <div class="square-form-group">
                                    <label for="square-state">State</label>
                                    <input type="text" id="square-state" name="state" required>
                                </div>
                                <div class="square-form-group">
                                    <label for="square-zip">ZIP Code</label>
                                    <input type="text" id="square-zip" name="zip" required>
                                </div>
                            </div>
                        </div>

                        <div class="square-payment-buttons">
                            <button type="button" class="square-btn-cancel">Cancel</button>
                            <button type="submit" class="square-btn-pay">
                                Pay $${orderData.total}
                            </button>
                        </div>
                    </form>
                </div>

                <div class="square-payment-status" id="square-payment-status"></div>
            </div>
        `;

        return container;
    }

    /**
     * Render order items
     */
    renderOrderItems(items) {
        return items.map(item => `
            <div class="square-order-item">
                <span class="square-item-name">${item.title} (${item.size})</span>
                <span class="square-item-quantity">×${item.quantity}</span>
                <span class="square-item-price">$${item.price * item.quantity}</span>
            </div>
        `).join('');
    }

    /**
     * Setup payment form event listeners
     */
    setupPaymentForm(orderData) {
        const form = document.getElementById('square-payment-form');
        const closeButton = document.querySelector('.square-payment-close');
        const cancelButton = document.querySelector('.square-btn-cancel');

        // Close handlers
        closeButton.addEventListener('click', () => this.closePaymentForm());
        cancelButton.addEventListener('click', () => this.closePaymentForm());

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.processPayment(orderData);
        });

        // Click outside to close
        document.querySelector('.square-payment-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('square-payment-modal')) {
                this.closePaymentForm();
            }
        });
    }

    /**
     * Process payment
     */
    async processPayment(orderData) {
        const submitButton = document.querySelector('.square-btn-pay');
        const originalText = submitButton.textContent;
        
        try {
            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Tokenize card
            const tokenResult = await this.card.tokenize();
            
            if (tokenResult.status === 'OK') {
                // Collect billing information
                const billingContact = this.collectBillingInfo();
                
                // In a real implementation, you would send this to your server
                // For testing, we'll simulate a successful payment
                await this.simulatePaymentProcessing(tokenResult.token, orderData, billingContact);
                
            } else {
                throw new Error(tokenResult.errors?.[0]?.message || 'Card tokenization failed');
            }

        } catch (error) {
            console.error('Payment processing error:', error);
            this.showError(error.message || 'Payment processing failed. Please try again.');
            
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    /**
     * Collect billing information
     */
    collectBillingInfo() {
        return {
            cardholderName: document.getElementById('square-cardholder-name').value,
            email: document.getElementById('square-email').value,
            address: document.getElementById('square-address').value,
            city: document.getElementById('square-city').value,
            state: document.getElementById('square-state').value,
            zip: document.getElementById('square-zip').value
        };
    }

    /**
     * Simulate payment processing (for testing)
     */
    async simulatePaymentProcessing(token, orderData, billingContact) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real implementation, you would send this to your backend:
        // const paymentData = {
        //     sourceId: token,
        //     amountMoney: {
        //         amount: orderData.total * 100, // Square uses cents
        //         currency: 'USD'
        //     },
        //     orderData: orderData,
        //     billingContact: billingContact
        // };

        console.log('SANDBOX PAYMENT SIMULATION:', {
            token: token,
            amount: orderData.total,
            order: orderData,
            billing: billingContact,
            note: 'This is a sandbox transaction - no real money was charged'
        });

        // Simulate successful payment
        this.showSuccess(orderData, billingContact);
    }

    /**
     * Show payment success
     */
    showSuccess(orderData, billingContact) {
        const statusDiv = document.getElementById('square-payment-status');
        statusDiv.innerHTML = `
            <div class="square-success">
                <h3>✅ Payment Successful!</h3>
                <p><strong>SANDBOX MODE:</strong> This is a test transaction. No real payment was processed.</p>
                <p>Order total: $${orderData.total}</p>
                <p>Email: ${billingContact.email}</p>
                <p>We'll send order confirmation and production timeline details to your email.</p>
                <button class="square-btn-close" onclick="squarePayment.closePaymentForm()">Close</button>
            </div>
        `;

        // Clear the cart
        if (window.shoppingCart) {
            window.shoppingCart.items = [];
            window.shoppingCart.saveCart();
            window.shoppingCart.updateCartCount();
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const statusDiv = document.getElementById('square-payment-status');
        if (statusDiv) {
            statusDiv.innerHTML = `
                <div class="square-error">
                    <h4>❌ Payment Error</h4>
                    <p>${message}</p>
                </div>
            `;
        } else {
            alert(`Payment Error: ${message}`);
        }
    }

    /**
     * Create demo container for HTTP testing
     */
    createDemoContainer(orderData) {
        const container = document.createElement('div');
        container.className = 'square-payment-modal';
        container.innerHTML = `
            <div class="square-payment-content">
                <div class="square-payment-header">
                    <h2>Demo Payment Form</h2>
                    <button class="square-payment-close" type="button">&times;</button>
                </div>
                
                <div class="demo-notice">
                    <strong>⚠️ Demo Mode:</strong> Square Payments requires HTTPS to work properly. 
                    This is a demonstration of the payment flow.
                </div>
                
                <div class="square-order-summary">
                    <h3>Order Summary</h3>
                    <div class="square-order-items">
                        ${this.renderOrderItems(orderData.items)}
                    </div>
                    <div class="square-order-total">
                        <strong>Total: $${orderData.total}</strong>
                    </div>
                </div>

                <div class="square-payment-form">
                    <form id="square-demo-form">
                        <div class="square-form-group">
                            <label for="demo-cardholder-name">Cardholder Name</label>
                            <input type="text" id="demo-cardholder-name" name="cardholderName" value="John Doe" required>
                        </div>
                        
                        <div class="square-form-group">
                            <label>Card Number (Demo)</label>
                            <input type="text" value="4111 1111 1111 1111" disabled style="background: #f5f5f5;">
                        </div>
                        
                        <div class="square-form-row" style="grid-template-columns: 1fr 1fr;">
                            <div class="square-form-group">
                                <label>Expiry (Demo)</label>
                                <input type="text" value="12/26" disabled style="background: #f5f5f5;">
                            </div>
                            <div class="square-form-group">
                                <label>CVC (Demo)</label>
                                <input type="text" value="123" disabled style="background: #f5f5f5;">
                            </div>
                        </div>
                        
                        <div class="square-form-group">
                            <label for="demo-email">Email Address</label>
                            <input type="email" id="demo-email" name="email" value="customer@example.com" required>
                        </div>
                        
                        <div class="square-billing-section">
                            <h4>Billing Address</h4>
                            <div class="square-form-row">
                                <div class="square-form-group">
                                    <label for="demo-address">Address</label>
                                    <input type="text" id="demo-address" name="address" value="123 Main St" required>
                                </div>
                            </div>
                            <div class="square-form-row">
                                <div class="square-form-group">
                                    <label for="demo-city">City</label>
                                    <input type="text" id="demo-city" name="city" value="Austin" required>
                                </div>
                                <div class="square-form-group">
                                    <label for="demo-state">State</label>
                                    <input type="text" id="demo-state" name="state" value="TX" required>
                                </div>
                                <div class="square-form-group">
                                    <label for="demo-zip">ZIP Code</label>
                                    <input type="text" id="demo-zip" name="zip" value="78701" required>
                                </div>
                            </div>
                        </div>

                        <div class="square-payment-buttons">
                            <button type="button" class="square-btn-cancel">Cancel</button>
                            <button type="submit" class="square-btn-pay">
                                Demo Pay $${orderData.total}
                            </button>
                        </div>
                    </form>
                </div>

                <div class="square-payment-status" id="square-demo-status"></div>
            </div>
        `;

        return container;
    }

    /**
     * Setup demo form event listeners
     */
    setupDemoForm(orderData) {
        const form = document.getElementById('square-demo-form');
        const closeButton = document.querySelector('.square-payment-close');
        const cancelButton = document.querySelector('.square-btn-cancel');

        // Close handlers
        closeButton.addEventListener('click', () => this.closePaymentForm());
        cancelButton.addEventListener('click', () => this.closePaymentForm());

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.processDemoPayment(orderData);
        });

        // Click outside to close
        document.querySelector('.square-payment-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('square-payment-modal')) {
                this.closePaymentForm();
            }
        });
    }

    /**
     * Process demo payment
     */
    async processDemoPayment(orderData) {
        const submitButton = document.querySelector('.square-btn-pay');
        const originalText = submitButton.textContent;
        
        try {
            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Processing Demo...';

            // Collect billing information from demo form
            const billingContact = {
                cardholderName: document.getElementById('demo-cardholder-name').value,
                email: document.getElementById('demo-email').value,
                address: document.getElementById('demo-address').value,
                city: document.getElementById('demo-city').value,
                state: document.getElementById('demo-state').value,
                zip: document.getElementById('demo-zip').value
            };

            // Simulate payment processing
            await this.simulatePaymentProcessing('demo-token-' + Date.now(), orderData, billingContact);
            
        } catch (error) {
            console.error('Demo payment processing error:', error);
            this.showError(error.message || 'Demo payment processing failed.');
            
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    /**
     * Close payment form
     */
    closePaymentForm() {
        const modal = document.querySelector('.square-payment-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }
}

// Initialize Square Payment when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.squarePayment = new SquarePayment();
});