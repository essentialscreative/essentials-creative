/**
 * Contact Form Handler
 * Manages form submission, validation, and user feedback
 */

(function() {
  'use strict';

  // Form elements
  let form;
  let submitButton;
  let statusMessage;
  let formFields = {};

  /**
   * Initialize contact form
   */
  function init() {
    form = document.getElementById('contact-form');
    if (!form) return;

    submitButton = form.querySelector('button[type="submit"]');
    statusMessage = document.getElementById('form-status');

    // Get all form fields
    const fields = ['firstName', 'lastName', 'email', 'phone', 'company', 'subject', 'projectType', 'message'];
    fields.forEach(field => {
      formFields[field] = form.querySelector(`[name="${field}"]`);
    });

    // Check for order information from shop
    checkForOrderInfo();

    // Add event listeners
    form.addEventListener('submit', handleSubmit);
    
    // Add real-time validation
    if (formFields.email) {
      formFields.email.addEventListener('blur', validateEmail);
    }
    
    // Add character counter for message
    if (formFields.message) {
      addCharacterCounter(formFields.message);
    }
  }

  /**
   * Check for order information from shopping cart
   */
  function checkForOrderInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderDetails = localStorage.getItem('pending-order');
    
    if (urlParams.get('order') === 'true' && orderDetails) {
      // Update form for order processing
      updateFormForOrder(orderDetails);
    }
  }

  /**
   * Update form for order processing
   */
  function updateFormForOrder(orderDetails) {
    // Update page title and description
    const formTitle = document.querySelector('.contact-form h2');
    const formDescription = document.querySelector('.contact-form p');
    
    if (formTitle) {
      formTitle.textContent = 'Complete Your Order';
    }
    
    if (formDescription) {
      formDescription.innerHTML = `
        Review your order details below and complete your information to finalize your tapestry order. 
        We'll contact you within 24 hours to confirm details and arrange payment.
      `;
    }

    // Update subject field
    if (formFields.subject) {
      formFields.subject.value = 'Tapestry Order';
    }

    // Pre-fill message with order details
    if (formFields.message) {
      formFields.message.value = orderDetails + '\n\nAdditional notes or special requests:';
      
      // Add order summary display
      const orderSummaryDiv = document.createElement('div');
      orderSummaryDiv.className = 'order-summary';
      orderSummaryDiv.innerHTML = `
        <h3>Order Summary</h3>
        <div class="order-details">
          <pre>${orderDetails}</pre>
        </div>
        <p class="order-note">
          <strong>Next Steps:</strong> After submitting this form, we'll contact you within 24 hours 
          to confirm your order details, discuss customization options if needed, and arrange payment. 
          Production time is typically 2-3 weeks.
        </p>
      `;
      
      // Insert before the form
      form.parentNode.insertBefore(orderSummaryDiv, form);
    }

    // Clear the pending order from localStorage
    localStorage.removeItem('pending-order');
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Clear previous status
    showStatus('', '');

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Disable submit button
    setSubmitState(true);

    // Collect form data
    const formData = collectFormData();

    try {
      // Check if using Netlify Forms (recommended)
      if (form.getAttribute('netlify') || form.getAttribute('data-netlify')) {
        await submitNetlifyForm(formData);
      } else {
        // Use custom function endpoint
        await submitToFunction(formData);
      }

      // Success — hand off to the thank-you page (matches the form's no-JS action)
      window.location.href = '/thanks.html';
      return;
      
      // Track submission (if analytics enabled)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submission', {
          'event_category': 'engagement',
          'event_label': formData.subject || 'General Inquiry'
        });
      }

    } catch (error) {
      console.error('Form submission error:', error);
      showStatus(
        'Sorry, there was an error sending your message. Please try again or email us directly.',
        'error'
      );
    } finally {
      setSubmitState(false);
    }
  }

  /**
   * Validate form fields
   */
  function validateForm() {
    const errors = [];

    // Check required fields
    if (!formFields.firstName?.value.trim()) {
      errors.push('First name is required');
      highlightError(formFields.firstName);
    }

    if (!formFields.lastName?.value.trim()) {
      errors.push('Last name is required');
      highlightError(formFields.lastName);
    }

    if (!formFields.email?.value.trim()) {
      errors.push('Email is required');
      highlightError(formFields.email);
    } else if (!isValidEmail(formFields.email.value)) {
      errors.push('Please enter a valid email address');
      highlightError(formFields.email);
    }

    if (!formFields.message?.value.trim()) {
      errors.push('Message is required');
      highlightError(formFields.message);
    } else if (formFields.message.value.length < 10) {
      errors.push('Message must be at least 10 characters');
      highlightError(formFields.message);
    }

    // Show errors if any
    if (errors.length > 0) {
      showStatus(errors.join('<br>'), 'error');
      return false;
    }

    return true;
  }

  /**
   * Validate email field
   */
  function validateEmail(e) {
    const email = e.target;
    if (email.value && !isValidEmail(email.value)) {
      email.classList.add('error');
      email.setAttribute('aria-invalid', 'true');
    } else {
      email.classList.remove('error');
      email.setAttribute('aria-invalid', 'false');
    }
  }

  /**
   * Check if email is valid
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Highlight field with error
   */
  function highlightError(field) {
    if (!field) return;
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    field.focus();
    
    // Remove error class on input
    field.addEventListener('input', function removeError() {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      field.removeEventListener('input', removeError);
    });
  }

  /**
   * Collect form data
   */
  function collectFormData() {
    const data = {};
    
    Object.keys(formFields).forEach(key => {
      if (formFields[key]) {
        data[key] = formFields[key].value.trim();
      }
    });

    // Add metadata
    data.timestamp = new Date().toISOString();
    data.pageUrl = window.location.href;
    
    return data;
  }

  /**
   * Submit to Netlify Forms
   */
  async function submitNetlifyForm(data) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    formData.append('form-name', form.getAttribute('name') || 'contact');

    const response = await fetch('/', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Submit to custom function endpoint
   */
  async function submitToFunction(data) {
    const response = await fetch('/.netlify/functions/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Set submit button state
   */
  function setSubmitState(isSubmitting) {
    if (!submitButton) return;

    if (isSubmitting) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.innerHTML = '<span class="spinner"></span> Sending...';
      submitButton.classList.add('submitting');
    } else {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.originalText || 'Send Message';
      submitButton.classList.remove('submitting');
    }
  }

  /**
   * Show status message
   */
  function showStatus(message, type) {
    if (!statusMessage) {
      // Create status element if doesn't exist
      statusMessage = document.createElement('div');
      statusMessage.id = 'form-status';
      statusMessage.setAttribute('role', 'alert');
      statusMessage.setAttribute('aria-live', 'polite');
      form.appendChild(statusMessage);
    }

    statusMessage.innerHTML = message;
    statusMessage.className = `form-status ${type}`;
    statusMessage.style.display = message ? 'block' : 'none';

    // Auto-hide success messages
    if (type === 'success' && message) {
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 5000);
    }

    // Scroll to message
    if (message) {
      statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Add character counter to textarea
   */
  function addCharacterCounter(textarea) {
    const maxLength = 2000;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.setAttribute('aria-live', 'polite');
    textarea.parentNode.appendChild(counter);

    function updateCounter() {
      const remaining = maxLength - textarea.value.length;
      counter.textContent = `${remaining} characters remaining`;
      counter.className = remaining < 100 ? 'character-counter warning' : 'character-counter';
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();