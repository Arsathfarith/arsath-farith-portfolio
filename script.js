/**
 * Arsath Farith Dashboard Portfolio Console Scripts
 * Strictly Vanilla JS. Fully responsive, optimized for recruiter reviews.
 */

document.addEventListener('DOMContentLoaded', () => {

    const mainCanvas = document.querySelector('.dashboard-main-canvas');
    
    // Dynamically identify scroll container based on viewport
    function getScrollContainer() {
        return (window.innerWidth > 1024 && mainCanvas) ? mainCanvas : window;
    }


    /* ==========================================================================
       TYPEWRITER ANIMATION
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        "AI Engineer",
        "Software Developer",
        "ASP.NET Developer",
        "Machine Learning Enthusiast"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full string
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typingSpeed);
    }
    
    if (typewriterElement) {
        setTimeout(type, 1000);
    }


    /* ==========================================================================
       MOBILE DRAWER HAMBURGER MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileToggle.classList.contains('open');
            mobileToggle.setAttribute('aria-expanded', !isOpen);
            mobileToggle.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.classList.remove('open');
                mobileNav.classList.remove('open');
            });
        });

        // Close menu on clicking outside mobile header
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target) && mobileNav.classList.contains('open')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.classList.remove('open');
                mobileNav.classList.remove('open');
            }
        });
    }


    /* ==========================================================================
       UNIVERSIAL SCROLL DYNAMICS & PROGRESS CIRCLE
       ========================================================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const circle = document.querySelector('.progress-ring__circle');
    
    let circumference = 0;

    if (circle) {
        const radius = circle.r.baseVal.value;
        circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
    }

    function getScrollMetrics() {
        const winWidth = window.innerWidth;
        if (winWidth > 1024 && mainCanvas) {
            return {
                scrollTop: mainCanvas.scrollTop,
                docHeight: mainCanvas.scrollHeight - mainCanvas.clientHeight
            };
        } else {
            return {
                scrollTop: window.pageYOffset || document.documentElement.scrollTop,
                docHeight: document.documentElement.scrollHeight - window.innerHeight
            };
        }
    }

    function handleScrollDynamics() {
        const { scrollTop, docHeight } = getScrollMetrics();
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // 1. Update Scroll Progress Bar (Top)
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // 2. Manage Back-to-Top visibility
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // 3. Update Back-to-Top circular progress ring
        if (circle && circumference > 0) {
            const offset = circumference - (scrollPercent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
    }

    // Attach listener dynamically
    const currentContainer = getScrollContainer();
    currentContainer.addEventListener('scroll', handleScrollDynamics);
    
    // Fallback resize hook
    window.addEventListener('resize', () => {
        const newContainer = getScrollContainer();
        // Clear listeners and re-attach
        window.removeEventListener('scroll', handleScrollDynamics);
        if (mainCanvas) mainCanvas.removeEventListener('scroll', handleScrollDynamics);
        newContainer.addEventListener('scroll', handleScrollDynamics);
    });
    
    handleScrollDynamics(); // Initial call

    // Click back-to-top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            const container = getScrollContainer();
            if (container === window) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (mainCanvas) {
                mainCanvas.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }


    /* ==========================================================================
       SCROLLSPY: ACTIVE NAVIGATION HIGHLIGHTS
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

    function scrollSpy() {
        const { scrollTop } = getScrollMetrics();

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            
            // Adjust offset dynamically
            let sectionTop = current.offsetTop;
            if (window.innerWidth <= 1024) {
                sectionTop -= 100; // Account for mobile floating header
            } else {
                sectionTop -= 120; // Account for dashboard canvas padding
            }
            
            const sectionId = current.getAttribute('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                // Highlight Sidebar
                sidebarLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });
                
                // Highlight Mobile Drawer
                mobileMenuLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });
            }
        });
    }

    const spyContainer = getScrollContainer();
    spyContainer.addEventListener('scroll', scrollSpy);
    
    window.addEventListener('resize', () => {
        const container = getScrollContainer();
        window.removeEventListener('scroll', scrollSpy);
        if (mainCanvas) mainCanvas.removeEventListener('scroll', scrollSpy);
        container.addEventListener('scroll', scrollSpy);
    });

    scrollSpy(); // Initial call


    /* ==========================================================================
       SCROLL REVEAL OBSERVERS & SKILL FILL TRIGGERS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.progress-fill');
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (skillBarsAnimated) return;
        skillBars.forEach(bar => {
            const widthValue = bar.getAttribute('data-width');
            bar.style.width = widthValue;
        });
        skillBarsAnimated = true;
    }

    // Dynamically choose observer root depending on viewport layout
    const isDesktop = window.innerWidth > 1024;
    const observerRoot = (isDesktop && mainCanvas) ? mainCanvas : null;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills section or overview section, trigger progress bars
                if (entry.target.id === 'overview' || entry.target.querySelector('.progress-fill')) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: observerRoot,
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Fallback: If elements are already visible on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
                el.classList.add('active');
                if (el.id === 'overview' || el.querySelector('.progress-fill')) {
                    animateSkillBars();
                }
            }
        });
    }, 400);


    /* ==========================================================================
       CONTACT FORM DISPATCH VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set loading state on button
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                showFeedback('All fields are required.', 'error');
                resetButton();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback('Please enter a valid email address.', 'error');
                resetButton();
                return;
            }

            // Simulate form submission
            setTimeout(() => {
                contactForm.reset();
                showFeedback(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                resetButton();

                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 8000);
            }, 1200);

            function resetButton() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

            function showFeedback(text, type) {
                formFeedback.textContent = text;
                formFeedback.className = `form-feedback ${type}`;
            }
        });
    }

});
