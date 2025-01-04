# Project Folder Structure 專案資料夾結構

## Root Directory 根目錄
```
shop_admin/
├── .vscode/                    # VS Code 設定
├── public/                     # 靜態資源
├── src/                        # 源碼目錄
├── tests/                      # 測試檔案
├── .gitignore                 # Git 忽略檔案
├── .eslintrc.js              # ESLint 設定
├── .prettierrc               # Prettier 設定
├── index.html                # 入口 HTML
├── package.json              # 專案配置
├── vite.config.js            # Vite 設定
└── README.md                 # 專案說明
```

## Source Directory 源碼目錄
```
src/
├── assets/                    # 靜態資源
│   ├── images/               # 圖片
│   ├── styles/               # 樣式
│   │   ├── variables.scss    # SCSS 變數
│   │   └── main.scss        # 主要樣式
│   └── icons/                # SVG 圖示
│
├── components/               # 共用元件
│   ├── base/                # 基礎元件
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseCard.vue
│   ├── layout/              # 布局元件
│   │   ├── TheHeader.vue
│   │   ├── TheSidebar.vue
│   │   └── TheFooter.vue
│   └── common/              # 通用元件
│       ├── TaskList.vue
│       ├── StatusBadge.vue
│       └── FilterPanel.vue
│
├── composables/              # 可重用的組合式函數
│   ├── useAuth.js
│   ├── useTask.js
│   └── useInventory.js
│
├── constants/               # 常數定義
│   ├── roles.js
│   ├── status.js
│   └── config.js
│
├── layouts/                 # 頁面布局
│   ├── DefaultLayout.vue
│   └── EmptyLayout.vue
│
├── mock/                    # 模擬資料
│   ├── data/               # 初始資料
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── inventory.js
│   └── api/                # API 模擬
│       ├── order.js
│       ├── inventory.js
│       └── task.js
│
├── modules/                 # 功能模組
│   ├── order/              # 訂單模組
│   │   ├── components/     # 模組專用元件
│   │   ├── composables/    # 模組專用組合式函數
│   │   └── views/          # 模組頁面
│   ├── inventory/          # 庫存模組
│   ├── procurement/        # 採購模組
│   └── task/              # 任務模組
│
├── router/                 # 路由配置
│   ├── index.js
│   └── routes/
│       ├── order.js
│       ├── inventory.js
│       └── procurement.js
│
├── stores/                 # Pinia 狀態管理
│   ├── modules/
│   │   ├── user.js
│   │   ├── order.js
│   │   └── inventory.js
│   └── index.js
│
├── utils/                  # 工具函數
│   ├── format.js
│   ├── validate.js
│   └── helper.js
│
└── views/                  # 頁面元件
    ├── dashboard/
    ├── order/
    ├── inventory/
    └── procurement/
```

## Module Structure 模組結構
以訂單模組為例：
```
modules/order/
├── components/             # 模組專用元件
│   ├── OrderList.vue
│   ├── OrderDetail.vue
│   └── OrderForm.vue
│
├── composables/           # 模組專用組合式函數
│   ├── useOrderList.js
│   ├── useOrderDetail.js
│   └── useOrderForm.js
│
└── views/               # 模組頁面
    ├── OrderListView.vue
    ├── OrderDetailView.vue
    └── OrderCreateView.vue
```

## Style Guide 風格指南

### 檔案命名規則
- Vue 元件: PascalCase (例: `OrderList.vue`)
- JavaScript 檔案: camelCase (例: `useOrderList.js`)
- 樣式檔案: kebab-case (例: `order-list.scss`)
- 常數檔案: camelCase (例: `orderStatus.js`)

### 目錄命名規則
- 全部使用 kebab-case
- 模組目錄使用單數形式
- 元件目錄使用複數形式

### 匯入順序
```javascript
// 1. Vue 相關
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. 元件匯入
import BaseButton from '@/components/base/BaseButton.vue'
import OrderList from './components/OrderList.vue'

// 3. 組合式函數
import { useOrderList } from './composables/useOrderList'

// 4. 常數和工具函數
import { ORDER_STATUS } from '@/constants'
import { formatDate } from '@/utils'
```

## 特別說明

### 1. 模組化設計
- 每個功能模組都是獨立的，包含自己的元件、組合式函數
- 模組間通過 Pinia store 進行狀態共享
- 共用元件放在根級的 `components` 目錄

### 2. 狀態管理
- 全域狀態放在根級的 `stores` 目錄
- 模組狀態放在 `stores/modules` 目錄
- 使用 Pinia 的組合式 API 風格

### 3. 路由管理
- 路由配置按模組拆分
- 使用路由懶加載優化首次載入速度
- 實作路由守衛處理權限控制

### 4. 模擬資料
- 初始資料放在 `mock/data` 目錄
- API 模擬放在 `mock/api` 目錄

---
*Note: This folder structure specification will be updated as development progresses.*
*備註：此資料夾結構說明將隨著開發進度更新。* 