$(document).ready(function() {
    // Function to get the navbar height
    function getNavbarHeight() {
        return $('.nav-reveal').outerHeight();
    }

    // Add click handler for the scroll down arrow
    $('.bounce-arrow').click(function(e) {
        e.preventDefault();
        
        // Get the target section ("Want to know me?")
        const targetSection = $('.font-protest-revolution:contains("Want to know me?")').parent();
        
        // Smooth scroll to the target section with offset for navbar
        $('html, body').animate({
            scrollTop: targetSection.offset().top - getNavbarHeight()
        }, 1000); // 1 second animation
    });

    // Add hover effect to the arrow
    $('.bounce-arrow').hover(
        function() {
            $(this).css('color', '#fcd34d');
        },
        function() {
            $(this).css('color', '');
        }
    );
});
