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

        // Sections to center vertically when scrolling
        const centeredSections = ['#support'];

        // For centered sections, center them in viewport
        if (centeredSections.includes(targetId)) {
          const targetHeight = target.offsetHeight;
          const windowHeight = window.innerHeight;
          const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
          // Center the section vertically
          topPosition = targetTop - (windowHeight - targetHeight) / 2;
        } else if (targetId === '#projects') {
          // For projects, align top border line with viewport top (below navbar)
          const navOffset = 60;
          topPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
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

  // ============================================
  // Interactive Emotion Zone
  // ============================================
  const emotionZone = document.getElementById('emotionZone');
  const heartCountEl = document.getElementById('heartCount');
  const thumbCountEl = document.getElementById('thumbCount');

  if (emotionZone && heartCountEl && thumbCountEl) {
    // Load counts from localStorage
    let heartCount = parseInt(localStorage.getItem('mellowHearts') || '127');
    let thumbCount = parseInt(localStorage.getItem('mellowThumbs') || '89');
    heartCountEl.textContent = heartCount;
    thumbCountEl.textContent = thumbCount;

    const maxEmojis = 7;
    let activeHearts = 0;
    let activeThumbs = 0;

    function spawnEmoji() {
      const isHeart = Math.random() > 0.5;

      if (isHeart && activeHearts >= maxEmojis) return;
      if (!isHeart && activeThumbs >= maxEmojis) return;

      const emoji = document.createElement('span');
      emoji.className = `emotion-emoji ${isHeart ? 'heart' : 'thumb'}`;
      emoji.textContent = isHeart ? '💖' : '👍';

      // Random position
      const x = Math.random() * (emotionZone.offsetWidth - 40);
      const y = Math.random() * (emotionZone.offsetHeight - 40);
      emoji.style.left = x + 'px';
      emoji.style.top = y + 'px';

      if (isHeart) activeHearts++;
      else activeThumbs++;

      // Click to despawn and increment counter
      emoji.addEventListener('click', () => {
        emoji.remove();
        if (isHeart) {
          activeHearts--;
          heartCount++;
          heartCountEl.textContent = heartCount;
          localStorage.setItem('mellowHearts', heartCount);
        } else {
          activeThumbs--;
          thumbCount++;
          thumbCountEl.textContent = thumbCount;
          localStorage.setItem('mellowThumbs', thumbCount);
        }
      });

      emotionZone.appendChild(emoji);

      // Auto-remove after animation
      setTimeout(() => {
        if (emoji.parentNode) {
          emoji.remove();
          if (isHeart) activeHearts--;
          else activeThumbs--;
        }
      }, 2500);
    }

    // Spawn emojis at random intervals
    function scheduleSpawn() {
      const delay = 1500 + Math.random() * 1500; // 1.5-3s
      setTimeout(() => {
        spawnEmoji();
        scheduleSpawn();
      }, delay);
    }

    // Start spawning
    scheduleSpawn();
    // Initial spawn burst
    setTimeout(() => spawnEmoji(), 500);
    setTimeout(() => spawnEmoji(), 1000);
  }
});
