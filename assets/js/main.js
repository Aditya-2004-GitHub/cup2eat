/**
 * Cup2Eat - Official Website Interactive Logic
 * Assets/js/main.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mountain Floating Navbar Scroll & Dynamic Split Mode (Matching Hand Drawing)
  const navWrapper = document.getElementById('mountainNavbarWrapper');
  const navbar = document.getElementById('mountainNavbar');
  const scrolledToggle = document.getElementById('scrolledNavToggle');
  const navExpandableWrap = document.getElementById('navExpandableWrap');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const toggleText = scrolledToggle?.querySelector('.toggle-text');

  // Scroll threshold to switch between full top mountain bar and split island mode
  const SCROLL_THRESHOLD = 80;

  function handleNavbarScroll() {
    const isPastThreshold = window.scrollY > SCROLL_THRESHOLD;

    if (isPastThreshold) {
      navWrapper?.classList.add('is-scrolled');
      navbar?.classList.add('scrolled');
    } else {
      navWrapper?.classList.remove('is-scrolled');
      navWrapper?.classList.remove('nav-expanded');
      navbar?.classList.remove('scrolled');
      if (scrolledToggle) scrolledToggle.setAttribute('aria-expanded', 'false');
      if (toggleText) toggleText.textContent = 'Menu';
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Initial check on load
  handleNavbarScroll();

  // Scrolled Compressed Toggle: Expands navbar TO THE LEFT with smooth animation
  if (scrolledToggle && navWrapper) {
    scrolledToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navWrapper.classList.toggle('nav-expanded');
      scrolledToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      if (toggleText) {
        toggleText.textContent = isExpanded ? 'Close' : 'Menu';
      }

      // If on mobile/small screen, also sync mobile drawer
      if (window.innerWidth < 992 && mobileDrawer) {
        if (isExpanded) {
          mobileDrawer.classList.add('open');
        } else {
          mobileDrawer.classList.remove('open');
        }
      }
    });
  }

  // Clicking any link inside the expanded navbar switches the view and smoothly collapses the menu
  document.querySelectorAll('.nav-expandable-wrap a').forEach(link => {
    link.addEventListener('click', () => {
      if (navWrapper?.classList.contains('nav-expanded')) {
        navWrapper.classList.remove('nav-expanded');
        if (scrolledToggle) scrolledToggle.setAttribute('aria-expanded', 'false');
        if (toggleText) toggleText.textContent = 'Menu';
      }
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  // Clicking outside collapses the expanded menu smoothly
  document.addEventListener('click', (e) => {
    if (navWrapper?.classList.contains('nav-expanded')) {
      if (!navExpandableWrap?.contains(e.target) && !scrolledToggle?.contains(e.target)) {
        navWrapper.classList.remove('nav-expanded');
        if (scrolledToggle) scrolledToggle.setAttribute('aria-expanded', 'false');
        if (toggleText) toggleText.textContent = 'Menu';
      }
    }
  });

  // Escape key closes expanded navbar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navWrapper?.classList.contains('nav-expanded')) {
      navWrapper.classList.remove('nav-expanded');
      if (scrolledToggle) scrolledToggle.setAttribute('aria-expanded', 'false');
      if (toggleText) toggleText.textContent = 'Menu';
    }
  });

  // Mobile Menu Drawer Toggle (for unscrolled mobile state)
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
      }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav-list a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      });
    });
  }

  // 2. Active Navigation Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Interactive Waste Calculator
  const cupSlider = document.getElementById('cupSlider');
  const sliderValDisplay = document.getElementById('sliderVal');
  const cupsSavedDisplay = document.getElementById('cupsSavedVal');
  const plasticSavedDisplay = document.getElementById('plasticSavedVal');
  const treesSavedDisplay = document.getElementById('treesSavedVal');

  function updateCalculator(val) {
    const dailyCups = parseInt(val, 10);
    const annualCups = dailyCups * 365;
    // Each paper cup with plastic lining + lid ~ 11 grams of non-biodegradable waste
    const plasticKg = Math.round((annualCups * 11) / 1000);
    // Tree / carbon equivalent estimation
    const treesEquivalent = (annualCups * 0.00035).toFixed(1);

    if (sliderValDisplay) sliderValDisplay.textContent = dailyCups.toLocaleString('en-IN');
    if (cupsSavedDisplay) cupsSavedDisplay.textContent = annualCups.toLocaleString('en-IN');
    if (plasticSavedDisplay) plasticSavedDisplay.textContent = `${plasticKg.toLocaleString('en-IN')} kg`;
    if (treesSavedDisplay) treesSavedDisplay.textContent = `${treesEquivalent} Trees`;
  }

  if (cupSlider) {
    cupSlider.addEventListener('input', (e) => {
      updateCalculator(e.target.value);
    });
    // Initial run
    updateCalculator(cupSlider.value || 250);
  }

  // 4. Sample Request & B2B Inquiry Form
  const sampleForm = document.getElementById('sampleInquiryForm');
  const toast = document.getElementById('customToast');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message, isSuccess = true) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.style.borderColor = isSuccess ? 'var(--c2e-gold-primary)' : '#e53e3e';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (sampleForm) {
    sampleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName')?.value.trim();
      const phone = document.getElementById('formPhone')?.value.trim();
      const business = document.getElementById('formBusiness')?.value.trim();
      const flavour = document.getElementById('formFlavour')?.value;

      if (!name || !phone) {
        showToast('Please fill in your name and contact phone number.', false);
        return;
      }

      // Simulate successful submission
      showToast(`Thank you, ${name}! Your Cup2Eat sample request has been registered. Our team will reach out via WhatsApp/Call.`);
      sampleForm.reset();
    });
  }

  // 5. Flavour Quick Filter Buttons (if user switches category)
  const flavourTabs = document.querySelectorAll('.flavour-tab-btn');
  const flavourCards = document.querySelectorAll('.flavour-col');

  flavourTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      flavourTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      flavourCards.forEach(col => {
        if (filter === 'all' || col.getAttribute('data-category').includes(filter)) {
          col.style.display = 'block';
        } else {
          col.style.display = 'none';
        }
      });
    });
  });

  // 6. Smooth Scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Living Hot Tea Steam Simulator (Convective Vapor Physics + Soft Turbulent Plumes)
  const steamCanvas = document.getElementById('teaSteamCanvas');
  if (steamCanvas) {
    const ctx = steamCanvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;
    let isVisible = true;

    const width = steamCanvas.width = 240;
    const height = steamCanvas.height = 260;

    // Origin: strictly on the hot tea liquid surface inside the cup (bottom of tea-steam-system)
    const originX = width / 2;
    const originY = height * 0.94;

    class SteamParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Disperse strictly across the inner tea liquid ellipse (safely inside chocolate rim)
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random();
        const rx = width * 0.28; // Fits neatly inside the tea liquid surface
        const ry = height * 0.04; // Flat perspective ellipse matching liquid plane
        this.x = originX + Math.cos(angle) * (rx * Math.sqrt(dist));
        this.y = originY + Math.sin(angle) * (ry * Math.sqrt(dist));
        this.radius = 6 + Math.random() * 5;
        this.maxRadius = 34 + Math.random() * 20;
        this.life = 0;
        this.maxLife = 110 + Math.random() * 60;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = -0.9 - Math.random() * 0.75; // Rises strictly UPWARDS from the tea
        this.alpha = 0;
        this.maxAlpha = 0.26 + Math.random() * 0.16; // Soft translucent vapor mist
        this.turbulenceSeed = Math.random() * 100;
        this.driftSpeed = 0.02 + Math.random() * 0.02;
      }

      update() {
        this.life++;
        // Convective sine turbulence simulating gentle air currents
        this.x += this.vx + Math.sin(this.life * this.driftSpeed + this.turbulenceSeed) * 0.4;
        this.y += this.vy;
        this.vy *= 0.995;
        this.radius += 0.2; // Natural atmospheric dispersion

        // Soft fade in, sustained mist, gentle fade out
        const progress = this.life / this.maxLife;
        if (progress < 0.25) {
          this.alpha = (progress / 0.25) * this.maxAlpha;
        } else {
          this.alpha = (1 - (progress - 0.25) / 0.75) * this.maxAlpha;
        }

        if (this.life >= this.maxLife) {
          this.reset();
        }
      }

      draw() {
        if (this.alpha <= 0.005) return;
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        grad.addColorStop(0.45, `rgba(255, 252, 246, ${this.alpha * 0.65})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize 36 particles pre-warmed so steam starts immediately
    const PARTICLE_COUNT = 36;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new SteamParticle();
      p.life = Math.random() * p.maxLife;
      p.y -= (p.life * 0.8);
      p.radius += p.life * 0.15;
      particles.push(p);
    }

    function renderSteam() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(renderSteam);
    }

    // IntersectionObserver to pause loop when scrolled away
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!animationFrameId) renderSteam();
          } else {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        });
      }, { threshold: 0.1 });

      observer.observe(steamCanvas);
    }

    renderSteam();
  }
});

