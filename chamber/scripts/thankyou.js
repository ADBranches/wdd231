// Displaying form data from URL parameters on thankyou.html
function displayApplicationDetails() {
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('application-details');
    
    if (!container) return;
    
    // Getting all form values
    const firstName = params.get('firstName') || 'Not provided';
    const lastName = params.get('lastName') || 'Not provided';
    const title = params.get('title') || 'Not provided';
    const email = params.get('email') || 'Not provided';
    const phone = params.get('phone') || 'Not provided';
    const businessName = params.get('businessName') || 'Not provided';
    const businessType = params.get('businessType') || 'Not provided';
    const membershipLevel = params.get('membershipLevel') || 'Not provided';
    const businessDescription = params.get('businessDescription') || 'Not provided';
    const timestamp = params.get('timestamp') || new Date().toLocaleString();
    
    // Formatting membership level for display
    const membershipDisplay = formatMembershipLevel(membershipLevel);
    
    // Creating the application details HTML
    container.innerHTML = `
        <div class="detail-grid">
            <div class="detail-section">
                <h4>Personal Information</h4>
                <div class="detail-item">
                    <strong>Full Name:</strong> ${firstName} ${lastName}
                </div>
                <div class="detail-item">
                    <strong>Title/Position:</strong> ${title}
                </div>
                <div class="detail-item">
                    <strong>Email:</strong> ${email}
                </div>
                <div class="detail-item">
                    <strong>Mobile Phone:</strong> ${phone}
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Business Information</h4>
                <div class="detail-item">
                    <strong>Business Name:</strong> ${businessName}
                </div>
                <div class="detail-item">
                    <strong>Business Type:</strong> ${formatBusinessType(businessType)}
                </div>
                <div class="detail-item">
                    <strong>Membership Level:</strong> ${membershipDisplay}
                </div>
                <div class="detail-item">
                    <strong>Business Description:</strong> ${businessDescription}
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Application Details</h4>
                <div class="detail-item">
                    <strong>Application Date:</strong> ${timestamp}
                </div>
                <div class="detail-item">
                    <strong>Application ID:</strong> #${generateApplicationId()}
                </div>
                <div class="detail-item">
                    <strong>Status:</strong> <span class="status-pending">Pending Review</span>
                </div>
            </div>
        </div>
    `;
    
    // Logging the application data for debugging
    console.log('Application details displayed:', {
        firstName,
        lastName,
        email,
        businessName,
        membershipLevel,
        timestamp
    });
}

// Formatting membership level for display
function formatMembershipLevel(level) {
    const levels = {
        'np': 'NP Membership (Non-Profit) - Free',
        'bronze': 'Bronze Membership - $200/year',
        'silver': 'Silver Membership - $400/year',
        'gold': 'Gold Membership - $600/year'
    };
    return levels[level] || level;
}

// Formatting business type for display
function formatBusinessType(type) {
    const types = {
        'retail': 'Retail',
        'service': 'Service',
        'manufacturing': 'Manufacturing',
        'technology': 'Technology',
        'healthcare': 'Healthcare',
        'other': 'Other'
    };
    return types[type] || type || 'Not specified';
}

// Generating a simple application ID
function generateApplicationId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Initializing the thankyou page
function initThankYou() {
    displayApplicationDetails();
    
    // Updating footer dates
    if (typeof updateFooterDates === 'function') {
        updateFooterDates();
    }
}

// Making functions available globally
window.displayApplicationDetails = displayApplicationDetails;
window.initThankYou = initThankYou;

// Initializing when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThankYou);
} else {
    initThankYou();
}
