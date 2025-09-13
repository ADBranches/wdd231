// Function to handle logo loading with proper error handling
function loadLogo() {
    const logoContainer = document.getElementById('logo-container');
    if (!logoContainer) return;
    
    const logoImg = new Image();
    logoImg.src = 'images/logo.svg';
    logoImg.alt = 'Kambale Chamber of Commerce Logo';
    logoImg.width = 100;
    logoImg.height = 100;
    
    logoImg.onload = function() {
        console.log('Logo loaded successfully');
        logoContainer.appendChild(logoImg);
    };
    
    logoImg.onerror = function() {
        console.log('Custom logo not found. Using programmatic logo instead.');
        createProgrammaticLogo(logoContainer);
    };
    
    // timeout in case the image never loads or errors
    setTimeout(function() {
        if (!logoImg.complete || logoImg.naturalWidth === 0) {
            console.log('Logo load timeout. Using programmatic logo instead.');
            if (logoContainer.childNodes.length === 0) {
                createProgrammaticLogo(logoContainer);
            }
        }
    }, 2000);
}

// Creating a programmatic logo as fallback
function createProgrammaticLogo(container) {
    const programmaticLogo = document.createElement('div');
    programmaticLogo.className = 'programmatic-logo';
    programmaticLogo.textContent = 'KCC';
    programmaticLogo.title = 'Kambale Chamber of Commerce - Custom logo coming soon';
    
    // Clearing container and adding the programmatic logo
    container.innerHTML = '';
    container.appendChild(programmaticLogo);
    
    // Adding retry functionality on double click (for development)
    programmaticLogo.addEventListener('dblclick', function() {
        console.log('Attempting to reload logo');
        loadLogo();
    });
}

// Simple weather display (mock data)
function displayWeather() {
    const weatherElement = document.getElementById('weather');
    if (weatherElement) {
        weatherElement.innerHTML = `
            <p><strong>Current Conditions:</strong> Sunny</p>
            <p><strong>Temperature:</strong> 28°C / 82°F</p>
            <p><strong>Humidity:</strong> 45%</p>
            <p><strong>Forecast:</strong> Clear skies throughout the week</p>
        `;
    }
}

// Initializing when DOM is loaded
function initHome() {
    // Loading logo with proper error handling
    loadLogo();
    
    // Display weather information
    displayWeather();
}

// Make functions available globally
window.loadLogo = loadLogo;
window.createProgrammaticLogo = createProgrammaticLogo;
window.displayWeather = displayWeather;
window.initHome = initHome;

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}
