// Global variables
let membersData = [];
let currentView = 'grid';

console.log('directory.js loaded successfully');

// Function to fetch member data from JSON file
async function getMembersData() {
    console.log('getMembersData() called');
    
    try {
        console.log('Attempting to fetch ./members.json');
        const response = await fetch('./members.json');
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully parsed JSON data:', data);
        
        membersData = data.members;
        console.log('Members data set:', membersData);
        
        return membersData;
        
    } catch (error) {
        console.error('Error fetching member data:', error);
        // Fallback to empty array if fetch fails
        return [];
    }
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
async function initDirectory() {
    console.log('initDirectory() called');
    
    try {
        // Show loading state
        const directoryContainer = document.getElementById('directory');
        if (directoryContainer) {
            directoryContainer.innerHTML = '<p class="loading">Loading member data...</p>';
            console.log('Set loading message');
        }
        
        // Fetch member data
        console.log('Calling getMembersData()...');
        await getMembersData();
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
