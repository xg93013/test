import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/utils'

Vue.use(Router)
// vue路由异步加载
let router =  new Router({
	routes: [{
		path: '/',
		name: 'home',
		component: resolve => require(['../views/Home'], resolve),
		redirect: { path: '/home/index' },
		// 配置了scrollToTop为true，点击这个路由，页面会滚到顶部
		// 如果没配置scrollToTop或配置scrollToTop为false，点击这个路由，页面保持原先的滚动位置
		// 效果说明：点击这个路由后，滚动页面隐藏顶部的一部分，再点击路由：/promisedemo,页面保持原先的滚动位置;再点击这个路由,页面会滚动到顶部，因为配置了scrollToTop为true
		meta: {
			scrollToTop: true
		},
		children: [
			{
				path: '/home/echart',
				name: 'echart',
				component: resolve => require(['../views/pages/echart'], resolve),
				meta: {
					login_require: false
				}
			},
			{
				path: '/home/index',
				name: 'index',
				component: resolve => require(['../views/pages/index'], resolve),
				meta: {
					login_require: false
				}
			},
			{
				path: '/home/amap',
				name: 'amap',
				component: resolve => require(['../views/pages/amap'], resolve)
			},
			{
				path: '/home/excel',
				name: 'excel',
				component: resolve => require(['../views/pages/excelToJson'], resolve),
				meta: {
					login_require: true
				}
			},
			{
				path: '/home/es6',
				name: 'es6',
				component: resolve => require(['../views/pages/es6'], resolve)
			}
		]
	},{
		path: '/login',
		name: 'login', 
		component: resolve => require(['../views/login/login'], resolve)
	}
	]
})

// 路由守卫
router.beforeEach((to, from, next) => {
	// console.log(item.meta.login_require)
	console.log(getStorage)
	if (to.matched.some(function (item) {
		return item.meta.login_require
	})) {
		next('/login')
	} else 
		next()
})

export default router