// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'lodash'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/reset.scss'
// 自定义指v-reclick
import vueReclick from 'vue-reclick'
Vue.use(vueReclick)

Vue.use(ElementUI)

Vue.config.productionTip = false

var getChildrenTextContent = function(children) {
    return children.map(function(node) {
        return node.children ?
            getChildrenTextContent(node.children) :
            node.text
    }).join('')
}
Vue.component('anchored-heading', {
    render: function(createElement) {
        // create kebabCase id
        var headingId = getChildrenTextContent(this.$slots.default)
            .toLowerCase()
            .replace(/\W+/g, '-')
            .replace(/(^\-|\-$)/g, '')
        return createElement('h' + this.level, [createElement('a', {
            attrs: {
                name: headingId,
                href: '#' + headingId
            }
        }, this.$slots.default)])
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})