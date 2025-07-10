// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Header scroll effect with enhanced parallax
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        
        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect for hero section
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Create floating particles animation
    function createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'floating-particles';
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particleContainer.appendChild(particle);
        }
    }
    
    // Initialize particles
    createParticles();
    
    // Typing animation for hero section
    function typeWriter(element, text, delay = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, delay);
            }
        }
        
        type();
    }
    
    // Apply typing animation to hero subtitle
    const heroSubtitle = document.querySelector('.hero-content h2');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        heroSubtitle.classList.add('typing-animation');
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 80);
        }, 1000);
    }
    
    // Enhanced stats counter with easing animation
    const statItems = document.querySelectorAll('.stat-item');
    
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    // Intersection Observer for scroll animations
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add reveal animation
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('active');
                }
                
                // Enhanced stats counter with easing
                if (entry.target.classList.contains('stat-item')) {
                    const countTo = parseInt(entry.target.getAttribute('data-count'));
                    const counter = entry.target.querySelector('h3');
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = easeOutQuart(progress);
                        const currentCount = Math.floor(easedProgress * countTo);
                        
                        counter.textContent = currentCount;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = countTo;
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                }
                
                // Enhanced skill bars animation
                if (entry.target.classList.contains('skill-level')) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 300);
                }
                
                // Service cards staggered animation
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Enhanced intersection observer
    const observer = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    // Observe elements for animations
    statItems.forEach(item => observer.observe(item));
    
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => observer.observe(bar));
    
    // Add reveal class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
    
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(187, 134, 252, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Pricing cards interactive effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-10px) scale(1.05)';
                this.style.borderColor = 'var(--primary-color)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
    
    // Enhanced button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Mouse trail effect
    const mouseTrail = [];
    const maxTrailLength = 20;
    
    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            opacity: 0.8;
            transform: scale(1);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(dot);
        
        mouseTrail.push(dot);
        
        if (mouseTrail.length > maxTrailLength) {
            const oldDot = mouseTrail.shift();
            oldDot.remove();
        }
        
        // Animate trail dots
        mouseTrail.forEach((dot, index) => {
            const scale = (index + 1) / maxTrailLength;
            const opacity = scale * 0.8;
            dot.style.transform = `scale(${scale})`;
            dot.style.opacity = opacity;
        });
        
        // Remove dot after animation
        setTimeout(() => {
            if (dot.parentNode) {
                dot.style.opacity = '0';
                dot.style.transform = 'scale(0)';
                setTimeout(() => {
                    if (dot.parentNode) {
                        dot.remove();
                    }
                }, 300);
            }
        }, 200);
    }
    
    // Add mouse trail on hero section
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
        heroElement.addEventListener('mousemove', function(e) {
            createTrailDot(e.clientX, e.clientY);
        });
    }
    
    // Code window interactive effects
    const codeWindow = document.querySelector('.code-window');
    if (codeWindow) {
        codeWindow.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 30px 60px rgba(187, 134, 252, 0.4)';
        });
        
        codeWindow.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    }
    
    // Social icons 3D effect
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotateX(15deg)';
            this.style.boxShadow = '0 10px 20px rgba(187, 134, 252, 0.5)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Dynamic background gradient based on scroll
    let ticking = false;
    
    function updateBackgroundGradient() {
        const scrolled = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrolled / maxScroll;
        
        const hue1 = 270 + (scrollProgress * 60); // Purple to blue
        const hue2 = 290 + (scrollProgress * 40); // Magenta to purple
        
        document.body.style.background = `
            linear-gradient(135deg, 
                hsl(${hue1}, 70%, 5%) 0%, 
                hsl(${hue2}, 60%, 8%) 100%
            )
        `;
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateBackgroundGradient);
            ticking = true;
        }
    });
    
    // Logo hover effect
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(15deg)';
            this.style.filter = 'drop-shadow(0 0 20px rgba(187, 134, 252, 0.8))';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0)';
            this.style.filter = '';
        });
    }
    
    // Initialize all animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Add CSS for loaded state
    const loadedStyle = document.createElement('style');
    loadedStyle.textContent = `
        body:not(.loaded) * {
            animation-play-state: paused !important;
        }
        
        .loaded {
            animation-play-state: running !important;
        }
        
        /* Additional enhancement styles */
        .hero-content h1 {
            position: relative;
            display: inline-block;
        }
        
        .hero-content h1::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--gradient-primary);
            transform: scaleX(0);
            transform-origin: left;
            animation: slideInWidth 1s ease-out 0.5s forwards;
        }
        
        @keyframes slideInWidth {
            to {
                transform: scaleX(1);
            }
        }
        
        .skill-category {
            transform: translateY(20px);
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .skill-category:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        @keyframes fadeInUp {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(loadedStyle);
}); 