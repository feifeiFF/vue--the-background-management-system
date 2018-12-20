// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
//  将公共的less文件引入入口文件，需要加载 less-loader 等
import '@/assets/base.less'
import 'element-ui/lib/theme-chalk/index.css'
// 关闭生产环境的提示
Vue.config.productionTip = false
// 使用element-ui
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
