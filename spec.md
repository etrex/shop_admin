# System Specifications 系統規格說明

## Data Structure 資料結構

### Products (10 items) 商品（10項）
- Product attributes 商品屬性:
  - ID 商品編號
  - Name 商品名稱
  - Price 售價
  - Description 商品描述
  - Category 商品分類
  - SKU 商品料號
  - Minimum stock threshold 最低庫存警戒值
  - Images (mock URLs) 商品圖片（模擬網址）
  - Status (active/inactive) 商品狀態（啟用/停用）

### Stock Transactions 庫存交易紀錄
- Transaction types 交易類型:
  - Incoming (Purchase Order Receipt) 入庫（採購單收貨）
  - Outgoing (Sales Order Shipment) 出庫（銷售單出貨）
  - Transfer (Between Warehouses) 調撥（倉庫間轉移）
  - Adjustment (Inventory Count/Loss) 調整（盤點/損耗）
- Transaction attributes 交易屬性:
  - Transaction ID 交易編號
  - Date/Time 交易日期時間
  - Product ID 商品編號
  - From Warehouse ID 來源倉庫編號（出庫/調撥來源，入庫時為空）
  - To Warehouse ID 目標倉庫編號（入庫/調撥目標，出庫時為空）
  - Quantity 數量
  - Transaction Type 交易類型
  - Reference Document (PO/SO/Transfer/Adjustment) 參考單據（採購單/銷售單/調撥單/調整單）
  - Unit Price 單價
  - Notes 備註

### Stock Calculation 庫存計算
- Physical Stock Calculation 實體庫存計算:
  - Calculated per warehouse 每個倉庫個別計算:
    - Based on actual stock transactions 基於實際庫存交易:
      - Total incoming receipts 實際入庫數量
      - Minus total outgoing shipments 減去實際出庫數量
      - Adjusted by transfer records 調整實際調撥數量
  - System maintains separate physical counts for each warehouse 系統維護每個倉庫的獨立實體庫存
  - Physical inventory reports by location 依據位置的實體庫存報表
  - Used for 用於:
    - Warehouse management 倉庫管理
    - Physical inventory counts 實體盤點
    - Space planning 空間規劃

- Book Inventory Calculation 帳面庫存計算:
  - Based on documents 基於單據計算:
    - Purchase orders (incoming) 採購單（進貨）
    - Sales orders (outgoing) 銷售單（銷貨）
  - Calculated across all warehouses 跨倉庫總計:
    - Total ordered quantity from suppliers 供應商總訂購數量
    - Minus total quantity in sales orders 減去銷售單總數量
  - Used for 用於:
    - Order acceptance decisions 訂單接受決策
    - Sales availability 銷售可用性
    - Procurement planning 採購規劃

### Warehouses (2 locations) 倉庫（2個地點）
- Warehouse attributes 倉庫屬性:
  - ID 倉庫編號
  - Name 倉庫名稱
  - Location 位置
  - Capacity 容量
  - Current stock level 目前庫存水平
  - Staff assigned 指派員工

### Suppliers (4 vendors) 供應商（4個廠商）
- Supplier attributes 供應商屬性:
  - ID 供應商編號
  - Name 供應商名稱
  - Contact information 聯絡資訊
  - Supply products (3 products each) 供應商品（每家3項）
  - Lead time 前置時間
  - Minimum order quantity 最小訂購量
  - Price per unit 單位價格
- Product-Supplier relationships 商品供應商關係:
  - Some products have multiple suppliers 部分商品有多個供應商
  - Each supplier provides 3 products 每個供應商提供3項商品
  - Total of 12 supplier-product relationships 共12個供應商-商品關係

## Business Rules 業務規則

### Inventory Strategy 庫存策略
- Just-In-Time (JIT) Procurement 即時採購:
  - Default strategy: Order after customer order received 預設策略：收到客戶訂單後才採購
  - Next-day delivery from suppliers 供應商隔天到貨
  - Minimum inventory maintained 維持最低庫存
- Box-Unit Purchase Strategy 箱單位採購策略:
  - Products packed and shipped in boxes of 6 商品以6件為一箱包裝運送
  - Shipping cost optimization 運費優化:
    - Lower shipping cost per unit for full box orders 整箱訂購單件運費較低
    - Higher shipping cost for incomplete box 非整箱訂購運費較高
  - Purchase decision factors 採購決策因素:
    - Current stock level vs minimum threshold 目前庫存vs最低庫存
    - Sales volume of products 商品銷售量
    - Box completion opportunity 湊整箱機會
  - Strategic stock decisions 策略性庫存決策:
    - Add high-turnover items to complete box 選擇高銷售量商品湊整箱
    - Maintain minimum stock levels 維持最低庫存水平
    - Balance between shipping cost and inventory cost 平衡運費和庫存成本

