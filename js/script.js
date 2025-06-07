
// --- JavaScript for Interactions and Animations ---

/**
 * Updates the scroll progress bar at the top of the page.
 * The width of the bar indicates the percentage of the page scrolled.
 */
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // Calculate total scrollable height
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (docHeight > 0) ? (scrollTop / docHeight) * 100 : 0; // Avoid division by zero
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
            btnText.textContent = 'Send Me The Guide';
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
});

// Basic error handling for console logging
window.addEventListener('error', (e) => {
    console.error('An unhandled error occurred:', e.error);
});

// --- Gemini API Integration for Financial Insight Generator (NEW) ---
document.getElementById('generateInsightBtn').addEventListener('click', async function() {
    const insightInput = document.getElementById('insightInput').value;
    const insightOutputDiv = document.getElementById('insightOutput');
    const insightText = document.getElementById('insightText');
    const insightStatusMessage = document.getElementById('insightStatusMessage');
    const generateBtn = this;
    const spinner = generateBtn.querySelector('.spinner');
    const btnText = generateBtn.querySelector('.btn-text');

    if (!insightInput.trim()) {
        insightStatusMessage.textContent = 'Please enter a financial topic or question.';
        insightStatusMessage.className = 'status-message error show';
        return;
    }

    // Set loading state
    generateBtn.classList.add('loading');
    spinner.style.display = 'inline-block';
    btnText.textContent = 'GENERATING...';
    insightOutputDiv.classList.remove('show'); // Hide previous output
    insightText.textContent = ''; // Clear previous text
    insightStatusMessage.classList.remove('show', 'success', 'error'); // Clear previous status

    // Add haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    try {
        let chatHistory = [];
        // Construct a clear and concise prompt for the LLM
        const prompt = `Provide a concise and helpful financial insight, explanation, or a motivational quote related to the following topic: "${insightInput}". Keep it under 150 words and be encouraging.`;
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        // The apiKey is provided by the Canvas environment; leave it as an empty string.
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Check if the response contains valid content from the LLM
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            insightText.textContent = text; // Display the generated text
            insightOutputDiv.classList.add('show'); // Show the output div with animation
            insightStatusMessage.textContent = 'Insight generated successfully!';
            insightStatusMessage.className = 'status-message success show';
        } else {
            // Handle cases where the LLM response is empty or malformed
            insightStatusMessage.textContent = 'Could not generate insight. Please try a different topic.';
            insightStatusMessage.className = 'status-message error show';
            console.error('Gemini API response structure unexpected:', result);
        }
    } catch (error) {
        // Handle network or other errors during the API call
        console.error('Error generating insight:', error);
        insightStatusMessage.textContent = 'An error occurred while connecting to the insight generator. Please try again.';
        insightStatusMessage.className = 'status-message error show';
    } finally {
        // Reset button state after a short delay
        setTimeout(() => {
            generateBtn.classList.remove('loading');
            spinner.style.display = 'none';
            btnText.textContent = 'Generate Insight';
        }, 500);
    }
});
