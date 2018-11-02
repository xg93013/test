import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const login = r => require.ensure([], () => r(require('../views/login')), 'login')///登录页
const main = r => require.ensure([], () => r(require('../views/index')), 'main')///主页
const workTableMenu = r => require.ensure([], () => r(require('../views/work-table-menu/work-table-menu')), 'workTableMenu')///工作表
const resourceDirMenu = r => require.ensure([], () => r(require('../views/resource-dir-menu/resource-dir-menu')), 'resourceDirMenu')///资源目录
const appliCation = r => require.ensure([], () => r(require('../views/application/application')), 'appliCation')///数据应用
const accountManageMenu = r => require.ensure([], () => r(require('../views/account-manage-menu/account-manage-menu')), 'accountManageMenu')///账户管理
const errorPage = r => require.ensure([], () => r(require('../views/error')), 'errorPage')///错误页面
export default new Router({
	routes: [{
		path: '/',
		name: 'login',
		component: login
	},{
		path: '/main',
		name: 'main',
		component: main,
		alias: '/',
		children: [{
			path: 'work-table-menu',
			name: 'workTableMenu',
			component: workTableMenu
		},{
			path: 'resource-dir-menu',
			name: 'resourceDirMenu',
			component: resourceDirMenu
		},{
			path: 'application',
			name: 'appliCation',
			component: appliCation
		},{
			path: 'account-manage-menu',
			name: 'accountManageMenu',
			component: accountManageMenu
		}]
	},{
		path: '*',///不存在的页面链接
		name: 'errorPage',
		component: errorPage
	}]
})
