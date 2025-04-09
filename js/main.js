import { tailwindConfig } from './config.js';
import { initializeNavigation } from './navigation.js';
import { initializeCarousel } from './carousel.js';
import { initializeAnimations, initializeGSAPAnimations } from './animations.js';
import { initializeFooter } from './footer.js';
import { initializeLoading } from './loading.js';

// Apply Tailwind configuration
tailwind.config = tailwindConfig;

// Initialize loading first
initializeLoading();

// Initialize all components when document is ready
$(document).ready(function() {
    initializeNavigation();
    initializeAnimations();
    initializeGSAPAnimations();
    initializeFooter();
    
    // Initial overflow handling
    $('body').css('overflow', 'hidden');
    setTimeout(() => {
        $('body').css('overflow', '');
    }, 2500);
});

// Initialize carousel on window load
$(window).on('load', function() {
    initializeCarousel();
});
