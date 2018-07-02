<template>
	<div id="es-box">

	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		created() {
			this.mapDemo()
			this.concatenateAll()
			this.compileJS('templateStr')
			this.setDemo()
		},
		methods: {
			mapDemo() {
				//				let map = new Map([
				//					[1, 'one'],
				//					[2, 'two'],
				//					[3, 'three'],
				//				]);
				//				let arr = [...map.keys()]; // [1, 2, 3]
				//				console.log(arr)
				let arr = [[1, 'x'], [2, 'y'], [3, 'z']]
				let map = new Map(arr);

				for(let key of map.keys()) {
					console.log(key);
				}

				for(let value of map.values()) {
					console.log(value);
				}

				for(let item of map.entries()) {
					console.log(item[0], item[1]);
				}
			},
			setDemo () {
				let outStr = 'helloword'
				let setDemo = new Set()
				let arr = [1, 2, 3, 3, 5, 5, 5, 7]
				arr.forEach(x => setDemo.add(x))
				for (let i of setDemo){
					console.log(i)
				}
				// 数组去重
				let outArr = [...setDemo]
				console.log(outArr)
				console.log(Math.max(...[14, 3, 77]))
				console.log([...outStr])
			},
			concatenateAll(...args) {
				console.log(args.join(''))
			},
			compileJS(template) {
					const evalExpr = /<%=(.+?)%>/g;
					const expr = /<%([\s\S]+?)%>/g;

					template = template
						.replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
						.replace(expr, '`); \n $1 \n  echo(`');

					template = 'echo(`' + template + '`);';

					let script =
					`(function parse(data){
					    let output = "";

					    function echo(html){
					      output += html;
					    }

					    ${ template }

					    return output;
					})`;

//					return script;
					console.log(script)
			}
		},
		mounted() {}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#es-box {}
</style>
