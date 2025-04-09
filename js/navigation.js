// Hamburger Menu functionality
export function initializeNavigation() {
    const $hamburger = $('.hamburger');
    const $mobileMenu = $('.mobile-menu');
    const $menuIcon = $hamburger.find('i');
    const $menuItems = $('.menu-item');

    $hamburger.on('click', () => {
        $mobileMenu.toggleClass('active');
        $menuIcon.toggleClass('fa-bars fa-times');

        $menuItems.each((index, item) => {
            if ($mobileMenu.hasClass('active')) {
                setTimeout(() => {
                    $(item).removeClass('opacity-0 translate-y-4');
                }, 100 * (index + 1));
            } else {
                $(item).addClass('opacity-0 translate-y-4');
            }
        });
    });

    // Close mobile menu when clicking outside
    $(document).on('click', (e) => {
        if (!$hamburger[0].contains(e.target) && !$mobileMenu[0].contains(e.target) && $mobileMenu.hasClass('active')) {
            $mobileMenu.removeClass('active');
            $menuIcon.addClass('fa-bars').removeClass('fa-times');
            $menuItems.addClass('opacity-0 translate-y-4');
        }
    });
}
