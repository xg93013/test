import Vue from "vue";
import Router from "vue-router";
import { getStorage } from "@/utils";

Vue.use(Router);
// vue路由异步加载
let router = new Router({
    mode: "history",
    routes: [{
        path: "/",
        name: "home",
        component: resolve => require(["../views/Home"], resolve),
        redirect: { path: "index" },
        // 配置了scrollToTop为true，点击这个路由，页面会滚到顶部
        // 如果没配置scrollToTop或配置scrollToTop为false，点击这个路由，页面保持原先的滚动位置
        // 效果说明：点击这个路由后，滚动页面隐藏顶部的一部分，再点击路由：/promisedemo,页面保持原先的滚动位置;再点击这个路由,页面会滚动到顶部，因为配置了scrollToTop为true
        meta: {
            scrollToTop: true
        },
        children: [{
            path: "echart",
            name: "echart",
            component: resolve => require(["../views/pages/echart"], resolve),
            meta: {
                login_require: false
            }
        }, {
            path: "empty",
            name: "empty",
            component: resolve => require(["../views/pages/empty"], resolve),
            meta: {
                login_require: false
            }
        }, {
            path: "index",
            name: "index",
            props: true,
            component: resolve => require(["../views/pages/index"], resolve),
            children: [{
                path: "comm",
                name: "comm",
                component: resolve => require(["../views/pages/comment/index"], resolve),
                meta: {
                    login_require: false
                }
            }],
            scrollToTop: false,
            meta: {
                login_require: false
            }
        },
        {
            path: "routers/:id",
            name: "routers",
            props: true,
            component: () => import(/* webpackChunkName: "group-foo" */ '../views/pages/routers'),
            meta: {
                login_require: false
            }
        },
        {
            path: "amap",
            name: "amap",
            component: resolve => require(["../views/pages/amap"], resolve)
        },
        {
            path: "excel",
            name: "excel",
            component: resolve =>
                require(["../views/pages/excelToJson"], resolve),
            meta: {
                login_require: false
            }
        },
        {
            path: "es6",
            name: "es6",
            component: resolve => require(["../views/pages/es6"], resolve)
        },
        {
            path: "warning",
            name: "warning",
            component: resolve => require(["../views/pages/warning"], resolve)
        },
        {
            path: "comment",
            name: "comment",
            component: resolve =>
                require(["../views/pages/comment/index"], resolve)
        }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: resolve => require(["../views/login/login"], resolve)
    }
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            // savedPosition is only available for popstate navigations.
            return savedPosition
          } else {
            const position = {}
        
            // scroll to anchor by returning the selector
            if (to.hash) {
              position.selector = to.hash
        
              // specify offset of the element
            //   if (to.hash === '#anchor2') {
            //     position.offset = { y: 100 }
            //   }
        
              if (document.querySelector(to.hash)) {
                return position
              }
        
              // if the returned position is falsy or an empty object,
              // will retain current scroll position.
              return false
            }
        
            return new Promise(resolve => {
              // check if any matched route config has meta that requires scrolling to top
              if (to.matched.some(m => m.meta.scrollToTop)) {
                // coords will be used if no selector is provided,
                // or if the selector didn't match any element.
                position.x = 0
                position.y = 0
              }
        
              // wait for the out transition to complete (if necessary)
              this.app.$root.$once('triggerScroll', () => {
                // if the resolved position is falsy or an empty object,
                // will retain current scroll position.
                resolve(position)
              })
            })
          }
    }
});

// 路由守卫
router.beforeEach((to, from, next) => {
    // console.log(item.meta.login_require)
    console.log(getStorage);
    console.log(to);
    if (
        to.matched.some(function (item) {
            console.log(to);
            return item.meta.login_require;
        })
    ) {
        next("/login");
    } else next();
});

export default router;