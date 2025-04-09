$(document).ready(function() {
    const $form = $('#contactForm');
    const $submitButton = $('#submitButton');
    const $submitStatus = $('#submitStatus');
    const $successMessage = $submitStatus.find('.success');
    const $errorMessage = $submitStatus.find('.error');

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

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s'-]{2,30}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    };

    // Error messages container
    const errorMessages = {};

    // Real-time validation
    const $inputs = $form.find('input, textarea, select');
    $inputs.each(function() {
        const $input = $(this);
        // Create error message element
        const $errorDiv = $('<div>').addClass('text-red-500 text-sm mt-1 hidden');
        $input.parent().append($errorDiv);
        errorMessages[$input.attr('id')] = $errorDiv;

        $input.on('input blur', function() {
            validateField($input);
        });
    });

    function validateField($field) {
        const $errorDiv = errorMessages[$field.attr('id')];
        let isValid = true;
        let errorMessage = '';

        // Clear previous error state
        $field.removeClass('border-red-500 border-green-500');
        $errorDiv.addClass('hidden');

        // Required field validation
        if ($field.prop('required') && !$field.val().trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else {
            // Specific field validations
            switch($field.attr('id')) {
                case 'firstName':
                case 'lastName':
                    if (!patterns.name.test($field.val().trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid name (2-30 letters, hyphens and apostrophes allowed)';
                    }
                    break;
                case 'email':
                    if (!patterns.email.test($field.val().trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'phone':
                    if ($field.val().trim() && !patterns.phone.test($field.val().trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (e.g., 123-456-7890)';
                    }
                    break;
                case 'message':
                    if ($field.val().trim().length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long';
                    }
                    break;
                case 'subject':
                    if ($field.val() === "") {
                        isValid = false;
                        errorMessage = 'Please select a subject';
                    }
                    break;
            }
        }

        // Update UI based on validation
        if (!isValid) {
            $field.addClass('border-red-500');
            $errorDiv.text(errorMessage).removeClass('hidden');
        } else {
            $field.addClass('border-green-500');
        }

        return isValid;
    }

    // Form submission handling
    $form.on('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        $inputs.each(function() {
            if (!validateField($(this))) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            $errorMessage.text('Please correct the errors in the form').removeClass('hidden');
            return;
        }

        // Disable submit button and show loading state
        $submitButton.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Sending...');
        
        // Hide any previous status messages
        $submitStatus.removeClass('hidden');
        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');

        // Get current time
        const now = new Date();
        const timeString = now.toLocaleString();

        // Prepare the form data
        const formData = {
            name: `${$form.find('#firstName').val()} ${$form.find('#lastName').val()}`,
            time: timeString,
            subject: $form.find('#subject').val(),
            email: $form.find('#email').val(),
            phone: $form.find('#phone').val() || 'Not provided',
            dateRange: `${$form.find('#startDate').val() || 'Not specified'} to ${$form.find('#endDate').val() || 'Not specified'}`,
            message: $form.find('#message').val()
        };

        // Send AJAX request
        $.ajax({
            url: 'https://api.emailjs.com/api/v1.0/email/send',
            type: 'POST',
            data: JSON.stringify({
                service_id: 'service_5sb36rn',
                template_id: 'template_6tfug9x',
                user_id: 's5L1Fg98w4PSn4Laq',
                template_params: {
                    name: formData.name,
                    time: formData.time,
                    message: `Subject: ${formData.subject}
Email: ${formData.email}
Phone: ${formData.phone}
Date Range: ${formData.dateRange}

Message:
${formData.message}`
                }
            }),
            contentType: 'application/json',
            success: function(response) {
                // Show success message
                $successMessage.removeClass('hidden');
                // Reset form
                $form[0].reset();
                // Reset validation states
                $inputs.removeClass('border-red-500 border-green-500');
                $inputs.each(function() {
                    errorMessages[$(this).attr('id')].addClass('hidden');
                });
            },
            error: function(error) {
                // Show error message
                console.error('Email error:', error);
                $errorMessage.removeClass('hidden');
            },
            complete: function() {
                // Re-enable submit button
                $submitButton.prop('disabled', false).html('Send Message');
            }
        });
    });
});
