# 療癒記帳本：拆分版

這個版本已將原本單一 HTML 檔案拆成較清楚的靜態網頁專案結構。

## 檔案結構

```text
healing-budget-split/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  └─ js/
│     ├─ config.js
│     ├─ utils.js
│     ├─ theme.js
│     ├─ categories.js
│     ├─ records.js
│     ├─ compare.js
│     └─ app.js
```

## 各檔案用途

- `index.html`：保留頁面 HTML 結構，改為引用外部 CSS 與 JS。
- `assets/css/styles.css`：原本 `<style>` 內的全部樣式。
- `assets/js/config.js`：主題設定、預設分類、圖示清單與全域狀態。
- `assets/js/utils.js`：通用工具函式，例如金額格式、月份文字、HTML escape、toast。
- `assets/js/theme.js`：主題切換、貼紙圖案、版面位置與按鈕樣式。
- `assets/js/categories.js`：分類管理、新增、刪除、排序、儲存。
- `assets/js/records.js`：記帳資料新增、刪除、月份切換、localStorage 存取。
- `assets/js/compare.js`：月份／年度比較分析與比較頁渲染。
- `assets/js/app.js`：事件綁定與初始化流程。

## 使用方式

直接用瀏覽器開啟 `index.html` 即可使用。
