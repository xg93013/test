import Vue from 'vue';
import iView from 'iview';
import Vuex from 'vuex';
import _ from 'lodash';
import VueRouter from 'vue-router';
import router from './router/router';
import { communicationService, utilService, modalService } from '@/libs/uBase';
// import uBase from './libs/uBase';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import 'babel-polyfill';

import Icon from 'vue-svg-icon/Icon.vue'
// import wtm from "./views/work-table-menu/work-table-menu.vue";
// import amm from "./views/account-manage-menu/account-manage-menu.vue";
// import app from "./views/application/application.vue";
// import rdm from "./views/resource-dir-menu/resource-dir-menu.vue";

// var routerView = {
//     'work-table-menu' : wtm,
//     'account-manage-menu' : amm,
//     'application' : app,
//     'resource-dir-menu' : rdm
// }

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Vuex);
Vue.component('icon', Icon);
//const RouterConfig = {
//          mode: 'history',
//          routes: Routers
//      };
//
//      const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start();
	let hash = to.name;
	let userRights = JSON.parse(sessionStorage.getItem("szlUserRights"));
	if(!userRights&&hash!="login") {
		next("/");
		return false;
	} else {
		if((hash == "workTableMenu" && !userRights.work_table_menu) || (hash == "resourceDirMenu" && !userRights.resource_dir_menu) || (hash == "appliCation" && !userRights.application) || (hash == "accountManageMenu" && !userRights.account_manage_menu)) {
			next("/error");
			return false;
		}
		// Util.title(to.meta.title);
		next();
	}

});

router.afterEach((to, from, next) => {
	iView.LoadingBar.finish();
	window.scrollTo(0, 0);
});
const store = new Vuex.Store({
	state: {
		routerSpinShow: false
	},
	mutations: {
		changeRouterSpinShow (state, bool) {
			state.routerSpinShow = bool;
		}
	}
})
new Vue({
	el: '#app',
	router: router,
	render: h => h(App),
	created: function() {
		// getPermisson(this);
		// this.$router.push({
		//     path: '/main/work-table-menu'
		// });
		utilService.setMainVM(this);
	},
	store : store
});

// (function init(vm) {
//     utilService.getRolePermisson(function(menuList){
//         new Vue({
//             el: '#app',
//             router: router,
//             render: h => h(App),
//             created : function () {
//                 // getPermisson(this);

//             }
//         });

//         vm.$router.push({
//             path: '/main/' + menuList[1].code.replace(/[_]/g, "-")
//         });
//     });
// }());

// (function login () {
//     communicationService.post(utilService.getResourceUrl("/login"), {username:"admin",password:"123"},function (results) {
//         console.log(results);
//         getPermisson(this);
//     },function (results) {

//     });
// }());
// document.getElementById("mainTitle");