# 魔法師的學徒｜AGENTS.md 課堂作業

一個可以依固定規則持續新增內容的繁體中文塔羅學習網站。以既有 App 的獨立快照為基礎，加入 AI 協作規則、內容範本、共用產生器與兩篇學習單元。

> 這是獨立作業，沒有修改或覆蓋原 App 的程式、頁面與正式部署。原 App 網址不是這份作業新網站的部署證明。

## 作業核心

| 要求 | 對應成果 |
| --- | --- |
| 決定自己的小專案 | 以觀察、聯想、筆記為核心的塔羅學習網站 |
| 建立 AI 規則 | [AGENTS.md](AGENTS.md)：目的、結構、風格、資料格式、修改邊界、驗證及發布 |
| 依規則完成網頁 | [作業入口](dist/assignment.html)、兩篇產生式文章與 78 張牌 App 快照 |
| 能持續製作內容 | [JSON 範本](templates/lesson.json)＋[共用產生器](scripts/build-lessons.mjs) |
| GitHub 與公開網站 | 以實際發布完成後的連結為準，見下方發布狀態 |

## 發布狀態

- GitHub：尚未發布，等待確認使用帳號。
- 作業網站：[公開作業入口](https://tarot-learning-agents-homework.vercel.app/assignment.html)。使用獨立 Vercel 專案，已發布。
- 作業入口：`/assignment.html`；App：`/index.html`；規則網頁：`/project-rules.html`。

## 本機執行

需要 Node.js 18 以上，無需安裝套件。

```sh
npm run build
npm run check
npm start
```

開啟 <http://127.0.0.1:4174/assignment.html>。若 4174 已被其他程式佔用，可在 PowerShell 使用：

```powershell
$env:PORT=4175
npm start
```

再開啟 <http://127.0.0.1:4174/assignment.html>。

## 新增下一篇，只需要一份內容資料

1. 先讓 AI 讀 `AGENTS.md`。
2. 複製 `templates/lesson.json` 為 `content/lessons/observe-the-magician.json`。
3. 填寫標題、摘要、程度、分鐘數、牌卡 ID、三個章節與練習。
4. 執行 `npm run build`，自動產生文章及入口卡片。
5. 執行 `npm run check`，開啟頁面驗證，提交內容來源與產生結果。

不要直接編輯 `dist/lessons/*.html` 或 `dist/assignment.html`，下次建置會覆蓋這些檔案。共用版型改 `scripts/build-lessons.mjs`，文章樣式改 `dist/course.css`。

## 作業網站包含什麼

- **先看圖，再讀牌**：把圖像觀察與個人解讀分開。
- **用一張牌寫學習筆記**：用固定的觀察、聯想、行動格式練習。
- **原 App 的獨立快照**：78 張牌、牌義搜尋、卡池切換、單張／三張抽牌、收藏與本機筆記。
- **規則網頁**：由根目錄的 `AGENTS.md` 自動產生，方便直接展示作業。

文章屬於原創教學練習，不宣稱能預知結果。App 的筆記只儲存在瀏覽器，不含登入或雲端同步。

## 發布方式

完整儲存庫包含來源、規則、模板與產物；公開網站只需發布 `dist/`。本作業不攜帶原 App 的 `.vercel` 連結。

GitHub Pages 可選擇 Actions，執行建置與檢查後部署 `dist/`；或在另一個靜態網站平台建立獨立專案，發布同一資料夾。所有頁面使用相對路徑，支援 GitHub Pages 子路徑。

## 素材與授權紀錄

App 的 78 張牌圖沿用既有專案快照；原畫作者 Pamela Colman Smith。小牌逐張來源保存在 [docs/minor-card-sources.json](docs/minor-card-sources.json)。詳細區分原創內容、沿用內容與來源完整性，見 [docs/SOURCES.md](docs/SOURCES.md)。沒有替未確認的第三方素材宣告新的授權。

## 交作業時展示

先展示 `AGENTS.md`，再展示文章 JSON 和網站，說明「修改一份資料 → 套用同一模板 → 自動新增入口」的流程。可直接參考 [作業說明](docs/SUBMISSION.md)。
