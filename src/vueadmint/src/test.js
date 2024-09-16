// The Vue build version to load with the `import` events
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/pub.scss'
import store from './vuex/store';
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(ElementUI)

router.beforeEach((to, from, next) => { ///用户页面权限控制
    if (to.name == "login") {
        next()
    } else {
        let pages = store.state.pages;
        if (pages.length) {
            if (!pages.includes(to.name)) {
                next("/error")
            } else {
                next()
            }
        } else {
            next()
        }
    }
})

new Vue({
    el: '#app',
    router,
    components: { App },
    store,
    template: '<App/>'
})