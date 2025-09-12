// Global variables
let membersData = [];
let currentView = 'grid';

console.log('directory.js loaded successfully');

// Use hardcoded data instead of fetching
function getMembersData() {
    console.log('Using fallback data instead of fetching JSON');
    
    // Your fallback data
    return [
        {
            "name": "Kambale Enterprises",
            "address": "123 Main Street, Kambale City",
            "phone": "+243 999 888 777",
            "url": "https://kambale-enterprises.com",
            "imageurl": "https://placehold.co/300x200/1a2a6c/ffffff?text=Kambale+Enterprises",
            "membershipLevel": 3,
            "description": "Leading provider of technology solutions and consulting services"
        },
        {
            "name": "Trovas Grocery Store",
            "address": "456 Market Road, Kambale City",
            "phone": "+243 999 777 666",
            "url": "https://trovassupermarket.com",
            "imageurl": "https://placehold.co/300x200/b21f1f/ffffff?text=Trovas+Grocery",
            "membershipLevel": 2,
            "description": "Your one-stop shop for fresh produce and household items"
        },
        {
            "name": "Kambale Construction Ltd",
            "address": "789 Builder's Avenue, Kambale City",
            "phone": "+243 999 666 555",
            "url": "https://kambaleconstruction.com",
            "imageurl": "https://placehold.co/300x200/fdbb2d/000000?text=Kambale+Construction",
            "membershipLevel": 3,
            "description": "Quality construction services for residential and commercial projects"
        },
        {
            "name": "Digital Solutions Africa",
            "address": "321 Tech Street, Kambale City",
            "phone": "+243 999 555 444",
            "url": "https://digitalsolutions.africa",
            "imageurl": "https://placehold.co/300x200/1a2a6c/ffffff?text=Digital+Solutions",
            "membershipLevel": 2,
            "description": "Digital marketing and web development services"
        },
        {
            "name": "Kambale Health Clinic",
            "address": "654 Healthcare Road, Kambale City",
            "phone": "+243 999 444 333",
            "url": "https://kambaleclinic.com",
            "imageurl": "https://placehold.co/300x200/28a745/ffffff?text=Kambale+Clinic",
            "membershipLevel": 1,
            "description": "Comprehensive healthcare services for the community"
        },
        {
            "name": "Green Fields Agriculture",
            "address": "987 Farm Lane, Kambale City",
            "phone": "+243 999 333 222",
            "url": "https://greenfieldsagriculture.com",
            "imageurl": "https://placehold.co/300x200/198754/ffffff?text=Green+Fields",
            "membershipLevel": 2,
            "description": "Sustainable farming and agricultural products"
        },
        {
            "name": "Kambale Transport Services",
            "address": "147 Transport Avenue, Kambale City",
            "phone": "+243 999 222 111",
            "url": "https://kambaletransport.com",
            "imageurl": "https://placehold.co/300x200/6f42c1/ffffff?text=Kambale+Transport",
            "membershipLevel": 1,
            "description": "Reliable transportation and logistics solutions"
        }
    ];
}

// Function to display members based on view type
function displayMembers(viewType = 'grid') {
    console.log('displayMembers() called with viewType:', viewType);
    
    const directoryContainer = document.getElementById('directory');
    console.log('Directory container:', directoryContainer);
    
    if (!directoryContainer) {
        console.error('Directory container not found');
        return;
    }
    
    // Clear previous content
    directoryContainer.innerHTML = '';
    
    // Set the current view class
    directoryContainer.className = viewType + '-view';
    currentView = viewType;
    console.log('Set view class to:', directoryContainer.className);
    
    // Update button states
    updateButtonStates(viewType);
    
    if (membersData.length === 0) {
        console.log('No member data available, showing message');
        directoryContainer.innerHTML = '<p class="no-data">No member data available.</p>';
        return;
    }
    
    console.log('Displaying', membersData.length, 'members');
    
    // Create and append member cards
    membersData.forEach((member, index) => {
        console.log('Creating card for member', index, ':', member.name);
        const memberCard = createMemberCard(member, viewType);
        directoryContainer.appendChild(memberCard);
    });
}

