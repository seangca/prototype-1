document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const submitStatus = document.getElementById('submitStatus');
    const successMessage = submitStatus.querySelector('.success');
    const errorMessage = submitStatus.querySelector('.error');

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s'-]{2,30}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    };

    // Error messages container
    const errorMessages = {};

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1 hidden';
        input.parentNode.appendChild(errorDiv);
        errorMessages[input.id] = errorDiv;

        input.addEventListener('input', function() {
            validateField(input);
        });

        input.addEventListener('blur', function() {
            validateField(input);
        });
    });

    function validateField(field) {
        const errorDiv = errorMessages[field.id];
        let isValid = true;
        let errorMessage = '';

        // Clear previous error state
        field.classList.remove('border-red-500', 'border-green-500');
        errorDiv.classList.add('hidden');

        // Required field validation
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else {
            // Specific field validations
            switch(field.id) {
                case 'firstName':
                case 'lastName':
                    if (!patterns.name.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid name (2-30 letters, hyphens and apostrophes allowed)';
                    }
                    break;
                case 'email':
                    if (!patterns.email.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'phone':
                    if (field.value.trim() && !patterns.phone.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (e.g., 123-456-7890)';
                    }
                    break;
                case 'message':
                    if (field.value.trim().length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long';
                    }
                    break;
                case 'subject':
                    if (field.value === "") {
                        isValid = false;
                        errorMessage = 'Please select a subject';
                    }
                    break;
            }
        }

        // Update UI based on validation
        if (!isValid) {
            field.classList.add('border-red-500');
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        } else {
            field.classList.add('border-green-500');
        }

        return isValid;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            errorMessage.textContent = 'Please correct the errors in the form';
            errorMessage.classList.remove('hidden');
            return;
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // Hide any previous status messages
        submitStatus.classList.remove('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Get current time
        const now = new Date();
        const timeString = now.toLocaleString();

        // Prepare the email parameters
        const templateParams = {
            name: `${form.firstName.value} ${form.lastName.value}`,
            time: timeString,
            message: `Subject: ${form.subject.value}
Email: ${form.email.value}
Phone: ${form.phone.value || 'Not provided'}

Message:
${form.message.value}`
        };

        // Send the email using EmailJS
        emailjs.send('service_5sb36rn', 'template_6tfug9x', templateParams)
            .then(function() {
                // Show success message
                successMessage.classList.remove('hidden');
                form.reset();
                // Reset validation states
                inputs.forEach(input => {
                    input.classList.remove('border-red-500', 'border-green-500');
                    errorMessages[input.id].classList.add('hidden');
                });
            })
            .catch(function(error) {
                // Show error message
                console.error('Email error:', error);
                errorMessage.classList.remove('hidden');
            })
            .finally(function() {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
            });
    });
});
