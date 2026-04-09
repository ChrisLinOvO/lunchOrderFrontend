# EZCON 午餐訂購系統後台

午餐訂購系統的後台管理介面，基於 React + Alita (阿里飛冰) 构建。

## 功能

- 午餐訂購管理
- 訂單狀態追蹤
- 付款狀態查詢
- 即時通知

## 環境準備

```bash
# 安裝依賴
npm install --legacy-peer-deps

# 啟動開發環境
npm start

# 執行測試
npm test

# 建置生產版本
npm run build
```

## 技術棧

| 套件 | 版本 | 用途 |
|------|------|------|
| React | 17.0.2 | UI 框架 |
| @alifd/next | 1.21.0-beta.4 | 阿里飛冰元件庫 |
| axios | 1.6.0 | HTTP 客戶端 |
| socket.io-client | 4.7.0 | 即時通訊 |
| sweetalert2 | 11.10.0 | 提示框 |

## 部署

已設定 GitHub Actions 自動部署，合并到 master 分支後自動觸發。

## 開發

本專案使用 `react-app-rewired` 擴展 CRA 配置。

```bash
# 新增依賴
npm install <package> --legacy-peer-deps

# 更新依賴
npm update --legacy-peer-deps
```

## 授權

ISC
