// Animation functionality
export function initializeAnimations() {
    // Intersection Observer for reveal animations
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
}

export function initializeGSAPAnimations() {
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
}
