export function initializeLoading() {
    const $landingMask = $('.landing-mask');

    const createLoadingElements = ($container) => {
        const $spinner = $('<div class="loading-spinner"></div>');
        const $loadingText = $('<div class="loading-text">Loading 0%</div>');
        $container.append($spinner, $loadingText);
        return { $spinner, $loadingText };
    };

    const loadingElements = createLoadingElements($landingMask);

    // Track initial visible images
    const allImages = $('img:not(.lazy)').toArray();
    const totalImages = allImages.length;
    let loadedCount = 0;
    let currentPercentage = 0;
    let animationFrame;
    let loadingTimeout = null;

    if (totalImages === 0) {
        $landingMask.addClass('loaded');
        return;
    }

    // Function to smoothly animate the loading percentage
    const animatePercentage = (targetPercentage) => {
        if (currentPercentage < targetPercentage) {
            currentPercentage = Math.min(currentPercentage + 1, targetPercentage);
            loadingElements.$loadingText.text(`Loading ${currentPercentage}%`);
            
            if (currentPercentage < targetPercentage) {
                animationFrame = requestAnimationFrame(() => animatePercentage(targetPercentage));
            } else if (currentPercentage === 100) {
                setTimeout(removeLoadingMask, 500);
            }
        }
    };

    // Function to update loading percentage
    const updateLoadingProgress = () => {
        loadedCount++;
        const targetPercentage = Math.round((loadedCount / totalImages) * 100);
        cancelAnimationFrame(animationFrame);
        animatePercentage(targetPercentage);

        if (!loadingTimeout) {
            loadingTimeout = setTimeout(() => {
                if (currentPercentage < 100) {
                    console.log('Loading timed out, forcing completion');
                    animatePercentage(100);
                }
            }, 10000);
        }
    };

    // Function to remove loading mask
    const removeLoadingMask = () => {
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }
        loadingElements.$spinner.addClass('hidden');
        loadingElements.$loadingText.addClass('hidden');
        setTimeout(() => {
            $landingMask.addClass('loaded');
        }, 300);

        // After initial load, initialize lazy loading
        initializeLazyLoading();
    };

    // Load initial visible images
    allImages.forEach(img => {
        if (img.complete) {
            updateLoadingProgress();
        } else {
            $(img).one('load error', updateLoadingProgress);
        }
    });
}

// Lazy loading implementation with fallback
function initializeLazyLoading() {
    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadLazyImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: "50px",
            threshold: 0.1
        });

        document.querySelectorAll("img.lazy").forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        let lazyloadThrottleTimeout;

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(() => {
                const scrollTop = $(window).scrollTop();
                $("img.lazy").each(function() {
                    const $img = $(this);
                    if ($img.offset().top < window.innerHeight + scrollTop + 500) {
                        loadLazyImage(this);
                    }
                });

                if ($("img.lazy").length === 0) {
                    $(document).off("scroll", lazyload);
                    $(window).off("resize", lazyload);
                }
            }, 20);
        }

        $(document).on("scroll", lazyload);
        $(window).on("resize", lazyload);
        lazyload();
    }
}

function loadLazyImage(img) {
    // Create placeholder
    const placeholder = createPlaceholder();
    img.parentNode.insertBefore(placeholder, img);

    // Load the actual image
    const actualImage = new Image();
    actualImage.onload = () => {
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        
        // Fade out placeholder
        placeholder.style.opacity = "0";
        setTimeout(() => placeholder.remove(), 500);
    };
    actualImage.src = img.dataset.src;
}

function createPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    
    const shimmerOverlay = document.createElement('div');
    shimmerOverlay.className = 'shimmer-overlay';
    
    const blurredBackground = document.createElement('div');
    blurredBackground.className = 'blurred-background';
    
    const loadingIcon = document.createElement('div');
    loadingIcon.className = 'loading-icon';
    loadingIcon.innerHTML = '<i class="fas fa-camera"></i>';
    
    Object.assign(placeholder.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s ease'
    });

    Object.assign(shimmerOverlay.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '200%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 100%)',
        animation: 'shimmer 2s infinite linear',
        transform: 'translateX(-50%)'
    });

    Object.assign(blurredBackground.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(255, 196, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 70%)',
        animation: 'pulse 2s infinite ease-in-out'
    });

    Object.assign(loadingIcon.style, {
        position: 'relative',
        zIndex: '2',
        color: 'rgba(255, 196, 0, 0.5)',
        fontSize: '2rem',
        animation: 'bounce 1s infinite ease-in-out'
    });

    placeholder.appendChild(blurredBackground);
    placeholder.appendChild(shimmerOverlay);
    placeholder.appendChild(loadingIcon);

    return placeholder;
}

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.5; }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.image-placeholder {
    transition: opacity 0.5s ease;
}

.loading-icon i {
    filter: drop-shadow(0 0 5px rgba(255, 196, 0, 0.3));
}

.lazy {
    opacity: 0;
    transition: opacity 0.5s ease-in;
}

.lazy.loaded {
    opacity: 1;
}
`;
document.head.appendChild(style);
