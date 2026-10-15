/* =============================================
   HAMBURGER MENU
============================================= */
(function() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const overlay   = document.getElementById('nav-overlay');
  function toggleDrawer(open) {
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hamburger.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('open')));
  overlay.addEventListener('click', () => toggleDrawer(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
})();

/* =============================================
   CARD DATA（申込URL・個別LP）
============================================= */
const entryUrl = code => `https://entry.jcb.co.jp/input_basic?1323011+3950+100+${code}&ActionType=entrytop`;
const LIMITED_NOTICE_URL = 'https://www.jcb.co.jp/ordercard/pop/limited-edition/os2025/index.html';

const CARDS = {
  w:        { name: 'JCBカード W',         img: './images/card_w.png',        detail: 'https://www.jcb.co.jp/promotion/ordercard/w/index.html',         nl: entryUrl('213010122'), num: entryUrl('113000122') },
  wplusl:   { name: 'JCBカード W plus L',  img: './images/card_pink.webp',    detail: 'https://www.jcb.co.jp/promotion/ordercard/wplusl/index.html',    nl: entryUrl('213010123'), num: entryUrl('113000123') },
  s:        { name: 'JCBカード S',         img: './images/card_s.png',        detail: 'https://www.jcb.co.jp/promotion/ordercard/os_card_s/index.html', nl: entryUrl('213210124'), num: entryUrl('113000124') },
  gold:     { name: 'JCBゴールド',         img: './images/card_gold.png',     detail: 'https://www.jcb.co.jp/promotion/ordercard/gold/index.html',      nl: entryUrl('213301207'), num: entryUrl('113021207') },
  platinum: { name: 'JCBプラチナ',         img: './images/card_platinum.png', detail: 'https://www.jcb.co.jp/promotion/ordercard/platinum/index.html',  nl: entryUrl('213012419'), num: entryUrl('113002419') },
  kirameki: { name: 'JCBゴールド -煌-',    img: './images/card_gold_kirameki.png',    detail: LIMITED_NOTICE_URL, nl: entryUrl('213401207'), limited: true },
  sakura:   { name: 'JCBゴールド -桜-',    img: './images/card_gold_sakura.png',      detail: LIMITED_NOTICE_URL, nl: entryUrl('213401207'), limited: true },
  mikage:   { name: 'JCBプラチナ -御影-',  img: './images/card_platinum_mikage.png',  detail: LIMITED_NOTICE_URL, nl: entryUrl('213012419'), limited: true },
};

/* =============================================
   MODAL（共用）
============================================= */
const modal     = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
let lastFocus = null;

function openModal(html, variant) {
  lastFocus = document.activeElement;
  modalBody.innerHTML = html;
  modal.className = 'modal' + (variant ? ` modal--${variant}` : '');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}
function closeModal() {
  modal.hidden = true;
  modalBody.innerHTML = '';
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft')  modal.querySelector('.zoom-nav--prev')?.click();
  if (e.key === 'ArrowRight') modal.querySelector('.zoom-nav--next')?.click();
});

function applyButtonsHTML(card) {
  if (card.limited) {
    return `
      <a class="btn-apply btn-apply--block ext" href="${card.nl}" target="_blank" rel="noopener">ナンバーレスを申し込む</a>
      <p class="modal-note">※限定デザインはナンバーレスのみ対応しています。発行費用1,100円（税込）が発生します。<br><a class="ext" href="${LIMITED_NOTICE_URL}" target="_blank" rel="noopener">限定デザイン申し込み時の注意事項</a></p>`;
  }
  return `
    <p class="apply-lead">＼アプリでカード情報を確認するならこちら／</p>
    <a class="btn-apply btn-apply--block ext" href="${card.nl}" target="_blank" rel="noopener">ナンバーレスを申し込む</a>
    <p class="apply-lead">＼券面でカード情報を確認するならこちら／</p>
    <a class="btn-apply btn-apply--block btn-apply--outline ext" href="${card.num}" target="_blank" rel="noopener">番号ありを申し込む</a>
    <a class="modal-detail ext" href="${card.detail}" target="_blank" rel="noopener">カード詳細を見る</a>`;
}

