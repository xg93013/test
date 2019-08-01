import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const summary = r => require.ensure([], () => r(require('../view/summary')), 'summary')
const index = r => require.ensure([], () => r(require('../view/index')), 'index') ///首页
const home = r => require.ensure([], () => r(require('../view/home')), 'home')
const exportPage = r => require.ensure([], () => r(require('../view/export')), 'exportPage')

const error = r => require.ensure([], () => r(require('../view/error')), 'error') ///错误界面
export default new Router({
	routes: [{
		path: '/',
		name: 'index',
		redirect: "/summary",
		component: index,
		children: [{
			path: '/summary',
			name: 'summary',
			component: summary
		}, {
			path: '/home',
			name: 'home',
			component: home,
			meta: {
				keepAlive: true
			},
		}, {
			path: '/export',
			name: 'export',
			component: exportPage,
			meta: {
				keepAlive: true
			},
		}]
	}, {
		path: '*',
		name: 'error',
		component: error
	}]
})