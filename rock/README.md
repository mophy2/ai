# AI Mineral Studio

一個可直接部署到 GitHub Pages 的手機友善 3D 礦石生成器。

## 特點

- Three.js + WebGL
- PBR / MeshPhysicalMaterial
- Transmission 透明折射效果
- 程序生成六角柱晶體與晶簇
- 晶體數量、長度、粗細、生長方向、不規則度、透明度、顏色、光澤
- 內含物與裂紋開關
- 360°拖曳旋轉、雙指縮放
- GitHub Pages 可直接使用
- **沒有 `import ... from "three"` 的裸模組 specifier**
- Three.js 與 OrbitControls 都使用 CDN 的明確 URL，瀏覽器可直接解析

## GitHub Pages

1. 建立一個 GitHub repository。
2. 上傳 `index.html`、`styles.css`、`app.js`。
3. Repository → Settings → Pages。
4. Source 選 `Deploy from a branch`。
5. 選 `main` / `root`。
6. 等待 GitHub Pages 發布。

## 重要說明

目前的「AI」是前端程序生成器：每次生成都會產生不同的晶體排列、比例、姿態、內含物與裂紋。

如果下一階段要做到「照片級 AI 礦物」，可以在這個 3D viewer 上加：
- WebGPU / 更高品質 PBR
- HDRI studio lighting
- GPU instancing
- 真正的布林切割與晶體面控制
- Web Worker / WASM 生成
- 接圖像生成 API，將 3D 參數轉成照片級礦物標本圖
