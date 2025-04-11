import { tailwindConfig } from './config.js';
import { initializeLoading } from './loading.js'
import { initializeNavigation } from './navigation.js';
import { initializeAnimations } from './animations.js';
import { initializeFooter } from './footer.js';


// Apply Tailwind configuration
tailwind.config = tailwindConfig;

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading first
    initializeLoading();

    // Initialize all components when document is ready
    $(document).ready(() => {
        // Initialize navigation after carousel
        initializeNavigation();
        initializeAnimations();
        initializeFooter();
        
        // Initial overflow handling
        $('body').css('overflow', 'hidden');
        setTimeout(() => {
            $('body').css('overflow', '');
        }, 2500);
    });
});
