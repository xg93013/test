// The Vue build version to load with the `import` events
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/pub.scss'
import _ from 'lodash'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(iView)
Vue.use(ElementUI)

new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})