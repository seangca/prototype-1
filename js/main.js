// Tailwind configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'protest-revolution': ['Protest Revolution', 'sans-serif'],
                'syne': ['Syne', 'sans-serif'],
            },
        }
    }
};

// Hamburger Menu
const $hamburger = $('.hamburger');
const $mobileMenu = $('.mobile-menu');
const $menuIcon = $hamburger.find('i');
const $menuItems = $('.menu-item');

$hamburger.on('click', () => {
    $mobileMenu.toggleClass('active');
    $menuIcon.toggleClass('fa-bars fa-times');

    $menuItems.each((index, item) => {
        if ($mobileMenu.hasClass('active')) {
            setTimeout(() => {
                $(item).removeClass('opacity-0 translate-y-4');
            }, 100 * (index + 1));
        } else {
            $(item).addClass('opacity-0 translate-y-4');
        }
    });
});

// Close mobile menu when clicking outside
$(document).on('click', (e) => {
    if (!$hamburger[0].contains(e.target) && !$mobileMenu[0].contains(e.target) && $mobileMenu.hasClass('active')) {
        $mobileMenu.removeClass('active');
        $menuIcon.addClass('fa-bars').removeClass('fa-times');
        $menuItems.addClass('opacity-0 translate-y-4');
    }
});

// Carousel functionality
$(window).on('load', function () {
    const $images = $('.carousel img');
    let currentIndex = 0;

    function showNextImage() {
        $images.eq(currentIndex).removeClass('opacity-100').addClass('opacity-0');
        currentIndex = (currentIndex + 1) % $images.length;
        $images.eq(currentIndex).removeClass('opacity-0').addClass('opacity-100');
    }

    if ($images.length > 0) {
        $images.eq(0).addClass('opacity-100');
        setInterval(showNextImage, 5000);
    }

    // Initial overflow handling
    $('body').css('overflow', 'hidden');
    setTimeout(() => {
        $('body').css('overflow', '');
    }, 2500);
});

// Intersection Observer for reveal animations
$(document).ready(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !$(entry.target).hasClass('reveal')) {
                requestAnimationFrame(() => {
                    $(entry.target).addClass('reveal').css('opacity', '1');
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });

    setTimeout(() => {
        $('.text-reveal, section > div, .map-container').each((_, element) => {
            if (!$(element).hasClass('reveal')) {
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
const $footer = $('#hidden-footer');

$(window).on('scroll', () => {
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();
    const scrollPosition = $(window).scrollTop() + windowHeight;
    const buffer = 20;

    if (documentHeight - scrollPosition <= buffer) {
        $footer.css('transform', 'translateY(0)');
    } else {
        $footer.css('transform', 'translateY(100%)');
    }
});
