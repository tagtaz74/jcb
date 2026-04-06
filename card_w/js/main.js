  // Footnote anchor highlight
  document.querySelectorAll('.fn-link').forEach(link => {
    link.addEventListener('click', function(e) {
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

  // ① 3D Card Tilt + Glare
  (function () {
    const card = document.querySelector('.card-img-wrap');
    if (!card) return;

    const glare = document.createElement('div');
    glare.style.cssText = 'position:absolute;inset:0;border-radius:16px;pointer-events:none;opacity:0;transition:opacity 0.4s ease;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,0.28) 0%,transparent 65%);mix-blend-mode:screen;z-index:2;';
    card.appendChild(glare);

    const MAX_TILT = 14;
    let hovering = false;

    card.addEventListener('mouseenter', () => {
      hovering = true;
      card.style.transition = 'transform 0.08s linear, filter 0.3s ease';
      glare.style.opacity = '1';
    });

    card.addEventListener('mousemove', e => {
      if (!hovering) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg) scale(1.05)`;
      glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.3) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      card.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), filter 0.3s ease';
      card.style.transform = 'rotate(-3deg)';
      glare.style.opacity = '0';
    });
  })();

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

  // Sticky CTA
  const sticky = document.getElementById('sticky');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) sticky.classList.add('visible');
    else sticky.classList.remove('visible');
  });
