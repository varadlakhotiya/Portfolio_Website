/**
 * ========================================
 * PORTFOLIO WEBSITE - MAIN JAVASCRIPT
 * ========================================
 * 
 * NAMING CONVENTIONS:
 * - Variables: camelCase (e.g., navLinks, currentTheme)
 * - Functions: camelCase with action verbs (e.g., initializeNavigation, handleFormSubmission)
 * - Constants: UPPER_SNAKE_CASE (e.g., TYPE_SPEED, DELETE_SPEED)
 * - DOM Elements: descriptive camelCase (e.g., contactForm, submitButton)
 * - CSS Classes: kebab-case (e.g., scroll-to-top, project-card)
 * - Event Handlers: handle + ActionName (e.g., handleScroll, handleClick)
 * - Initialize Functions: initialize + ComponentName (e.g., initializeTheme, initializeFlipCards)
 */

// =================== CONSTANTS ===================
const TYPING_SPEED = 100;
const DELETE_SPEED = 50;
const PAUSE_DELAY = 1500;
const TESTIMONIAL_INTERVAL = 5000;
const SCROLL_THRESHOLD = 500;
const ANIMATION_THRESHOLD = 0.5;
const OBSERVER_THRESHOLD = 0.3;

// =================== GLOBAL VARIABLES ===================
let currentTestimonialIndex = 0;
let typingTextIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

// =================== UTILITY FUNCTIONS ===================
/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Smooth scroll to element by ID
 * @param {string} elementId - Target element ID
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// =================== NAVIGATION FUNCTIONALITY ===================
/**
 * Initialize navigation with active link highlighting and smooth scrolling
 */
function initializeNavigation() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    // Section observer for active navigation highlighting
    const observerOptions = {
        root: null,
        threshold: OBSERVER_THRESHOLD,
    };

    const navigationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
        });
    }, observerOptions);

    sections.forEach((section) => navigationObserver.observe(section));

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigationClick);
    });
}

/**
 * Handle navigation link clicks
 * @param {Event} event - Click event
 */
function handleNavigationClick(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// =================== THEME FUNCTIONALITY ===================
/**
 * Initialize theme toggle functionality
 */
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', handleThemeToggle);
}

/**
 * Handle theme toggle button click
 */
function handleThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

/**
 * Update theme toggle icon based on current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');

    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    } else {
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
    }
}

// =================== EMAIL FUNCTIONALITY ===================
/**
 * Initialize EmailJS contact form
 */
function initializeEmailForm() {
    // Initialize EmailJS - Replace with your actual keys
    emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");

    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    setupRealtimeValidation();
}

/**
 * Setup real-time form validation
 */
function setupRealtimeValidation() {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');

    if (nameField) {
        nameField.addEventListener('blur', () => {
            if (nameField.value.trim()) {
                showFieldSuccess('name');
            }
        });
    }

    if (emailField) {
        emailField.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value.trim() && emailRegex.test(emailField.value)) {
                showFieldSuccess('email');
            }
        });
    }

    if (messageField) {
        messageField.addEventListener('blur', () => {
            if (messageField.value.trim() && messageField.value.length >= 10) {
                showFieldSuccess('message');
            }
        });
    }
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmission(event) {
    event.preventDefault();

    if (!validateContactForm()) {
        showStatusMessage('error', 'Please fix the errors above and try again.');
        return;
    }

    setButtonLoadingState(true);

    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_email: 'lakhotiya.varad20@gmail.com'
    };

    // Replace with your actual service and template IDs
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(handleEmailSuccess)
        .catch(handleEmailError);
}

/**
 * Validate contact form fields
 * @returns {boolean} - Form validity status
 */
function validateContactForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;

    // Clear previous validation states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
    });

    // Validate name
    if (!name) {
        showFieldError('name', 'Please enter your name');
        isValid = false;
    } else {
        showFieldSuccess('name');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError('email', 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        showFieldSuccess('email');
    }

    // Validate message
    if (!message) {
        showFieldError('message', 'Please enter your message');
        isValid = false;
    } else if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    } else {
        showFieldSuccess('message');
    }

    return isValid;
}

/**
 * Show field validation error
 * @param {string} fieldName - Field name/ID
 * @param {string} message - Error message
 */
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
}

/**
 * Show field validation success
 * @param {string} fieldName - Field name/ID
 */
function showFieldSuccess(fieldName) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('success');
}

/**
 * Show status message to user
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - Status message
 */
function showStatusMessage(type, message) {
    const statusMessage = document.getElementById('status-message');
    const statusText = document.getElementById('status-text');
    
    if (!statusMessage || !statusText) return;

    statusMessage.className = `status-message ${type} show`;
    statusText.textContent = message;
    
    const icon = statusMessage.querySelector('i');
    if (icon) {
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    }

    // Auto hide after 5 seconds
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 5000);
}

