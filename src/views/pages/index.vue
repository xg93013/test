<template>
	<div>
		<div @click="login">登录</div>
		<div @click="getUser">获取用户</div>
	</div>
</template>

<script>
	import { mapMutations, mapGetters } from 'vuex'
	import { setStorage } from '@/utils'
	export default {
		name: 'HelloWorld',
		data() {
			return {
				msg: ''
			}
		},
		computed: {
			...mapGetters(['loginUser'])
		},
		methods: {
			...mapMutations(['SET_USER']),
			login () {
				this.SET_USER({
					loginUser: {
						userName: 'xg',
						userPwd: '123456'
					}
				})
				let loginUser = {
					userName: 'xg',
					userPwd: '123456'
				}
				// console.log(loginUser instanceof Object)
				setStorage(loginUser, loginUser)
			},
			getUser () {
				console.log(this.loginUser.userName)
			}
		}
	}
</script>

<style>
</style>