document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery-container');
    const track = document.querySelector('.gallery-track');
    const filterSelect = document.querySelector('.filter-select');
    const minimapItems = document.querySelectorAll('.minimap-item');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let isDown = false;
    let startX;
    let scrollLeft;
    let isScrolling = false;

    function calculateSnapPoints() {
        return Array.from(galleryItems).map(item => {
            const itemRect = item.getBoundingClientRect();
            const galleryRect = gallery.getBoundingClientRect();
            return item.offsetLeft - (galleryRect.width / 2) + (itemRect.width / 2);
        });
    }

    let snapPoints = calculateSnapPoints();

    window.addEventListener('resize', () => {
        snapPoints = calculateSnapPoints();
    });

    function getClosestSnapPoint(currentScroll) {
        return snapPoints.reduce((prev, curr) => {
            return Math.abs(curr - currentScroll) < Math.abs(prev - currentScroll) ? curr : prev;
        });
    }

    function smoothSnap(targetScroll) {
        gsap.to(gallery, {
            scrollLeft: targetScroll,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                isScrolling = false;
                updateMinimapActive();
            }
        });
    }

    function handleScrollEnd() {
        if (isScrolling) {
            const currentScroll = gallery.scrollLeft;
            const targetScroll = getClosestSnapPoint(currentScroll);
            smoothSnap(targetScroll);
        }
    }

    function handleDragEnd() {
        gsap.killTweensOf(gallery);
        const currentScroll = gallery.scrollLeft;
        const targetScroll = getClosestSnapPoint(currentScroll);
        smoothSnap(targetScroll);
    }

    // Touch events
    gallery.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
        gsap.killTweensOf(gallery);
    });

    gallery.addEventListener('touchend', () => {
        isDown = false;
        handleDragEnd();
    });

    gallery.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
        updateMinimapActive();
    });

    // Mouse events
    gallery.addEventListener('mousedown', (e) => {
        gsap.killTweensOf(gallery);
        isDown = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => {
        if (isDown) handleDragEnd();
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mouseup', () => {
        if (isDown) handleDragEnd();
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
        updateMinimapActive();
    });

    // Wheel scroll
    gallery.addEventListener('wheel', (e) => {
        e.preventDefault();
        isScrolling = true;
        gsap.killTweensOf(gallery);

        gallery.scrollLeft += e.deltaX || e.deltaY;
        updateMinimapActive();

        clearTimeout(gallery.scrollTimeout);
        gallery.scrollTimeout = setTimeout(() => {
            handleScrollEnd();
        }, 150);
    }, { passive: false });

    // Minimap functionality
    minimapItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            gsap.killTweensOf(gallery);
            const targetScroll = snapPoints[index];
            smoothSnap(targetScroll);
        });
    });

    function updateMinimapActive() {
        const currentScroll = gallery.scrollLeft;
        const activeIndex = snapPoints.findIndex((point, index) => {
            const nextPoint = snapPoints[index + 1] || Infinity;
            return currentScroll >= point - 100 && currentScroll < nextPoint - 100;
        });

        minimapItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    gallery.addEventListener('scroll', () => {
        if (!isDown) {
            updateMinimapActive();
        }
    });

    // Filter functionality
    filterSelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        const items = track.querySelectorAll('.gallery-item');
        
        gsap.killTweensOf(gallery);
        
        items.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const minimapItem = minimapItems[index];
            
            if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                gsap.to(item, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    display: 'block'
                });
                minimapItem.style.display = 'block';
            } else {
                gsap.to(item, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.5,
                    display: 'none'
                });
                minimapItem.style.display = 'none';
            }
        });

        smoothSnap(0);
        snapPoints = calculateSnapPoints();
    });

    // GSAP animations
    gsap.from('.gallery-container', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.gallery-container',
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from(['.filter-container', '.minimap-container'], {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.5,
        stagger: 0.2
    });

    updateMinimapActive();
});