### Product Categories by Procurement Type 依採購類型的商品分類
1. JIT Products (7 items) 即時採購商品（7項）:
   - Order placed after customer purchase 客戶購買後才下單
   - Minimal storage costs 最小存儲成本
   - Lower inventory risk 較低庫存風險
2. High-Turnover Products (3 items) 高週轉商品（3項）:
   - Frequently used for box completion 常用於湊整箱
   - Minimum stock level maintained 維持最低庫存水平
   - Good candidates for box-unit purchase 適合箱單位採購

## Workflow Processes 工作流程

### 1. Order Processing Flow 訂單處理流程
1. Customer Order Creation 客戶訂單建立
   - Customer places order 客戶下單
   - Customer selects payment method 客戶選擇付款方式:
     - Online payment 線上付款
     - Cash on delivery (COD) 貨到付款
   - Initial order status: Pending CS Confirmation 初始訂單狀態：待客服確認

2. Customer Service Verification 客服確認
   - CS staff reviews order details 客服人員審查訂單細節
   - Stock availability verification 庫存可用性確認:
     - Check book inventory 檢查帳面庫存
     - Check incoming stock 檢查進貨狀況
     - Check alternative suppliers if needed 必要時檢查替代供應商
     - Make procurement decisions if needed 必要時做採購決策
   - Customer contact if necessary 必要時聯繫客戶:
     - Stock availability issues 庫存問題
     - Delivery time estimation 預估到貨時間
     - Special requests 特殊要求
     - Delivery concerns 配送問題
   - Order confirmation/rejection decision 訂單確認/拒絕決定

3. Payment Processing 付款處理
   - For Online Payment 線上付款:
     - Payment link sent after CS confirmation 客服確認後發送付款連結
     - Order confirmed after payment received 收到付款後確認訂單
     - Payment status tracked 追蹤付款狀態
     - Order enters fulfillment queue only after payment received 僅在收到付款後才進入出貨隊列
   - For Cash on Delivery 貨到付款:
     - Order confirmed immediately after CS approval 客服核准後立即確認訂單
     - COD amount included in shipping label 貨到付款金額標註在配送單上
     - Payment collected by courier 由物流人員收款
     - Order enters fulfillment queue immediately 立即進入出貨隊列

4. Order Confirmation 訂單確認
   - System updates order status 系統更新訂單狀態
   - Confirmation notification sent 發送確認通知
   - Order enters procurement/fulfillment queue based on payment method 根據付款方式決定是否進入採購/履行隊列:
     - Online payment: After payment received 線上付款：收到付款後
     - COD: Immediately after confirmation 貨到付款：確認後立即

### 2. Daily Procurement Process 每日採購流程
1. Daily Order Aggregation (End of Day) 每日訂單彙總（日終）
   - System aggregates all orders 系統彙總所有訂單
   - Calculates total quantities needed 計算所需總數量
   - Considers existing stock levels 考慮現有庫存水平
   - Generates draft purchase orders by supplier 依供應商產生進貨單草稿:
     - JIT items automatically included 自動加入JIT商品
     - High-turnover items suggested 建議高週轉商品選項
     - Box unit completion opportunities highlighted 標示湊整箱機會
     - Available supplier discounts displayed 顯示可用供應商折扣

2. Management Review 管理審核
   - Manager reviews draft purchase orders 管理人員審核進貨單草稿
   - Decision making for high-turnover items 決定高週轉商品進貨:
     - Review current stock levels 檢視目前庫存
     - Evaluate box completion options 評估湊整箱選項
     - Consider sales trends 考慮銷售趨勢
     - Review available supplier discounts 檢視可用供應商折扣
   - Purchase order modification 修改進貨單:
     - Add/remove high-turnover items 新增/移除高週轉商品
     - Adjust quantities 調整數量
     - Optimize for box units 優化整箱訂購
     - Apply supplier discounts 套用供應商折扣
   - Final approval and confirmation 最終核准確認

3. Purchase Order Management 採購單管理
   - Finalized POs sent to suppliers 發送確認的採購單給供應商
   - Next-day delivery scheduling 安排隔日配送
   - Order tracking setup 設定訂單追蹤

