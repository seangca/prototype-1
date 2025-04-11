$(document).ready(function() {
    // Add hover effects to list items
    $('.photography-list li, .videography-list li').hover(
        function() {
            // On mouse enter
            $(this).css({
                'transform': 'scale(1.05)',
                'color': '#fcd34d'
            }).find('.bullet-point').css('color', '#fcd34d');
        },
        function() {
            // On mouse leave
            $(this).css({
                'transform': 'scale(1)',
                'color': ''
            }).find('.bullet-point').css('color', '#fcd34d');
        }
    );

    // Add smooth transitions
    $('.photography-list li, .videography-list li').css({
        'transition': 'all 0.3s ease-out'
    });

    // Add cursor pointer
    $('.photography-list li, .videography-list li').css('cursor', 'pointer');
});
