// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Scoreboard count-up
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('[data-count]');

  const animate = (el) => {
    const target = el.getAttribute('data-count');
    const match = target.match(/^([^\d]*)([\d,]+\.?\d*)(.*)$/);
    if (!match) { el.textContent = target; return; }
    const [, prefix, numStr, suffix] = match;
    const end = parseFloat(numStr.replace(/,/g, ''));
    const hasComma = numStr.includes(',');
    const decimals = (numStr.split('.')[1] || '').length;
    if (prefersReduced) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      let formatted = decimals ? current.toFixed(decimals) : Math.round(current).toString();
      if (hasComma) formatted = Number(formatted).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      el.textContent = prefix + formatted + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && nums.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => observer.observe(el));
  } else {
    nums.forEach(el => { el.textContent = el.getAttribute('data-count'); });
  }

  // ---------- Scroll progress bar ----------
  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  };

  const backToTop = document.querySelector('.back-to-top');

  // ---------- Nav scrolled state ----------
  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
    updateProgress();
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Scrollspy for in-page nav ----------
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navAnchors.length) {
    const sections = navAnchors
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = '#' + entry.target.id;
          const link = navAnchors.find(a => a.getAttribute('href') === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(s => spy.observe(s));
    }
  }

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el, i) => {
      if (!prefersReduced) el.style.transitionDelay = `${(i % 4) * 70}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---------- Back to top ----------
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  // ---------- Cursor-follow project preview ----------
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const workCards = document.querySelectorAll('.work-card[data-preview]');
  if (canHover && workCards.length) {
    const preview = document.createElement('div');
    preview.className = 'cursor-preview';
    const img = document.createElement('img');
    preview.appendChild(img);
    document.body.appendChild(preview);

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let rafId = null;

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      preview.style.left = `${currentX}px`;
      preview.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(loop);
    };

    workCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        img.src = card.getAttribute('data-preview');
        preview.classList.add('is-active');
        if (!rafId) rafId = requestAnimationFrame(loop);
      });
      card.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      });
      card.addEventListener('mouseleave', () => {
        preview.classList.remove('is-active');
      });
    });
  }

  // ---------- Hero photo tilt ----------
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto && canHover && !prefersReduced) {
    const heroWrap = heroPhoto.closest('.hero-grid') || heroPhoto.parentElement;
    heroWrap.addEventListener('mousemove', (e) => {
      const rect = heroPhoto.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroPhoto.style.transform = `rotateY(${px * 8}deg) rotateX(${py * -8}deg)`;
    });
    heroWrap.addEventListener('mouseleave', () => {
      heroPhoto.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
});
