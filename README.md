# 腹膜透析知識技術學習成效評估系統 (PD Tech Assessment)

這是一個基於 React + Vite 開發的網頁應用程式，旨在協助評估腹膜透析的學習成效。系統透過 Google Sheets 作為後端資料庫，利用 Google Apps Script (GAS) 處理題目獲取與成績記錄。

## 🚀 快速開始

### 1. 安裝依賴
在專案根目錄執行以下指令以安裝所需套件：

```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```
啟動後，請在瀏覽器打開顯示的網址 (通常是 `http://localhost:5173`)。

---

## 🛠️ 後端設置指南 (Google Sheets + GAS)

本系統不需要傳統後端伺服器 (Node.js/Python)，而是直接使用 Google 試算表作為資料庫。請依照以下步驟完成設置。

### 第一步：建立 Google Sheets (資料庫)

1. 前往 [Google Sheets](https://sheets.google.com) 建立一個新的試算表。
2. 將試算表命名為 `PD學習評估資料庫` (或是您喜歡的名稱)。
3. **建立兩個工作表 (Tabs)**，名稱必須完全準確：
   - 第一個工作表命名為：**`題目`**
   - 第二個工作表命名為：**`回答`**

#### 「題目」工作表欄位設定
請在第一列設定以下標題 (順序很重要)：

| 欄位 | 標題 (Header) | 說明 | 範例資料 |
| :---: | :--- | :--- | :--- |
| **A** | **ID** | 題號 (唯一識別碼) | `1` |
| **B** | **Question** | 題目敘述 | `腹膜透析時發現引流液混濁，該怎麼辦？` |
| **C** | **A** | 選項 A 的內容 | `立即停止操作並聯絡醫院` |
| **D** | **B** | 選項 B 的內容 | `繼續觀察下一次` |
| **E** | **C** | 選項 C 的內容 | `吃止痛藥` |
| **F** | **D** | 選項 D 的內容 | `多喝水` |
| **G** | **E** | 選項 E 的內容 | `去睡覺` |
| **H** | **Answer** | 正確答案 (填入 A-E) | `A` |
| **I** | **ImgUrl** | (選填) 題目背景圖片網址 | `https://example.com/pd-setup.jpg` |
| **J** | **Explanation** | (選填) 題目詳解/解析 | `混濁可能代表腹膜炎，應立即處理...` |

#### 「回答」工作表欄位設定
請在第一列設定以下標題：

| 欄位 (A) | 欄位 (B) | 欄位 (C) | 欄位 (D) | 欄位 (E) | 欄位 (F) | 欄位 (G) | 欄位 (H) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **姓名** | **時間** | **總分** | **第一題** | **第二題** | **第三題** | **第四題** | **第五題** |
| 使用者姓名 | 自動記錄 | 答對題數 | 答對留白<br>答錯填題目 | 答對留白<br>答錯填題目 | 答對留白<br>答錯填題目 | 答對留白<br>答錯填題目 | 答對留白<br>答錯填題目 |

---

### 第二步：設定 Google Apps Script (後端邏輯)

1. 在剛建立的 Google Sheet 中，點擊上方選單的 **「擴充功能 (Extensions)」** > **「Apps Script」**。
2. 進入 Script 編輯器後，將預設的 `function myFunction() {...}` 刪除。
3. 打開本專案中的 `google-apps-script.js` 檔案，複製 **全部內容**。
4. 將複製的程式碼貼上到 Script 編輯器中。
5. 點擊上方的磁碟片圖示 **「儲存」** (或按 `Cmd/Ctrl + S`)。

---

### 第三步：部署為 Web 應用程式

這是最關鍵的一步，讓前端網頁可以連接到試算表。

1. 在 Script 編輯器右上角，點擊藍色的 **「部署 (Deploy)」** 按鈕 > 選擇 **「新增部署 (New deployment)」**。
2. 在左側齒輪圖示旁選擇 **「網頁應用程式 (Web app)」**。
3. 填寫設定：
   - **說明 (Description)**: `PD Assessment API v1` (可隨意填)
   - **執行身分 (Execute as)**: **`我 (Me)`** (這很重要，代表用您的權限存取試算表)
   - **誰可以存取 (Who has access)**: **`所有使用者 (Anyone)`** <br>⚠️ **注意**：一定要選「所有使用者」，否則前端無法存取。
4. 點擊 **「部署 (Deploy)」**。
5. 第一次部署時，Google 會要求授權：
   - 點擊「授權存取」。
   - 選擇您的 Google 帳號。
   - 如果出現「Google 尚未驗證這個應用程式」的警示視窗：
     - 點擊左下角的 **「進階 (Advanced)」**。
     - 點擊最下方的 **「前往... (不安全) (Go to ... (unsafe))」**。
   - 點擊 **「允許 (Allow)」**。
6. 部署成功後，會看到一個 **「網頁應用程式網址 (Web app URL)」** (以 `https://script.google.com/...` 開頭)。
7. **複製這個網址**。

---

### 第四步：連接前端與後端

1. 回到本專案的程式碼資料夾。
2. 找到 `.env` 檔案。
3. 將您剛才複製的網址貼上到 `VITE_GOOGLE_APP_SCRIPT_URL` 欄位：

```env
# .env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/您的部署ID/exec
VITE_QUESTION_COUNT=5
```

4. 重啟開發伺服器 (`Ctrl + C` 停止，再 `npm run dev`)。
5. 現在您的網頁應該可以從 Google Sheets 撈取題目並將成績寫回去了！

## 📋 專案結構

```
src/
├── components/      # React 元件 (首頁、測驗頁、結果頁)
├── lib/            # API 連接邏輯
├── App.tsx         # 主程式入口
├── index.css       # 全域樣式設定
└── types.ts        # TypeScript 型別定義
google-apps-script.js # Google Apps Script 原始碼 (僅供複製用)
```

## 🌐 自動部署到 GitHub Pages

本專案已設定好 GitHub Actions，只要將程式碼推送到 GitHub，即會自動部署。

### 設定步驟

1. **將專案上傳至 GitHub**。
2. **設定 Secrets (環境變數)**：
   - 進入 GitHub Repository 的 **Settings** > **Secrets and variables** > **Actions**。
   - 點擊 **New repository secret**。
   - **Name**: `VITE_GOOGLE_APP_SCRIPT_URL`
   - **Secret**: 貼上您的 Google Apps Script 網頁應用程式網址。
   - (選填) 若想調整題數，可新增 Variable (非 Secret)：Name 為 `VITE_QUESTION_COUNT`，Value 為數字。

3. **開啟 GitHub Pages**：
   - 進入 GitHub Repository 的 **Settings** > **Pages**。
   - 在 **Build and deployment** 區塊：
   - **Source**: 選擇 `GitHub Actions` (不用選分支)。

4. **觸發部署**：
   - 每次 `push` 到 `main` 分支時，Actions 就會自動開始建置並部署。
   - 部署完成後，您可以在 Settings > Pages 頁面看到網址。
