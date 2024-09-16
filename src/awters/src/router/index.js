import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    linkExactActiveClass:"active",
    routes: [
        {
            path: '/',
            name: 'main',
            component: (resolve) => require(['../views/main'], resolve),
            redirect:{
                path: "/situation"
            },
            children : [{
                    path: '/situation',
                    name: 'situation',
                    component: (resolve) => require(['../views/situation/situation'], resolve),
                },
                {
                    path: '/sensory',
                    name: 'sensory',
                    component: (resolve) => require(['../views/sensory/sensory.vue'], resolve),
                },
                {
                    path: '/sensory_sub',
                    name: 'sensory_sub',
                    component: (resolve) => require(['../views/sensory/sensory_sub.vue'], resolve),
                },
                {
                    path: '/tendency',
                    name: 'tendency',
                    component: (resolve) => require(['../views/tendency/tendency.vue'], resolve),
                }
            ]
        }
    ]
})
