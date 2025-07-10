// Enhanced scroll behavior
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header-transparent');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.nav-links');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Header transparency on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Add slide-up/slide-down animation
        if (currentScroll > lastScroll) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle with enhanced animation
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Typing effect
    const typingTexts = [
        "Создаю современные веб-приложения.",
        "Разрабатываю мобильные приложения.",
        "Настраиваю серверы и базы данных.",
        "Решаю сложные задачи."
    ];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    function typeText() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const currentText = typingTexts[currentTextIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = deletingSpeed;
        } else {
            typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = pauseTime;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        }

        setTimeout(typeText, typingSpeed);
    }

    typeText();

    // Animate skill bars on scroll
    const skillLevels = document.querySelectorAll('.skill-level');
    const animateSkills = () => {
        skillLevels.forEach(skill => {
            const skillTop = skill.getBoundingClientRect().top;
            const skillBottom = skill.getBoundingClientRect().bottom;
            
            if (skillTop < window.innerHeight && skillBottom > 0) {
                skill.style.width = skill.parentElement.dataset.level || '0%';
            }
        });
    };

    // Intersection Observer for elements animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .slide-in-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => observer.observe(element));

    // Initialize animations
    window.addEventListener('scroll', animateSkills);
    animateSkills();
});

// Scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in, .slide-in-right, .scale-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0) scale(1)';
        }
    });
};

// Animate stats numbers
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const targetNumber = parseInt(stat.textContent);
        let currentNumber = 0;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetNumber / steps;
        const stepDuration = duration / steps;
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                stat.textContent = targetNumber + '+';
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentNumber) + '+';
            }
        }, stepDuration);
    });
}

// Initialize number animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Parallax effect for hero shapes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX * speed);
        const y = (mouseY * speed);
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
}); 