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
    
    // Adding retry functionality on double click (during development)
    programmaticLogo.addEventListener('dblclick', function() {
        console.log('Attempting to reload logo');
        loadLogo();
    });
}
// const url = `https://api.openweathermap.org/data/2.5/forecast?lat=32°39'05"E&lon=0°23'08"N&units=imperial&appid=WEATHER_API_KEY`;
//  the displayWeather 
async function displayWeather() {
    const weatherElement = document.getElementById('weather');
    if (!weatherElement) return;

    // Using a free weather API (example - may have limitations)
    const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=0.3864&longitude=32.6514&current=temperature_2m,weather_code&daily=temperature_2m_max&temperature_unit=fahrenheit';
    
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            // Processing the data accordingly
            weatherElement.innerHTML = `
                <p><strong>Current:</strong> ${data.current.temperature_2m}°F</p>
                <p><strong>Forecast:</strong> 
                    Today: ${data.daily.temperature_2m_max[0]}°F,
                    Tomorrow: ${data.daily.temperature_2m_max[1]}°F
                </p>
            `;
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherElement.innerHTML = `<p>Weather data unavailable</p>`;
    }
}


//  spotlights
async function displaySpotlights() {
    const spotlightsContainer = document.querySelector('.spotlights');
    if (!spotlightsContainer) return;

    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        
        // Accessing the members array from the JSON structure
        const members = data.members;

        // Filtering for Gold (3) and Silver (2) members
        const qualifiedMembers = members.filter(member => member.membershipLevel >= 2);

        // Randomly selecting 2 - 3 members
        const selectedMembers = [];
        const count = Math.min(Math.floor(Math.random() * 2) + 2, qualifiedMembers.length);
        const indices = new Set();
        while(indices.size < count) {
            indices.add(Math.floor(Math.random() * qualifiedMembers.length));
        }
        indices.forEach(index => selectedMembers.push(qualifiedMembers[index]));

        // Generating HTML for each spotlight
        spotlightsContainer.innerHTML = ''; 
        selectedMembers.forEach(member => {
            const spotlightDiv = document.createElement('div');
            spotlightDiv.className = 'spotlight';
            spotlightDiv.innerHTML = `
                <img src="${member.imageurl}" alt="${member.name} Logo" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.description || ''}</p>
                <hr>
                <p>${member.address}<br>${member.phone}<br><a href="${member.url}" target="_blank">Website</a></p>
            `;
            spotlightsContainer.appendChild(spotlightDiv);
        });

    } catch (error) {
        console.error('Error fetching or parsing members data:', error);
    }
}


// Initializing when DOM is loaded
function initHome() {
    loadLogo();
    displayWeather(); 
    displaySpotlights(); // Calling the new JSON function
}

// Making functions available globally
window.loadLogo = loadLogo;
window.createProgrammaticLogo = createProgrammaticLogo;
window.displayWeather = displayWeather;
window.initHome = initHome;

// Initializing when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}