/* 申し込み方法の選択 */
function openApply(key) {
  const card = CARDS[key];
  openModal(`
    <p class="modal-eyebrow" id="modalTitle">申し込み方法をお選びください。</p>
    <img class="apply-modal-img${card.limited ? ' is-tall' : ''}" src="${card.img}" alt="${card.name}">
    <p class="apply-modal-name">${card.name}</p>
    ${card.limited ? '' : '<p class="apply-modal-badge">最短5分で発行</p>'}
    ${applyButtonsHTML(card)}`, 'apply');
}

/* 券面の拡大表示（デザイン比較から開いた場合は前後のデザインへ移動できる） */
let zoomList = [];
let zoomIndex = 0;

function openZoom(trigger) {
  const grid = trigger.closest('#designGrid');
  zoomList = grid
    ? [...grid.querySelectorAll('li:not([hidden]) .js-zoom')]
    : [trigger];
  zoomIndex = Math.max(0, zoomList.indexOf(trigger));
  renderZoom();
}

function renderZoom() {
  const t = zoomList[zoomIndex];
  const card = CARDS[t.dataset.card];
  const multi = zoomList.length > 1;
  const html = `
    <div class="zoom-stage" id="zoomStage">
      <img class="zoom-img" src="${t.dataset.img}" alt="${card.name} ${t.dataset.design}">
      ${multi ? `
        <button class="zoom-nav zoom-nav--prev" type="button" aria-label="前のデザイン">‹</button>
        <button class="zoom-nav zoom-nav--next" type="button" aria-label="次のデザイン">›</button>` : ''}
    </div>
    <p class="zoom-hint">券面をタップで拡大${multi ? `　${zoomIndex + 1} / ${zoomList.length}` : ''}</p>
    <p class="zoom-sub">${card.name.replace(/ -.+-$/, '')}</p>
    <p class="zoom-title" id="modalTitle">${t.dataset.design}</p>
    <div class="zoom-cta">${applyButtonsHTML(card)}</div>`;

  if (modal.hidden) openModal(html, 'zoom');
  else modalBody.innerHTML = html;

  const stage = document.getElementById('zoomStage');
  const img = stage.querySelector('.zoom-img');
  const setOrigin = (x, y) => {
    const r = img.getBoundingClientRect();
    img.style.transformOrigin = `${((x - r.left) / r.width) * 100}% ${((y - r.top) / r.height) * 100}%`;
  };
  img.addEventListener('click', e => {
    setOrigin(e.clientX, e.clientY);
    stage.classList.toggle('zoomed');
  });
  stage.addEventListener('pointermove', e => {
    if (stage.classList.contains('zoomed')) setOrigin(e.clientX, e.clientY);
  });
  if (multi) {
    stage.querySelector('.zoom-nav--prev').addEventListener('click', () => {
      zoomIndex = (zoomIndex - 1 + zoomList.length) % zoomList.length;
      renderZoom();
    });
    stage.querySelector('.zoom-nav--next').addEventListener('click', () => {
      zoomIndex = (zoomIndex + 1) % zoomList.length;
      renderZoom();
    });
  }
}

/* 比較表のサービス概要 */
const TIPS = {
  rate:         ['還元率（最大）', 'J-POINTパートナー（優待店）でご利用いただいた場合の最大還元率です。JCBカード W／W plus Lは最大21倍（還元率10.5%）、JCBカード S／JCBゴールド／JCBプラチナは最大20倍（還元率10%）。'],
  tsumitate:    ['JCBのクレカ積立', 'JCBカードで投資信託を積み立てるとJ-POINTがたまります。還元率は積立以外の月間ショッピング利用額によって変わり、JCBゴールド・JCBプラチナは最大1.0%、その他のカードは最大0.5%です。'],
  shopping:     ['ショッピングガード保険', 'カードで購入した品物が、破損・盗難などの損害にあった場合に補償されます。カードにより補償の範囲（海外のみ／国内・海外）と自己負担額が異なります。'],
  delay:        ['航空機遅延保険', '航空機の遅延や欠航、手荷物の遅延・紛失によって発生した宿泊費・食事代・衣類の購入費などを補償します。'],
  smartphone:   ['JCBスマートフォン保険', 'スマートフォンのディスプレイ破損などの修理費用を補償します。補償対象スマートフォンの通信料を直近3ヵ月以上連続して対象カードでお支払いいただいていることが条件です。'],
  clubOff:      ['クラブオフ', '国内外20万ヵ所以上の宿泊施設・レジャー施設・グルメなどを優待価格で利用できる会員制優待サービスです。'],
  lounge:       ['空港ラウンジ', '国内主要空港とハワイ ホノルルの空港ラウンジを無料で利用できます。'],
  priorityPass: ['プライオリティ・パス', '世界1,800ヵ所以上の空港ラウンジを利用できる会員制サービスです。JCBプラチナには標準で付帯します。'],
  hotelux:      ['HoteLux', '国内外の高級ホテルを優待価格で予約できる会員制サービスです。年に1回、予約に使えるクーポンがもらえます。'],
  gourmet:      ['グルメ・ベネフィット', '国内の厳選レストランで所定のコースを2名以上で予約すると、1名分のコース料金が無料になります。'],
  starDining:   ['JCBスター・ダイニング', 'JCBが厳選した飲食店で、割引などの優待が受けられるサービスです。'],
  concierge:    ['コンシェルジュ', 'レストランの予約や旅行の手配などを、24時間365日、専用デスクにご相談いただけます。'],
};
function openTip(key) {
  const [title, body] = TIPS[key];
  openModal(`<p class="tip-title" id="modalTitle">${title}</p><p class="tip-body">${body}</p>`, 'tip');
}

