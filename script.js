const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

document.getElementById('waitlistForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    const successMessage = document.getElementById('successMessage');
    const submitButton = this.querySelector('button[type="submit"]');

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Joining...';

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                email: email,
                source: 'prelaunch-page',
                timestamp: new Date().toISOString()
            })
        });

        const result = await response.json();

        // Show success message (duplicates are handled silently on the backend)
        if (result.success) {
            console.log('Email submitted successfully:', email);

            // Show success message
            successMessage.classList.add('show');
            emailInput.value = '';

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        } else {
            throw new Error(result.message || 'Failed to join waitlist');
        }

    } catch (error) {
        console.error('Error submitting email:', error);
        alert('Oops! Something went wrong. Please try again.');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Join the Waitlist';
    }
});
