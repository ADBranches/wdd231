// Constants - Using the correct URL from the PDF instructions
const url = 'https://www.churchofjesuschrist.org/study/manual/gospel-art-book/latter-day-prophets?lang=eng';
const cards = document.querySelector('#cards');

const prophetImages = {
    "Joseph Smith": "joseph-smith-jr.webp",
    "Brigham Young": "brigham-young.webp",
    "John Taylor": "john-taylor.webp",
    "Wilford Woodruff": "wilford-woodruff.webp",
    "Lorenzo Snow": "lorenzo-snow.webp",
    "Joseph F. Smith": "joseph-f-smith.webp",
    "Heber J. Grant": "heber-j-grant.webp",
    "George Albert Smith": "george-albert-smith.webp",
    "David O. McKay": "david-o-mckay.webp",
    "Joseph Fielding Smith": "joseph-fielding-smith.webp",
    "Harold B. Lee": "harold-b-lee.webp",
    "Spencer W. Kimball": "spencer-w-kimball.webp",
    "Ezra Taft Benson": "ezra-taft-benson.webp",
    "Howard W. Hunter": "w-hunter.webp",
    "Gordon B. Hinckley": "gordon-b-hinckley.webp",
    "Thomas S. Monson": "thomas-s-monson.webp",
    "Russell M. Nelson": "russell-m-nelson.webp"
};

const fallbackData = {
    prophets: [
        {
            name: "Joseph",
            lastname: "Smith",
            birthdate: "December 23, 1805",
            birthplace: "Vermont",
            numofchildren: 11,
            death: "June 27, 1844",
            length: "14 years",
            imageurl: "images/joseph-smith-jr.webp"
        },
        {
            name: "Brigham",
            lastname: "Young",
            birthdate: "June 1, 1801",
            birthplace: "Vermont",
            numofchildren: 56,
            death: "August 29, 1877",
            length: "29 years",
            imageurl: "images/brigham-young.webp"
        },
        {
            name: "John",
            lastname: "Taylor",
            birthdate: "November 1, 1808",
            birthplace: "England",
            numofchildren: 34,
            death: "July 25, 1887",
            length: "7 years",
            imageurl: "images/john-taylor.webp"
        },
        {
            name: "Wilford",
            lastname: "Woodruff",
            birthdate: "March 1, 1807",
            birthplace: "Connecticut",
            numofchildren: 34,
            death: "September 2, 1898",
            length: "9 years",
            imageurl: "images/wilford-woodruff.webp"
        },
        {
            name: "Lorenzo",
            lastname: "Snow",
            birthdate: "April 3, 1814",
            birthplace: "Ohio",
            numofchildren: 42,
            death: "October 10, 1901",
            length: "3 years",
            imageurl: "images/lorenzo-snow.webp"
        },
        {
            name: "Joseph F.",
            lastname: "Smith",
            birthdate: "November 13, 1838",
            birthplace: "Missouri",
            numofchildren: 45,
            death: "November 19, 1918",
            length: "17 years",
            imageurl: "images/joseph-f-smith.webp"
        },
        {
            name: "Heber J.",
            lastname: "Grant",
            birthdate: "November 22, 1856",
            birthplace: "Utah",
            numofchildren: 12,
            death: "May 14, 1945",
            length: "26 years",
            imageurl: "images/heber-j-grant.webp"
        },
        {
            name: "George Albert",
            lastname: "Smith",
            birthdate: "April 4, 1870",
            birthplace: "Utah",
            numofchildren: 3,
            death: "April 4, 1951",
            length: "6 years",
            imageurl: "images/george-albert-smith.webp"
        },
        {
            name: "David O.",
            lastname: "McKay",
            birthdate: "September 8, 1873",
            birthplace: "Utah",
            numofchildren: 7,
            death: "January 18, 1970",
            length: "18 years",
            imageurl: "images/david-o-mckay.webp"
        },
        {
            name: "Joseph Fielding",
            lastname: "Smith",
            birthdate: "July 19, 1876",
            birthplace: "Utah",
            numofchildren: 11,
            death: "July 2, 1972",
            length: "2 years",
            imageurl: "images/joseph-fielding-smith.webp"
        },
        {
            name: "Harold B.",
            lastname: "Lee",
            birthdate: "March 28, 1899",
            birthplace: "Idaho",
            numofchildren: 2,
            death: "December 26, 1973",
            length: "1.5 years",
            imageurl: "images/harold-b-lee.webp"
        },
        {
            name: "Spencer W.",
            lastname: "Kimball",
            birthdate: "March 28, 1895",
            birthplace: "Utah",
            numofchildren: 4,
            death: "November 5, 1985",
            length: "12 years",
            imageurl: "images/spencer-w-kimball.webp"
        },
        {
            name: "Ezra Taft",
            lastname: "Benson",
            birthdate: "August 4, 1899",
            birthplace: "Idaho",
            numofchildren: 6,
            death: "May 30, 1994",
            length: "9 years",
            imageurl: "images/ezra-taft-benson.webp"
        },
        {
            name: "Howard W.",
            lastname: "Hunter",
            birthdate: "November 14, 1907",
            birthplace: "Idaho",
            numofchildren: 3,
            death: "March 3, 1995",
            length: "9 months",
            imageurl: "images/w-hunter.webp"
        },
        {
            name: "Gordon B.",
            lastname: "Hinckley",
            birthdate: "June 23, 1910",
            birthplace: "Utah",
            numofchildren: 5,
            death: "January 27, 2008",
            length: "13 years",
            imageurl: "images/gordon-b-hinckley.webp"
        },
        {
            name: "Thomas S.",
            lastname: "Monson",
            birthdate: "August 21, 1927",
            birthplace: "Utah",
            numofchildren: 3,
            death: "January 2, 2018",
            length: "10 years",
            imageurl: "images/thomas-s-monson.webp"
        },
        {
            name: "Russell M.",
            lastname: "Nelson",
            birthdate: "September 9, 1924",
            birthplace: "Utah",
            numofchildren: 10,
            death: null,
            length: "6+ years",
            imageurl: "images/russell-m-nelson.webp"
        }
    ]
};

