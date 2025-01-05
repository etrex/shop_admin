<template>
  <div class="order-create">
    <div class="page-header">
      <h2>建立訂單</h2>
      <el-button type="primary" @click="submitOrder" :loading="submitting">
        提交訂單
      </el-button>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="order-form"
    >
      <!-- 客戶資訊 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>客戶資訊</span>
          </div>
        </template>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ customerInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="電話">{{ customerInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="地址" :span="2">{{ customerInfo.address }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 商品選擇 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>商品選擇</span>
            <el-button type="primary" link @click="addProduct">
              新增商品
            </el-button>
          </div>
        </template>

        <div 
          v-for="(product, index) in form.products" 
          :key="index"
          class="product-item"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item 
                :label="index === 0 ? '商品' : ''"
                :prop="'products.' + index + '.id'"
                :rules="rules.product"
              >
                <el-select 
                  v-model="product.id"
                  placeholder="請選擇商品"
                  @change="handleProductChange($event, index)"
                  class="w-100"
                >
                  <el-option
                    v-for="item in products"
                    :key="item.id"
                    :label="getProductLabel(item)"
                    :value="item.id"
                  >
                    <span>{{ item.name }}</span>
                    <span class="option-price">¥{{ item.price }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item 
                :label="index === 0 ? '數量' : ''"
                :prop="'products.' + index + '.quantity'"
                :rules="rules.quantity"
              >
                <el-input-number 
                  v-model="product.quantity"
                  :min="1"
                  :max="99"
                  @change="calculateTotal"
                  class="w-100"
                />
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item :label="index === 0 ? '小計' : ''">
                <el-input
                  v-model="product.subtotal"
                  readonly
                  class="w-100"
                >
                  <template #prefix>¥</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4" class="text-right">
              <el-button
                v-if="index !== 0"
                type="danger"
                circle
                @click="removeProduct(index)"
                class="mt-4"
              >
                <el-icon><delete /></el-icon>
              </el-button>
            </el-col>
          </el-row>
        </div>

        <div class="order-total">
          <span class="label">訂單總計：</span>
          <span class="amount">¥{{ form.total }}</span>
        </div>
      </el-card>

      <!-- 付款資訊 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span>付款資訊</span>
          </div>
        </template>

        <el-form-item label="付款方式" prop="payment.method">
          <el-radio-group v-model="form.payment.method">
            <el-radio label="online">線上付款</el-radio>
            <el-radio label="cod">貨到付款</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="備註">
          <el-input
            v-model="form.note"
            type="textarea"
            rows="3"
            placeholder="請輸入備註（選填）"
          />
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/modules/order'

const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()
const customerInfo = computed(() => userStore.userInfo.customerInfo)

// 模擬商品數據
const products = ref([
  { id: 1, name: '法國波爾多紅酒 2018', price: 2580, stock: 0, preorder: true },
  { id: 2, name: '意大利基安蒂紅酒 2019', price: 1980, stock: 0, preorder: true },
  { id: 3, name: '西班牙里奧哈紅酒 2017', price: 2180, stock: 0, preorder: true },
  { id: 4, name: '法國勃艮第白酒 2020', price: 2380, stock: 5, preorder: false },
  { id: 5, name: '意大利白葡萄酒 2021', price: 1680, stock: 0, preorder: true },
  { id: 6, name: '德國雷司令白酒 2020', price: 1880, stock: 0, preorder: true },
  { id: 7, name: '獺祭 純米大吟釀 45', price: 1580, stock: 3, preorder: false },
  { id: 8, name: '久保田 千寿', price: 1280, stock: 0, preorder: true },
  { id: 9, name: '出羽桜 純米大吟釀', price: 1480, stock: 0, preorder: true },
  { id: 10, name: '八海山 特別本醸造', price: 980, stock: 0, preorder: true }
])

const formRef = ref(null)
const submitting = ref(false)

// 表單數據
const form = reactive({
  customer: computed(() => ({
    name: customerInfo.value.name,
    phone: customerInfo.value.phone,
    address: customerInfo.value.address
  })),
  products: [
    {
      id: '',
      quantity: 1,
      price: 0,
      subtotal: 0,
      preorder: false
    }
  ],
  payment: {
    method: 'online'
  },
  note: '',
  total: 0
})

// 表單驗證規則
const rules = {
  product: [
    { required: true, message: '請選擇商品', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '請輸入數量', trigger: 'change' },
    { type: 'number', min: 1, message: '數量必須大於0', trigger: 'change' }
  ],
  'payment.method': [
    { required: true, message: '請選擇付款方式', trigger: 'change' }
  ]
}

// 處理商品選擇變更
const handleProductChange = (productId, index) => {
  const selectedProduct = products.value.find(p => p.id === productId)
  if (selectedProduct) {
    form.products[index].price = selectedProduct.price
    form.products[index].preorder = selectedProduct.preorder
    calculateSubtotal(index)
  }
}

// 計算小計
const calculateSubtotal = (index) => {
  const product = form.products[index]
  product.subtotal = product.price * product.quantity
  calculateTotal()
}

// 計算總計
const calculateTotal = () => {
  form.total = form.products.reduce((sum, product) => {
    return sum + (product.subtotal || 0)
  }, 0)
}

// 新增商品
const addProduct = () => {
  form.products.push({
    id: '',
    quantity: 1,
    price: 0,
    subtotal: 0,
    preorder: false
  })
}

// 移除商品
const removeProduct = (index) => {
  form.products.splice(index, 1)
  calculateTotal()
}

// 提交訂單
const submitOrder = async () => {
  if (!formRef.value) return
  
  try {
    submitting.value = true
    await formRef.value.validate()
    
    // 建立訂單
    const orderData = {
      customer: form.customer,
      products: form.products,
      payment: form.payment,
      note: form.note,
      total: form.total
    }
    
    const orderId = orderStore.createOrder(orderData)
    ElMessage.success('訂單提交成功')
    // 導向訂單列表頁面
    router.push({ name: 'order-list' })
  } catch (error) {
    console.error('表單驗證失敗：', error)
    ElMessage.error('請檢查表單填寫是否正確')
  } finally {
    submitting.value = false
  }
}

// 在商品選擇下拉選單中顯示預購標記
const getProductLabel = (product) => {
  return product.stock === 0 && product.preorder ? `${product.name} (預購)` : product.name
}
</script>

<style lang="scss" scoped>
.order-create {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .product-item {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-light);

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  .order-total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border-light);

    .label {
      font-size: 16px;
      margin-right: 12px;
    }

    .amount {
      font-size: 20px;
      font-weight: bold;
      color: var(--primary-color);
    }
  }

  .option-price {
    float: right;
    color: var(--text-secondary);
  }

  .text-right {
    text-align: right;
  }

  .w-100 {
    width: 100%;
  }

  .mt-4 {
    margin-top: 16px;
  }
}
</style> 