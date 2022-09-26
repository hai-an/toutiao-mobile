import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'/* 全局样式 */
import Vant from 'vant'/* vant移动端组件库引入 */
import 'vant/lib/index.css'/* vant全局样式引入 */
import 'amfe-flexible'/* 引入flex-rem自适应 */
import './utils/dayjs' /* 引入日期过滤器 */

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
