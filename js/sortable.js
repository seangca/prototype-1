// Initialize sortable functionality for both lists
document.addEventListener('DOMContentLoaded', function() {
    // Make the photography list sortable
    $('.photography-list').sortable({
        placeholder: 'ui-sortable-placeholder',
        axis: 'y',
        cursor: 'move',
        update: function(event, ui) {
            // Update the bullet points after sorting
            $(this).find('li').each(function(index) {
                $(this).find('.bullet-point').text('•');
            });
        }
    });

    // Make the videography list sortable
    $('.videography-list').sortable({
        placeholder: 'ui-sortable-placeholder',
        axis: 'y',
        cursor: 'move',
        update: function(event, ui) {
            // Update the bullet points after sorting
            $(this).find('li').each(function(index) {
                $(this).find('.bullet-point').text('•');
            });
        }
    });

    // Add visual feedback for the placeholder
    $('.ui-sortable-placeholder').addClass('bg-black/20');
});
