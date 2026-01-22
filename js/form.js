/**
 * Form Module
 * Handles form validation and submission
 */

export function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => setupFormValidation(form));

    // Initialize FAQ accordion
    initFaqAccordion();

    // Initialize portfolio filters
    initPortfolioFilters();
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            await submitForm(form);
        }
    });
}

function validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');

    // Remove existing error
    clearError(input);

    // Required check
    if (required && !value) {
        showError(input, 'Field ini wajib diisi');
        return false;
    }

    if (!value) return true;

    // Email validation
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(input, 'Format email tidak valid');
            return false;
        }
    }

    // Phone validation
    if (type === 'tel') {
        const phoneRegex = /^[\d\s\-+()]{8,}$/;
        if (!phoneRegex.test(value)) {
            showError(input, 'Format nomor telepon tidak valid');
            return false;
        }
    }

    // Min length
    const minLength = input.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
        showError(input, `Minimal ${minLength} karakter`);
        return false;
    }

    // Mark as valid
    input.classList.add('is-valid');
    return true;
}

function showError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');

    // Create error message
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;

    // Insert after input
    input.parentNode.insertBefore(errorEl, input.nextSibling);
}

function clearError(input) {
    input.classList.remove('is-invalid', 'is-valid');
    const error = input.parentNode.querySelector('.form-error');
    if (error) error.remove();
}

async function submitForm(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    try {
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        showFormMessage(form, 'success', 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
        form.reset();

        // Clear all validation states
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

    } catch (error) {
        showFormMessage(form, 'error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function showFormMessage(form, type, message) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.innerHTML = `
    <span>${message}</span>
    <button type="button" onclick="this.parentElement.remove()">×</button>
  `;

    form.insertBefore(messageEl, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => messageEl.remove(), 5000);
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(i => i.classList.remove('open'));

            // Toggle current item
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
}

// Portfolio Filters
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.portfolio-filter');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.add('reveal', 'visible');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
