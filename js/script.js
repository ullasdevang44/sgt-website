/**
 * Encapsulates website interactivity logic within an IIFE for scope isolation.
 */
(() => {
    'use strict'; // Enable strict mode for safer coding

    // ==========================================================================
    // Configuration Constants
    // ==========================================================================
    const CONFIG = {
        // Selectors
        SMOOTH_SCROLL_SELECTOR: 'nav a[href^="#"]:not([href="#"]), .hero a[href^="#"]:not([href="#"]), a.btn[href^="#"]:not([href="#"])',
        HEADER_SELECTOR: 'header',
        FORM_ID: 'contactForm',
        FOOTER_YEAR_SELECTOR: '#current-year',
        MOBILE_NAV_TOGGLE_SELECTOR: '#menu-toggle',
        NAV_MENU_SELECTOR: '#nav-menu',
        VANTA_TARGET_SELECTOR: '#contact-particles-js',

        // Classes
        ACTIVE_CLASS: 'is-active',

        // Vanta Settings
        VANTA_SCRIPT_URL: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.starfield.min.js',
        VANTA_FALLBACK_BG_COLOR: '#DFFFD6',

        // Timing
        FOCUS_DELAY_MS: 800 // Delay for focus after smooth scroll
    };

    // ==========================================================================
    // Element Caching (Executed once on load)
    // ==========================================================================
    const elements = {
        header: document.querySelector(CONFIG.HEADER_SELECTOR),
        smoothScrollLinks: document.querySelectorAll(CONFIG.SMOOTH_SCROLL_SELECTOR),
        queryForm: document.getElementById(CONFIG.FORM_ID),
        footerYearEl: document.querySelector(CONFIG.FOOTER_YEAR_SELECTOR),
        menuToggleBtn: document.querySelector(CONFIG.MOBILE_NAV_TOGGLE_SELECTOR),
        navMenu: document.querySelector(CONFIG.NAV_MENU_SELECTOR),
        vantaTarget: document.querySelector(CONFIG.VANTA_TARGET_SELECTOR)
    };

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Logs messages with a consistent prefix for debugging.
     * @param {string} message - The message to log.
     * @param {string} [level='log'] - Log level: 'log', 'warn', 'error'.
     */
    const log = (message, level = 'log') => {
        const prefix = '[Sri Gaviranga Traders]';
        console[level](`${prefix} ${message}`);
    };

    /**
     * Calculates scroll offset based on fixed header height.
     * @returns {number} Header height or 0 if not present.
     */
    const getScrollOffset = () => {
        return elements.header?.offsetHeight > 0 ? elements.header.offsetHeight : 0;
    };

    /**
     * Toggles the mobile navigation menu state.
     */
    const toggleMobileMenu = () => {
        if (!elements.navMenu || !elements.menuToggleBtn) return;

        const isActive = elements.navMenu.classList.toggle(CONFIG.ACTIVE_CLASS);
        elements.menuToggleBtn.setAttribute('aria-expanded', String(isActive));
        elements.menuToggleBtn.classList.toggle(CONFIG.ACTIVE_CLASS, isActive);
        document.body.classList.toggle('mobile-menu-open', isActive);
        log(`Mobile menu ${isActive ? 'opened' : 'closed'}.`);
    };

    /**
     * Closes the mobile navigation menu if open.
     */
    const closeMobileMenu = () => {
        if (!elements.navMenu || !elements.menuToggleBtn || !elements.navMenu.classList.contains(CONFIG.ACTIVE_CLASS)) return;

        elements.navMenu.classList.remove(CONFIG.ACTIVE_CLASS);
        elements.menuToggleBtn.setAttribute('aria-expanded', 'false');
        elements.menuToggleBtn.classList.remove(CONFIG.ACTIVE_CLASS);
        document.body.classList.remove('mobile-menu-open');
        log('Mobile menu closed.');
    };

    // ==========================================================================
    // Feature Setup Functions
    // ==========================================================================

    /**
     * Initializes mobile navigation toggle functionality.
     */
    const setupMobileNavigation = () => {
        if (!elements.menuToggleBtn || !elements.navMenu) {
            log('Mobile Navigation: Toggle button or nav menu not found.', 'warn');
            return;
        }

        elements.menuToggleBtn.setAttribute('aria-controls', elements.navMenu.id || 'nav-menu');
        elements.menuToggleBtn.setAttribute('aria-expanded', 'false');

        elements.menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        log('Mobile navigation toggle initialized.');
    };

    /**
     * Sets up smooth scrolling for anchor links with debugging.
     */
    const setupSmoothScrolling = () => {
        if (!elements.smoothScrollLinks.length) {
            log(`Smooth Scrolling: No links found for selector '${CONFIG.SMOOTH_SCROLL_SELECTOR}'.`, 'warn');
            return;
        }

        elements.smoothScrollLinks.forEach(anchor => {
            anchor.addEventListener('click', (event) => {
                const targetId = anchor.getAttribute('href');
                log(`Smooth Scrolling: Link clicked - Href: ${targetId}`);

                if (!targetId || !targetId.startsWith('#') || targetId.length <= 1) {
                    log('Smooth Scrolling: Invalid or empty hash. Handling accordingly.');
                    if (targetId === '#') event.preventDefault();
                    closeMobileMenu();
                    return;
                }

                let targetElement;
                try {
                    targetElement = document.querySelector(targetId);
                } catch (e) {
                    log(`Smooth Scrolling: Invalid selector '${targetId}'.`, 'error');
                    return;
                }

                if (!targetElement) {
                    log(`Smooth Scrolling: Target '${targetId}' not found.`, 'warn');
                    return;
                }

                event.preventDefault();
                const scrollOffset = getScrollOffset();
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - scrollOffset;

                log(`Smooth Scrolling: Scrolling to '${targetId}' at ${offsetPosition}px (Offset: ${scrollOffset}px)`);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                closeMobileMenu();

                // Accessibility: Focus target after scroll
                setTimeout(() => {
                    if (document.activeElement !== targetElement) {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus({ preventScroll: true });
                        log(`Smooth Scrolling: Focused target '${targetId}'`);
                    }
                }, CONFIG.FOCUS_DELAY_MS);
            });
        });

        log(`Smooth scrolling initialized for ${elements.smoothScrollLinks.length} links.`);
    };

    /**
     * Adds client-side validation to the contact form.
     */
    const setupFormValidation = () => {
        if (!elements.queryForm) {
            log(`Form Validation: Form '${CONFIG.FORM_ID}' not found.`, 'warn');
            return;
        }

        const submitButton = elements.queryForm.querySelector('button[type="submit"]');

        elements.queryForm.addEventListener('submit', (event) => {
            const formData = new FormData(elements.queryForm);
            const name = formData.get('name')?.trim();
            const phone = formData.get('phone')?.trim();
            const message = formData.get('message')?.trim();

            if (!name || !phone || !message) {
                event.preventDefault();
                alert('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.\nPlease fill in all required fields.');
                log('Form Validation: Failed - Missing required fields.', 'warn');
                return;
            }

            log('Form Validation: Passed. Proceeding with submission.');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
                submitButton.textContent = 'Sending...';
            }
        });

        log(`Form validation initialized for '${CONFIG.FORM_ID}'.`);
    };

    /**
     * Dynamically loads and initializes Vanta.js STARFIELD effect.
     */
    const setupVantaEffect = () => {
        if (!elements.vantaTarget) {
            log(`Vanta: Target '${CONFIG.VANTA_TARGET_SELECTOR}' not found.`, 'warn');
            return;
        }

        const initEffect = () => {
            try {
                if (elements.vantaTarget.vantaInstance) {
                    log('Vanta: Destroying previous instance.');
                    elements.vantaTarget.vantaInstance.destroy();
                }

                elements.vantaTarget.vantaInstance = VANTA.STARFIELD({
                    el: elements.vantaTarget,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x6a1b9a,
                    backgroundColor: 0xdfffd6
                });
                log(`Vanta: Effect initialized on '${CONFIG.VANTA_TARGET_SELECTOR}'.`);
            } catch (error) {
                log(`Vanta: Initialization failed - ${error.message}`, 'error');
                elements.vantaTarget.style.backgroundColor = CONFIG.VANTA_FALLBACK_BG_COLOR;
            }
        };

        if (typeof VANTA !== 'undefined' && VANTA.STARFIELD) {
            initEffect();
            return;
        }

        if (document.querySelector(`script[src="${CONFIG.VANTA_SCRIPT_URL}"]`)) {
            log('Vanta: Script already loading or loaded.');
            return;
        }

        const script = document.createElement('script');
        script.src = CONFIG.VANTA_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
            log('Vanta: Script loaded.');
            initEffect();
        };
        script.onerror = () => {
            log('Vanta: Script failed to load.', 'error');
            elements.vantaTarget.style.backgroundColor = CONFIG.VANTA_FALLBACK_BG_COLOR;
        };
        document.head.appendChild(script);
        log(`Vanta: Loading script from '${CONFIG.VANTA_SCRIPT_URL}'.`);
    };

    /**
     * Updates the footer with the current year.
     */
    const setupFooterYear = () => {
        if (!elements.footerYearEl) {
            log(`Footer Year: Element '${CONFIG.FOOTER_YEAR_SELECTOR}' not found.`, 'warn');
            return;
        }

        try {
            elements.footerYearEl.textContent = new Date().getFullYear();
            log('Footer year updated.');
        } catch (error) {
            log(`Footer Year: Error - ${error.message}`, 'error');
        }
    };

    // ==========================================================================
    // Initialization
    // ==========================================================================

    /**
     * Initializes all website interactivity features.
     */
    const initialize = () => {
        log('Initializing website scripts...');

        if (!elements.header) log('Header not found. Scroll offset may be affected.', 'warn');
        if (!elements.vantaTarget) log('Vanta target not found. Background effect skipped.', 'warn');

        setupMobileNavigation();
        setupSmoothScrolling();
        setupFormValidation();
        setupFooterYear();
        setupVantaEffect();

        log('Initialization complete.');
    };

    // ==========================================================================
    // Bootstrap
    // ==========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
