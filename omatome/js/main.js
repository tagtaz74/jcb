const cards = {
  W: {
    name: 'JCBカード W',
    fee: '年会費 永年無料',
    color: 'green',
    badge: 'ポイント特化型',
    specs: {
      '年会費': '永年無料',
      '申込対象': '18〜39歳（40歳以降も継続可）',
      'ポイント付与': '200円 → 2ポイント（通常の2倍）',
      '海外旅行保険': '最高2,000万円',
      'ショッピング保険': '海外最高100万円',
    }
  },
  S: {
    name: 'JCBカード S',
    fee: '年会費 永年無料',
    color: 'blue',
    badge: '優待充実型',
    specs: {
      '年会費': '永年無料',
      '申込対象': '18歳以上（年齢上限なし）',
      '主な特典': 'クラブオフ優待（国内外20万ヵ所以上）',
      '海外旅行保険': '最高2,000万円',
      'スマホ保険': '年間最高3万円',
    }
  },
  gold: {
    name: 'JCBゴールド',
    fee: '年会費 11,000円（税込）初年度無料',
    color: 'gold',
    badge: 'トラベル充実型',
    specs: {
      '年会費': '11,000円（税込）※初年度無料',
      '申込対象': '20歳以上（学生不可）',
      '海外旅行保険': '最高1億円',
      '国内旅行保険': '最高5,000万円',
      '空港ラウンジ': '国内主要空港＋ハワイ 無料',
      'クレカ積立還元': '最大1.0%',
    }
  },
  platinum: {
    name: 'JCBプラチナ',
    fee: '年会費 27,500円（税込）',
    color: 'platinum',
    badge: 'プレミアム体験型',
    specs: {
      '年会費': '27,500円（税込）',
      '申込対象': '20歳以上（学生不可）',
      'グルメ特典': '2名以上で1名分無料（グルメ・ベネフィット）',
      '海外旅行保険': '最高1億円',
      '空港ラウンジ': 'プライオリティ・パス（世界1,800ヵ所以上）',
      'コンシェルジュ': '24時間365日専用デスク',
    }
  }
};

function getAnswers() {
  const get = n => { const e = document.querySelector(`input[name="${n}"]:checked`); return e ? e.value : null; };
  return { fee: get('fee'), age: get('age'), travel: get('travel'), food: get('food'), points: get('points') };
}

function diagnose({ fee, age, travel, food, points }) {
  if (fee === 'free') {
    if (age === 'under40') return {
      card: 'W',
      reasons: [
        { title: 'ポイントが通常の2倍たまる', desc: '200円につき2ポイント付与。同じ年会費無料カードの中で最高クラスの還元率です。' },
        { title: '年会費は永年無料', desc: '39歳以下で入会すれば40歳以降もずっと無料で使い続けられます。' },
        { title: '日常の買い物がとにかくお得', desc: 'コンビニやAmazon.co.jp、スターバックスなど優待店ではポイント最大21倍（還元率10.5%）。' },
        { title: '海外旅行保険も付帯', desc: '無料カードながら最高2,000万円の海外旅行傷害保険が付きます。' },
      ]
    };
    return {
      card: 'S',
      reasons: [
        { title: '年会費無料・年齢制限なし', desc: '18歳以上なら誰でも申込OK。40歳以上でも安心して使えるスタンダードカードです。' },
        { title: '国内外20万ヵ所以上の優待', desc: '映画、グルメ、温泉、レジャーなど幅広い施設を最大80%OFFで利用可能（クラブオフ）。' },
        { title: '家族カードも永年無料', desc: '家族も同じ優待と保険が使えて、ポイントも合算できます。' },
        { title: 'スマホ保険付き', desc: '年間最高3万円のスマートフォン保険が付帯。無料カードでの付帯は珍しい特典です。' },
      ]
    };
  }

  // 有料可
  if (food === 'gourmet') return {
    card: 'platinum',
    reasons: [
      { title: 'グルメ・ベネフィット（2名で1名分無料）', desc: '国内の厳選レストランでコースを2名以上で利用すると1名分が無料に。記念日や接待に最高。' },
      { title: 'プライオリティ・パスで世界中の空港ラウンジへ', desc: '世界146ヵ国・1,800ヵ所以上の空港ラウンジを追加料金なしで利用できます。' },
      { title: '24時間コンシェルジュサービス', desc: 'レストラン予約から旅行手配まで、専任スタッフが365日24時間対応してくれます。' },
      { title: 'ラグジュアリーホテル特典', desc: '世界4,000軒以上のホテルを優待価格で予約可能。年20,000円分のホテルクーポンも付与。' },
      { title: 'JCBザ・クラスへの招待チャンス', desc: '利用実績次第で完全招待制の最上位カード「JCBザ・クラス」への招待対象になります。' },
    ]
  };

  if (travel === 'overseas' || travel === 'domestic') return {
    card: 'gold',
    reasons: [
      { title: '旅行傷害保険が大幅アップ', desc: travel === 'overseas'
        ? '海外最高1億円・国内最高5,000万円の旅行傷害保険付き。海外での万一の事態も安心です。'
        : '国内最高5,000万円の旅行傷害保険付き。国内旅行でも充実した補償が受けられます。' },
      { title: '空港ラウンジが無料で使える', desc: '国内主要空港＋ハワイ ホノルル空港のラウンジを本会員・家族会員ともに無料利用できます。' },
      { title: 'クレカ積立でポイント還元率アップ', desc: '積立投資にも使えてポイント還元率最大1.0%。ゴールド以上のカードで適用される特典です。' },
      { title: 'ゴールドザ・プレミアへの招待', desc: '2年連続100万円以上利用でプライオリティ・パス付きの上位カードに無条件で招待されます。' },
      { title: '初年度年会費無料', desc: 'オンライン入会なら初年度11,000円が無料。まずお試しで体験できます。' },
    ]
  };

  if (age === 'under40' && points === 'yes') return {
    card: 'W',
    reasons: [
      { title: 'ポイント還元率が最強クラス', desc: '200円につき2ポイント付与。優待店では最大21倍（還元率10.5%）。日常使いで圧倒的にお得。' },
      { title: '年会費無料でコスト0', desc: '有料でもOKな余裕があるなら、その分ポイントに活用するのが賢い選択です。' },
      { title: '普段使いで最大の効果を発揮', desc: 'セブン-イレブン・Amazon.co.jp・スターバックスなど身近なお店でポイント最大21倍に。' },
      { title: 'クレカ積立でさらにお得', desc: '積立投資にも対応。月5万円以上のショッピング利用で還元率最大0.5%に。' },
    ]
  };

  return {
    card: 'S',
    reasons: [
      { title: '国内外20万ヵ所以上の優待サービス', desc: '映画、カラオケ、温泉、グルメなど幅広いジャンルの施設を最大80%OFFで利用できます。' },
      { title: '年会費永年無料でリスクゼロ', desc: '旅行より日常での使いやすさを重視するなら、維持費のかからないカードSがベスト。' },
      { title: '家族カードも永年無料', desc: '家族も同じ優待と保険が使えて、ポイントも本会員と合算。家族まとめてお得に。' },
      { title: '年齢制限なし・長く使えるカード', desc: '18歳以上なら何歳でも申込可能。ライフステージが変わっても使い続けられる安心感。' },
    ]
  };
}

