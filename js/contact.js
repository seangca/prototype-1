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