### 3. Receiving Process 收貨流程
1. Inventory Receipt 收貨作業
   - Partial deliveries allowed and tracked 允許並追蹤部分到貨
   - Stock receipt registration 登記收貨
   - Quality check (mock process) 品質檢查（模擬流程）
   - Warehouse location assignment 指派倉庫位置

2. Stock Update 庫存更新
   - Update inventory levels 更新庫存水平
   - Match against purchase orders 對應採購單
   - Record partial deliveries 記錄部分到貨
   - Update order fulfillment status 更新訂單履行狀態

### 4. Shipping Process 出貨流程
1. Order Fulfillment 訂單履行
   - Partial shipment allowed 允許部分出貨
   - Priority based on order date 依訂單日期排序優先順序
   - Stock allocation by warehouse 依倉庫分配庫存

2. Document Generation 文件產生
   - Picking List Generation 揀貨單產生:
     - Product details 商品詳細資訊
     - Warehouse locations 倉庫位置
     - Quantities 數量
     - Placed inside shipping box 放置於出貨箱內
   - Shipping Label Creation 配送單產生:
     - Customer details 客戶資訊
     - Tracking number 追蹤號碼
     - Attached to box exterior 貼於箱外
     - Barcode for logistics 物流條碼

3. Logistics Handling 物流處理
   - Courier pickup schedule 物流取貨排程
   - Direct warehouse access 直接倉庫取貨
   - Pickup confirmation 取貨確認
   - Tracking update 追蹤更新

## Core Systems 核心系統

### Shopping Cart System 購物車系統
- Add/remove items 新增/移除商品
- Quantity adjustment 數量調整
- Price calculation 價格計算
- Cart persistence in local storage 購物車資料本地儲存

### Order Management 訂單管理
- Order Workflow Status 訂單工作流程狀態:
  - Pending CS Confirmation 待客服確認（客服審核節點）
  - Pending Payment (for online payment) 待付款（付款等待節點）
  - Confirmed 已確認（訂單確認節點，線上付款完成或貨到付款審核通過）
  - Processing 處理中（採購/出貨處理節點）
  - Shipped 已出貨（出貨完成節點）
  - Delivered 已送達（送達完成節點）
  - Payment Collected (for COD) 已收款（貨到付款收款完成節點）
  - Cancelled 已取消（訂單取消節點）

- Order details 訂單詳細資訊:
  - Order ID 訂單編號
  - Customer information 客戶資訊
  - Payment method 付款方式
  - Payment status 付款狀態
  - CS confirmation status 客服確認狀態
  - CS notes 客服備註
  - Customer communication log 客戶溝通記錄
  - Shipping details 配送詳細資訊

- Order Items Status 訂單品項狀態:
  - Each item tracks its own status 每個品項獨立追蹤狀態:
    - Pending Procurement 待採購（等待加入進貨單）
    - In Procurement 採購中（已加入進貨單）
    - Received 已到貨（已完成入庫）
    - Shipped 已出貨（已完成出庫）
  - Item status attributes 品項狀態屬性:
    - Product ID 商品編號
    - Ordered quantity 訂購數量
    - Purchase order reference 進貨單參考（關聯到特定進貨單）
    - Shipping reference 出貨單參考（關聯到特定出貨單）
    - Warehouse location 倉庫位置（入庫後的存放位置）

- Document References 單據參考:
  - Generated based on item status 根據品項狀態產生:
    - Picking list 揀貨單（根據待出貨品項產生）
    - Shipping label 配送單（根據待出貨品項產生）

### Inventory Management 庫存管理
- Real-time stock calculation 即時庫存計算
- Transaction history tracking 交易歷史追蹤
- Stock transfer records 庫存調撥紀錄
- Stock adjustment records 庫存調整紀錄
- Inventory reports 庫存報表:
  - Stock movement history 庫存異動歷史
  - Transaction analysis 交易分析
  - Warehouse distribution 倉庫分布
- Stock type tracking 庫存類型追蹤:
  - JIT items monitoring JIT商品監控
  - Stocked items monitoring 備貨商品監控
  - Reorder point calculations 再訂購點計算
  - Bulk purchase optimization 大量採購最佳化
- Order allocation tracking 訂單分配追蹤
- Picking list management 揀貨單管理
- Location tracking for efficient picking 高效揀貨的位置追蹤

