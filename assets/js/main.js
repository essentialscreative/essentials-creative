// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Smooth scrolling for CTA button
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        if (button.getAttribute('href')?.startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Form validation for newsletter
    const newsletterForms = document.querySelectorAll('form[action*="formspree"]');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !emailInput.value.includes('@')) {
                e.preventDefault();
                alert('Please enter a valid email address');
            }
        });
    });
});