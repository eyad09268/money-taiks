// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach((element, index) => {
        element.style.setProperty('--animation-order', index);
        
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

// Scroll progress indicator
const updateScrollProgress = () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
};

// Parallax effect for book cover
const parallaxEffect = () => {
    const bookCover = document.getElementById('bookCover');
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;
    
    bookCover.style.transform = `
        perspective(1000px)
        rotateY(${(mouseX - 0.5) * 10}deg)
        rotateX(${(mouseY - 0.5) * -10}deg)
        scale3d(1.05, 1.05, 1.05)
    `;
};

// Smooth scroll for navigation
const smoothScroll = (target) => {
    const element = document.querySelector(target);
    window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
    });
};

// Form submission animation
const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const statusMessage = document.getElementById('statusMessage');
    
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.spinner').style.display = 'inline-block';
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.spinner').style.display = 'none';
        statusMessage.textContent = 'Thank you! Your guide is on its way.';
        statusMessage.classList.add('show', 'success');
        form.reset();
    }, 2000);
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Initial animation check
    animateOnScroll();
    
    // Add event listeners
    window.addEventListener('scroll', () => {
        animateOnScroll();
        updateScrollProgress();
    });
    
    // Book cover parallax
    const bookCover = document.getElementById('bookCover');
    if (bookCover) {
        bookCover.addEventListener('mousemove', parallaxEffect);
        bookCover.addEventListener('mouseleave', () => {
            bookCover.style.transform = 'none';
        });
    }
    
    // Form submission
    const form = document.getElementById('ebookForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('.interactive-element');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px) scale(1.02)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'none';
        });
    });
});

// Add typing animation to hero title
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        typeWriter(heroTitle, text, 50);
    }
});

// Enhanced scroll progress indicator
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrollPercent + '%';
}

// Enhanced scroll animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Add staggered animation delays for grouped elements
            if (entry.target.classList.contains('feature-item')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Enhanced header scroll effect
let lastScroll = 0;
function handleScroll() {
    const currentScroll = window.pageYOffset;
    const header = document.getElementById('header');
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    updateScrollProgress();
    lastScroll = currentScroll;
}

// Enhanced form submission with better UX
document.getElementById('ebookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const submitBtn = document.querySelector('.submit-btn');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
    const statusMessage = document.getElementById('statusMessage');
    
    // Enhanced loading state
    submitBtn.classList.add('loading');
    spinner.style.display = 'inline-block';
    btnText.textContent = 'SENDING...';
    statusMessage.classList.remove('show');
    
    // Add haptic feedback (if supported)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    try {
        const response = await fetch('http://localhost:5000/send-ebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const result = await response.json();
        
        if (result.status === 'sent') {
            statusMessage.textContent = '✓ Success! Check your email for the Money Talks guide.';
            statusMessage.className = 'status-message success show';
            document.getElementById('email').value = '';
            
            // Confetti effect (simple version)
            createConfetti();
        } else {
            statusMessage.textContent = '✗ ' + result.message;
            statusMessage.className = 'status-message error show';
        }
    } catch (error) {
        console.error('Error:', error);
        statusMessage.textContent = '✗ Connection error. Please ensure the server is running and try again.';
        statusMessage.className = 'status-message error show';
    }
    
    // Reset button state with delay
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        spinner.style.display = 'none';
        btnText.textContent = 'SEND ME THE GUIDE';
    }, 500);
});

// Enhanced book cover interactions
const bookCover = document.getElementById('bookCover');
let isHovering = false;
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

function isDesktop() {
    return window.innerWidth > 768;
}

const handleBookHover = (e) => {
    if (!bookCover || !isDesktop()) return;
    const rect = bookCover.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetX = ((y / rect.height) - 0.5) * -20;
    targetY = ((x / rect.width) - 0.5) * 20;
    isHovering = true;
};

const handleBookLeave = () => {
    if (!bookCover) return;
    isHovering = false;
    targetX = 0;
    targetY = 0;
};

const animateBook = () => {
    if (!bookCover) return;
    if (!isDesktop()) {
        bookCover.style.transform = 'none';
        const elements = bookCover.querySelectorAll('.book-logo, .book-title-main, .book-subtitle-main');
        elements.forEach((el) => {
            el.style.transform = 'none';
        });
        return;
    }
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    bookCover.style.transform = `
        perspective(2000px)
        rotateX(${currentX}deg)
        rotateY(${currentY}deg)
        scale3d(${isHovering ? 1.05 : 1}, ${isHovering ? 1.05 : 1}, 1.05)
    `;
    const elements = bookCover.querySelectorAll('.book-logo, .book-title-main, .book-subtitle-main');
    elements.forEach((el, index) => {
        const depth = (index + 1) * 20;
        el.style.transform = `translateZ(${isHovering ? depth : 0}px)`;
    });
    requestAnimationFrame(animateBook);
};

if (bookCover) {
    if (isDesktop()) {
        bookCover.addEventListener('mousemove', handleBookHover);
        bookCover.addEventListener('mouseleave', handleBookLeave);
    }
    animateBook();
    bookCover.addEventListener('click', () => {
        if (!isDesktop()) return;
        bookCover.style.transform = `
            perspective(2000px)
            rotateX(${currentX}deg)
            rotateY(${currentY}deg)
            scale3d(1.1, 1.1, 1.1)
        `;
        setTimeout(() => {
            bookCover.style.transform = `
                perspective(2000px)
                rotateX(${currentX}deg)
                rotateY(${currentY}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        }, 200);
    });
}

const addPageTurnEffect = () => {
    if (!bookCover) return;
    const pages = document.createElement('div');
    pages.className = 'book-pages';
    pages.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 100%;
        background: linear-gradient(90deg, 
            rgba(0,0,0,0.1) 0%,
            rgba(0,0,0,0.2) 50%,
            rgba(0,0,0,0.1) 100%
        );
        transform-origin: right;
        transform: rotateY(0deg);
        transition: transform 0.6s ease;
        pointer-events: none;
    `;
    bookCover.appendChild(pages);
    if (isDesktop()) {
        bookCover.addEventListener('mouseenter', () => {
            pages.style.transform = 'rotateY(-30deg)';
        });
        bookCover.addEventListener('mouseleave', () => {
            pages.style.transform = 'rotateY(0deg)';
        });
    }
};
addPageTurnEffect();

// Parallax effect for hero section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.book-overlay, .hero::before');
    
    parallaxElements.forEach(element => {
        if (element) {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
}

// Simple confetti effect
function createConfetti() {
    const colors = ['#C4A574', '#D4B584', '#1A1A1A', '#FFFFFF'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 1000;
            pointer-events: none;
            animation: confettiFall ${2 + Math.random() * 3}s ease-out forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mouse movement parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const bookCover = document.getElementById('bookCover');
    if (bookCover && window.innerWidth > 768) {
        const rotateX = (mouseY - 0.5) * 10;
        const rotateY = (mouseX - 0.5) * -10;
        bookCover.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize scroll handlers
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        handleScroll();
        handleParallax();
    });
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateScrollProgress();
    
    // Add loading animation to elements
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Performance optimization
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
    }
}

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

// Service worker registration (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js'); // Uncomment if you have a service worker
    });
}
