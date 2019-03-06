import Mock from 'mockjs'
Mock.mock('/api/getUserInfo', {
    'list|1-100': [{
        'id|+1': 1,
        'name|+1': '123',
        'address+1': 'address1'
    }]
})
Mock.mock('/api/tables', {
    code: 0,
    'data|1-20': [{
        'key|+1': 1,
        'id|+1': 1,
        'name|+1': '成都大风炊餐饮管理有限责任公成都大风炊餐饮管理有限责任公成都大风炊餐都大风炊餐饮管理有限责任公',
        'num|+1': 20,
        'address|+1': '成都大风炊餐饮管理有限责任公司address1address1address1address1address1address1address1address1address1address1'
    }],
    'msg': '请求成功！'
})
Mock.mock('/api/menuData', {
    code: 0,
    data: [{
        key: 'sub1',
        titleIcon: 'setting',
        subValue: '类1',
        menuItem: [{
            key: '1',
            value: '/warning',
            label: 'warning'
        }, {
            key: '2',
            value: '/next',
            label: 'next'
        }]
    }, {
        key: 'sub2',
        titleIcon: 'setting',
        subValue: '类2',
        menuItem: [{
            key: '3',
            value: '/sub2',
            label: 'sub2'
        }, {
            key: '4',
            value: '/sub3',
            label: 'sub3'
        }]
    }, {
        key: 'sub24',
        titleIcon: 'setting',
        subValue: '类3',
        menuItem: [{
            key: '5',
            value: '/sub4',
            label: 'sub4'
        }, {
            key: '6',
            value: '/sub6',
            label: 'sub6'
        }]
    }, {
        key: 'sub25',
        titleIcon: 'setting',
        subValue: '类4',
        menuItem: [{
            key: '7',
            value: '/sub8',
            label: 'sub8'
        }, {
            key: '8',
            value: '/sub9',
            label: 'sub9'
        }]
    }]
})
Mock.mock('/api/leftList', {
    code: '0',
    'data|1-10': [{
        name: '成都大风炊餐饮管理有限责任公司',
        address: '金牛区-XX街道',
        area: '金牛区',
        percent: '10',
        'lng|+1': ['104.06476', '104.02376', '104.02345'],
        lat: '30.57020',
        riskLevel: 1
    }]
})
Mock.mock('/api/barDatas', {
        code: '0',
        'data|1-8': [{
            'area|1': ['高新区', '青羊区', '武侯区', '天府新区'],
            'netfood|1': [1, 2, 4],
            'foodWaste|1': [3, 5, 2]
        }]
    })
    Mock.mock('/api/filterData', {
        code: '0',
        'data|1-8': [{
            'code|1': ['高新区', '青羊区', '武侯区', '天府新区'],
            'name|1': [1, 2, 4],
            'items|1': []
        }]
    })
    // export default data