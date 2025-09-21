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
// 0°23'08"N 32°39'05"E
//  the displayWeather 
async function displayWeather() {
    const weatherElement = document.getElementById('weather');
    if (!weatherElement) return;

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=32°39'05"E&lon=0°23'08"N&units=imperial&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data); // Check the data structure in the console
            // Update current weather
            const current = data.list[0];
            weatherElement.innerHTML = `
                <p><strong>Current:</strong> ${current.main.temp.toFixed(0)}°F, ${current.weather[0].description}</p>
                <p><strong>Forecast:</strong> 
                    Today: ${data.list[0].main.temp.toFixed(0)}°F,
                    Tomorrow: ${data.list[8].main.temp.toFixed(0)}°F,
                    ${data.list[16].main.temp.toFixed(0)}°F
                </p>
            `;
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherElement.innerHTML = `<p>Error loading weather data. Check console.</p>`;
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
