export function initializeLoading() {
    const $landingMask = $('.landing-mask');
    
    // Add loading spinner and text
    const $spinner = $('<div class="loading-spinner"></div>');
    const $loadingText = $('<div class="loading-text">Loading 0%</div>');
    $landingMask.append($spinner, $loadingText);

    // Track total images and loaded count
    const images = $('img').toArray();
    let loadedCount = 0;
    const totalImages = images.length;

    // Function to update loading percentage
    function updateLoadingProgress() {
        loadedCount++;
        const percentage = Math.round((loadedCount / totalImages) * 100);
        $loadingText.text(`Loading ${percentage}%`);
    }

    // Function to check if all images are loaded
    function checkImagesLoaded() {
        const loadedImages = images.filter(img => img.complete);
        return images.length === loadedImages.length;
    }

    // Function to remove loading mask
    function removeLoadingMask() {
        $spinner.addClass('hidden');
        $loadingText.addClass('hidden');
        setTimeout(() => {
            $landingMask.addClass('loaded');
        }, 300);
    }

    // Check if images are already loaded
    if (checkImagesLoaded()) {
        $loadingText.text('Loading 100%');
        removeLoadingMask();
    } else {
        // Wait for all images to load
        images.forEach(img => {
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
}
