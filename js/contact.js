// Initialize contact form functionality
export function initializeContactForm() {
    const $form = $('#contactForm');
    const $submitStatus = $('#submitStatus');
    const $successMessage = $submitStatus.find('.success');
    const $errorMessage = $submitStatus.find('.error');
    const $submitButton = $('#submitButton');

    // Initialize date range picker
    let startDate, endDate;
    
    $('#startDate').datepicker({
        dateFormat: 'MM d, yy',
        minDate: 0,
        showAnim: 'fadeIn',
        onSelect: function(selectedDate) {
            startDate = $(this).datepicker('getDate');
            let minEndDate = new Date(startDate);
            $('#endDate').datepicker('option', 'minDate', minEndDate);
        },
        beforeShow: function(input, inst) {
            setTimeout(function() {
                inst.dpDiv.addClass('bg-zinc-800 text-white border-zinc-700');
                $('.ui-datepicker-header').addClass('bg-zinc-900 border-zinc-700');
                $('.ui-datepicker-calendar th').addClass('text-yellow-300');
                $('.ui-datepicker-calendar td:not(.ui-datepicker-other-month) a').addClass('text-white hover:bg-yellow-300 hover:text-black');
                $('.ui-datepicker-calendar td.ui-datepicker-other-month a').addClass('text-zinc-500');
            }, 0);
        }
    });

    $('#endDate').datepicker({
        dateFormat: 'MM d, yy',
        minDate: 0,
        showAnim: 'fadeIn',
        onSelect: function(selectedDate) {
            endDate = $(this).datepicker('getDate');
        },
        beforeShow: function(input, inst) {
            setTimeout(function() {
                inst.dpDiv.addClass('bg-zinc-800 text-white border-zinc-700');
                $('.ui-datepicker-header').addClass('bg-zinc-900 border-zinc-700');
                $('.ui-datepicker-calendar th').addClass('text-yellow-300');
                $('.ui-datepicker-calendar td:not(.ui-datepicker-other-month) a').addClass('text-white hover:bg-yellow-300 hover:text-black');
                $('.ui-datepicker-calendar td.ui-datepicker-other-month a').addClass('text-zinc-500');
            }, 0);
        }
    });

    // Initialize jQuery Validation
    $form.validate({
        rules: {
            firstName: {
                required: true,
                minlength: 2,
                maxlength: 30,
                pattern: /^[a-zA-Z\s'-]+$/
            },
            lastName: {
                required: true,
                minlength: 2,
                maxlength: 30,
                pattern: /^[a-zA-Z\s'-]+$/
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                pattern: /^[2-9]\d{2}[\s-]?(\d{3})[\s-]?(\d{4})$/
            },
            subject: {
                required: true
            },
            message: {
                required: true,
                minlength: 10
            }
        },
        messages: {
            firstName: {
                required: 'Please enter your first name',
                minlength: 'First name must be at least 2 characters',
                maxlength: 'First name cannot exceed 30 characters',
                pattern: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
            },
            lastName: {
                required: 'Please enter your last name',
                minlength: 'Last name must be at least 2 characters',
                maxlength: 'Last name cannot exceed 30 characters',
                pattern: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
            },
            email: {
                required: 'Please enter your email address',
                email: 'Please enter a valid email address'
            },
            phone: {
                pattern: 'Please enter a valid phone number (e.g., 123-456-7890 or 1234567890)'
            },
            subject: {
                required: 'Please select a subject'
            },
            message: {
                required: 'Please enter your message',
                minlength: 'Message must be at least 10 characters'
            }
        },
        errorElement: 'div',
        errorClass: 'text-red-400 text-sm mt-1',
        highlight: function(element, errorClass, validClass) {
            $(element).addClass('border-red-400').removeClass('border-yellow-300');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).addClass('border-yellow-300').removeClass('border-red-400');
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        }
    });

    // Format phone number with hyphens
    function formatPhoneNumber(phone) {
        if (!phone) return '';
        phone = phone.replace(/\D/g, ''); // Remove all non-digit characters
        if (phone.length === 10) {
            return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
        }
        return phone;
    }

    // Format phone number on blur
    $('#phone').on('blur', function() {
        const phone = $(this).val();
        $(this).val(formatPhoneNumber(phone));
    });

    // Form submission handling
    $form.on('submit', function(e) {
        e.preventDefault();
        
        if (!$form.valid()) {
            return;
        }

        // Format phone number before submission
        const phone = $('#phone').val();
        $('#phone').val(formatPhoneNumber(phone));

        // Get form data
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            subject: $('#subject').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val(),
            message: $('#message').val()
        };

        // Disable submit button and show loading state
        $submitButton.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Sending...');
        
        // Hide any previous status messages
        $submitStatus.removeClass('hidden');
        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');

        // Send AJAX request
        $.ajax({
            url: 'https://api.emailjs.com/api/v1.0/email/send',
            type: 'POST',
            data: JSON.stringify({
                service_id: 'service_5sb36rn',
                template_id: 'template_6tfug9x',
                user_id: 's5L1Fg98w4PSn4Laq',
                template_params: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || 'Not provided',
                    subject: formData.subject,
                    startDate: formData.startDate || 'Not specified',
                    endDate: formData.endDate || 'Not specified',
                    message: formData.message
                }
            }),
            contentType: 'application/json',
            success: function(response) {
                // Show success message
                showSuccess();
                // Reset form
                $form[0].reset();
                // Reset date pickers
                $('#startDate').datepicker('setDate', null);
                $('#endDate').datepicker('setDate', null);
                // Reset validation states
                $form.find('input, select, textarea').removeClass('border-red-400 border-yellow-300');
                $form.find('.text-red-400').addClass('hidden');
            },
            error: function(xhr, status, error) {
                console.error('EmailJS error:', error);
                showError('There was an error sending your message. Please try again.');
            },
            complete: function() {
                // Re-enable submit button and reset text
                $submitButton.prop('disabled', false).html('Send Message');
            }
        });
    });

    // Helper functions
    function showSuccess() {
        $successMessage.removeClass('hidden');
        $errorMessage.addClass('hidden');
        $submitStatus.removeClass('hidden');
    }

    function showError(message) {
        $errorMessage.text(message);
        $errorMessage.removeClass('hidden');
        $successMessage.addClass('hidden');
        $submitStatus.removeClass('hidden');
    }

    // Add smooth scrolling to anchor links
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
}

// Initialize the contact form when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeContactForm();
});
