// Course data array
const courses = [
    { code: "CSE 110", name: "Programming Building Blocks", credits: 3, completed: true },
    { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 2, completed: false },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true },
    { code: "CSE 210", name: "Programming with Classes", credits: 2, completed: false },
    { code: "WDD 231", name: "Web Frontend Development", credits: 2, completed: false },
    { code: "CSE 310", name: "Data Structures and Algorithms", credits: 3, completed: false }
];

// DOM elements
const courseList = document.getElementById('course-list');
const totalCredits = document.getElementById('total-credits');
const filterButtons = document.querySelectorAll('.filter-btn');
const currentYear = document.getElementById('currentyear');
const lastModified = document.getElementById('lastmodified');

// Displaying courses based on filter
function displayCourses(filter = 'all') {
    courseList.innerHTML = '';
    
    const filteredCourses = filter === 'all' 
        ? courses 
        : courses.filter(course => course.code.toLowerCase().includes(filter));
    
    filteredCourses.forEach(course => {
        const li = document.createElement('li');
        li.className = 'course-item';
        li.textContent = `${course.code}: ${course.name} (${course.credits} credits)`;
        
        if (course.completed) {
            li.classList.add('completed');
        }
        
        courseList.appendChild(li);
    });
    
    updateTotalCredits(filteredCourses);
}

// Updating total credits using reduce
function updateTotalCredits(courses) {
    const total = courses.reduce((sum, course) => sum + course.credits, 0);
    totalCredits.textContent = total;
}

// Filtering button event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayCourses(button.dataset.filter);
    });
    
    // keyboard accessibility
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// current year and last modified date
currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;

// Initial display
displayCourses();

// Lazy loading implementation
document.addEventListener("DOMContentLoaded", function() {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    let active = false;
    
    const lazyLoad = function() {
        if (active === false) {
            active = true;
            
            setTimeout(function() {
                lazyImages.forEach(function(lazyImage) {
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazy");
                        lazyImage.classList.add("loaded");
                        
                        lazyImages = lazyImages.filter(function(image) {
                            return image !== lazyImage;
                        });
                        
                        if (lazyImages.length === 0) {
                            document.removeEventListener("scroll", lazyLoad);
                            window.removeEventListener("resize", lazyLoad);
                            window.removeEventListener("orientationchange", lazyLoad);
                        }
                    }
                });
                
                active = false;
            }, 200);
        }
    };
    
    // event listeners for lazy loading
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
    
    lazyLoad();
});

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (menuBtn && navList) {
        // Toggle menu function
        function toggleMenu() {
            navList.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = navList.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isExpanded);
        }
        
        // Add click event to menu button
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navList.classList.contains('active') && 
                !event.target.closest('.nav-list') && 
                !event.target.closest('.menu-btn')) {
                toggleMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navList.classList.contains('active')) {
                toggleMenu();
            }
        });
        
        // Close menu when window is resized to desktop size
        function handleResize() {
            if (window.innerWidth > 768 && navList.classList.contains('active')) {
                toggleMenu();
            }
        }
        
        window.addEventListener('resize', handleResize);
    }
});
