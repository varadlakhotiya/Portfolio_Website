document.addEventListener("DOMContentLoaded", () => {
    // Section Observer
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const observerOptions = {
        root: null,
        threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeToggleIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
});

function updateThemeToggleIcon(theme) {
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

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (!name || !email || !message) {
                alert('Please fill out all fields.');
                return;
            }

            console.log('Form submitted:', { name, email, message });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Lazy Loading for Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyLoad = (image) => {
        image.setAttribute('src', image.getAttribute('data-src'));
        image.onload = () => {
            image.removeAttribute('data-src');
        };
    };

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                lazyLoad(entry.target);
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    lazyImages.forEach((img) => lazyObserver.observe(img));

    // Scroll-to-Top Button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.textContent = '↑';
    scrollToTopButton.classList.add('scroll-to-top');
    document.body.appendChild(scrollToTopButton);

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopButton.style.display = 'block';
        } else {
            scrollToTopButton.style.display = 'none';
        }
    });

    // Dynamic Year in Footer
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Varad Lakhotiya. All rights reserved.`;
    }

    // Animations on Scroll
    const animateOnScroll = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        animatedElements.forEach((element) => animationObserver.observe(element));
    };

    animateOnScroll();
});


// Add a loading spinner
const loadingSpinner = document.createElement('div');
loadingSpinner.classList.add('loading-spinner');
document.body.appendChild(loadingSpinner);

window.addEventListener('load', () => {
    loadingSpinner.style.display = 'none';
});

const progressIndicator = document.createElement('div');
progressIndicator.classList.add('progress-indicator');
document.body.appendChild(progressIndicator);

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressIndicator.style.width = `${scrollPercentage}%`;
});

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".project-filters button");
    const projects = document.querySelectorAll(".project");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            projects.forEach(project => {
                const projectCategory = project.getAttribute("data-category");
                if (filter === "all" || projectCategory === filter) {
                    project.style.display = "block";
                } else {
                    project.style.display = "none";
                }
            });

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
});


function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.opacity = i === index ? '1' : '0';
        testimonial.style.transform = i === index ? 'translateY(0)' : 'translateY(20px)';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        "Full-Stack Developer & Problem-Solver",
        "Creative Coder & Web Enthusiast"
    ];
    let h2Element = document.querySelector("#home h2");
    let textIndex = 0;
    
    // Function to change the text content
    function changeText() {
        h2Element.style.animation = 'none';  // Reset the animation
        h2Element.offsetHeight;  // Trigger reflow to reset animation
        h2Element.style.animation = '';  // Restore the animation
        h2Element.textContent = texts[textIndex];  // Change the text
        h2Element.style.width = '0';  // Reset width to start typing effect again
    }
    
    // Loop to change text and trigger typing animation
    function loopText() {
        setInterval(() => {
            changeText();
            textIndex = (textIndex + 1) % texts.length; // Switch between texts
        }, 8000);  // Change text every 8 seconds
    }

    loopText();  // Start looping text
});