/* トリガーは診断結果など後から描画される要素にもあるため委譲で拾う */
document.addEventListener('click', e => {
  const apply = e.target.closest('.js-apply');
  if (apply) { openApply(apply.dataset.card); return; }
  const zoom = e.target.closest('.js-zoom');
  if (zoom) { openZoom(zoom); return; }
  const tip = e.target.closest('.js-tip');
  if (tip) openTip(tip.dataset.tip);
});

/* =============================================
   CAROUSEL（タイプ別・キャンペーン）
============================================= */
function setupCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const dotsEl = root.querySelector('.carousel-dots');
  const items = [...track.querySelectorAll('.carousel-item')];

  dotsEl.innerHTML = items.map((_, i) => `<button type="button" class="carousel-dot" aria-label="${i + 1}枚目"></button>`).join('');
  const dots = [...dotsEl.children];
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    track.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: 'smooth' });
  }));

  function update() {
    const scrollable = track.scrollWidth > track.clientWidth + 4;
    dotsEl.hidden = !scrollable;
    root.classList.toggle('is-static', !scrollable);
    if (!scrollable) return;
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    let current = 0;
    if (atEnd) current = items.length - 1;
    else {
      let min = Infinity;
      items.forEach((item, i) => {
        const d = Math.abs(item.offsetLeft - items[0].offsetLeft - track.scrollLeft);
        if (d < min) { min = d; current = i; }
      });
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  root.carouselUpdate = update;
  update();
}
document.querySelectorAll('.carousel').forEach(setupCarousel);

/* =============================================
   タイプ別：重視ポイントのタブ
============================================= */
const recoTabs = [...document.querySelectorAll('.reco-tab')];
const recoPanels = [...document.querySelectorAll('.reco-panel')];
function selectRecoTab(type) {
  const all = type === 'all';
  recoTabs.forEach(tab => {
    const selected = tab.dataset.reco === type;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', selected);
  });
  recoPanels.forEach(panel => {
    panel.hidden = !all && panel.id !== `reco-${type}`;
    if (!panel.hidden) panel.querySelector('.carousel-track').scrollLeft = 0;
  });
}
recoTabs.forEach(tab => tab.addEventListener('click', () => {
  const type = tab.dataset.reco;
  selectRecoTab(type);
  const firstPanel = type === 'all' ? recoPanels[0] : document.getElementById(`reco-${type}`);
  firstPanel.querySelector('.reco-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

function showRecoCardFromHash() {
  const card = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!card?.matches('.reco-card')) return;
  selectRecoTab('all');
  requestAnimationFrame(() => requestAnimationFrame(() => card.scrollIntoView({ behavior: 'instant', block: 'start' })));
}
window.addEventListener('hashchange', showRecoCardFromHash);
showRecoCardFromHash();

/* =============================================
   比較：タブ切り替え
============================================= */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + btn.dataset.tab));
  });
});

/* 比較：デザインのカテゴリ絞り込み */
document.querySelectorAll('.design-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    document.querySelectorAll('.design-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('#designGrid > li').forEach(li => {
      li.hidden = f !== 'all' && !li.dataset.cats.split(' ').includes(f);
    });
  });
});

