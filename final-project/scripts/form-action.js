// Form Action Page Functionality
function displayFormData() {
    const params = new URLSearchParams(window.location.search);
    const formDataContainer = document.getElementById('form-data-display');
    const submissionIdElement = document.getElementById('submission-id');
    
    if (!params.toString()) {
        formDataContainer.innerHTML = `
            <div class="error-message">
                <p>No form data found. Please submit the movie suggestion form first.</p>
                <a href="catalog.html" class="btn btn-primary">Go to Suggestion Form</a>
            </div>
        `;
        return;
    }
    
    // Generate a unique submission ID
    const submissionId = generateSubmissionId();
    if (submissionIdElement) {
        submissionIdElement.textContent = submissionId;
    }
    
    // Format and display form data
    const formData = {
        'Movie Title': params.get('movieTitle'),
        'Release Year': params.get('releaseYear'),
        'Genre': formatGenre(params.get('movieGenre')),
        'Director': params.get('directorName') || 'Not provided',
        'Your Name': params.get('suggesterName'),
        'Your Email': params.get('suggesterEmail'),
        'Description': params.get('movieDescription'),
        'Additional Notes': params.get('movieNotes') || 'None provided',
        'Submitted': params.get('submissionTimestamp') || new Date().toLocaleString()
    };
    
    // Create HTML for form data display
    const formDataHTML = Object.entries(formData)
        .map(([key, value]) => `
            <div class="data-item">
                <div class="data-label">${key}</div>
                <div class="data-value">${value}</div>
            </div>
        `).join('');
    
    formDataContainer.innerHTML = formDataHTML;
    
    // Store in localStorage for demonstration
    storeSubmissionInLocalStorage(formData, submissionId);
}

function generateSubmissionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `MOV-${timestamp}-${random}`.toUpperCase();
}

function formatGenre(genre) {
    const genreMap = {
        'action': 'Action',
        'comedy': 'Comedy', 
        'drama': 'Drama',
        'horror': 'Horror',
        'sci-fi': 'Science Fiction',
        'romance': 'Romance',
        'thriller': 'Thriller',
        'documentary': 'Documentary',
        'animation': 'Animation',
        'fantasy': 'Fantasy',
        'other': 'Other'
    };
    return genreMap[genre] || genre;
}

function storeSubmissionInLocalStorage(formData, submissionId) {
    try {
        const submissions = JSON.parse(localStorage.getItem('movieSubmissions') || '[]');
        submissions.push({
            id: submissionId,
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('movieSubmissions', JSON.stringify(submissions));
        console.log('Submission stored in localStorage:', submissionId);
    } catch (error) {
        console.error('Error storing submission:', error);
    }
}

function setupFormActionPage() {
    displayFormData();
    
    // Setup "Suggest Another" button
    const suggestAnotherBtn = document.getElementById('suggest-another');
    if (suggestAnotherBtn) {
        suggestAnotherBtn.addEventListener('click', () => {
            window.location.href = 'catalog.html#suggestion-form';
        });
    }
    
    // Add some interactive effects
    addConfettiEffect();
}

function addConfettiEffect() {
    // Simple confetti effect for celebration
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
        background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
        animation: confettiFade 2s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFade {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.remove();
        }
    }, 2000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupFormActionPage);
