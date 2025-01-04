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
        
        <el-form-item label="姓名" prop="customer.name">
          <el-input v-model="form.customer.name" placeholder="請輸入姓名" />
        </el-form-item>
        
        <el-form-item label="電話" prop="customer.phone">
          <el-input v-model="form.customer.phone" placeholder="請輸入電話" />
        </el-form-item>
        
        <el-form-item label="地址" prop="customer.address">
          <el-input v-model="form.customer.address" placeholder="請輸入地址" />
        </el-form-item>
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
                    :label="item.name"
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
import { ref, reactive } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 模擬商品數據
const products = ref([
  { id: 1, name: '商品A', price: 1000, stock: 100 },
  { id: 2, name: '商品B', price: 2000, stock: 50 },
  { id: 3, name: '商品C', price: 3000, stock: 30 },
])

const formRef = ref(null)
const submitting = ref(false)

// 表單數據
const form = reactive({
  customer: {
    name: '',
    phone: '',
    address: ''
  },
  products: [
    {
      id: '',
      quantity: 1,
      price: 0,
      subtotal: 0
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
  'customer.name': [
    { required: true, message: '請輸入姓名', trigger: 'blur' }
  ],
  'customer.phone': [
    { required: true, message: '請輸入電話', trigger: 'blur' }
  ],
  'customer.address': [
    { required: true, message: '請輸入地址', trigger: 'blur' }
  ],
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
    subtotal: 0
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
    
    // TODO: 實作訂單提交 API
    console.log('訂單資料：', form)
    
    ElMessage.success('訂單提交成功')
    // TODO: 導向訂單列表或訂單詳情頁
  } catch (error) {
    console.error('表單驗證失敗：', error)
    ElMessage.error('請檢查表單填寫是否正確')
  } finally {
    submitting.value = false
  }
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