
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'


import 'normalize.css'
// import './assets/styles/global.scss'

createApp(App).use(router).use(createPinia()).mount('#app')
