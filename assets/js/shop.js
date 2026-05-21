// Shopping Cart Functionality for Essentials Creative Shop

class ShoppingCart {
    constructor() {
        this.items = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.loadCart();
        this.createCartUI();
        this.addEventListeners();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('essentials-cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('essentials-cart', JSON.stringify(this.items));
    }

    // Create cart UI elements
    createCartUI() {
        // Create cart icon/button
        const cartButton = document.createElement('div');
        cartButton.className = 'cart-button';
        cartButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 0 0 5.414 17H19M17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            </svg>
            <span class="cart-count">0</span>
        `;

        // Create cart sidebar
        const cartSidebar = document.createElement('div');
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Shopping Cart</h3>
                <button class="cart-close">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total: $<span class="total-amount">0</span></strong>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(cartButton);
        document.body.appendChild(cartSidebar);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);
    }

    // Add event listeners
    addEventListeners() {
        // Cart button click
        document.querySelector('.cart-button').addEventListener('click', () => {
            this.toggleCart();
        });

        // Close button
        document.querySelector('.cart-close').addEventListener('click', () => {
            this.closeCart();
        });

        // Overlay click
        document.querySelector('.cart-overlay').addEventListener('click', () => {
            this.closeCart();
        });

        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            this.checkout();
        });

        // Add to cart buttons
        this.addProductEventListeners();
    }

    // Add event listeners to product cards
    addProductEventListeners() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            // Add "Add to Cart" button to each product
            const productContent = card.querySelector('.product-content');
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.innerHTML = 'Add to Cart';
            addToCartBtn.dataset.productIndex = index;

            productContent.appendChild(addToCartBtn);

            // Add click event
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(index, card);
            });

            // Add product detail click
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-cart-btn')) {
                    this.showProductDetail(index, card);
                }
            });
        });
    }

    // Add item to cart
    addToCart(productIndex, productCard) {
        const title = productCard.querySelector('.product-title').textContent;
        const image = productCard.querySelector('.product-image').style.backgroundImage;
        const description = productCard.querySelector('.product-description').textContent;

        // Default to small size, single-sided, and quantity 1
        const product = {
            id: `product-${productIndex}`,
            title: title,
            image: image,
            description: description,
            size: 'small',
            sides: 'single',
            price: 75, // Small single-sided price
            quantity: 1
        };

        // Check if item already exists
        const existingIndex = this.items.findIndex(item => 
            item.id === product.id && item.size === product.size && item.sides === product.sides
        );

        if (existingIndex >= 0) {
            this.items[existingIndex].quantity += 1;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartItems();
        this.showAddedToCartFeedback();
    }

    // Show product detail modal
    showProductDetail(productIndex, productCard) {
        const title = productCard.querySelector('.product-title').textContent;
        const image = productCard.querySelector('.product-image').style.backgroundImage;
        const description = productCard.querySelector('.product-description').textContent;

        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-content" style="grid-template-columns: 1fr; max-width: 600px;">
                <button class="modal-close">&times;</button>
                <div style="padding: 2rem;">
                    <div class="modal-image" style="${image}; height: 200px; border-radius: 8px; margin-bottom: 1.5rem;"></div>
                    <div class="modal-info">
                        <h2>${title}</h2>
                        <p>${description}</p>
                        
                        <div class="size-selection">
                            <h4>Size & Pricing:</h4>
                            <label>
                                <input type="radio" name="size" value="small" checked>
                                <strong>Small (18" × 24")</strong>
                                <div style="margin-left: 1.5rem; color: #666; font-size: 0.9rem;">
                                    Single-sided: $75 | Double-sided: $150
                                </div>
                            </label>
                            <label>
                                <input type="radio" name="size" value="large">
                                <strong>Large (30" × 40")</strong>
                                <div style="margin-left: 1.5rem; color: #666; font-size: 0.9rem;">
                                    Single-sided: $300 | Double-sided: $600
                                </div>
                            </label>
                        </div>
                        
                        <div class="sides-selection">
                            <h4>Design Type:</h4>
                            <label>
                                <input type="radio" name="sides" value="single" checked>
                                <strong>Single-sided</strong> - Design printed on front only
                            </label>
                            <label>
                                <input type="radio" name="sides" value="double">
                                <strong>Double-sided</strong> - Choose different designs for front and back
                            </label>
                        </div>
                        
                        <div class="design-selection" id="design-selection" style="display: none;">
                            <h4>Back Design Selection:</h4>
                            <div class="design-preview">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Front Design:</label>
                                        <div class="front-design-preview" style="${image}; height: 80px; border-radius: 4px; border: 2px solid #667eea;"></div>
                                        <small style="color: #666;">Current selection</small>
                                    </div>
                                    <div>
                                        <label>Back Design:</label>
                                        <select id="back-design" class="back-design-select">
                                            <option value="">Choose back design...</option>
                                            ${this.generateBackDesignOptions(productIndex)}
                                        </select>
                                        <div id="back-design-preview" class="back-design-preview" style="height: 80px; border-radius: 4px; background: #f5f5f5; border: 2px dashed #ccc; margin-top: 0.5rem; display: none;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="quantity-selection">
                            <label for="quantity">Quantity:</label>
                            <input type="number" id="quantity" min="1" value="1">
                        </div>
                        
                        <button class="add-to-cart-modal-btn" data-product-index="${productIndex}">
                            Add to Cart - $75
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEventListeners(modal, productIndex, title, image, description);
    }

    // Generate back design options (excluding current front design)
    generateBackDesignOptions(currentIndex) {
        const designs = [
            'Botanical Study #1', 'Botanical Study #2', 'Botanical Study #3', 'Botanical Study #4',
            'Botanical Study #5', 'Botanical Study #6', 'Botanical Study #7', 'Botanical Study #8',
            'Botanical Study #9', 'Botanical Study #10', 'Botanical Study #11', 'Botanical Study #12',
            'Botanical Study #13', 'Botanical Study #14', 'Botanical Study #15', 'Botanical Study #16',
            'Botanical Study #17', 'Botanical Study #18', 'Botanical Study #19', 'Botanical Study #20',
            'Botanical Study #21', 'Botanical Study #22', 'Kernza & Microbes', 'White Sage Reciprocity'
        ];

        const images = [
            'assets/images/plant-story/Scan 1 copy.webp', 'assets/images/plant-story/Scan 2 copy.webp',
            'assets/images/plant-story/Scan 3 copy.webp', 'assets/images/plant-story/Scan 4 copy.webp',
            'assets/images/plant-story/Scan 5 copy.webp', 'assets/images/plant-story/Scan 6 copy.webp',
            'assets/images/plant-story/Scan 7 copy.webp', 'assets/images/plant-story/Scan 8 copy.webp',
            'assets/images/plant-story/Scan 9 copy.webp', 'assets/images/plant-story/Scan 10 copy.webp',
            'assets/images/plant-story/Scan copy.webp', 'assets/images/plant-story/carousel_025_EK2A8761 copy.webp',
            'assets/images/plant-story/carousel_032_EK2A8768 copy.webp', 'assets/images/plant-story/carousel_055_EK2A8791 copy.webp',
            'assets/images/plant-story/gallery_1.webp', 'assets/images/plant-story/gallery_2.webp',
            'assets/images/plant-story/hero_image.webp', 'assets/images/plant-story/Scan 1 copy.webp',
            'assets/images/plant-story/Scan 2 copy.webp', 'assets/images/plant-story/Scan 3 copy.webp',
            'assets/images/plant-story/Scan 4 copy.webp', 'assets/images/plant-story/Scan 5 copy.webp',
            'assets/images/plant-story/Scan 6 copy.webp', 'assets/images/plant-story/Scan 7 copy.webp'
        ];

        return designs.map((design, index) => {
            if (index !== currentIndex) {
                return `<option value="${index}" data-image="${images[index] || images[index % images.length]}">${design}</option>`;
            }
            return '';
        }).join('');
    }

    // Setup modal event listeners with new pricing logic
    setupModalEventListeners(modal, productIndex, title, image, description) {
        // Close handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Get form elements
        const sizeInputs = modal.querySelectorAll('input[name="size"]');
        const sidesInputs = modal.querySelectorAll('input[name="sides"]');
        const addToCartBtn = modal.querySelector('.add-to-cart-modal-btn');
        const designSelection = modal.getElementById('design-selection');
        const backDesignSelect = modal.getElementById('back-design');
        const backDesignPreview = modal.getElementById('back-design-preview');

        // Pricing calculation
        const updatePrice = () => {
            const selectedSize = modal.querySelector('input[name="size"]:checked').value;
            const selectedSides = modal.querySelector('input[name="sides"]:checked').value;
            
            let price;
            if (selectedSize === 'small' && selectedSides === 'single') price = 75;
            else if (selectedSize === 'small' && selectedSides === 'double') price = 150;
            else if (selectedSize === 'large' && selectedSides === 'single') price = 300;
            else if (selectedSize === 'large' && selectedSides === 'double') price = 600;
            
            addToCartBtn.textContent = `Add to Cart - $${price}`;
            return price;
        };

        // Size selection change
        sizeInputs.forEach(input => {
            input.addEventListener('change', updatePrice);
        });

        // Sides selection change
        sidesInputs.forEach(input => {
            input.addEventListener('change', () => {
                updatePrice();
                if (input.value === 'double') {
                    designSelection.style.display = 'block';
                } else {
                    designSelection.style.display = 'none';
                    backDesignSelect.value = '';
                    backDesignPreview.style.display = 'none';
                }
            });
        });

        // Back design selection
        backDesignSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.selectedOptions[0];
            if (selectedOption && selectedOption.dataset.image) {
                backDesignPreview.style.backgroundImage = `url('${selectedOption.dataset.image}')`;
                backDesignPreview.style.backgroundSize = 'cover';
                backDesignPreview.style.backgroundPosition = 'center';
                backDesignPreview.style.display = 'block';
                backDesignPreview.style.border = '2px solid #667eea';
            } else {
                backDesignPreview.style.display = 'none';
            }
        });

        // Add to cart from modal
        addToCartBtn.addEventListener('click', () => {
            const selectedSize = modal.querySelector('input[name="size"]:checked').value;
            const selectedSides = modal.querySelector('input[name="sides"]:checked').value;
            const quantity = parseInt(modal.querySelector('#quantity').value);
            const price = updatePrice();

            let backDesign = null;
            let backDesignTitle = null;
            if (selectedSides === 'double' && backDesignSelect.value) {
                backDesign = backDesignSelect.selectedOptions[0].dataset.image;
                backDesignTitle = backDesignSelect.selectedOptions[0].text;
            }

            const product = {
                id: `product-${productIndex}`,
                title: title,
                image: image,
                description: description,
                size: selectedSize,
                sides: selectedSides,
                price: price,
                quantity: quantity,
                backDesign: backDesign,
                backDesignTitle: backDesignTitle
            };

            // Check if item already exists with same configuration
            const existingIndex = this.items.findIndex(item => 
                item.id === product.id && 
                item.size === product.size && 
                item.sides === product.sides &&
                item.backDesign === product.backDesign
            );

            if (existingIndex >= 0) {
                this.items[existingIndex].quantity += quantity;
            } else {
                this.items.push(product);
            }

            this.saveCart();
            this.updateCartCount();
            this.updateCartItems();
            this.showAddedToCartFeedback();
            document.body.removeChild(modal);
        });
    }

    // Update cart count
    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    // Update cart items display
    updateCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            this.items.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                const sizeText = item.size === 'small' ? 'Small (18" × 24")' : 'Large (30" × 40")';
                const sidesText = item.sides === 'single' ? 'Single-sided' : 'Double-sided';
                const backDesignText = item.backDesign ? `<br><small>Back: ${item.backDesignTitle}</small>` : '';
                
                cartItem.innerHTML = `
                    <div class="cart-item-image" style="${item.image}"></div>
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>${sizeText} • ${sidesText}${backDesignText}</p>
                        <p>$${item.price} each</p>
                        <div class="quantity-controls">
                            <button class="qty-decrease" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-increase" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        $${item.price * item.quantity}
                    </div>
                    <button class="remove-item" data-index="${index}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Add event listeners for quantity controls and remove
            this.addCartItemEventListeners();
        }

        this.updateCartTotal();
    }

