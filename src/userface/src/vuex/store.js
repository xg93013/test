import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	// 定义状态
	state: {
		loading: false,
		userMsg: {},//用户信息
		pages: [],//用户能访问的页面
		isFullScreen: false,//是否全屏
		mapJson: {}//地图信息
	},
	mutations: {
		changeLoading(state,msg){
			state.loading = msg;
		},
		getPages(state,msg){
			state.pages = msg;
		},
		getUserMsg(state,msg){
			state.userMsg = msg;
		},
		changeScreen(state,msg){
			state.isFullScreen = msg;
		},
		getMapJson(state,msg){
			state.mapJson = msg;
		}
	}
})

export default store