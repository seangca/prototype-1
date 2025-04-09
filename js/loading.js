export function initializeLoading() {
    const $landingMask = $('.landing-mask');
    const $galleryMask = $('.gallery-mask');
    const $contactMask = $('.contact-mask');
    
    // Add loading spinner and text to each section
    const createLoadingElements = ($container) => {
        const $spinner = $('<div class="loading-spinner"></div>');
        const $loadingText = $('<div class="loading-text">Loading 0%</div>');
        $container.append($spinner, $loadingText);
        return { $spinner, $loadingText };
    };

    const landingElements = createLoadingElements($landingMask);
    const galleryElements = createLoadingElements($galleryMask);
    const contactElements = createLoadingElements($contactMask);

    // Track images for each section
    const landingImages = $('.landing-section img').toArray();
    const galleryImages = $('.gallery-section img').toArray();
    const contactImages = $('.contact-section img').toArray();

    const sections = [
        { name: 'landing', images: landingImages, elements: landingElements, mask: $landingMask },
        { name: 'gallery', images: galleryImages, elements: galleryElements, mask: $galleryMask },
        { name: 'contact', images: contactImages, elements: contactElements, mask: $contactMask }
    ];

    sections.forEach(section => {
        let loadedCount = 0;
        const totalImages = section.images.length;

        // Function to update loading percentage
        const updateLoadingProgress = () => {
            loadedCount++;
            const percentage = Math.round((loadedCount / totalImages) * 100);
            section.elements.$loadingText.text(`Loading ${percentage}%`);
        };

        // Function to check if all images are loaded
        const checkImagesLoaded = () => {
            const loadedImages = section.images.filter(img => img.complete);
            return section.images.length === loadedImages.length;
        };

        // Function to remove loading mask
        const removeLoadingMask = () => {
            section.elements.$spinner.addClass('hidden');
            section.elements.$loadingText.addClass('hidden');
            setTimeout(() => {
                section.mask.addClass('loaded');
            }, 300);
        };

        // Check if images are already loaded
        if (checkImagesLoaded()) {
            section.elements.$loadingText.text('Loading 100%');
            removeLoadingMask();
        } else {
            // Wait for all images to load
            section.images.forEach(img => {
                if (img.complete) {
                    updateLoadingProgress();
                } else {
                    $(img).on('load', () => {
                        updateLoadingProgress();
                        if (loadedCount === totalImages) {
                            removeLoadingMask();
                        }
                    });
                    $(img).on('error', () => {
                        updateLoadingProgress();
                        if (loadedCount === totalImages) {
                            removeLoadingMask();
                        }
                    });
                }
            });
        }
    });
}
