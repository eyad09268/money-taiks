

// --- JavaScript for Interactions and Animations ---

/**
 * Updates the scroll progress bar at the top of the page.
 * The width of the bar indicates the percentage of the page scrolled.
 */
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // Calculate total scrollable height
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrollPercent + '%';
}

/**
 * Sets up an Intersection Observer to animate elements as they come into view.
 * Elements with the class 'animate-on-scroll' will gain the 'animate' class.
 * Feature items will also have staggered animation delays.
 */
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly reduce trigger area from bottom
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Add staggered animation delays for grouped elements like feature items
            if (entry.target.classList.contains('feature-item')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`; // 0.1s delay for each subsequent item
            }
        } else {
            // Optional: remove 'animate' class if element scrolls out of view
            // entry.target.classList.remove('animate');
        }
    });
}, observerOptions);

/**
 * Observes all elements marked for scroll-based animation.
 */
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

/**
 * Handles header scroll effect (shrinking/shadow) and updates scroll progress.
 */
function handleScroll() {
    const currentScroll = window.pageYOffset;
    const header = document.getElementById('header');
    
    if (currentScroll > 100) { // If scrolled more than 100px
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    updateScrollProgress();
}

/**
 * Handles the submission of the ebook form.
 * Shows loading state, simulates API call, and displays status messages.
 */
document.getElementById('ebookForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const email = document.getElementById('email').value;
    const submitBtn = this.querySelector('.submit-btn');
    const spinner = this.querySelector('.spinner');
    const btnText = this.querySelector('.btn-text');
    const statusMessage = document.getElementById('statusMessage');
    
    // Set loading state for the button
    submitBtn.classList.add('loading');
    spinner.style.display = 'inline-block'; // Show spinner
    btnText.textContent = 'SENDING...'; // Change button text
    statusMessage.classList.remove('show', 'success', 'error'); // Hide previous messages
    
    // Add haptic feedback (small vibration) if supported by the browser
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    try {
        // Simulate an API call with a delay
        // In a real application, replace this with your actual backend endpoint
        // const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email: email })
        // });
        
        // const result = await response.json();

        // For demonstration, simulate success or failure
        const simulatedResult = { status: 'sent', message: 'Ebook sent successfully!' };
        // const simulatedResult = { status: 'error', message: 'Failed to send ebook. Please try again.' };

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        if (simulatedResult.status === 'sent') {
            statusMessage.textContent = '✓ Success! Check your email for the Money Talks guide.';
            statusMessage.className = 'status-message success show';
            document.getElementById('email').value = ''; // Clear email field
            
            createConfetti(); // Trigger confetti animation
        } else {
            statusMessage.textContent = '✗ ' + simulatedResult.message;
            statusMessage.className = 'status-message error show';
        }
    } catch (error) {
        console.error('Submission Error:', error);
        statusMessage.textContent = '✗ An unexpected error occurred. Please try again.';
        statusMessage.className = 'status-message error show';
    } finally {
        // Reset button state after a short delay
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            spinner.style.display = 'none';
            btnText.textContent = 'SEND ME THE GUIDE';
        }, 500); // Give a moment for the status message to be seen
    }
});

/**
 * Adds a subtle animation to the book cover on click.
 */
document.getElementById('bookCover').addEventListener('click', function() {
    this.style.transform = 'rotateY(-10deg) rotateX(5deg) scale(1.05)';
    setTimeout(() => {
        this.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.02)'; // Return to hover state after click
    }, 300);
});

/**
 * Applies a simple parallax effect to specified elements based on scroll position.
 */
function handleParallax() {
    const scrolled = window.pageYOffset;
    // Select elements for parallax effect
    const parallaxElements = document.querySelectorAll('.book-overlay, .hero::before');
    
    parallaxElements.forEach(element => {
        if (element) {
            const speed = 0.08; // Adjust speed for desired effect
            element.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
}

/**
 * Creates a burst of confetti particles for a celebratory effect.
 */
function createConfetti() {
    const colors = ['#C4A574', '#D4B584', '#1A1A1A', '#FFFFFF'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px; /* Random size */
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw; /* Random horizontal position */
            top: -10px; /* Start above viewport */
            z-index: 1000;
            pointer-events: none; /* Do not interfere with mouse events */
            animation: confettiFall ${2 + Math.random() * 3}s ease-out forwards; /* Random duration */
            opacity: 1;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'}; /* Mix of circles and squares */
        `;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation finishes to prevent DOM bloat
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

/**
 * Applies a subtle 3D rotation to the book cover based on mouse movement.
 * This creates a pseudo-parallax effect that reacts to the cursor.
 */
document.addEventListener('mousemove', (e) => {
    // Normalize mouse coordinates to a range of -0.5 to 0.5
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const bookCover = document.getElementById('bookCover');
    // Apply effect only on larger screens to avoid issues with touch devices or smaller layouts
    if (bookCover && window.innerWidth > 1024) {
        const rotateX = mouseY * -15; // Invert X-axis rotation for natural feel
        const rotateY = mouseX * 15;
        bookCover.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
});

// Reset book cover transform when mouse leaves (for mousemove effect)
document.getElementById('bookCover').addEventListener('mouseleave', function() {
    if (window.innerWidth > 1024) {
        this.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'; // Reset to original state
    }
});


/**
 * Enables smooth scrolling for all internal anchor links.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default jump behavior
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Smooth scroll animation
                block: 'start' // Align the top of the target element with the top of the viewport
            });
        }
    });
});

/**
 * Initializes all scroll-related event listeners and initial animations.
 * Uses requestAnimationFrame for performance optimization.
 */
window.addEventListener('scroll', () => {
    // Use requestAnimationFrame to ensure smooth animations
    requestAnimationFrame(() => {
        handleScroll(); // Header and scroll progress
        handleParallax(); // Parallax background effect
    });
});

// Initial setup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateScrollProgress(); // Set initial progress bar width
    
    // Add staggered loading animation to initial visible elements if needed
    // (Observer handles most, but this can ensure first-load elements animate)
    // const elements = document.querySelectorAll('.animate-on-scroll');
    // elements.forEach((el, index) => {
    //     el.style.animationDelay = `${index * 0.1}s`;
    // });
});

// Basic error handling for console logging
window.addEventListener('error', (e) => {
    console.error('An unhandled error occurred:', e.error);
});

// Optional: Service worker registration for PWA features (uncomment if you have 'sw.js')
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js').then(registration => {
//             console.log('SW registered: ', registration);
//         }).catch(registrationError => {
//             console.log('SW registration failed: ', registrationError);
//         });
//     });
// }
