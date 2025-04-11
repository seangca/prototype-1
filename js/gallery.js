function gallery() {
    return {
        opened: false,
        activeUrl: null,
        currentIndex: null,
        currentGallery: null,
        galleries: {},

        initGalleries() {
            // Initialize galleries
            this.galleries.events = Array.from(this.$refs.events.querySelectorAll('img')).map((img, index) => {
                img.setAttribute('data-index', index + 1);
                return {
                    src: img.src,
                    alt: img.alt,
                    element: img
                };
            });

            this.galleries.automotive = Array.from(this.$refs.automotive.querySelectorAll('img')).map((img, index) => {
                img.setAttribute('data-index', index + 1);
                return {
                    src: img.src,
                    alt: img.alt,
                    element: img
                };
            });

            // Initialize sortable and tooltips after Alpine is done rendering
            this.$nextTick(() => {
                this.initSortableGalleries();
                this.initTooltips();
            });
        },

        initTooltips() {
            // Destroy any existing tooltips first to avoid duplicates
            $('li.relative button').tooltip('destroy');

            // Initialize new tooltips
            $('li.relative button').tooltip({
                tooltipClass: "ui-widget ui-tooltip ui-corner-all",
                position: {
                    my: "center bottom-10",
                    at: "center top",
                    collision: "flipfit"
                },
                show: {
                    effect: "fadeIn",
                    duration: 200
                },
                hide: {
                    effect: "fadeOut",
                    duration: 200
                },
                content: "View Image"
            });
        },

        initSortableGalleries() {
            $(".draggable-gallery").sortable({
                handle: ".drag-handle",
                items: "> li",
                cursor: "move",
                opacity: 0.7,
                placeholder: "sortable-placeholder",
                tolerance: "pointer",
                start: (e, ui) => {
                    ui.placeholder.height(ui.item.height());
                    $(ui.item).css({
                        "transform": "rotate(2deg)",
                        "box-shadow": "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                        "z-index": "10000"
                    });
                },
                stop: (e, ui) => {
                    $(ui.item).css({
                        "transform": "",
                        "box-shadow": "",
                        "z-index": ""
                    });
                },
                update: (e, ui) => {
                    const galleryType = $(ui.item).closest(".draggable-gallery").data("gallery-type");
                    this.updateGalleryIndexes(galleryType);
                }
            });

            // Prevent handle clicks from triggering image clicks
            $(".drag-handle").on("mousedown", function (e) {
                e.stopPropagation();
            });
        },

        updateGalleryIndexes(galleryType) {
            const galleryElement = this.$refs[galleryType];
            this.galleries[galleryType] = Array.from(galleryElement.querySelectorAll('img')).map((img, index) => {
                img.setAttribute('data-index', index + 1);
                return {
                    src: img.src,
                    alt: img.alt,
                    element: img
                };
            });
        },

        open(event, galleryName) {
            this.currentGallery = galleryName;
            const clickedImg = event.target;
            this.currentIndex = parseInt(clickedImg.dataset.index) - 1; // Convert to 0-based index
            this.activeUrl = clickedImg.src;
            this.opened = true;
        },

        close() {
            this.opened = false;
            setTimeout(() => this.activeUrl = null, 300);
        },

        next() {
            if (!this.opened || !this.currentGallery) return;

            const gallery = this.galleries[this.currentGallery];
            this.currentIndex = (this.currentIndex + 1) % gallery.length;
            this.activeUrl = gallery[this.currentIndex].src;
        },

        prev() {
            if (!this.opened || !this.currentGallery) return;

            const gallery = this.galleries[this.currentGallery];
            this.currentIndex = (this.currentIndex - 1 + gallery.length) % gallery.length;
            this.activeUrl = gallery[this.currentIndex].src;
        }
    };
}

// Initialize tooltips after DOM is ready and Alpine is initialized
$(document).ready(function () {
    // Wait for Alpine to be initialized
    document.addEventListener('alpine:initialized', function () {
        // Tooltips will be initialized by the Alpine component
    });
    
});
