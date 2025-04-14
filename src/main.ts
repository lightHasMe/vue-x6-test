import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh-CN', // 默认语言
  messages: {
    'zh-CN': {
      hello: '你好'
    },
    'en-US': {
      hello: 'Hello'
    }
  }
})

const app = createApp(App)

app.use(i18n)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