/* =============================================
   お申し込みの流れ：タブ切り替え
============================================= */
document.querySelectorAll('.flow-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flow-tab-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn);
    });
    document.querySelectorAll('.flow-tab-panel').forEach(p => { p.hidden = p.id !== btn.dataset.flowTab; });
  });
});

/* =============================================
   診断
============================================= */
const DIAG_META = {
  w:        { badge: 'ポイント特化型',             fee: '年会費 永年無料',                     color: 'blue',     designs: 1 },
  wplusl:   { badge: 'ポイント特化＋女性向け特典', fee: '年会費 永年無料',                     color: 'pink',     designs: 3 },
  s:        { badge: '優待充実型',                 fee: '年会費 永年無料',                     color: 'gray',     designs: 3 },
  gold:     { badge: 'トラベル充実型',             fee: '年会費 11,000円（税込）初年度無料',   color: 'gold',     designs: 3 },
  platinum: { badge: 'プレミアム体験型',           fee: '年会費 27,500円（税込）',             color: 'platinum', designs: 1 },
};

function getAnswers() {
  const get = n => { const e = document.querySelector(`input[name="${n}"]:checked`); return e ? e.value : null; };
  return { fee: get('fee'), age: get('age'), travel: get('travel'), food: get('food'), points: get('points'), gender: get('gender') };
}

// 結果はシンプルに「おすすめの理由」3点のみ表示する
function diagnose({ fee, age, travel, food, points, gender }) {
  const w      = { card: 'w',      reasons: ['ポイントが通常の2倍たまる', '優待店ではポイント最大21倍（還元率10.5%）', '39歳以下で入会すれば年会費はずっと無料'] };
  const wplusl = { card: 'wplusl', reasons: ['ポイントが通常の2倍たまる', '女性向け優待「LINDAリーグ」付き', 'デザインが3種類から選べる'] };

  if (fee === 'free') {
    if (age === 'under40') return gender === 'female' ? wplusl : w;
    return { card: 's', reasons: ['年会費永年無料・年齢上限なし', '国内外20万ヵ所以上で最大84％OFFの優待', 'スマホ保険 年間最高3万円'] };
  }
  if (food === 'gourmet') {
    return { card: 'platinum', reasons: ['グルメ・ベネフィット（2名で1名分無料）', 'プライオリティ・パスで世界中の空港ラウンジへ', '24時間コンシェルジュサービス'] };
  }
  if (travel === 'overseas' || travel === 'domestic') {
    return { card: 'gold', reasons: [travel === 'overseas' ? '海外旅行保険 最高1億円' : '国内旅行保険 最高5,000万円', '空港ラウンジが無料で使える', '初年度年会費無料'] };
  }
  if (age === 'under40' && points === 'yes') return gender === 'female' ? wplusl : w;
  return { card: 's', reasons: ['国内外20万ヵ所以上で最大84％OFFの優待', '年会費永年無料', '家族カードも永年無料'] };
}

const FIELD_VALUES = {
  age: ['under40', 'over40'],
  gender: ['female', 'male'],
  fee: ['free', 'paid'],
  travel: ['overseas', 'domestic', 'none'],
  food: ['gourmet', 'cospa'],
  points: ['yes', 'no'],
};

// 残りの未回答質問がどんな組み合わせでも結果が変わらないなら、その結果を返す（まだ確定しないなら null）
function findDeterminedResult(answers) {
  const unanswered = Object.keys(FIELD_VALUES).filter(k => !answers[k]);
  if (unanswered.length === 0) return diagnose(answers);

  let combos = [{}];
  unanswered.forEach(key => {
    const next = [];
    combos.forEach(c => FIELD_VALUES[key].forEach(v => next.push({ ...c, [key]: v })));
    combos = next;
  });

  let signature = null;
  for (const combo of combos) {
    const json = JSON.stringify(diagnose({ ...answers, ...combo }));
    if (signature === null) signature = json;
    else if (signature !== json) return null;
  }
  return diagnose(answers);
}