// Function to create a member card element
function createMemberCard(member, viewType) {
    console.log('createMemberCard() for:', member.name);
    
    const card = document.createElement('article');
    card.className = 'member-card';
    
    // Determine membership level text
    let membershipText = '';
    switch(member.membershipLevel) {
        case 1:
            membershipText = 'Member';
            break;
        case 2:
            membershipText = 'Silver Member';
            break;
        case 3:
            membershipText = 'Gold Member';
            break;
        default:
            membershipText = 'Member';
    }
    
    if (viewType === 'grid') {
        card.innerHTML = `
            <img src="${member.imageurl}" alt="${member.name}" loading="lazy" width="300" height="200">
            <div class="member-card-content">
                <h3>${member.name}</h3>
                <p class="address">${member.address}</p>
                <p class="description">${member.description}</p>
                <div class="phone">
                    <span>📞</span>
                    <a href="tel:${member.phone}">${member.phone}</a>
                </div>
                <div class="website">
                    <span>🌐</span>
                    <a href="${member.url}" target="_blank" rel="noopener">Visit Website</a>
                </div>
                <span class="membership-level" data-level="${member.membershipLevel}">${membershipText}</span>
            </div>
        `;
    } else {
        // List view layout
        card.innerHTML = `
            <img src="${member.imageurl}" alt="${member.name}" loading="lazy" width="100" height="100">
            <div class="member-card-content">
                <h3>${member.name}</h3>
                <p class="address">${member.address}</p>
                <div class="contact-info">
                    <div class="phone">
                        <span>📞</span>
                        <a href="tel:${member.phone}">${member.phone}</a>
                    </div>
                    <div class="website">
                        <span>🌐</span>
                        <a href="${member.url}" target="_blank" rel="noopener">Website</a>
                    </div>
                </div>
                <span class="membership-level" data-level="${member.membershipLevel}">${membershipText}</span>
            </div>
        `;
    }
    
    return card;
}

// Function to update button active states
function updateButtonStates(activeView) {
    console.log('updateButtonStates() called with:', activeView);
    
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');
    
    console.log('Grid button:', gridBtn);
    console.log('List button:', listBtn);
    
    if (gridBtn && listBtn) {
        if (activeView === 'grid') {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            console.log('Set grid button as active');
        } else {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            console.log('Set list button as active');
        }
    }
}

// Function to set up view toggle functionality
function setupViewToggle() {
    console.log('setupViewToggle() called');
    
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');
    
    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            console.log('Grid button clicked');
            if (currentView !== 'grid') {
                displayMembers('grid');
            }
        });
        
        listBtn.addEventListener('click', () => {
            console.log('List button clicked');
            if (currentView !== 'list') {
                displayMembers('list');
            }
        });
        
        console.log('View toggle event listeners added');
    }
}

// Function to initialize the directory page
function initDirectory() {
    console.log('initDirectory() called');
    
    try {
        // Show loading state
        const directoryContainer = document.getElementById('directory');
        if (directoryContainer) {
            directoryContainer.innerHTML = '<p class="loading">Loading member data...</p>';
            console.log('Set loading message');
        }
        
        // Get member data (using fallback)
        console.log('Calling getMembersData()...');
        membersData = getMembersData();
        console.log('getMembersData() completed, membersData:', membersData);
        
        // Set up view toggle
        console.log('Setting up view toggle...');
        setupViewToggle();
        
        // Display members in default view (grid)
        console.log('Calling displayMembers("grid")...');
        displayMembers('grid');
        
        console.log('initDirectory() completed successfully');
        
    } catch (error) {
        console.error('Error in initDirectory:', error);
        const directoryContainer = document.getElementById('directory');
        if (directoryContainer) {
            directoryContainer.innerHTML = `
                <div class="error">
                    <p>Failed to load member data. Please try again later.</p>
                    <button onclick="initDirectory()">Retry</button>
                </div>
            `;
        }
    }
}

// Make initDirectory available globally for the retry button
window.initDirectory = initDirectory;

// Initialize when DOM is fully loaded
console.log('Adding DOMContentLoaded event listener...');
document.addEventListener('DOMContentLoaded', initDirectory);

// Add some additional styles for loading and error states
const style = document.createElement('style');
style.textContent = `
    .loading, .no-data, .error {
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        color: var(--medium-gray);
    }
    
    .error {
        color: var(--secondary-color);
    }
    
    .error button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
    }
    
    .error button:hover {
        background-color: var(--secondary-color);
    }
    
    .contact-info {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(style);
console.log('Added dynamic styles');
