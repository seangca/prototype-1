$(document).ready(function() {
    // Add font styles
    $('.carousel-item h3').addClass('font-protest-revolution');
    $('.carousel-item p').addClass('font-syne');

    $('.carousel-container').each(function() {
        const $container = $(this);
        let currentSlide = 0;
        const $slides = $container.find('.carousel-item');
        const $indicatorsContainer = $container.find('.absolute.bottom-2, .absolute.bottom-4');
        let $indicators;
        const $progressBar = $container.find('.progress-bar');
        let autoAdvanceTimer;
        const slideCount = $slides.length;
        let slideWidth = $container.width();

        // Update slide width on resize
        $(window).on('resize', function() {
            slideWidth = $container.width();
        });

        // Initialize draggable for active slide
        function initDraggable() {
            const $activeImg = $container.find('.carousel-item.active img');
            
            // Destroy previous draggable instance if exists
            if ($activeImg.data('ui-draggable')) {
                $activeImg.draggable('destroy');
            }
            
            $activeImg.draggable({
                axis: 'x',
                containment: [-slideWidth * 0.7, 0, slideWidth * 0.7, 0],
                cursor: 'grab',
                helper: 'clone',
                revert: 'invalid',
                start: function() {
                    $(this).css('transition', 'none');
                },
                drag: function(e, ui) {
                    // Calculate opacity based on drag distance
                    const opacity = 1 - Math.min(Math.abs(ui.position.left) / (slideWidth * 0.7), 1);
                    $(this).css('opacity', opacity);
                },
                stop: function(e, ui) {
                    const threshold = slideWidth * 0.5;
                    
                    // Reset styles
                    $(this).css({
                        'transition': 'transform 0.3s ease, opacity 0.3s ease',
                        'opacity': 1,
                        'left': 0
                    });

                    // Check drag distance and trigger slide change
                    if (ui.position.left > threshold) {
                        prevSlide();
                    } else if (ui.position.left < -threshold) {
                        nextSlide();
                    }
                }
            });
        }

        function updateSlides() {
            $slides.each(function(index) {
                $(this).removeClass('active next prev hidden')
                       .addClass('absolute top-0 left-0 w-full h-full');
                
                if (index === currentSlide) {
                    $(this).addClass('active');
                } else if (index === (currentSlide + 1) % slideCount) {
                    $(this).addClass('next');
                } else if (index === (currentSlide - 1 + slideCount) % slideCount) {
                    $(this).addClass('prev');
                } else {
                    $(this).addClass('hidden');
                }
            });

            // Reinitialize draggable for new active slide
            initDraggable();
            updateIndicators();
            $progressBar.css('width', ((currentSlide + 1) / slideCount) * 100 + '%');
        }

        function updateIndicators() {
            if (!$indicators || !$indicators.length) return;
            
            $indicators.each(function(index) {
                $(this).removeClass('bg-white/40 bg-white/20')
                       .addClass('w-8 sm:w-12 h-1 sm:h-1.5 rounded-full transition-colors hover:bg-white/60');
                
                if (index === currentSlide) {
                    $(this).addClass('bg-white/40');
                } else {
                    $(this).addClass('bg-white/20');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlides();
            resetAutoAdvance();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateSlides();
            resetAutoAdvance();
        }

        function resetAutoAdvance() {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = setInterval(nextSlide, 5000);
        }

        function initIndicators() {
            $indicatorsContainer.empty();
            for (let i = 0; i < slideCount; i++) {
                $indicatorsContainer.append(
                    `<button class="indicator-btn w-8 sm:w-12 h-1 sm:h-1.5 rounded-full transition-colors ${
                        i === 0 ? 'bg-white/40' : 'bg-white/20'
                    } hover:bg-white/60" data-index="${i}" title="Go to Slide ${i + 1}"></button>`
                );
            }
            $indicators = $indicatorsContainer.find('button');
            
            $indicators.tooltip({
                position: {
                    my: "center bottom-5",
                    at: "center top"
                },
                show: { effect: "fadeIn", duration: 200 },
                hide: { effect: "fadeOut", duration: 200 }
            });
        }

        // Initialize everything
        initIndicators();
        updateSlides();
        resetAutoAdvance();
        
        // Event handlers
        $container.hover(
            () => clearInterval(autoAdvanceTimer),
            () => resetAutoAdvance()
        );
        
        $indicatorsContainer.on('click', 'button', function() {
            currentSlide = $(this).index();
            updateSlides();
            resetAutoAdvance();
        });
        
        $container.find('.nav-button').on('click', function() {
            if ($(this).is('[onclick="prevSlide()"], [title*="Previous"]')) {
                prevSlide();
            } else {
                nextSlide();
            }
        });
    });
});