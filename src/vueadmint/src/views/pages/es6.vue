<template>
  <div id="es-box"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.mapDemo();
    this.concatenateAll();
    this.compileJS("templateStr");
    this.setDemo();
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
      let arr = [[1, "x"], [2, "y"], [3, "z"]];
      let map = new Map(arr);

      for (let key of map.keys()) {
        console.log(key);
      }

      for (let value of map.values()) {
        console.log(value);
      }

      for (let item of map.entries()) {
        console.log(item[0], item[1]);
      }
    },
    setDemo() {
      let outStr = "helloword";
      let setDemo = new Set();
      let arr = [1, 2, 3, 3, 5, 5, 5, 7];
      arr.forEach(x => setDemo.add(x));
      for (let i of setDemo) {
        console.log(i);
      }
      // 数组去重
      let outArr = [...setDemo];
      console.log(outArr);
      console.log(Math.max(...[14, 3, 77]));
      console.log([...outStr]);
    },
    concatenateAll(...args) {
      console.log(args.join(""));
    },
    compileJS(template) {
      const evalExpr = /<%=(.+?)%>/g;
      const expr = /<%([\s\S]+?)%>/g;

      template = template
        .replace(evalExpr, "`); \n  echo( $1 ); \n  echo(`")
        .replace(expr, "`); \n $1 \n  echo(`");

      template = "echo(`" + template + "`);";

      let script = `(function parse(data){
					    let output = "";

					    function echo(html){
					      output += html;
					    }

					    ${template}

					    return output;
					})`;

      //					return script;
      console.log(script);
    },
    // 对象合并
    objectMerge() {
      let source = {
        name: "a"
      };
      let target = {
        add: "b"
      };
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      // console.log(target);
      let target2 = (target, source) =>
        Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source)
        );
      console.log(target2);
    },
    obejctKeyValue() {
      let { keys, values, entries } = Object;
      let obj = {
        a: "1",
        b: "2"
      };
      for (let key of keys(obj)) {
        console.log(key);
      }
      for (let value of values(obj)) {
        console.log(value);
      }
      for (let [key, value] of entries(obj)) {
        console.log([key, value]);
      }
    },
    // set
    typeSet() {
      let setA = new Set();
      [2, 3, 4, 5, 6, 2, 3, 4, 2, 2, 9].forEach(item => setA.add(item));
      console.log(setA);
      // for (let item of setA) {
      //   console.log(item);
      // }
      let setB = new Set([2, 3, 4, 5, 6, 2, 3, 4, 2, 2, 9]);
      console.log(Array.from(setB));
    },
    typeMap() {
      let mapA = new Map();
      let a = { a: "a" };
      let b = { b: "b" };
      mapA.set(a, "content");
      mapA.set(b, "text");
      // console.log(mapA.get(a));
      for (let item of mapA.keys()) {
        console.log(item);
      }
      for (let item of mapA.values()) {
        console.log(item);
      }
      console.log(JSON.stringify([...mapA]));
    },
    numberFiniyte() {
      console.log(Number.isFinite(12));
    },
    jgValue() {
      let [a, ...b] = [3, 4, 5, 6, 7];
    }
  },
  mounted() {
    this.jgValue();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
