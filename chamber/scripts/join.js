// Joining page specific functionality

// Setting timestamp when page loads
function setTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toLocaleString();
    }
}

// Validating form inputs
function setupFormValidation() {
    const form = document.getElementById('membership-form');
    if (!form) return;
    
    // Title validation: at least 7 characters, letters, hyphens, and spaces only
    const titleInput = document.getElementById('title');
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 7) {
                this.setCustomValidity('Title must be at least 7 characters long');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Form submission handler - UPDATED for GET submission to thankyou.html
    form.addEventListener('submit', function(e) {
        // Updating timestamp right before submission
        setTimestamp();
        
        // Validating form - only prevent default if invalid
        if (!this.checkValidity()) {
            e.preventDefault();
            showValidationErrors();
            return;
        }
        
        // If form is valid, we'll allow natural submission to thankyou.html
        // The form will submit via GET method with all data as URL parameters
        console.log('Form is valid, submitting to thankyou.html...');
        
        // Optional: Show a brief loading message
        showLoadingMessage();
    });
}

// Showing brief loading message before redirect
function showLoadingMessage() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Resetting button after short delay (form will have submitted by then)
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Showing validation errors
function showValidationErrors() {
    const form = document.getElementById('membership-form');
    const invalidFields = form.querySelectorAll(':invalid');
    
    // Adding error styles to invalid fields
    invalidFields.forEach(field => {
        field.style.borderColor = 'var(--secondary-color)';
        
        // Removing error style when field becomes valid
        field.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '';
            }
        });
    });
    
    // Focussing on first invalid field
    if (invalidFields.length > 0) {
        invalidFields[0].focus();
    }
    
    // Showing error message
    showErrorMessage('Please fix the errors above before submitting.');
}

// Showing error message
function showErrorMessage(message) {
    // Removing existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <p>❌ ${message}</p>
    `;
    
    // Styling the error message
    errorMessage.style.cssText = `
        background: var(--secondary-color);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        margin: var(--spacing-md) 0;
        text-align: center;
        font-weight: bold;
    `;
    
    // Inserting after the form
    const form = document.getElementById('membership-form');
    form.parentNode.insertBefore(errorMessage, form.nextSibling);
    
    // Auto-removing after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 5000);
}

// Calculating membership benefits based on level
function setupMembershipCalculator() {
    const levelSelect = document.getElementById('membershipLevel');
    const benefitsContainer = document.createElement('div');
    benefitsContainer.id = 'dynamic-benefits';
    benefitsContainer.style.marginTop = 'var(--spacing-md)';
    benefitsContainer.style.padding = 'var(--spacing-md)';
    benefitsContainer.style.background = 'var(--light-gray)';
    benefitsContainer.style.borderRadius = 'var(--border-radius)';
    
    if (levelSelect) {
        levelSelect.insertAdjacentElement('afterend', benefitsContainer);
        
        levelSelect.addEventListener('change', function() {
            const level = this.value;
            let benefits = '';
            
            switch(level) {
                case 'np':
                    benefits = '<strong>NP Benefits:</strong> Basic listing, newsletter access, public events';
                    break;
                case 'bronze':
                    benefits = '<strong>Bronze Benefits:</strong> Enhanced listing, workshops, networking events';
                    break;
                case 'silver':
                    benefits = '<strong>Silver Benefits:</strong> Featured listing, priority registration, training discounts';
                    break;
                case 'gold':
                    benefits = '<strong>Gold Benefits:</strong> Premium listing, sponsorship opportunities, exclusive events';
                    break;
                default:
                    benefits = 'Select a membership level to see benefits';
            }
            
            benefitsContainer.innerHTML = benefits;
        });
        
        // Triggering change event to show initial state
        levelSelect.dispatchEvent(new Event('change'));
    }
}

// Enhancing real-time validation feedback
function setupRealTimeValidation() {
    const form = document.getElementById('membership-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.checkValidity() && this.value.length > 0) {
                this.style.borderColor = 'var(--secondary-color)';
                showFieldError(this, this.validationMessage);
            } else {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
    });
}

// Showing field-specific error message
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--secondary-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: bold;
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Clearing field-specific error message
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Initializing join page
function initJoin() {
    setTimestamp();
    setupFormValidation();
    setupMembershipCalculator();
    setupRealTimeValidation();
}

// Making functions available globally
window.setTimestamp = setTimestamp;
window.setupFormValidation = setupFormValidation;
window.showValidationErrors = showValidationErrors;
window.setupMembershipCalculator = setupMembershipCalculator;
window.initJoin = initJoin;

// Initializing when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJoin);
} else {
    initJoin();
}