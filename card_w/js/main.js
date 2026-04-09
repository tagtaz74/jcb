  // Footnote anchor highlight
  document.querySelectorAll('.fn-link').forEach(link => {
    link.addEventListener('click', function() {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      target.classList.remove('fn-highlight');
      void target.offsetWidth;
      target.classList.add('fn-highlight');
    });
  });

  // Spec tab switch
  function switchSpec(btn, id) {
    document.querySelectorAll('.spec-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.spec-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('spec-' + id).classList.add('active');
  }

  // Tsumitate accordion toggle
  function toggleTsumitate() {
    const collapse = document.getElementById('tsumitate-collapse');
    const btn = document.getElementById('tsumitate-btn');
    const isOpen = collapse.classList.contains('open');
    collapse.classList.toggle('open');
    btn.classList.toggle('open');
    if (!isOpen) {
      collapse.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 100 + i * 80);
      });
    }
  }

  // FAQ toggle
  function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  const overlay = document.getElementById('nav-overlay');
  function toggleDrawer(open) {
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hamburger.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('open')));
  overlay.addEventListener('click', () => toggleDrawer(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));

  // ③ Scroll Parallax（カードが浮遊するように上昇）
  (function () {
    const wrap = document.querySelector('.hero-card-wrap');
    if (!wrap) return;
    let raf = false;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.14, 90);
        wrap.style.transform = `translateY(-${offset}px)`;
        raf = false;
      });
    });
  })();

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => revealObs.observe(r));

  // Top bar hide on scroll
  const topBar = document.getElementById('top-bar');
  const mainNav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      topBar.classList.add('hidden');
      mainNav.classList.add('scrolled');
    } else {
      topBar.classList.remove('hidden');
      mainNav.classList.remove('scrolled');
    }
  });

  // Sticky CTA
  const sticky = document.getElementById('sticky');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) sticky.classList.add('visible');
    else sticky.classList.remove('visible');
  });
