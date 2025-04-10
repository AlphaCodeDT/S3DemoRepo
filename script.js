// script.js

document.addEventListener("DOMContentLoaded", function() {

    // --- Reusable Component Loading ---
    const loadComponent = (url, placeholderId, callback) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                    if (callback) callback(); // Execute callback after loading
                } else {
                    console.warn(`Placeholder element with ID '${placeholderId}' not found.`);
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    // Load Header and Footer
    // Pass setActiveNavLink as a callback for the header
    loadComponent('header.html', 'header-placeholder', setActiveNavLink);
    loadComponent('footer.html', 'footer-placeholder');

    // --- Active Navigation Link Highlighting ---
    function setActiveNavLink() {
        // Find the current page filename (e.g., "home.html", "about.html")
        // Handle potential trailing slash or root path
        const pathParts = window.location.pathname.split('/');
        let currentPage = pathParts.pop() || 'home.html'; // Default to home.html if path ends in / or is empty
         if (currentPage === '' && pathParts.length <= 1) {
             currentPage = 'home.html'; // Explicitly handle root path
         }

        // Select navigation links within the *loaded* header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const navLinks = headerPlaceholder.querySelectorAll('header nav a');
            navLinks.forEach(link => {
                // Get the filename from the link's href
                const linkHref = link.getAttribute('href');
                const linkPage = linkHref ? linkHref.split('/').pop() : null;

                // Remove existing active class first
                link.classList.remove('nav-active', 'text-primary');
                link.classList.add('text-gray-800'); // Ensure default color

                // Add active class if the link's page matches the current page
                if (linkPage && linkPage === currentPage) {
                    link.classList.add('nav-active');
                    link.classList.add('text-primary'); // Apply primary color directly if preferred over nav-active class
                    link.classList.remove('text-gray-800');
                }
            });

            // Add mobile menu toggle functionality if it wasn't loaded yet
            const menuButton = headerPlaceholder.querySelector('#mobile-menu-button');
            const mobileNav = headerPlaceholder.querySelector('#mobile-menu'); // Assuming you add an ID to the nav for mobile
            if (menuButton && mobileNav) {
                menuButton.addEventListener('click', () => {
                    mobileNav.classList.toggle('hidden'); // Or your preferred toggle mechanism
                });
            }
        }
    }

    // --- Form Validation (Example for contact page) ---
    const contactForm = document.querySelector('#contact-form'); // Add id="contact-form" to your form tag
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual submission for this example

            // Add basic validation checks here (e.g., check if fields are empty)
            let isValid = true;
            const requiredInputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]'); // Add 'required' attribute in HTML
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    // Add visual feedback (e.g., border color)
                    input.classList.add('border-red-500');
                    console.warn(`Field ${input.id || input.name} is required.`);
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            // Check checkbox agreement
            const agreementCheckbox = contactForm.querySelector('input[type="checkbox"]');
            if (agreementCheckbox && !agreementCheckbox.checked) {
                 isValid = false;
                 // Find the label or add specific feedback
                 const checkboxLabel = agreementCheckbox.closest('label');
                 if (checkboxLabel) checkboxLabel.classList.add('text-red-500'); // Example feedback
                 console.warn('Agreement checkbox must be checked.');
            } else if (agreementCheckbox) {
                 const checkboxLabel = agreementCheckbox.closest('label');
                 if (checkboxLabel) checkboxLabel.classList.remove('text-red-500');
            }


            if (isValid) {
                 console.log("Form is valid, simulating submission...");
                 // Simulate submission feedback
                const formSubmitMessage = document.createElement('div');
                formSubmitMessage.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-center py-3 px-6 rounded shadow-lg z-50';
                formSubmitMessage.textContent = 'Thank you for your inquiry! We will contact you shortly.';
                document.body.appendChild(formSubmitMessage);

                // Optionally clear the form
                contactForm.reset();
                 // Remove validation styles on reset
                 requiredInputs.forEach(input => input.classList.remove('border-red-500'));
                 const checkboxLabel = agreementCheckbox ? agreementCheckbox.closest('label') : null;
                 if (checkboxLabel) checkboxLabel.classList.remove('text-red-500');


                // Remove the message after a few seconds
                setTimeout(() => {
                    formSubmitMessage.remove();
                }, 3500);

                // In a real scenario, you would send the data using fetch() or similar
                // fetch('/your-api-endpoint', { method: 'POST', body: new FormData(contactForm) })
                //  .then(...)
                //  .catch(...)

            } else {
                 console.error("Form validation failed.");
                  // Optionally show a general error message
                const generalError = document.getElementById('form-general-error'); // Add a div with this ID to your form
                if (generalError) {
                    generalError.textContent = 'Please fill out all required fields correctly.';
                    generalError.classList.remove('hidden');
                }
            }
        });
    }

    // --- Custom Checkbox Functionality (if needed beyond CSS) ---
    // The CSS handles the visual state change. JS might be needed
    // for more complex interactions, but often isn't required for simple checks.
    const checkboxes = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Example: Log state change
             console.log(`Checkbox ${this.id || this.name} changed to: ${this.checked}`);
        });
    });

}); // End DOMContentLoaded