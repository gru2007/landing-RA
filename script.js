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
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Initialize stats counter
    const statItems = document.querySelectorAll('.stat-item');
    
    // Set up Intersection Observer for elements that should animate when in view
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a stat item, start counter animation
                if (entry.target.classList.contains('stat-item')) {
                    const countTo = parseInt(entry.target.getAttribute('data-count'));
                    const counter = entry.target.querySelector('h3');
                    const duration = 2000; // Duration in milliseconds
                    
                    let count = 0;
                    const interval = Math.ceil(duration / countTo);
                    
                    const timer = setInterval(() => {
                        count++;
                        counter.textContent = count;
                        
                        if (count >= countTo) {
                            clearInterval(timer);
                        }
                    }, interval);
                }
                
                // If it's a skill bar, animate width
                if (entry.target.classList.contains('skill-level')) {
                    const width = entry.target.style.width;
                    entry.target.style.width = 0;
                    
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                }
                
                // Remove from observer after animation
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create the observer
    const observer = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1
    });
    
    // Observe stat items
    statItems.forEach(item => {
        observer.observe(item);
    });
    
    // Observe skill bars
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        observer.observe(bar);
    });

    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
}); 