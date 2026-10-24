/* ============================================================
   JCB スタートガイド LP
   ============================================================ */

/* --- タブ切り替え（data-tabs / data-tabs-panels で紐付け） --- */
document.querySelectorAll('[data-tabs]').forEach((tabs) => {
  const name = tabs.dataset.tabs;
  const panels = document.querySelector(`[data-tabs-panels="${name}"]`);
  tabs.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.querySelectorAll(':scope > .tab-panel').forEach((p) => {
        p.classList.toggle('is-active', p.dataset.panel === btn.dataset.tab);
      });
    });
  });
});

/* --- アコーディオン --- */
document.querySelectorAll('.acc-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const acc = trigger.closest('.acc');
    const open = acc.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open);
  });
});

/* --- ステップナビのアクティブ表示 --- */
const stepNav = document.querySelector('.step-nav');
const navLinks = stepNav.querySelectorAll('a');
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute('href')));
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      const active = a.getAttribute('href') === `#${entry.target.id}`;
      a.classList.toggle('is-active', active);
      // scrollIntoView はページ本体のスクロールまで巻き込むため、ナビ自体だけを横スクロールさせる
      if (active) {
        const navRect = stepNav.getBoundingClientRect();
        const linkRect = a.getBoundingClientRect();
        const left = stepNav.scrollLeft + (linkRect.left - navRect.left) - (navRect.width - linkRect.width) / 2;
        stepNav.scrollTo({ left, behavior: 'smooth' });
      }
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach((s) => s && navObserver.observe(s));

/* --- フローティングCTA：FV通過後〜STEP1のCTA表示中以外で表示 --- */
const floatCta = document.getElementById('float-cta');
const hero = document.querySelector('.hero');
const inlineCta = document.querySelector('.cta-box');
let heroVisible = true;
let ctaVisible = false;
const updateFloat = () => floatCta.classList.toggle('is-show', !heroVisible && !ctaVisible);
new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; updateFloat(); }).observe(hero);
new IntersectionObserver(([e]) => { ctaVisible = e.isIntersecting; updateFloat(); }).observe(inlineCta);
