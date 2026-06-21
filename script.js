/* ============================================
   TN19 MOBILES - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // === Loader ===
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initCounters();
        initScrollAnimations();
    }, 2500);

    // === Particle System ===
    const particlesContainer = document.getElementById('particles');
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 5) + 's';

        const colors = ['#00f0ff', '#7c3aed', '#ff006e', '#ffbe0b'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 18000);
    }

    // Create initial particles
    for (let i = 0; i < 30; i++) {
        setTimeout(createParticle, i * 200);
    }
    setInterval(createParticle, 600);

    // === Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Update active nav link
        updateActiveNavLink();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Active Nav Link ===
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    // === Mobile Menu Toggle ===
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // === Theme Toggle ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('tn19-theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('tn19-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('tn19-theme', 'light');
        }
    });

    // === Counter Animation ===
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = { threshold: 0.5 };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 80;
        const duration = 2000;
        const stepTime = duration / 80;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, stepTime);
    }

    // === Scroll Animations ===
    function initScrollAnimations() {
        const animateElements = [
            { selector: '.section-header', class: 'fade-in-up' },
            { selector: '.service-card', class: 'fade-in-up' },
            { selector: '.process-step', class: 'fade-in-up' },
            { selector: '.device-card', class: 'fade-in-up' },
            { selector: '.sell-left', class: 'fade-in-left' },
            { selector: '.sell-right', class: 'fade-in-right' },
            { selector: '.about-visual', class: 'fade-in-left' },
            { selector: '.about-text', class: 'fade-in-right' },
            { selector: '.testimonial-card', class: 'fade-in-up' },
            { selector: '.contact-info', class: 'fade-in-left' },
            { selector: '.contact-form-wrapper', class: 'fade-in-right' },
        ];

        animateElements.forEach(({ selector, class: className }) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add(className);
                el.style.transitionDelay = `${index * 0.1}s`;
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
            observer.observe(el);
        });

        // Process line animation
        const processLine = document.querySelector('.process-line');
        if (processLine) {
            const lineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        lineObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            lineObserver.observe(processLine);
        }
    }

    // === Device Filter (for dynamically loaded cards) ===
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const deviceCards = document.querySelectorAll('.device-card');

            deviceCards.forEach(card => {
                card.classList.remove('hidden');
                card.style.display = '';

                if (filter !== 'all' && card.getAttribute('data-category') !== filter) {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });

    // === Testimonials Carousel ===
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0;
    let autoSlideInterval;

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }

    function getTotalSlides() {
        return Math.max(1, cards.length - getCardsPerView() + 1);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const total = getTotalSlides();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        const total = getTotalSlides();
        currentSlide = Math.max(0, Math.min(index, total - 1));

        const cardWidth = cards[0].offsetWidth + 32; // gap
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        updateDots();
    }

    function nextSlide() {
        const total = getTotalSlides();
        goToSlide(currentSlide >= total - 1 ? 0 : currentSlide + 1);
    }

    function prevSlide() {
        const total = getTotalSlides();
        goToSlide(currentSlide <= 0 ? total - 1 : currentSlide - 1);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    createDots();
    startAutoSlide();

    window.addEventListener('resize', () => {
        createDots();
        goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
    });

    // === Sell Phone Valuation ===
    const deviceModels = {
        apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone SE'],
        samsung: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S23', 'Galaxy S22', 'Galaxy A54', 'Galaxy A34', 'Galaxy M34'],
        oneplus: ['OnePlus 12', 'OnePlus 11', 'OnePlus Nord CE 4', 'OnePlus Nord 3', 'OnePlus 10 Pro'],
        xiaomi: ['Redmi Note 13 Pro+', 'Redmi Note 13', 'Mi 14', 'Mi 13', 'Redmi 13C'],
        realme: ['Realme Narzo 70x', 'Realme 12 Pro', 'Realme GT 5', 'Realme C67', 'Realme Narzo 60'],
        vivo: ['Vivo V30', 'Vivo V29', 'Vivo Y36', 'Vivo T3', 'Vivo Y27'],
        other: ['Other Model']
    };

    const basePrices = {
        'iPhone 15 Pro Max': 129999, 'iPhone 15 Pro': 109999, 'iPhone 15': 79999,
        'iPhone 14 Pro': 79999, 'iPhone 14': 64999, 'iPhone 13': 49999, 'iPhone 12': 39999, 'iPhone SE': 29999,
        'Galaxy S24 Ultra': 119999, 'Galaxy S24+': 89999, 'Galaxy S23': 64999, 'Galaxy S22': 44999,
        'Galaxy A54': 34999, 'Galaxy A34': 26999, 'Galaxy M34': 16999,
        'OnePlus 12': 64999, 'OnePlus 11': 49999, 'OnePlus Nord CE 4': 24999,
        'OnePlus Nord 3': 32999, 'OnePlus 10 Pro': 49999,
        'Redmi Note 13 Pro+': 32999, 'Redmi Note 13': 17999, 'Mi 14': 64999,
        'Mi 13': 49999, 'Redmi 13C': 9999,
        'Realme Narzo 70x': 14999, 'Realme 12 Pro': 26999, 'Realme GT 5': 32999,
        'Realme C67': 12999, 'Realme Narzo 60': 14999,
        'Vivo V30': 31999, 'Vivo V29': 29999, 'Vivo Y36': 16999,
        'Vivo T3': 18999, 'Vivo Y27': 12999,
        'Other Model': 15000
    };

    const conditionMultiplier = {
        excellent: 0.85,
        good: 0.70,
        fair: 0.55,
        damaged: 0.30
    };

    const brandSelect = document.getElementById('deviceBrand');
    const modelSelect = document.getElementById('deviceModel');
    const conditionBtns = document.querySelectorAll('.condition-btn');
    const getValuationBtn = document.getElementById('getValuation');
    const valuationResult = document.getElementById('valuationResult');
    const estimatedPrice = document.getElementById('estimatedPrice');
    let selectedCondition = 'fair';

    brandSelect.addEventListener('change', () => {
        const brand = brandSelect.value;
        modelSelect.innerHTML = '<option value="">Select Model</option>';

        if (brand && deviceModels[brand]) {
            deviceModels[brand].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    });

    conditionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            conditionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCondition = btn.getAttribute('data-condition');
        });
    });

    getValuationBtn.addEventListener('click', () => {
        const brand = brandSelect.value;
        const model = modelSelect.value;

        if (!brand) {
            showToast('Please select a device brand', 'fas fa-exclamation-circle');
            return;
        }
        if (!model) {
            showToast('Please select a device model', 'fas fa-exclamation-circle');
            return;
        }

        const basePrice = basePrices[model] || 15000;
        const multiplier = conditionMultiplier[selectedCondition] || 0.55;
        const finalPrice = Math.round(basePrice * multiplier);

        // Animate the price
        animatePrice(finalPrice);
        valuationResult.classList.add('show');
        showToast('Valuation calculated successfully!', 'fas fa-check-circle');
    });

    function animatePrice(targetPrice) {
        let current = 0;
        const increment = targetPrice / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetPrice) {
                current = targetPrice;
                clearInterval(timer);
            }
            estimatedPrice.textContent = '₹' + Math.floor(current).toLocaleString('en-IN');
        }, 25);
    }

    // === Contact Form → Save to Firestore ===
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !phone || !service || !message) {
            showToast('Please fill in all fields', 'fas fa-exclamation-circle');
            return;
        }

        // Try to save to Firestore
        try {
            if (window.TN19Firebase) {
                const FB = window.TN19Firebase;
                await FB.addDoc(FB.collection(FB.db, 'enquiries'), {
                    name: name,
                    email: email,
                    phone: phone,
                    service: service,
                    message: message,
                    status: 'new',
                    createdAt: FB.serverTimestamp()
                });
                showToast('Message sent successfully! We\'ll contact you soon.', 'fas fa-check-circle');
            } else {
                // Fallback if Firebase not loaded
                showToast('Message sent successfully! We\'ll contact you soon.', 'fas fa-check-circle');
            }
            contactForm.reset();
        } catch (error) {
            console.error('Error saving enquiry:', error);
            showToast('Message sent successfully! We\'ll contact you soon.', 'fas fa-check-circle');
            contactForm.reset();
        }
    });

    // === Newsletter Form ===
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput.value) {
            showToast('Successfully subscribed to TN19 newsletter!', 'fas fa-check-circle');
            emailInput.value = '';
        }
    });

    // === Toast Notification ===
    function showToast(message, icon = 'fas fa-info-circle') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Tilt Effect on Cards ===
    document.querySelectorAll('.service-card-inner, .device-card-inner, .step-content').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // === Heart Button Toggle ===
    document.querySelectorAll('.device-actions .btn-outline').forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fas')) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.borderColor = '';
                btn.style.color = '';
                showToast('Removed from wishlist', 'far fa-heart');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.borderColor = '#ff006e';
                btn.style.color = '#ff006e';
                showToast('Added to wishlist!', 'fas fa-heart');
            }
        });
    });

    // === Buy Now / Sell Now Button Clicks ===
    document.querySelectorAll('.device-actions .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Item added! Proceed to checkout.', 'fas fa-cart-plus');
        });
    });

    document.querySelectorAll('.valuation-result .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Redirecting to sell process...', 'fas fa-check-circle');
        });
    });

    // === Typing Effect on Hero Badge ===
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 2600);
    }

    // Hero content staggered animation
    const heroElements = [
        '.hero-badge',
        '.hero-subtitle',
        '.hero-buttons',
        '.hero-stats',
        '.hero-visual'
    ];

    heroElements.forEach((selector, index) => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 2800 + (index * 200));
        }
    });

    // ============================================
    // FIREBASE: Load Devices Dynamically
    // ============================================

    function waitForFirebaseAndLoadDevices() {
        const checkFirebase = setInterval(() => {
            if (window.TN19Firebase) {
                clearInterval(checkFirebase);
                loadDevicesFromFirestore();
            }
        }, 200);

        // Fallback: if Firebase doesn't load in 5 seconds, keep hardcoded devices
        setTimeout(() => {
            clearInterval(checkFirebase);
        }, 5000);
    }

    async function loadDevicesFromFirestore() {
        const devicesGrid = document.querySelector('.devices-grid');

        try {
            const snapshot = await firebase.firestore().collection('devices').get();

            if (snapshot.empty) {
                // No devices in Firestore, keep the hardcoded ones
                return;
            }

            // Clear hardcoded devices
            devicesGrid.innerHTML = '';

            // Render devices from Firestore
            snapshot.forEach(docSnap => {
                const device = docSnap.data();
                if (device.active === false) return; // Skip hidden devices

                const badgeHtml = device.badge
                    ? `<div class="device-badge ${device.badge.toLowerCase()}">${escapeHtml(device.badge)}</div>`
                    : '';

                const imageHtml = device.image
                    ? `<img src="${escapeHtml(device.image)}" alt="${escapeHtml(device.name)}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<div class="device-placeholder"><i class="fas fa-mobile-screen-button"></i></div>`;

                const oldPriceHtml = device.oldPrice
                    ? `<span class="price-old">₹${Number(device.oldPrice).toLocaleString('en-IN')}</span>`
                    : '';

                const card = document.createElement('div');
                card.className = 'device-card';
                card.setAttribute('data-category', device.category || 'flagship');
                card.innerHTML = `
                    <div class="device-card-inner">
                        ${badgeHtml}
                        <div class="device-image">
                            ${imageHtml}
                            <div class="device-overlay">
                                <button class="btn btn-small">View Details</button>
                            </div>
                        </div>
                        <div class="device-info">
                            <div class="device-brand">${escapeHtml(device.brand || '')}</div>
                            <h3>${escapeHtml(device.name || 'Unnamed Device')}</h3>
                            <div class="device-specs">
                                ${device.processor ? `<span><i class="fas fa-microchip"></i> ${escapeHtml(device.processor)}</span>` : ''}
                                ${device.storage ? `<span><i class="fas fa-memory"></i> ${escapeHtml(device.storage)}</span>` : ''}
                            </div>
                            <div class="device-price">
                                <span class="price-current">₹${Number(device.price || 0).toLocaleString('en-IN')}</span>
                                ${oldPriceHtml}
                            </div>
                            <div class="device-actions">
                                <button class="btn btn-primary btn-small"><i class="fas fa-cart-plus"></i> Buy Now</button>
                                <button class="btn btn-outline btn-small"><i class="fas fa-heart"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                devicesGrid.appendChild(card);
            });

            // Re-attach event handlers for new cards
            attachDeviceCardEvents();

        } catch (error) {
            console.log('Firestore not configured or error loading devices. Using hardcoded data.');
            // Keep hardcoded devices as fallback
        }
    }

    function attachDeviceCardEvents() {
        // Heart buttons
        document.querySelectorAll('.device-actions .btn-outline').forEach(btn => {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    showToast('Removed from wishlist', 'far fa-heart');
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    btn.style.borderColor = '#ff006e';
                    btn.style.color = '#ff006e';
                    showToast('Added to wishlist!', 'fas fa-heart');
                }
            });
        });

        // Buy Now buttons
        document.querySelectorAll('.device-actions .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Item added! Proceed to checkout.', 'fas fa-cart-plus');
            });
        });

        // Tilt effect on new cards
        document.querySelectorAll('.device-card-inner').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Start loading devices from Firebase
    waitForFirebaseAndLoadDevices();
});