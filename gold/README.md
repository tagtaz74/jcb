# JCBゴールド 獲得LP リニューアル モック

ローカルで `index.html` をブラウザで開くと表示できます。

## フォルダ構成
- `index.html` … ページ本体。セクションごとにコメントで区切っています
- `css/style.css` … スタイル。色・フォント・幅は冒頭の `:root` 変数で一括管理
- `js/config.js` … シミュレーターの計算係数、30秒診断の設問と結果、券面一覧
- `js/main.js` … 動作（ドロワー、タブ、カルーセル、診断、シミュレーター、申込（券面選択）
- `images/cards/` … 券面画像（5種）
- `images/scenes/` … ダミー画像枠の差し替え先（空）

## 画像の差し替え
ダミー画像枠（斜線の枠）は、`index.html` 内の `<img src="images/scenes/xxx.jpg">` と同じファイル名で
`images/scenes/` に画像を置くと、自動で表示されます。
使用中のファイル名：scene_dining.jpg / scene_lounge.jpg / scene_point.jpg / cp_disney.jpg /
partner_logos.png / perk_cluboff.jpg / perk_trouble.jpg / perk_phone.jpg / perk_shopping.jpg /
perk_delay.jpg / family.jpg

## モック動作
- 申込ボタンは `config.js` の `mockNoTransition: true` の間は遷移しません

## 注意
- シミュレーターの係数は現行LPの掲載数値をもとにした仮の値です（JCB様監修前）
- ［提案メモ］と赤字で書かれた箇所は提案時の補足で、本番には載せません