/**
 * Set button loading state
 * @param {boolean} loading - Loading state
 */
function setButtonLoadingState(loading) {
    const submitButton = document.getElementById('submit-btn');
    const buttonText = document.getElementById('button-text');
    const buttonIcon = document.getElementById('button-icon');
    const spinner = document.getElementById('spinner');

    if (!submitButton) return;

    if (loading) {
        submitButton.disabled = true;
        if (buttonText) buttonText.textContent = 'Sending...';
        if (buttonIcon) buttonIcon.style.display = 'none';
        if (spinner) spinner.style.display = 'block';
    } else {
        submitButton.disabled = false;
        if (buttonText) buttonText.textContent = 'Send Message';
        if (buttonIcon) buttonIcon.style.display = 'block';
        if (spinner) spinner.style.display = 'none';
    }
}

/**
 * Handle successful email submission
 * @param {Object} response - EmailJS response
 */
function handleEmailSuccess(response) {
    console.log('Email sent successfully:', response);
    
    showStatusMessage('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
    
    // Reset form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.reset();
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
    }
    
    setButtonLoadingState(false);
}

/**
 * Handle email submission error
 * @param {Object} error - EmailJS error
 */
function handleEmailError(error) {
    console.error('Email sending failed:', error);
    showStatusMessage('error', 'Oops! Something went wrong. Please try again or contact me directly.');
    setButtonLoadingState(false);
}

// =================== PROJECT FILTER FUNCTIONALITY ===================
/**
 * Initialize project filtering system
 */
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll(".project-filters button");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleFilterClick(button, projectCards, filterButtons));
    });
}

/**
 * Handle project filter button click
 * @param {Element} clickedButton - Clicked filter button
 * @param {NodeList} projectCards - All project cards
 * @param {NodeList} filterButtons - All filter buttons
 */
function handleFilterClick(clickedButton, projectCards, filterButtons) {
    const filter = clickedButton.getAttribute("data-filter");

    // Reset all flipped cards before filtering
    projectCards.forEach(card => card.classList.remove('flipped'));

    // Filter projects with animation
    projectCards.forEach(card => {
        const projectCategory = card.getAttribute("data-category");
        if (filter === "all" || projectCategory === filter) {
            showProjectCard(card);
        } else {
            hideProjectCard(card);
        }
    });

    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove("active"));
    clickedButton.classList.add("active");
}

/**
 * Show project card with animation
 * @param {Element} card - Project card element
 */
function showProjectCard(card) {
    card.style.display = "block";
    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
    }, 50);
}

/**
 * Hide project card with animation
 * @param {Element} card - Project card element
 */
function hideProjectCard(card) {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
        card.style.display = "none";
    }, 300);
}

// =================== FLIP CARD FUNCTIONALITY ===================
/**
 * Initialize flip card interactions
 */
function initializeFlipCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        setupCardFlipHandlers(card);
    });
}

/**
 * Setup flip handlers for a single card
 * @param {Element} card - Project card element
 */
function setupCardFlipHandlers(card) {
    const flipButton = card.querySelector('.flip-btn');
    const flipBackButton = card.querySelector('.flip-back-btn');
    const cardBack = card.querySelector('.card-back');

    // Handle flip to back
    if (flipButton) {
        flipButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            card.classList.add('flipped');
        });
    }

    // Handle flip back to front
    if (flipBackButton) {
        flipBackButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            card.classList.remove('flipped');
        });
    }

    // Optional: Click on back card to flip back (excluding buttons/links)
    if (cardBack) {
        cardBack.addEventListener('click', (e) => {
            if (e.target === cardBack || e.target.closest('.project-summary')) {
                card.classList.remove('flipped');
            }
        });
    }
}

// =================== TYPING EFFECT FUNCTIONALITY ===================
/**
 * Initialize typing effect for hero section
 */
function initializeTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const texts = [
        "Full-Stack Developer & Problem-Solver",
        "Creative Coder & Web Enthusiast"
    ];

    function typeText() {
        const fullText = texts[typingTextIndex];
        
        if (!isDeleting) {
            // Add characters
            typingCharIndex++;
            typingElement.textContent = fullText.slice(0, typingCharIndex);
            
            if (typingCharIndex === fullText.length) {
                isDeleting = true;
                typingElement.classList.remove('typing');
                return setTimeout(typeText, PAUSE_DELAY);
            }
            typingElement.classList.add('typing');
            setTimeout(typeText, TYPING_SPEED);
            
        } else {
            // Remove characters
            typingCharIndex--;
            typingElement.textContent = fullText.slice(0, typingCharIndex);
            
            if (typingCharIndex === 0) {
                isDeleting = false;
                typingTextIndex = (typingTextIndex + 1) % texts.length;
            }
            typingElement.classList.add('typing');
            setTimeout(typeText, DELETE_SPEED);
        }
    }
    
    typeText();
}