function showResult(precomputed) {
  const result = precomputed || diagnose(getAnswers());
  const card = CARDS[result.card];
  const meta = DIAG_META[result.card];

  document.getElementById('cardResult').innerHTML = `
    <div class="result-card">
      <div class="result-head ${meta.color}">
        <span class="card-badge">${meta.badge}</span>
        <p class="card-name">${card.name}</p>
        <p class="card-fee">${meta.fee}</p>
      </div>
      <div class="result-body">
        <button class="result-img js-zoom" type="button" data-card="${result.card}" data-design="通常デザイン" data-img="${card.img}" aria-label="${card.name}の券面を拡大">
          <img src="${card.img}" alt="${card.name}">
        </button>
        ${meta.designs > 1 ? `<p class="result-design-note">選べるデザイン：${meta.designs}種類</p>` : ''}
        <ul class="result-points">${result.reasons.map(r => `<li>${r}</li>`).join('')}</ul>
        <div class="cta-pair">
          <button class="btn-apply js-apply" type="button" data-card="${result.card}">このカードを申し込む</button>
          <a class="btn-detail ext" href="${card.detail}" target="_blank" rel="noopener">詳しく見る</a>
        </div>
      </div>
    </div>`;

  const section = document.getElementById('resultSection');
  section.style.display = 'block';
  setTimeout(() => section.classList.add('visible'), 10);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResult() {
  const section = document.getElementById('resultSection');
  section.classList.remove('visible');
  section.style.display = 'none';
}

function resetDiagnosis() {
  document.querySelectorAll('#diagnosis input[type="radio"]').forEach(r => r.checked = false);
  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.question-card').forEach(c => c.classList.remove('answered', 'active'));
  hideResult();
  goToStep(1);
  document.getElementById('diagnosis').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* STEP-BY-STEP */
const stepQNames = ['age', 'gender', 'fee', 'travel', 'food', 'points'];
let currentStep = 1;
let stepping = false;

function isStepAnswered(n) {
  return !!document.querySelector(`input[name="${stepQNames[n - 1]}"]:checked`);
}

function updateDots() {
  let answered = 0;
  stepQNames.forEach((name, i) => {
    const isAnswered = isStepAnswered(i + 1);
    const dot = document.getElementById(`dot${i + 1}`);
    dot.classList.remove('filled', 'current');
    if (i + 1 === currentStep) dot.classList.add('current');
    else if (isAnswered) dot.classList.add('filled');
    if (isAnswered) answered++;
  });
  document.getElementById('progressText').textContent = `${answered} / 6 回答済み`;
}

function updateNavButtons() {
  const backBtn = document.getElementById('stepBack');
  const nextBtn = document.getElementById('stepNext');
  backBtn.disabled = currentStep === 1;
  nextBtn.disabled = !isStepAnswered(currentStep);
  const determined = isStepAnswered(currentStep) && !!findDeterminedResult(getAnswers());
  nextBtn.textContent = (determined || currentStep === 6) ? '結果を見る >' : '進む >';
}

function goToStep(n) {
  document.querySelectorAll('.question-card').forEach(c => c.classList.remove('active'));
  currentStep = n;
  updateDots();
  document.getElementById(`qcard${n}`).classList.add('active');
  updateNavButtons();
}

function clearAnswersFrom(n) {
  for (let i = n; i <= 6; i++) {
    document.querySelectorAll(`input[name="${stepQNames[i - 1]}"]`).forEach(r => {
      r.checked = false;
      r.closest('.option').classList.remove('selected');
    });
    document.getElementById(`qcard${i}`).classList.remove('answered');
  }
}

function advance() {
  const determined = findDeterminedResult(getAnswers());
  if (determined) showResult(determined);
  else if (currentStep < 6) goToStep(currentStep + 1);
  else showResult();
}

document.getElementById('stepBack').addEventListener('click', () => {
  if (currentStep === 1) return;
  clearAnswersFrom(currentStep);
  hideResult();
  goToStep(currentStep - 1);
});
document.getElementById('stepNext').addEventListener('click', () => {
  if (isStepAnswered(currentStep)) advance();
});
document.getElementById('retryBtn').addEventListener('click', resetDiagnosis);

document.querySelectorAll('.option').forEach(label => {
  label.addEventListener('click', function(e) {
    e.preventDefault();
    if (stepping) return;

    const radio = this.querySelector('input[type="radio"]');
    document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => r.closest('.option').classList.remove('selected'));
    this.classList.add('selected');
    radio.checked = true;

    document.getElementById(`qcard${stepQNames.indexOf(radio.name) + 1}`).classList.add('answered');
    updateDots();
    updateNavButtons();

    stepping = true;
    setTimeout(() => { stepping = false; advance(); }, 420);
  });
});

goToStep(1);
