import { tailwindConfig } from './config.js';
import { initializeNavigation } from './navigation.js';
import { initializeCarousel } from './carousel.js';
import { initializeAnimations, initializeGSAPAnimations } from './animations.js';
import { initializeFooter } from './footer.js';
import { initializeLoading } from './loading.js';

// Apply Tailwind configuration
tailwind.config = tailwindConfig;

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading first
    initializeLoading();

    // Initialize carousel immediately to start loading images
    initializeCarousel();

    // Initialize all components when document is ready
    $(document).ready(() => {
        // Initialize navigation after carousel
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
});
