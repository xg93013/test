<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	export default {
		name: 'App',
		mounted(){}
	}
</script>

<style lang='scss'>
html,body{
	width: 100%;
	height: 100%;
}
html{
	// background: url(./images/backs.jpg) center no-repeat;
	background-size: cover;
}
#app{
	width: 100%;
	height: 100%;
}

</style>