function showResult() {
  const ans = getAnswers();
  const result = diagnose(ans);
  const card = cards[result.card];

  const specsHTML = Object.entries(card.specs).map(([k, v]) =>
    `<div class="points-row"><span class="points-key">${k}</span><span class="points-val">${v}</span></div>`
  ).join('');

  const reasonsHTML = result.reasons.map(r =>
    `<li class="reason-item">
      <div class="reason-text">
        <strong>${r.title}</strong>
        <span>${r.desc}</span>
      </div>
    </li>`
  ).join('');

  document.getElementById('cardResult').innerHTML = `
    <div class="card-result-header ${card.color}">
      <div class="card-badge">${card.badge}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-fee">${card.fee}</div>
    </div>
    <div class="card-result-body">
      <div class="reason-title">おすすめの理由</div>
      <ul class="reasons">${reasonsHTML}</ul>
      <div class="card-points">${specsHTML}</div>
    </div>
  `;

  const allCards = [
    { key: 'W', color: 'green', label: 'JCBカード W', note: '年会費無料・ポイント2倍（39歳以下限定）' },
    { key: 'S', color: 'blue', label: 'JCBカード S', note: '年会費無料・クラブオフ優待（年齢不問）' },
    { key: 'gold', color: 'gold', label: 'JCBゴールド', note: '旅行保険1億円・空港ラウンジ' },
    { key: 'platinum', color: 'platinum', label: 'JCBプラチナ', note: 'グルメ・コンシェルジュ・プライオリティパス' },
  ];
  document.getElementById('otherList').innerHTML = allCards
    .filter(c => c.key !== result.card)
    .map(c => `
      <div class="other-item">
        <div class="other-dot ${c.color}"></div>
        <span class="other-card-name">${c.label}</span>
        <span class="other-card-note">${c.note}</span>
      </div>`)
    .join('');

  const section = document.getElementById('resultSection');
  section.style.display = 'block';
  setTimeout(() => section.classList.add('visible'), 10);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetDiagnosis() {
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.question-card').forEach(c => c.classList.remove('answered'));
  document.getElementById('diagnoseBtn').disabled = true;
  document.getElementById('cta-hint').style.display = '';
  document.getElementById('unansweredCount').textContent = '5';
  const section = document.getElementById('resultSection');
  section.classList.remove('visible');
  section.style.display = 'none';
  updateDots();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDots() {
  const names = ['fee', 'age', 'travel', 'food', 'points'];
  let answered = 0;
  names.forEach((name, i) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    const dot = document.getElementById(`dot${i + 1}`);
    if (checked) { dot.classList.add('filled'); answered++; }
    else { dot.classList.remove('filled'); }
  });
  document.getElementById('progressText').textContent = `${answered} / 5 回答済み`;
  document.getElementById('unansweredCount').textContent = 5 - answered;
  const btn = document.getElementById('diagnoseBtn');
  btn.disabled = answered < 5;
  document.getElementById('cta-hint').style.display = answered === 5 ? 'none' : '';
}

document.querySelectorAll('.option').forEach(label => {
  label.addEventListener('click', function() {
    const radio = this.querySelector('input[type="radio"]');
    const name = radio.name;
    document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
      r.closest('.option').classList.remove('selected');
    });
    this.classList.add('selected');
    radio.checked = true;
    const qnum = { fee:1, age:2, travel:3, food:4, points:5 }[name];
    document.getElementById(`qcard${qnum}`).classList.add('answered');
    updateDots();
  });
});