async function getProphetData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch data from server. Using fallback data.');
        }
        const data = await response.json();
        
        // Checking the data structure
        console.table(data.prophets);
        
        // Processing the data to use local images
        const processedData = processProphetData(data.prophets);
        
        // Displaying the data
        displayProphets(processedData);
                
    } catch (error) {
        console.warn('Error fetching data:', error.message);
        console.info('Using fallback data instead');
        displayProphets(fallbackData.prophets);
        
        // warning to the user
        const warning = document.createElement('div');
        warning.className = 'warning';
        warning.innerHTML = `<p>Note: Using fallback data as the server is temporarily unavailable.</p>`;
        cards.before(warning);
    }
}

// Function to process prophet data and use local images
function processProphetData(prophets) {
    return prophets.map(prophet => {
        const fullName = `${prophet.name} ${prophet.lastname}`;
        return {
            ...prophet,
            imageurl: prophetImages[fullName] ? `images/${prophetImages[fullName]}` : 'images/default-prophet.jpg'
        };
    });
}

// Function to display prophets
const displayProphets = (prophets) => {
    cards.innerHTML = ''; // Clear any existing content
    
    prophets.forEach((prophet) => {
        // card element
        const card = document.createElement('section');
        card.classList.add('card');
        
        // elements for the prophet data
        const fullName = document.createElement('h2');
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        const portrait = document.createElement('img');
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        
        // error handling for images
        portrait.onerror = function() {
            this.src = 'images/default-prophet.jpg';
            this.alt = 'Default prophet image';
        };
        
        const birthDate = document.createElement('p');
        birthDate.innerHTML = `<strong>Date of Birth:</strong> ${prophet.birthdate}`;
        
        const birthPlace = document.createElement('p');
        birthPlace.innerHTML = `<strong>Place of Birth:</strong> ${prophet.birthplace}`;
        
        // container for text content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.appendChild(birthDate);
        cardContent.appendChild(birthPlace);
        
        // Adding more details if available in the JSON
        if (prophet.numofchildren) {
            const numChildren = document.createElement('p');
            numChildren.innerHTML = `<strong>Children:</strong> ${prophet.numofchildren}`;
            cardContent.appendChild(numChildren);
        }
        
        if (prophet.death) {
            const death = document.createElement('p');
            death.innerHTML = `<strong>Death:</strong> ${prophet.death}`;
            cardContent.appendChild(death);
        } else {
            const status = document.createElement('p');
            status.innerHTML = `<strong>Status:</strong> Current President`;
            status.style.color = 'var(--secondary-color)';
            status.style.fontWeight = 'bold';
            cardContent.appendChild(status);
        }
        
        if (prophet.length) {
            const length = document.createElement('p');
            length.innerHTML = `<strong>Years as Prophet:</strong> ${prophet.length}`;
            cardContent.appendChild(length);
        }
        
        // Adding all elements to the card
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(cardContent);
        
        // Adding the card to the DOM
        cards.appendChild(card);
    });
};

// Initializing the page when DOM is loaded
document.addEventListener('DOMContentLoaded', getProphetData);
