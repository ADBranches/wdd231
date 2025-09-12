// Global variables
let membersData = [];
let currentView = 'grid';

// Use hardcoded data instead of fetching
function getMembersData() {
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
        // ... (other member objects)
    ];
}

// Function to display members based on view type
function displayMembers(viewType = 'grid') {
    const directoryContainer = document.getElementById('directory');
    
    if (!directoryContainer) return;
    
    directoryContainer.innerHTML = '';
    directoryContainer.className = viewType + '-view';
    currentView = viewType;
    
    updateButtonStates(viewType);
    
    if (membersData.length === 0) {
        directoryContainer.innerHTML = '<p class="no-data">No member data available.</p>';
        return;
    }
    
    membersData.forEach(member => {
        const memberCard = createMemberCard(member, viewType);
        directoryContainer.appendChild(memberCard);
    });
}

// Function to create a member card element
function createMemberCard(member, viewType) {
    const card = document.createElement('article');
    card.className = 'member-card';
    
    let membershipText = '';
    switch(member.membershipLevel) {
        case 1: membershipText = 'Member'; break;
        case 2: membershipText = 'Silver Member'; break;
        case 3: membershipText = 'Gold Member'; break;
        default: membershipText = 'Member';
    }
    
    if (viewType === 'grid') {
        card.innerHTML = `
            <img src="${member.imageurl}" alt="${member.name}" loading="lazy" width="300" height="200">
            <div class="member-card-content">
                <h3>${member.name}</h3>
                <p class="address">${member.address}</p>
                <p class="description">${member.description}</p>
                <div class="phone">📞 <a href="tel:${member.phone}">${member.phone}</a></div>
                <div class="website">🌐 <a href="${member.url}" target="_blank" rel="noopener">Visit Website</a></div>
                <span class="membership-level" data-level="${member.membershipLevel}">${membershipText}</span>
            </div>
        `;
    } else {
        card.innerHTML = `
            <img src="${member.imageurl}" alt="${member.name}" loading="lazy" width="100" height="100">
            <div class="member-card-content">
                <h3>${member.name}</h3>
                <p class="address">${member.address}</p>
                <div class="contact-info">
                    <div class="phone">📞 <a href="tel:${member.phone}">${member.phone}</a></div>
                    <div class="website">🌐 <a href="${member.url}" target="_blank" rel="noopener">Website</a></div>
                </div>
                <span class="membership-level" data-level="${member.membershipLevel}">${membershipText}</span>
            </div>
        `;
    }
    
    return card;
}

// Function to update button active states
function updateButtonStates(activeView) {
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');
    
    if (gridBtn && listBtn) {
        if (activeView === 'grid') {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }
}

// Function to set up view toggle functionality
function setupViewToggle() {
    const gridBtn = document.getElementById('grid-btn');
    const listBtn = document.getElementById('list-btn');
    
    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            if (currentView !== 'grid') {
                displayMembers('grid');
            }
        });
        
        listBtn.addEventListener('click', () => {
            if (currentView !== 'list') {
                displayMembers('list');
            }
        });
    }
}

// Function to initialize the directory page
function initDirectory() {
    const directoryContainer = document.getElementById('directory');
    if (directoryContainer) {
        directoryContainer.innerHTML = '<p class="loading">Loading member data...</p>';
    }
    
    membersData = getMembersData();
    setupViewToggle();
    displayMembers('grid');
}

// Make initDirectory available globally
window.initDirectory = initDirectory;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initDirectory);

// Add dynamic styles
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
