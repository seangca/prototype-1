// Carousel functionality
function initializeCarousel() {
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
}

// Initialize the carousel when the document is ready
$(document).ready(initializeCarousel);
