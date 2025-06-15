# 北歐神話靈修 - 解惑之路

## LIFF 設定

### 環境變數設定
1. 創建 `.env` 檔案在專案根目錄
2. 加入以下內容：
```bash
# LIFF 設定
REACT_APP_LIFF_ID=2006502425-NnaLozOm
REACT_APP_ENV=development
```

### LIFF ID 取得方式
1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 選擇或建立您的 Channel
3. 在 LIFF 頁面建立新的 LIFF App
4. 複製 LIFF ID（格式：1234567890-abcdefgh）
5. 將 LIFF ID 貼到 `.env` 檔案中

### 常見問題排除

#### LIFF 發送訊息失敗的可能原因：
1. **LIFF 未初始化**
   - 確認 LIFF ID 正確設定
   - 檢查 console 是否有初始化錯誤

2. **不在 LINE 應用內**
   - 必須在 LINE 應用內開啟網頁
   - 無法在外部瀏覽器發送訊息到聊天室

3. **用戶未登入**
   - 確認用戶已授權 LINE 登入
   - 可使用偵錯器的登入功能

4. **權限設定錯誤**
   - 檢查 LIFF App 的 Scope 設定
   - 確認有 `chat_message.write` 權限

### 偵錯功能
- 開發模式下會顯示 LIFF 偵錯器
- 可即時查看 LIFF 狀態
- 提供測試功能按鈕

## 開發環境執行
```bash
npm run dev
```

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/alps40411/runa)