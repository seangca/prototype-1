// Footer scroll behavior
export function initializeFooter() {
    const $footer = $('#hidden-footer');

    $(window).on('scroll', () => {
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollPosition = $(window).scrollTop() + windowHeight;
        const buffer = 20;

        if (documentHeight - scrollPosition <= buffer) {
            $footer.css('transform', 'translateY(0)');
        } else {
            $footer.css('transform', 'translateY(100%)');
        }
    });
}
