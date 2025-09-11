const url = 'https://byui-cse.github.io/cse121b-ww-course/resources/prophets.json';
const cards = document.querySelector('#cards');

// Async function to get prophet data
async function getProphetData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch data');
        }
        const data = await response.json();
        
        // Check the data structure
        console.table(data.prophets);
        
        // Comment out the console.table after checking and use this instead:
        displayProphets(data.prophets);
                
    } catch (error) {
        console.error('Error fetching data:', error);
        cards.innerHTML = `<p class="error">Error loading data: ${error.message}</p>`;
    }
}

// Function to display prophets
const displayProphets = (prophets) => {
    cards.innerHTML = ''; // Clear any existing content
    
    prophets.forEach((prophet) => {
        // Create card element
        const card = document.createElement('section');
        card.classList.add('card');
        
        // Create elements for the prophet data
        const fullName = document.createElement('h2');
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        const portrait = document.createElement('img');
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        
        const birthDate = document.createElement('p');
        birthDate.innerHTML = `<strong>Date of Birth:</strong> ${prophet.birthdate}`;
        
        const birthPlace = document.createElement('p');
        birthPlace.innerHTML = `<strong>Place of Birth:</strong> ${prophet.birthplace}`;
        
        // Add more details if available in the JSON
        if (prophet.numofchildren) {
            const numChildren = document.createElement('p');
            numChildren.innerHTML = `<strong>Children:</strong> ${prophet.numofchildren}`;
            card.appendChild(numChildren);
        }
        
        if (prophet.death) {
            const death = document.createElement('p');
            death.innerHTML = `<strong>Death:</strong> ${prophet.death}`;
            card.appendChild(death);
        }
        
        if (prophet.length) {
            const length = document.createElement('p');
            length.innerHTML = `<strong>Years as Prophet:</strong> ${prophet.length}`;
            card.appendChild(length);
        }
        
        // Create container for text content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.appendChild(birthDate);
        cardContent.appendChild(birthPlace);
        
        // Add all elements to the card
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(cardContent);
        
        // Add the card to the DOM
        cards.appendChild(card);
    });
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', getProphetData);
