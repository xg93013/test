import * as types from './mutation-types'

export default {
	[types.SET_USER] (state, { loginUser }) {
		state.loginUser = loginUser
	},
	[types.SET_LIST] (state, newsList) {
		console.log(newsList)
		state.newsList = newsList
	}
}
