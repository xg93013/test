// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'iview/dist/styles/iview.css';
import './style/public.scss'
import App from './App'
import router from './router'
import iView from 'iview'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import _ from 'lodash'
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(iView) 
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
