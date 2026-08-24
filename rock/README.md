# 礦石工坊 / Procedural Gem Studio

一個可直接部署到 GitHub Pages 的手機友善 3D 程序生成礦石網頁。

## 使用

最簡單的方法：

1. 建立 GitHub repository。
2. 把 `index.html`、`style.css`、`app.js` 放進 repository 根目錄。
3. GitHub → Settings → Pages。
4. Source 選 `Deploy from a branch`。
5. 選 `main` / `root`。
6. 等待 GitHub Pages 發布。
7. 用手機開啟 GitHub Pages 網址。

本專案使用 Three.js CDN，因此瀏覽器需要網路連線。

## 功能

- 程序生成 10 種礦石風格
- 3D 旋轉
- 手機觸控拖曳、雙指縮放
- PBR 光澤、透明、金屬材質
- 隨機晶體、內含物、閃光
- PNG 匯出
- 完全前端，沒有後端

## 注意

不同手機的 WebGL 效能不同。如果舊手機掉幀，可在 `app.js` 把：

`Math.min(devicePixelRatio, 2)`

改成：

`Math.min(devicePixelRatio, 1.5)`
