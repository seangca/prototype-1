$(document).ready(function() {
    // Create the lightbox HTML structure
    const lightboxHTML = `
    <div id="lightbox" class="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-50" style="display: none;">
        <div class="relative flex items-center justify-center w-11/12 xl:w-4/5 h-11/12">
            <!-- Previous button -->
            <div id="lightbox-prev" class="absolute left-0 flex items-center justify-center text-white translate-x-10 rounded-full cursor-pointer xl:-translate-x-24 2xl:-translate-x-32 bg-white/10 w-14 h-14 hover:bg-white/20">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </div>
            
            <!-- Main image -->
            <img id="lightbox-img" class="object-contain object-center w-full h-full select-none cursor-pointer" src="" alt="">
            
            <!-- Next button -->
            <div id="lightbox-next" class="absolute right-0 flex items-center justify-center text-white -translate-x-10 rounded-full cursor-pointer xl:translate-x-24 2xl:translate-x-32 bg-white/10 w-14 h-14 hover:bg-white/20">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    </div>`;
    
    // Append the lightbox to the body
    $('body').append(lightboxHTML);
    
    // Variables to track current image and gallery
    let currentImageIndex = 0;
    let currentGallery = [];
    
    // Function to open lightbox
    function openLightbox(imgSrc, gallery) {
        currentGallery = gallery;
        currentImageIndex = gallery.findIndex(img => img.src === imgSrc);
        
        $('#lightbox-img').attr('src', imgSrc);
        $('#lightbox').fadeIn();
        
        // Update button visibility
        updateNavButtons();
    }
    
    // Function to close lightbox
    function closeLightbox() {
        $('#lightbox').fadeOut();
    }
    
    // Function to show next image
    function showNextImage() {
        if (currentGallery.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
            $('#lightbox-img').attr('src', currentGallery[currentImageIndex].src);
            updateNavButtons();
        }
    }
    
    // Function to show previous image
    function showPrevImage() {
        if (currentGallery.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            $('#lightbox-img').attr('src', currentGallery[currentImageIndex].src);
            updateNavButtons();
        }
    }
    
    // Update navigation buttons visibility
    function updateNavButtons() {
        if (currentGallery.length <= 1) {
            $('#lightbox-prev, #lightbox-next').hide();
        } else {
            $('#lightbox-prev, #lightbox-next').show();
        }
    }
    
    // Event handlers
    $(document).on('click', '.group button', function(e) {
        e.stopPropagation();
        
        // Get all images in the current section
        const section = $(this).closest('.events, .automotive, .nature, .hobbies');
        const gallery = section.find('img').map(function() {
            return {
                src: $(this).attr('src'),
                element: this
            };
        }).get();
        
        // Get the clicked image src
        const imgSrc = $(this).closest('.group').find('img').attr('src');
        
        // Open lightbox
        openLightbox(imgSrc, gallery);
    });
    
    // Lightbox navigation
    $('#lightbox-next').click(function(e) {
        e.stopPropagation();
        showNextImage();
    });
    
    $('#lightbox-prev').click(function(e) {
        e.stopPropagation();
        showPrevImage();
    });
    
    // Close lightbox when clicking the image
    $('#lightbox-img').click(function(e) {
        e.stopPropagation();
        closeLightbox();
    });
    
    // Close lightbox when clicking outside
    $('#lightbox').click(function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    $(document).keydown(function(e) {
        if ($('#lightbox').is(':visible')) {
            switch(e.which) {
                case 27: // ESC
                    closeLightbox();
                    e.preventDefault();
                    break;
                case 37: // Left arrow
                    showPrevImage();
                    e.preventDefault();
                    break;
                case 39: // Right arrow
                    showNextImage();
                    e.preventDefault();
                    break;
                default:
                    return;
            }
        }
    });
    
    // Prevent lightbox content from closing when clicking inside
    $('#lightbox > div').click(function(e) {
        e.stopPropagation();
    });
});