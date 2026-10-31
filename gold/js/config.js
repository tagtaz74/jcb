/* =========================================================
   JCBゴールド 獲得LP モック ― 設定データ
   数字・文言の修正はこのファイルだけで完結するようにしています。
   ※試算ロジックはJCB様監修前の仮です（現行LP掲載の数値をもとに設定）
   ========================================================= */

window.MOCK_CONFIG = {

  /* ---------- 基本 ---------- */
  annualFee: 11000,            // 年会費（税込）
  applyUrl: "https://entry.jcb.co.jp/input_basic",
  mockNoTransition: true,      // true: 申込ボタンで実際には遷移しない（モック用）

  /* ---------- モト取りシミュレーター ---------- */
  sim: {
    basePerYen: 200,           // 200円（税込）ごとに1ポイント
    pointYen: 1,               // 1ポイント＝最大1円分
    partnerRate: 0.035,        // J-POINTパートナー店の平均還元率（現行LPの利用例 1,795pt/5万円 から算出）
    // J-POINTボーナス：年間利用額に応じた累計ポイント
    bonusTable: [
      [500000, 1000], [1000000, 3000], [1500000, 5000],
      [2000000, 7000], [2500000, 9000], [3000000, 15000]
    ],
    bonusAfter: { step: 500000, pt: 2500 },  // 300万円以降は50万円ごとに2,500pt
    lounge: 1100,              // 空港ラウンジ1回あたりの換算額
    dining: 2500,              // スター・ダイニング：2名×25,000円コースの5％引き（1回あたり）
    hotelCoupon: 5000,         // HoteLuxクーポン1枚
    hotelCouponMax: 2,         // 年2枚まで
    tsumitate: { high: 0.01, low: 0.005, threshold: 50000 }, // クレカ積立の還元率と条件（積立以外の月間利用額）
    // 診断前に表示する標準値（診断に答えるとタイプ別の preset に切り替わる）
    defaultPreset: { daily: 50000, partner: 10000, flights: 1, dining: 1, hotel: 1, tsumitate: 0 },
    defaultBadge: "標準的な使い方の例で試算中",

    inputs: [
      { id: "daily",     label: "普段のお買い物",                 note: "スーパー・公共料金・通販など", unit: "円／月", min: 0, max: 300000, step: 5000 },
      { id: "partner",   label: "よく使うお店でのお支払い",       note: "Amazon・セブン-イレブン・スターバックスなど", unit: "円／月", min: 0, max: 100000, step: 1000 },
      { id: "flights",   label: "飛行機に乗る回数",               note: "国内主要空港・ホノルル", unit: "回／年", min: 0, max: 12, step: 1 },
      { id: "dining",    label: "記念日や特別な日の外食",         note: "2名で1人25,000円のコースを想定", unit: "回／年", min: 0, max: 6, step: 1 },
      { id: "hotel",     label: "ホテル・旅館に泊まる回数",       note: "JCBプレミアムステイプランで予約した場合（5,000円分のクーポンを1回1枚、年2枚まで）", unit: "回／年", min: 0, max: 2, step: 1 },  // クーポンが年2枚までなので上限2回
      { id: "tsumitate", label: "クレカ積立",                     note: "松井証券・SBI証券・マネックス証券", unit: "円／月", min: 0, max: 100000, step: 5000 }
    ]
  },

  /* ---------- 30秒診断 ---------- */
  questions: [
    {
      q: "休日は、どう過ごすことが多いですか？",
      options: [
        { text: "旅行やお出かけ", score: { travel: 2 } },
        { text: "外食や映画・イベント", score: { gourmet: 2 } },
        { text: "家でゆっくり、ネットで買い物", score: { point: 2 } }
      ]
    },
    {
      q: "飛行機に乗るのは、年に何回くらいですか？",
      options: [
        { text: "3回以上", score: { travel: 2 } },
        { text: "1〜2回", score: { travel: 1, gourmet: 1 } },
        { text: "ほとんど乗らない", score: { point: 1, gourmet: 1 } }
      ]
    },
    {
      q: "カードに一番期待することは？",
      options: [
        { text: "ポイントがたまること", score: { point: 2 } },
        { text: "特別な体験ができること", score: { gourmet: 2 } },
        { text: "旅先での安心", score: { travel: 2 } }
      ]
    }
  ],

  types: {
    travel: {
      name: "旅を上質に楽しむタイプ",
      lead: "移動や旅先での時間を、ゆとりあるものに変えられます。",
      perks: [
        { title: "空港ラウンジ無料", text: "国内主要空港とホノルルの空港ラウンジを、出発前にゆったり。" },
        { title: "ホテルクーポン年1万円分", text: "JCBプレミアムステイプランで使える5,000円分のクーポンを年2回。" },
        { title: "旅行傷害保険 最高1億円", text: "海外の事故やケガにも、しっかり備えられます。" }
      ],
      preset: { daily: 60000, partner: 15000, flights: 4, dining: 1, hotel: 2, tsumitate: 0 },
      anchor: "#features"
    },
    gourmet: {
      name: "食と体験を楽しむタイプ",
      lead: "特別な日の外食やエンタメが、もっと身近になります。",
      perks: [
        { title: "JCB スター・ダイニング by OMAKASE", text: "予約困難店やミシュランガイド掲載店を、会員優待で予約。" },
        { title: "JCB GOLD Service Club Off", text: "映画館やスポーツクラブなど、身近な場所で優待価格に。" },
        { title: "JCBプレミアムステイプラン", text: "世界4,000軒以上のホテルで、朝食や館内利用券の優待。" }
      ],
      preset: { daily: 50000, partner: 15000, flights: 1, dining: 3, hotel: 1, tsumitate: 0 },
      anchor: "#features"
    },
    point: {
      name: "ポイントでかしこく得するタイプ",
      lead: "いつもの支払いを、そのままポイントに変えていけます。",
      perks: [
        { title: "J-POINTパートナーで最大20倍", text: "Amazon・セブン-イレブン・スターバックスなどでポイントアップ。" },
        { title: "ゴールドだけのJ-POINTボーナス", text: "年間50万円のご利用ごとに、通常ポイントに上乗せ。" },
        { title: "クレカ積立で最大1.0%還元", text: "毎月の積立投資でも、ポイントがたまります。" }
      ],
      preset: { daily: 80000, partner: 30000, flights: 0, dining: 0, hotel: 0, tsumitate: 30000 },
      anchor: "#point"
    }
  },

  /* ---------- 券面デザイン ---------- */
  designs: [
    { id: "gold",     name: "通常デザイン",       img: "images/cards/card_gold.png",     vertical: false, limited: false },
    { id: "biomass",  name: "バイオマスデザイン", img: "images/cards/card_biomass.png",  vertical: false, limited: false },
    { id: "disney",   name: "ディズニー・デザイン", img: "images/cards/card_disney.png", vertical: false, limited: false },
    { id: "kirameki", name: "JCBゴールド -煌-",   img: "images/cards/card_kirameki.png", vertical: true,  limited: true },
    { id: "sakura",   name: "JCBゴールド -桜-",   img: "images/cards/card_sakura.png",   vertical: true,  limited: true }
  ]
};
