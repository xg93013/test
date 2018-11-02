const routers = [
    {
        path: '/main',
        meta: {
            title: '主页'
        },
        alias: '/',
        component: (resolve) => require(['./views/index.vue'], resolve),
        children : [{
            path:"work-table-menu",
            component: (resolve) => require(['./views/work-table-menu/work-table-menu.vue'], resolve)
        },{
            path:"account-manage-menu",
            component: (resolve) => require(['./views/account-manage-menu/account-manage-menu.vue'], resolve)
        },{
            path:"application",
            component: (resolve) => require(['./views/application/application.vue'], resolve)
        },{
            path:"resource-dir-menu",
            component: (resolve) => require(['./views/resource-dir-menu/resource-dir-menu'], resolve)
        }]
    },
    {
        path: '/login',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    }
];
export default routers;