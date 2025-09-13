// Join page specific functionality

// Set timestamp when page loads
function setTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toLocaleString();
    }
}

// Validate form inputs
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
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (this.checkValidity()) {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Store in localStorage (for demonstration)
            localStorage.setItem('membershipApplication', JSON.stringify(data));
            
            // Show success message
            showSubmissionSuccess(data);
            
            // Reset form
            this.reset();
            setTimestamp(); // Reset timestamp
        } else {
            // Show validation errors
            showValidationErrors();
        }
    });
}

// Show success message after form submission
function showSubmissionSuccess(data) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>🎉 Application Submitted Successfully!</h3>
        <p>Thank you, ${data.firstName} ${data.lastName}, for applying for ${data.membershipLevel} membership.</p>
        <p>We'll review your application and contact you at ${data.email} within 2 business days.</p>
        <button onclick="this.parentElement.remove()">Close</button>
    `;
    
    // Style the success message
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 500px;
        width: 90%;
        text-align: center;
        border: 4px solid var(--accent-color);
    `;
    
    successMessage.querySelector('button').style.cssText = `
        background: var(--primary-color);
        color: white;
        padding: var(--spacing-sm) var(--spacing-lg);
        border: none;
        border-radius: var(--border-radius);
        margin-top: var(--spacing-md);
        cursor: pointer;
    `;
    
    // Add to page
    document.body.appendChild(successMessage);
    
    // Log to console for debugging
    console.log('Membership application submitted:', data);
}

// Show validation errors
function showValidationErrors() {
    const form = document.getElementById('membership-form');
    const invalidFields = form.querySelectorAll(':invalid');
    
    // Add error styles to invalid fields
    invalidFields.forEach(field => {
        field.style.borderColor = 'var(--secondary-color)';
        
        // Remove error style when field becomes valid
        field.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '';
            }
        });
    });
    
    // Focus on first invalid field
    if (invalidFields.length > 0) {
        invalidFields[0].focus();
    }
}

// Calculate membership benefits based on level
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
        
        // Trigger change event to show initial state
        levelSelect.dispatchEvent(new Event('change'));
    }
}

// Initialize join page
function initJoin() {
    setTimestamp();
    setupFormValidation();
    setupMembershipCalculator();
}

// Make functions available globally
window.setTimestamp = setTimestamp;
window.setupFormValidation = setupFormValidation;
window.showSubmissionSuccess = showSubmissionSuccess;
window.showValidationErrors = showValidationErrors;
window.setupMembershipCalculator = setupMembershipCalculator;
window.initJoin = initJoin;

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJoin);
} else {
    initJoin();
}
