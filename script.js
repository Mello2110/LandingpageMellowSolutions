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

        // Sections that align with dividing line (fixed offset below navbar)
        const lineAlignedSections = ['#support', '#projects'];

        // For line-aligned sections, use fixed offset to show dividing line
        if (lineAlignedSections.includes(targetId)) {
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
  // Interactive Emotion Zone (Global Counters)
  // ============================================
  const emotionZone = document.getElementById('emotionZone');
  const heartCountEl = document.getElementById('heartCount');
  const thumbCountEl = document.getElementById('thumbCount');

  // Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB9cLe56D1sZ3fyW0PGGjMXHUQJZZjW9qY",
    authDomain: "mellowsolutionslandingpage.firebaseapp.com",
    databaseURL: "https://mellowsolutionslandingpage-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mellowsolutionslandingpage",
    storageBucket: "mellowsolutionslandingpage.firebasestorage.app",
    messagingSenderId: "238389947436",
    appId: "1:238389947436:web:c47e5d3f6eae847c83f589"
  };

  let db;
  let useFirebase = false;

  // Initialize Firebase if config is present
  if (window.firebase && Object.keys(firebaseConfig).length > 0) {
    try {
      const app = window.firebase.initializeApp(firebaseConfig);
      db = window.firebase.getDatabase(app);
      useFirebase = true;
    } catch (e) {
      console.warn("Firebase initialization failed:", e);
    }
  }

  if (emotionZone && heartCountEl && thumbCountEl) {
    // Local state as fallback
    let localCounts = {
      hearts: parseInt(localStorage.getItem('mellowHearts') || '0'),
      thumbs: parseInt(localStorage.getItem('mellowThumbs') || '0')
    };

    // Update UI helper
    const updateUI = (type, count) => {
      const el = type === 'hearts' ? heartCountEl : thumbCountEl;
      el.textContent = count;
      // Animate counter card
      const card = el.closest('.counter-card');
      if (card) {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => card.style.transform = '', 150);
      }
    };

    // Initial load
    updateUI('hearts', localCounts.hearts);
    updateUI('thumbs', localCounts.thumbs);

    // Sync with Firebase if available
    if (useFirebase) {
      const countersRef = window.firebase.ref(db, 'counters');
      window.firebase.onValue(countersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (data.hearts) updateUI('hearts', data.hearts);
          if (data.thumbs) updateUI('thumbs', data.thumbs);
        }
      });
    }

    // Handle Interaction (Click on card or emoji)
    const handleInteraction = (type) => {
      // Spawn emoji visual
      spawnEmojiVisual(type);

      if (useFirebase) {
        // Firebase Transaction
        const counterRef = window.firebase.ref(db, `counters/${type}`);
        window.firebase.runTransaction(counterRef, (currentValue) => {
          return (currentValue || 0) + 1;
        });
      } else {
        // Local Fallback
        localCounts[type]++;
        updateUI(type, localCounts[type]);
        localStorage.setItem(type === 'hearts' ? 'mellowHearts' : 'mellowThumbs', localCounts[type]);
      }
    };

    // Card Click Listeners
    document.querySelector('.counter-hearts').addEventListener('click', () => handleInteraction('hearts'));
    document.querySelector('.counter-thumbs').addEventListener('click', () => handleInteraction('thumbs'));

    // Visual Spawn Logic
    function spawnEmojiVisual(type) {
      const emoji = document.createElement('span');
      emoji.className = `emotion-emoji ${type === 'hearts' ? 'heart' : 'thumb'}`;
      emoji.textContent = type === 'hearts' ? '💖' : '👍';

      // Random position
      const x = Math.random() * (emotionZone.offsetWidth - 30);
      const y = Math.random() * (emotionZone.offsetHeight - 30);
      emoji.style.left = x + 'px';
      emoji.style.top = y + 'px';

      // Click on flying emoji also triggers interaction
      emoji.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent double counting if clicking emoji over card
        emoji.remove();
        handleInteraction(type);
      });

      emotionZone.appendChild(emoji);

      // Auto-remove
      setTimeout(() => {
        if (emoji.parentNode) emoji.remove();
      }, 2500);
    }

    // Ambient Spawning (Visual only, no count increment)
    function scheduleAmbientSpawn() {
      const delay = 2000 + Math.random() * 3000;
      setTimeout(() => {
        if (document.hidden) return; // Don't spawn if tab hidden
        const type = Math.random() > 0.5 ? 'hearts' : 'thumbs';
        spawnEmojiVisual(type);
        scheduleAmbientSpawn();
      }, delay);
    }

    scheduleAmbientSpawn();
    setTimeout(() => spawnEmojiVisual('hearts'), 500);
  }
});