### Procurement Management 採購管理
- Purchase order creation 採購單建立
- Supplier selection 供應商選擇
- Order quantity calculation 訂購數量計算
- Delivery scheduling 配送排程
- Cost tracking 成本追蹤
- Supply chain visibility 供應鏈可視性
- Procurement type management 採購類型管理:
  - JIT order processing JIT訂單處理
  - Bulk order processing 大量訂單處理
  - Supplier discount tracking 供應商折扣追蹤
  - Order bundling for better prices 訂單組合以獲得更好價格

### Warehouse Operations 倉庫作業
- Receiving operations 收貨作業:
  - Partial delivery processing 部分到貨處理
  - Purchase order matching 採購單對應
  - Location assignment 位置分配
- Storage management 儲存管理
- Picking operations 揀貨作業:
  - Picking list generation 揀貨單產生
  - Partial pick handling 部分揀貨處理
  - Box packing instructions 裝箱指示
- Shipping operations 出貨作業:
  - Shipping label generation 配送單產生
  - Courier coordination 物流協調
  - Pickup scheduling 取貨排程
- Stock counts 庫存盤點
- Space utilization tracking 空間使用追蹤

### Customer Service System 客服系統
- Order review interface 訂單審核介面
- Stock verification tools 庫存驗證工具
- Customer communication tools 客戶溝通工具:
  - Contact history 聯絡歷史
  - Communication templates 溝通範本
  - Note taking 記錄備註
- Order approval/rejection tools 訂單核准/拒絕工具
- Payment status monitoring 付款狀態監控
- Stock availability checking 庫存可用性檢查:
  - Current stock levels 目前庫存水平
  - Incoming deliveries 進貨狀況
  - Alternative supplier options 替代供應商選項

## Mock Data Specifications 模擬資料規格

### Products 商品
- 10 products with varied 10種不同的商品:
  - Categories (Electronics, Clothing, Accessories) 分類（電子產品、服飾、配件）
  - Price ranges (¥1,000 - ¥50,000) 價格範圍
  - Stock levels 庫存水平
  - Supplier relationships 供應商關係
  - Procurement types 採購類型:
    - 7 JIT products 7項即時採購商品
    - 3 stocked products with bulk discounts 3項有大量採購折扣的備貨商品

### Stock Distribution 庫存分配
- Warehouse A: 60% of total inventory A倉庫：總庫存的60%
  - Primary storage for stocked items 備貨商品主要存放
  - Temporary storage for JIT items JIT商品暫存
- Warehouse B: 40% of total inventory B倉庫：總庫存的40%
  - Secondary storage for stocked items 備貨商品次要存放
  - Processing center for JIT orders JIT訂單處理中心

### Supplier Distribution 供應商分配
- Supplier A: Products 1, 2, 3 (2 JIT, 1 stocked) 供應商A：商品1、2、3（2項JIT，1項備貨）
- Supplier B: Products 4, 5, 6 (2 JIT, 1 stocked) 供應商B：商品4、5、6（2項JIT，1項備貨）
- Supplier C: Products 7, 8, 9 (2 JIT, 1 stocked) 供應商C：商品7、8、9（2項JIT，1項備貨）
- Supplier D: Products 3, 6, 10 (Cross-supply for high-demand items) 供應商D：商品3、6、10（高需求商品的交叉供應）

### Supplier Policies 供應商政策
- Next-day delivery guarantee 隔日到貨保證
- Box unit pricing 整箱價格:
  - Standard price for incomplete box 非整箱標準價格
  - Lower price per unit for full box 整箱單價較低
- Purchase discounts 進貨折扣:
  - Volume-based discounts 數量折扣
  - Seasonal promotions 季節性促銷
  - Bundle deals 組合優惠
- Regular supply schedule for stocked items 備貨商品定期供應排程
- On-demand delivery for JIT items JIT商品依需求供應

## System States 系統狀態
All data will be maintained in frontend state management with 所有資料將在前端狀態管理中維護:
- Initial state loaded from mock data 從模擬資料載入初始狀態
- State persistence in local storage 狀態保存在本地儲存
- State reset capability for demo purposes 可重置狀態以供展示
- Role-specific state views 角色專屬狀態視圖

## Demo Scenarios 展示情境
1. Customer Purchase Flow 客戶購買流程
2. Order Fulfillment Process 訂單履行流程
3. Inventory Replenishment 庫存補充
4. Warehouse Transfer 倉庫調撥
5. Supplier Order Management 供應商訂單管理

---
*Note: This specification will be updated as new requirements are added to the project.* 
*備註：此規格說明將隨著新需求的增加而更新。* 