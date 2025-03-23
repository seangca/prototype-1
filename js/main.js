// Tailwind configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'orbitron': ['Orbitron', 'sans-serif'],
                'syne': ['Syne', 'sans-serif'],
            },
        }
    }
};

// Andriod Screen Adjustments

function updateVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', updateVH);
window.addEventListener('orientationchange', updateVH);
updateVH();

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const menuIcon = hamburger.querySelector('i');
const menuItems = document.querySelectorAll('.menu-item');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-times');

    // Animate menu items
    menuItems.forEach((item, index) => {
        if (mobileMenu.classList.contains('active')) {
            setTimeout(() => {
                item.classList.remove('opacity-0', 'translate-y-4');
            }, 100 * (index + 1));
        } else {
            item.classList.add('opacity-0', 'translate-y-4');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-times');

        // Reset menu items
        menuItems.forEach(item => {
            item.classList.add('opacity-0', 'translate-y-4');
        });
    }
});

// Prevent default scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Carousel functionality
window.onload = function () {
    const images = document.querySelectorAll('.carousel img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('opacity-100');
        images[currentIndex].classList.add('opacity-0');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.remove('opacity-0');
        images[currentIndex].classList.add('opacity-100');
    }

    if (images.length > 0) {
        images[0].classList.add('opacity-100');
        setInterval(showNextImage, 5000);
    }

    // Initial overflow handling
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 2500);
};

// Intersection Observer for reveal animations
document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smoother animation scheduling
                requestAnimationFrame(() => {
                    // Throttle animations to prevent overwhelming the browser
                    if (!entry.target.classList.contains('reveal')) {
                        entry.target.classList.add('reveal');
                        entry.target.style.opacity = '1';
                    }
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
        trackVisibility: true,
        delay: 100
    });

    // Delay initial observation to prevent initial load performance impact
    setTimeout(() => {
        const textElements = document.querySelectorAll('.text-reveal');
        textElements.forEach(element => {
            if (!element.classList.contains('reveal')) {
                observer.observe(element);
            }
        });

        const fadeElements = document.querySelectorAll('section > div');
        fadeElements.forEach(element => {
            if (element && !element.classList.contains('reveal')) {
                observer.observe(element);
            }
        });
    }, 2500);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Text animation for "EVERY THING"
const everyText = new SplitType('#every-text', { types: 'chars' });
const thingText = new SplitType('#thing-text', { types: 'chars' });

const textTrigger = {
    trigger: '#every-text',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
};

if (everyText.chars) {
    gsap.from(everyText.chars, {
        scrollTrigger: textTrigger,
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
}

if (thingText.chars) {
    gsap.from(thingText.chars, {
        scrollTrigger: textTrigger,
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.4,
        ease: 'back.out(1.7)'
    });
}

// Hidden Footer Scroll Behavior
const footer = document.getElementById('hidden-footer');

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY + windowHeight;
    const buffer = 20; // Show footer slightly before reaching absolute bottom

    if (documentHeight - scrollPosition <= buffer) {
        footer.style.transform = 'translateY(0)';
    } else {
        footer.style.transform = 'translateY(100%)';
    }
});
