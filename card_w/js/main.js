  // Footnote renumbering + bidirectional links
  (function () {
    // 1. 本文の fn-link を DOM 順に走査し、初出順で連番を決定
    const allLinks = Array.from(document.querySelectorAll('a.fn-link'));
    if (!allLinks.length) return;

    const ordered = [];   // 初出順の fnId 配列
    const seenOrder = new Set();
    allLinks.forEach(link => {
      const fnId = link.getAttribute('href').replace('#', '');
      if (!seenOrder.has(fnId)) {
        seenOrder.add(fnId);
        ordered.push(fnId);
      }
    });

    // 2. 旧 fnId → 新番号のマップ
    const numMap = {};
    ordered.forEach((fnId, i) => { numMap[fnId] = i + 1; });

    // 3. 本文リンクのテキストを新番号に更新 + 初出に id 付与
    const seenRef = new Set();
    allLinks.forEach(link => {
      const fnId = link.getAttribute('href').replace('#', '');
      link.textContent = '※' + numMap[fnId];
      if (!seenRef.has(fnId)) {
        seenRef.add(fnId);
        link.id = 'fnref-' + fnId;
      }
    });

    // 4. 本文クリック時のハイライト（content → footnote）
    allLinks.forEach(link => {
      link.addEventListener('click', function () {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        target.classList.remove('fn-highlight');
        void target.offsetWidth;
        target.classList.add('fn-highlight');
      });
    });

    // 5. 注釈リストを新番号順に並び替え・戻りリンク化
    const list = document.querySelector('.footnotes-list');
    if (!list) return;

    const allItems = Array.from(list.querySelectorAll('li[id]'));
    const referenced   = allItems.filter(li => numMap[li.id] !== undefined);
    const unreferenced = allItems.filter(li => numMap[li.id] === undefined);

    referenced.sort((a, b) => numMap[a.id] - numMap[b.id]);
    list.innerHTML = '';

    referenced.forEach(li => {
      const fnId  = li.id;
      const refId = 'fnref-' + fnId;
      const refEl = document.getElementById(refId);
      const numSpan = li.querySelector('.fn-num');

      if (numSpan) {
        const a = document.createElement('a');
        a.href = '#' + refId;
        a.className = 'fn-back-link';
        a.title = '本文へ戻る';
        a.textContent = '※' + numMap[fnId];
        if (refEl) {
          a.addEventListener('click', function () {
            refEl.classList.remove('fn-ref-highlight');
            void refEl.offsetWidth;
            refEl.classList.add('fn-ref-highlight');
          });
        }
        numSpan.replaceWith(a);
      }
      list.appendChild(li);
    });

    // 6. 未参照注釈を「共通注意事項」ブロックのAmazon行の後に追加
    if (!unreferenced.length) return;

    const insertTarget = document.getElementById('common-notes-insert');
    if (!insertTarget) return;

    unreferenced.forEach(li => {
      const numSpan = li.querySelector('.fn-num');
      if (numSpan) numSpan.textContent = '※';
      insertTarget.appendChild(li);
    });
  })();

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

  // Apply selector
  const applyState = { card: null, number: null };
  const submitBtn = document.getElementById('apply-submit-btn');

  // Apply URL map
  const applyUrls = {
    'w_numberless':  'https://entry.jcb.co.jp/input_basic?cardtype=w&number=0',
    'w_numbered':    'https://entry.jcb.co.jp/input_basic?cardtype=w&number=1',
    'plusl_numberless': 'https://entry.jcb.co.jp/input_basic?cardtype=plusl&number=0',
    'plusl_numbered':   'https://entry.jcb.co.jp/input_basic?cardtype=plusl&number=1',
  };

  document.querySelectorAll('.apply-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      // Deselect siblings
      document.querySelectorAll(`.apply-option[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      applyState[group] = btn.dataset.value;
      // Enable submit if both selected
      if (applyState.card && applyState.number) {
        submitBtn.disabled = false;
      }
    });
  });

  submitBtn.addEventListener('click', () => {
    const key = `${applyState.card}_${applyState.number}`;
    const url = applyUrls[key] || 'https://entry.jcb.co.jp/input_basic';
    window.location.href = url;
  });