    // Add event listeners to cart items
    addCartItemEventListeners() {
        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (this.items[index].quantity > 1) {
                    this.items[index].quantity--;
                    this.saveCart();
                    this.updateCartCount();
                    this.updateCartItems();
                }
            });
        });

        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.items[index].quantity++;
                this.saveCart();
                this.updateCartCount();
                this.updateCartItems();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.items.splice(index, 1);
                this.saveCart();
                this.updateCartCount();
                this.updateCartItems();
            });
        });
    }

    // Update cart total
    updateCartTotal() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector('.total-amount').textContent = total;
    }

    // Toggle cart sidebar
    toggleCart() {
        this.isOpen = !this.isOpen;
        const sidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-overlay');

        if (this.isOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            this.updateCartItems();
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        }
    }

    // Close cart
    closeCart() {
        this.isOpen = false;
        document.querySelector('.cart-sidebar').classList.remove('open');
        document.querySelector('.cart-overlay').classList.remove('open');
    }

    // Show feedback when item added to cart
    showAddedToCartFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'cart-feedback';
        feedback.textContent = 'Added to cart!';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);

        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                if (feedback.parentNode) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    // Checkout process
    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show checkout options
        this.showCheckoutOptions();
    }

    // Show checkout options modal
    showCheckoutOptions() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const modal = document.createElement('div');
        modal.className = 'checkout-options-modal';
        modal.innerHTML = `
            <div class="checkout-options-content">
                <div class="checkout-options-header">
                    <h2>Choose Payment Method</h2>
                    <button class="checkout-options-close">&times;</button>
                </div>
                <div class="checkout-options-body">
                    <p>Total: <strong>$${total}</strong></p>
                    <div class="checkout-options-buttons">
                        <button class="checkout-option-btn checkout-card-btn">
                            💳 Pay with Card
                            <small>Secure payment via Square</small>
                        </button>
                        <button class="checkout-option-btn checkout-contact-btn">
                            📧 Request Quote
                            <small>We'll contact you to arrange payment</small>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.checkout-options-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.checkout-card-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.checkoutWithSquare();
        });

        modal.querySelector('.checkout-contact-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.checkoutWithContact();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Checkout with Square payments
    async checkoutWithSquare() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
            items: this.items,
            total: total,
            orderId: 'EC-' + Date.now(),
            timestamp: new Date().toISOString()
        };

        // Wait for Square payment system to be ready
        if (window.squarePayment && window.squarePayment.isInitialized) {
            try {
                await window.squarePayment.createPaymentForm(orderData);
            } catch (error) {
                console.error('Square payment error:', error);
                this.showSquareError();
            }
        } else {
            this.showSquareError();
        }
    }

    // Show Square error and fallback to contact
    showSquareError() {
        const errorModal = document.createElement('div');
        errorModal.className = 'square-error-modal';
        errorModal.innerHTML = `
            <div class="square-error-content">
                <h3>Payment System Unavailable</h3>
                <p>Our card payment system is temporarily unavailable. We'll contact you to arrange payment.</p>
                <button class="square-error-continue">Continue with Request Quote</button>
            </div>
        `;

        document.body.appendChild(errorModal);

        errorModal.querySelector('.square-error-continue').addEventListener('click', () => {
            document.body.removeChild(errorModal);
            this.checkoutWithContact();
        });
    }

    // Checkout with contact form (original method)
    checkoutWithContact() {
        // Create order summary and redirect to contact form
        const orderSummary = this.items.map(item => 
            `${item.title} (${item.size}) x${item.quantity} = $${item.price * item.quantity}`
        ).join('\n');

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderDetails = `Order Summary:\n${orderSummary}\n\nTotal: $${total}\n\nPlease include these details in your message.`;

        // Store order details for the contact form
        localStorage.setItem('pending-order', orderDetails);

        // Redirect to contact page
        window.location.href = 'contact.html?order=true';
    }
}

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});