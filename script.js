/* ============================================
   Mellow Solutions - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in animations
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered animation delay
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  fadeElements.forEach(el => fadeObserver.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed nav
        const topPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: topPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile navigation toggle
  const mobileBtn = document.querySelector('.nav-mobile-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.flexDirection = 'column';
      navLinks.style.padding = '1rem';
      navLinks.style.background = 'rgba(26, 47, 56, 0.98)';
      navLinks.style.borderTop = '1px solid rgba(255, 255, 255, 0.05)';
    });
  }

  // Navbar scroll effect
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.style.background = 'rgba(26, 47, 56, 0.95)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
      nav.style.background = 'rgba(26, 47, 56, 0.85)';
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // Donation option click handler
  document.querySelectorAll('.donation-option').forEach(option => {
    option.addEventListener('click', () => {
      const amount = option.querySelector('.donation-amount').textContent;
      // Open Buy Me a Coffee with pre-selected amount (customize URL as needed)
      window.open(`https://buymeacoffee.com/mellowsolutions`, '_blank');
    });
  });
});