// =================== IMAGE LAZY LOADING ===================
/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                lazyLoadObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    lazyImages.forEach((img) => lazyLoadObserver.observe(img));
}

/**
 * Load lazy image
 * @param {Element} image - Image element to load
 */
function loadImage(image) {
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = () => {
        image.removeAttribute('data-src');
    };
}

// =================== SCROLL FUNCTIONALITY ===================
/**
 * Initialize scroll-related features
 */
function initializeScrollFeatures() {
    createScrollToTopButton();
    createProgressIndicator();
    
    const optimizedScrollHandler = debounce(handleScroll, 16);
    window.addEventListener('scroll', optimizedScrollHandler);
}

/**
 * Create and setup scroll-to-top button
 */
function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.textContent = '↑';
    scrollButton.classList.add('scroll-to-top');
    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(scrollButton);
}

/**
 * Create progress indicator
 */
function createProgressIndicator() {
    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');
    document.body.appendChild(progressIndicator);
}

/**
 * Handle scroll events
 */
function handleScroll() {
    const scrollY = window.scrollY;
    const scrollButton = document.querySelector('.scroll-to-top');
    const progressIndicator = document.querySelector('.progress-indicator');

    // Show/hide scroll to top button
    if (scrollButton) {
        scrollButton.style.display = scrollY > SCROLL_THRESHOLD ? 'block' : 'none';
    }

    // Update progress indicator
    if (progressIndicator) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressIndicator.style.width = `${scrollPercentage}%`;
    }
}

// =================== TESTIMONIALS FUNCTIONALITY ===================
/**
 * Initialize testimonials rotation
 */
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;

    showTestimonial(currentTestimonialIndex, testimonials);
    
    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        showTestimonial(currentTestimonialIndex, testimonials);
    }, TESTIMONIAL_INTERVAL);
}

/**
 * Show specific testimonial
 * @param {number} index - Testimonial index to show
 * @param {NodeList} testimonials - All testimonial elements
 */
function showTestimonial(index, testimonials) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.opacity = i === index ? '1' : '0';
        testimonial.style.transform = i === index ? 'translateY(0)' : 'translateY(20px)';
    });
}

// =================== ANIMATION FUNCTIONALITY ===================
/**
 * Initialize scroll-triggered animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: ANIMATION_THRESHOLD });

    animatedElements.forEach((element) => animationObserver.observe(element));
}

// =================== ACCESSIBILITY & KEYBOARD NAVIGATION ===================
/**
 * Initialize keyboard accessibility features
 */
function initializeKeyboardAccessibility() {
    document.addEventListener('keydown', handleKeyboardInput);
    document.addEventListener('click', handleExternalLinks);
}

/**
 * Handle keyboard input for accessibility
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardInput(event) {
    if (event.key === 'Escape') {
        // Close all flipped cards when Escape is pressed
        document.querySelectorAll('.project-card.flipped').forEach(card => {
            card.classList.remove('flipped');
        });
    }
}

/**
 * Handle external link clicks for analytics
 * @param {Event} event - Click event
 */
function handleExternalLinks(event) {
    if (event.target.matches('a[target="_blank"]')) {
        console.log('External link clicked:', event.target.href);
        // Add analytics tracking here if needed
    }
}

// =================== INITIALIZATION FUNCTIONS ===================
/**
 * Initialize loading spinner
 */
function initializeLoadingSpinner() {
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    document.body.appendChild(loadingSpinner);

    window.addEventListener('load', () => {
        loadingSpinner.style.display = 'none';
    });
}

/**
 * Initialize dynamic footer year
 */
function initializeFooter() {
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Varad Lakhotiya. All rights reserved.`;
    }
}

// =================== MAIN INITIALIZATION ===================
/**
 * Main initialization function - called when DOM is ready
 */
function initializePortfolio() {
    // Core functionality
    initializeNavigation();
    initializeTheme();
    initializeEmailForm();
    
    // Interactive features
    initializeProjectFilters();
    initializeFlipCards();
    initializeTypingEffect();
    initializeTestimonials();
    
    // Performance and UX
    initializeLazyLoading();
    initializeScrollFeatures();
    initializeScrollAnimations();
    initializeKeyboardAccessibility();
    
    // Utilities
    initializeLoadingSpinner();
    initializeFooter();
}

// =================== EVENT LISTENERS ===================
document.addEventListener("DOMContentLoaded", initializePortfolio);