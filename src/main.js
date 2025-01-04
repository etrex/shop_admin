import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import router from './router'
import App from './App.vue'

// Styles
import 'element-plus/dist/index.css'
import './assets/styles/main.scss'

const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app') 