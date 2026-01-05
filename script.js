/* ============================================
   Mellow Solutions - Premium JavaScript v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in animations with stagger
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // Smooth scroll for anchor links - centers sections in viewport
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        let topPosition;

        // For support section, center it in viewport
        if (targetId === '#support') {
          const targetHeight = target.offsetHeight;
          const windowHeight = window.innerHeight;
          const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
          // Center the section vertically
          topPosition = targetTop - (windowHeight - targetHeight) / 2;
        } else {
          // For other sections, use standard offset
          const offset = 80;
          topPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        }

        window.scrollTo({
          top: Math.max(0, topPosition),
          behavior: 'smooth'
        });

        // Close mobile nav if open
        if (navLinks) navLinks.classList.remove('active');
      }
    });
  });

  // Mobile navigation toggle
  const mobileBtn = document.querySelector('.nav-mobile-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // Navbar scroll effect with class toggle
  const nav = document.querySelector('.nav');
  let ticking = false;

  function updateNav() {
    const scrollY = window.pageYOffset;

    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // Donation option click handler with ripple effect
  document.querySelectorAll('.donation-option').forEach(option => {
    option.addEventListener('click', (e) => {
      // Create ripple
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(212, 160, 120, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      const rect = option.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

      option.style.position = 'relative';
      option.style.overflow = 'hidden';
      option.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);

      // Open Buy Me a Coffee
      window.open('https://buymeacoffee.com/mellowsolutions', '_blank');
    });
  });

  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Parallax effect for hero glow (subtle)
  const heroGlow = document.querySelector('.hero-logo-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }
});
