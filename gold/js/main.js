/* =========================================================
   JCBゴールド 獲得LP モック ― 動作
   データは js/config.js にまとめています。
   ========================================================= */
(function () {
  "use strict";
  const C = window.MOCK_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const yen = (n) => Math.round(n).toLocaleString("ja-JP");

  /* ---------- ダミー画像枠：画像が無ければ枠だけ表示 ---------- */
  $$(".ph img").forEach((img) => {
    const drop = () => img.remove();
    if (img.complete && img.naturalWidth === 0) drop();
    img.addEventListener("error", drop);
  });

  /* ---------- トースト ---------- */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastEl.hidden = true), 2600);
  }

  /* ---------- ドロワー ---------- */
  const drawer = $("#drawer");
  const drawerBtn = $("[data-drawer-open]");
  function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    drawerBtn.setAttribute("aria-expanded", String(open));
    if (open) $("a, button", drawer).focus();
  }
  drawerBtn.addEventListener("click", () => setDrawer(true));
  $("[data-drawer-close]").addEventListener("click", () => setDrawer(false));
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer || e.target.closest("a")) setDrawer(false);
  });

  /* ---------- FV切替・広告流入の出し分け ---------- */
  function setFv(v) {
    document.body.dataset.fv = v;
    $$("[data-mock-fv] button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === v)));
  }
  function setAd(key) {
    const ad = C.fvAd[key] || C.fvAd.none;
    document.body.dataset.ad = key;
    $("[data-ad-sub]").innerHTML = ad.sub;
    const f = $("[data-ad-fact3]");
    $("dt", f).textContent = ad.fact3.label;
    $("dd", f).textContent = ad.fact3.value;
    $$("[data-mock-ad] button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === key)));
  }
  $$("[data-mock-fv] button").forEach((b) => b.addEventListener("click", () => setFv(b.dataset.value)));
  $$("[data-mock-ad] button").forEach((b) => b.addEventListener("click", () => setAd(b.dataset.value)));
  const params = new URLSearchParams(location.search);
  if (params.get("fv")) setFv(params.get("fv"));
  if (params.get("ad") && C.fvAd[params.get("ad")]) setAd(params.get("ad"));

  const panelBtn = $("[data-mockpanel-toggle]");
  panelBtn.addEventListener("click", () => {
    const body = panelBtn.nextElementSibling;
    body.hidden = !body.hidden;
    panelBtn.setAttribute("aria-expanded", String(!body.hidden));
  });

  /* ---------- 追従CTA：FVが見えなくなったら表示 ---------- */
  const sticky = $("[data-sticky-cta]");
  const fvs = $$(".fv");
  let ticking = false;
  function updateSticky() {
    ticking = false;
    const visibleFv = fvs.find((f) => f.offsetParent !== null);
    if (!visibleFv) return;
    const fvBottom = visibleFv.getBoundingClientRect().bottom;
    const applyTop = $("#apply").getBoundingClientRect().top;
    const show = fvBottom < 0 && applyTop > window.innerHeight * 0.8;
    sticky.classList.toggle("is-shown", show);
    sticky.setAttribute("aria-hidden", String(!show));
    $(".btn", sticky).tabIndex = show ? 0 : -1;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateSticky); } }, { passive: true });
  updateSticky();

  /* ---------- タブ ---------- */
  $$("[data-tabs]").forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    function select(t) {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        $("#" + x.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        select(n); n.focus();
      });
    });
  });

  /* ---------- カルーセル ---------- */
  $$("[data-carousel]").forEach((c) => {
    const track = $(".carousel__track", c);
    const step = () => track.firstElementChild.getBoundingClientRect().width + 14;
    $("[data-carousel-prev]", c).addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    $("[data-carousel-next]", c).addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  });

  /* =========================================================
     体験者の声：初期はPC4件・SP2件、5件目以降はフェードで「もっと見る」
     ========================================================= */
  const more = $("[data-more]");
  const moreBtn = $("[data-more-btn]");
  const pc = window.matchMedia("(min-width: 1024px)");
  function collapseVoices() {
    if (!more.classList.contains("is-collapsed")) return;
    const items = $$(".testi__item", more);
    const shown = pc.matches ? 4 : 2;
    const next = items[shown];
    if (!next) { more.classList.remove("is-collapsed"); moreBtn.hidden = true; return; }
    // 次の行を少しだけ見せて、続きがあることを伝える
    more.style.maxHeight = `${next.offsetTop + 90}px`; // offsetTop は .voices-more（position: relative）基準
    moreBtn.textContent = `もっと見る（あと${items.length - shown}件）`;
  }
  moreBtn.addEventListener("click", () => {
    more.style.maxHeight = `${more.scrollHeight}px`;
    more.classList.remove("is-collapsed");
    moreBtn.setAttribute("aria-expanded", "true");
    moreBtn.hidden = true;
    // アニメーション後は高さ制限を外す（transitionend が来ない環境向けにタイマーでも解除）
    setTimeout(() => (more.style.maxHeight = "none"), 450);
  });
  collapseVoices();
  pc.addEventListener("change", collapseVoices);
  window.addEventListener("resize", collapseVoices);
  document.fonts?.ready.then(collapseVoices);

  /* =========================================================
     30秒診断
     ========================================================= */
  const diag = $("[data-diag]");
  const result = $("[data-result]");
  let qIndex = 0;
  let scores = {};
  let lastPick = null;

  function renderQuestion() {
    const q = C.questions[qIndex];
    $("[data-diag-step]").textContent = `質問 ${qIndex + 1}／${C.questions.length}`;
    $("[data-diag-q]").textContent = q.q;
    $("[data-diag-bar]").style.width = `${(qIndex / C.questions.length) * 100}%`;
    const box = $("[data-diag-options]");
    box.innerHTML = "";
    q.options.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "diag__opt";
      b.textContent = o.text;
      b.addEventListener("click", () => answer(o));
      box.appendChild(b);
    });
  }
  function answer(o) {
    Object.entries(o.score).forEach(([k, v]) => (scores[k] = (scores[k] || 0) + v));
    lastPick = Object.keys(o.score)[0];
    qIndex++;
    if (qIndex < C.questions.length) renderQuestion();
    else showResult(decideType());
  }
  function decideType() {
    const order = Object.keys(C.types);
    let best = lastPick, max = -1;
    order.forEach((k) => {
      const s = scores[k] || 0;
      if (s > max || (s === max && k === lastPick)) { max = s; best = k; }
    });
    return best;
  }
  function showResult(typeKey) {
    const t = C.types[typeKey];
    $("[data-diag-bar]").style.width = "100%";
    diag.hidden = true;
    result.hidden = false;
    $("[data-result-type]").textContent = t.name;
    $("[data-result-lead]").textContent = t.lead;
    $("[data-result-perks]").innerHTML = t.perks.map((p) => `<li><strong>${p.title}</strong><span>${p.text}</span></li>`).join("");
    $("[data-result-anchor]").setAttribute("href", t.anchor);
    setSimValues(t.preset, `診断結果「${t.name}」で試算中`);
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function resetDiag() {
    qIndex = 0; scores = {}; lastPick = null;
    result.hidden = true; diag.hidden = false;
    setSimValues(S.defaultPreset, S.defaultBadge);
    renderQuestion();
    diag.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  $("[data-diag-retry]").addEventListener("click", resetDiag);
  renderQuestion();

  /* =========================================================
     モト取りシミュレーター
     ========================================================= */
  const S = C.sim;
  const inputsBox = $("[data-sim-inputs]");
  const values = {};
  const fmt = (inp, v) => (inp.unit.startsWith("円") ? `${yen(v)}${inp.unit}` : `${v}${inp.unit}`);

  S.inputs.forEach((inp) => {
    const row = document.createElement("div");
    row.className = "sim__row";
    row.innerHTML = `
      <div class="sim__row-head"><label class="sim__row-label" for="sim-${inp.id}">${inp.label}</label><span class="sim__row-val" data-val="${inp.id}"></span></div>
      ${inp.note ? `<p class="sim__row-note">${inp.note}</p>` : ""}
      <input type="range" id="sim-${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.min}">`;
    inputsBox.appendChild(row);
    const range = $("input", row);
    range.addEventListener("input", () => { values[inp.id] = Number(range.value); calc(); });
    values[inp.id] = inp.min;
  });

  const simBadge = $("[data-sim-badge]");
  function setSimValues(preset, badge) {
    S.inputs.forEach((inp) => {
      const v = preset[inp.id] ?? inp.min;
      values[inp.id] = v;
      $(`#sim-${inp.id}`).value = v;
    });
    simBadge.textContent = badge;
    simBadge.classList.toggle("is-diag", badge !== S.defaultBadge);
    calc();
  }
  // 診断前から標準値で表示しておく
  setSimValues(S.defaultPreset, S.defaultBadge);

  function bonusPoints(annual) {
    let pt = 0;
    S.bonusTable.forEach(([th, p]) => { if (annual >= th) pt = p; });
    const last = S.bonusTable[S.bonusTable.length - 1];
    if (annual > last[0]) pt += Math.floor((annual - last[0]) / S.bonusAfter.step) * S.bonusAfter.pt;
    return pt;
  }

  function calc() {
    const v = values;
    const shopMonthly = v.daily + v.partner;
    const annualShop = shopMonthly * 12;
    const rows = [
      ["普段のお買い物のポイント", (v.daily * 12 / S.basePerYen) * S.pointYen],
      ["よく使うお店のポイント", v.partner * 12 * S.partnerRate],
      ["ゴールドのボーナスポイント", bonusPoints(annualShop) * S.pointYen],
      ["空港ラウンジ", v.flights * S.lounge],
      ["JCB スター・ダイニング", v.dining * S.dining],
      ["ホテルクーポン", Math.min(v.hotel, S.hotelCouponMax) * S.hotelCoupon],
      ["クレカ積立", v.tsumitate * 12 * (shopMonthly >= S.tsumitate.threshold ? S.tsumitate.high : S.tsumitate.low)]
    ];
    const total = rows.reduce((a, [, n]) => a + n, 0);
    const fee = C.annualFee;
    const monthlyFee = Math.round(fee / 12);

    S.inputs.forEach((inp) => ($(`[data-val="${inp.id}"]`).textContent = fmt(inp, v[inp.id])));
    $("[data-sim-total]").textContent = yen(total);
    const max = Math.max(total, fee, 1);
    $("[data-sim-bar-gain]").style.width = `${(total / max) * 100}%`;
    $("[data-sim-bar-fee]").style.width = `${(fee / max) * 100}%`;
    $("[data-sim-breakdown]").innerHTML = rows
      .filter(([, n]) => n > 0)
      .map(([k, n]) => `<div><dt>${k}</dt><dd>${yen(n)}円</dd></div>`).join("") || "<div><dt>入力すると内訳が表示されます</dt><dd></dd></div>";

    const diff = total - fee;
    let msg = `初年度は年会費<strong>0円</strong>なので、まるごとおトクに。`;
    msg += diff >= 0
      ? `<br>2年目以降も、年会費11,000円（月あたり約${yen(monthlyFee)}円）を<strong>${yen(diff)}円</strong>上回る見込みです。`
      : `<br>2年目以降は、年会費11,000円（月あたり約${yen(monthlyFee)}円）まであと<strong>${yen(-diff)}円</strong>。使い方を変えると、どこで差が出るか試してみてください。`;
    $("[data-sim-msg]").innerHTML = msg;
  }

  /* =========================================================
     申込：券面選択 → 番号有無（#apply 内）
     ========================================================= */
  function buildChooser(root) {
    let design = C.designs[0];
    let type = "nl";
    root.innerHTML = `
      <p class="chooser__step">1. カードデザインを選ぶ</p>
      <div class="chooser__designs" role="group" aria-label="カードデザイン"></div>
      <p class="chooser__step">2. 申し込み方法を選ぶ</p>
      <div class="chooser__types">
        <button type="button" class="chooser__type" data-type="nl"><strong>ナンバーレス（最短5分）</strong><span>アプリでカード番号を確認。すぐにネットで使えます</span></button>
        <button type="button" class="chooser__type" data-type="num"><strong>番号あり（約1週間）</strong><span>券面でカード番号を確認したい方に</span></button>
      </div>
      <a class="btn btn--cta btn--block btn--lg" href="${C.applyUrl}" data-go>この内容で申し込む<small>申し込みフォームに進みます</small></a>
      <p class="chooser__note" data-chooser-note></p>`;
    const list = $(".chooser__designs", root);
    C.designs.forEach((d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chooser__design";
      b.dataset.id = d.id;
      b.innerHTML = `<img src="${d.img}" alt="">${d.name}${d.limited ? '<span class="chooser__limited">枚数限定・発行費用1,100円</span>' : ""}`;
      b.addEventListener("click", () => { design = d; if (d.limited) type = "nl"; sync(); });
      list.appendChild(b);
    });
    $$(".chooser__type", root).forEach((b) => b.addEventListener("click", () => { type = b.dataset.type; sync(); }));
    $("[data-go]", root).addEventListener("click", (e) => {
      if (C.mockNoTransition) { e.preventDefault(); toast(`（モック）${design.name}・${type === "nl" ? "ナンバーレス" : "番号あり"}で申込フォームへ進みます`); }
    });
    function sync() {
      $$(".chooser__design", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === design.id)));
      $$(".chooser__type", root).forEach((b) => {
        b.disabled = design.limited && b.dataset.type === "num";
        b.setAttribute("aria-pressed", String(b.dataset.type === type));
      });
      $("[data-chooser-note]", root).textContent = design.limited
        ? "限定デザインはナンバーレスのみ。発行枚数が上限に達し次第、受付終了です。"
        : "ナンバーレスは、アプリ初回起動時に顔写真付きの本人確認書類が必要です。";
    }
    sync();
  }
  $$("[data-chooser]").forEach(buildChooser);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false);
  });
})();
