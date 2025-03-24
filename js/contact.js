document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const submitStatus = document.getElementById('submitStatus');
    const successMessage = submitStatus.querySelector('.success');
    const errorMessage = submitStatus.querySelector('.error');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // Hide any previous status messages
        submitStatus.classList.remove('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Prepare the email parameters
        const templateParams = {
            from_name: `${form.firstName.value} ${form.lastName.value}`,
            from_email: form.email.value,
            phone: form.phone.value || 'Not provided',
            subject: form.subject.value,
            message: form.message.value
        };

        // Send the email using EmailJS
        emailjs.send('service_5sb36rn', 'template_6tfug9x', templateParams)
            .then(function() {
                // Show success message
                successMessage.classList.remove('hidden');
                form.reset();
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
