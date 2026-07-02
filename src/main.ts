import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/element-glass.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'
import './assets/styles/reveal.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
