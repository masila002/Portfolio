// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initCanvas();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
});

// Theme Toggle
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });
    
    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-header')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
        }
    });
}

// Canvas Background Effect - Network Particles
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Resize handling
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, ' : 'rgba(188, 19, 254, '; // Neon Cyan or Purple
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.5)';
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist/150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on position
                const delay = index * 0.1;
                entry.target.style.animationDelay = `${delay}s`;
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add scroll-animate class to all animation targets
    const animationTargets = document.querySelectorAll(
        '.section-title, .project-card, .skill-category, .about-text, .category-title'
    );
    
    animationTargets.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    
    // Use Formspree service (you need to update the form ID)
    // Get your form ID from: https://formspree.io/
    const FORMSPREE_ID = 'mykkzdvz'; // This is for francismusyoki1039@gmail.com
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                messageDiv.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                messageDiv.className = 'form-message success';
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageDiv.className = 'form-message';
                }, 5000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            messageDiv.textContent = '✗ Failed to send message. Please try again or contact via WhatsApp.';
            messageDiv.className = 'form-message error';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.className = 'form-message';
            }, 5000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}
