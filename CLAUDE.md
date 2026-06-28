# CLAUDE.md — JCB Landing Page Mocks

## Repository Overview

This repository contains four independent Japanese-language marketing landing page mocks for JCB (Japan Credit Bureau) financial products. All pages are static HTML/CSS/JS with no build toolchain or external dependencies beyond Google Fonts.

## Module Structure

```
jcb/
├── card_w/             # JCBカード W — conversion-focused LP (age 18–39)
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
├── card_w_awareness/   # JCBカード W — awareness/recognition-stage LP
│   ├── index.html
│   ├── css/style.css
│   └── images/
├── omatome/            # Card comparison & recommendation tool (お申し込みまとめ)
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
└── faith/              # JCB Card Loan FAITH — card loan product LP
    ├── index.html
    ├── css/style.css
    └── images/
```

Each module is fully self-contained. There are no shared files or symlinks between modules.

## Technology Stack

- **HTML**: Semantic HTML5, `lang="ja"`, UTF-8 encoding
- **CSS**: Vanilla CSS with CSS custom properties (design tokens) in `:root`; no preprocessors
- **JavaScript**: Vanilla ES6+, no frameworks, no package manager, no bundler
- **Fonts**: Google Fonts via CDN — `Noto Sans JP` (Japanese body text), plus module-specific display fonts
- **Images**: Stored locally in each module's `images/` directory (PNG, JPEG, WebP, GIF, SVG)

## Design Tokens (CSS Custom Properties)

Defined in `:root` inside each module's `style.css`. Core JCB brand values:

```css
--jcb-blue: #003087      /* JCB primary brand blue */
--jcb-blue-mid: #0046b5
--jcb-blue-light: #e8f0ff
--jcb-electric: #3d78f8
--jcb-red: #e8001d       /* JCB red accent */
--jcb-green: #00a651
--gold: #c9a84c          /* Gold card tier */
```

Always use these variables rather than hardcoded hex values when working inside the design system.

## Page Architecture Conventions

### Section pattern
Each section follows this structure:
```html
<section class="<name>-section" id="<anchor>">
  <div class="section-inner">
    <div class="section-header">
      <span class="section-label-tag">ラベル</span>
      <h2 class="section-h2">見出し<em>強調部分</em></h2>
      <p class="section-desc">説明文</p>
    </div>
    <!-- content -->
  </div>
</section>
```

- `<em>` is styled as normal weight with color/gradient emphasis (not italic)
- Section IDs match the hamburger drawer nav anchor links
- `.section-inner` constrains content width (typically 960px or 1200px max-width)

### Navigation
All modules use a fixed header with a hamburger drawer for mobile:
- Top bar: JCB logo, hides on scroll
- Nav bar: product name + hamburger button (`#hamburger`, `#nav-drawer`, `#nav-overlay`)
- Drawer closes on overlay click and on anchor link click

### Scroll reveal
Elements with class `.reveal` animate in via `IntersectionObserver` (threshold 0.1). The observer adds `.visible` to trigger CSS transitions. Staggered children use `setTimeout` with 80ms increments.

### Footnotes (`card_w` only)
`js/main.js` includes an IIFE that:
1. Walks `.fn-link` elements in DOM order to assign sequential ※N numbers
2. Bidirectionally links body references ↔ footnote list items
3. Highlights the target on click (adds/removes `.fn-highlight` / `.fn-ref-highlight`)
4. Appends unreferenced footnotes after `#common-notes-insert`

When adding new footnotes: add `<a href="#fnN" class="fn-link">※N</a>` in body and `<li id="fnN">` in `.footnotes-list`. The script renumbers automatically.

## Module-Specific Notes

### `card_w`
- Target audience: 18–39 years old
- Sections (by anchor): `#features`, `#reasons`, `#simulation`, `#flow`, `#campaign`, `#other-campaign`, `#spec`, `#comparison`, `#faq`, `#apply`
- JS features: footnote system, spec tab switching (`switchSpec()`), tsumitate accordion (`toggleTsumitate()`), FAQ accordion (`toggleFaq()`), scroll parallax on hero card, sticky CTA after 500px scroll
- Apply URL map: `entry.jcb.co.jp/input_basic?cardtype=<w|plusl>&number=<0|1>` (0 = numberless, 1 = numbered)

### `card_w_awareness`
- Awareness/upper-funnel variant of `card_w`; simpler page, no JS file
- Uses `DM Sans` display font alongside `Noto Sans JP`
- Has a second-view branching section (`#section-2nd`) with 3 user state paths

### `omatome`
- Card recommendation/comparison tool covering: W, W Plus L, S, Gold, Gold Disney, Platinum, Platinum Mikage, and limited-design variants
- JS (`main.js`) contains full card data as `const cards = {...}` object; update card specs here
- Features: 6-question card diagnosis quiz, infinite-scroll card marquee in hero, card comparison table, campaign section
- GAS (Google Apps Script) integration was removed (commit `8aae0f3`) for security reasons — do not re-add

### `faith`
- JCB Card Loan product (カードローン FAITH)
- Has an inline borrowing simulator: income dropdown + other-loan dropdown → estimated limit
- Includes a `p.mock-disclaimer` banner marking it as a design mock, not production
- Step images: `images/step_01.png` through `step_04.png`

## Responsive Design

All modules are mobile-first. Common breakpoints:
- `@media (min-width: 600px)` — tablet adjustments
- `@media (min-width: 768px)` — tablet/desktop
- `@media (min-width: 1024px)` — desktop

Test both mobile (375px) and desktop (1280px) viewports when making layout changes.

## Commit Message Convention

Format: `<module>: <imperative description in Japanese>`

Examples from history:
```
omatome: 各セクションのリードコピー文言を修正
card_w: FAQアコーディオンのスタイルを修正
faith: ヒーローのh1フォントサイズをモバイルで調整
```

Use the module directory name as the prefix. Use Japanese for the description. Keep it under ~60 characters total.

## Development Workflow

No build step. Open `index.html` directly in a browser or use any static file server:

```bash
# Python one-liner from the module directory
python3 -m http.server 8080

# Or use any static server; there are no API calls or server-side requirements
```

Changes are immediately reflected on browser reload. No hot-reload tooling is configured.

## Image Conventions

- Card face images: `card_<variant>.png` or `.webp` (e.g. `card_w.png`, `card_pink.webp`)
- Partner/merchant logos: `logo_<brand>.<ext>`
- Flow step images: `step_0N.png`
- Scene illustrations: `scene_<context>.png` (used in `faith`)
- JCB logo: `JCB_logo.svg.png` (SVG rendered as PNG, present in every module)

Keep images in the module's own `images/` directory. Do not share assets across modules.

## What to Avoid

- Do not add build tools, npm, or bundlers — the project is intentionally dependency-free
- Do not add GAS (Google Apps Script) data-submission integrations (removed for security)
- Do not hardcode hex colors that already have CSS variable equivalents
- Do not use `!important` except to override third-party styles (there are none here)
- Do not create shared CSS/JS files between modules — each module is independent
