import createHistory from 'history/createBrowserHistory';

const throttle = (fn, delay = 200) => { //节流
    let handle;
    return e => {
        clearTimeout(handle);
        handle = setTimeout(() => {
            fn(e);
        }, delay)
    }
}

const debounce = (fn, delay = 200) => {//防抖
    let runFlag = false;
    return e => {
        if (runFlag) {
            return false;
        }
        runFlag = true;
        setTimeout(() => {
            fn(e);
            runFlag = false;
        }, delay)
    }
}


const history = createHistory();

const links = {
    cj:'https://182.150.44.163:7016/#/index/page1',
    gltp:' https://graph.fdabd.com/#/login ',
    wlyq:'http://118.123.173.72:8181/',
    zhjg:'https://sampling.fdabd.com/#/comAnalysis',
    hhzl:'http://172.27.2.107/pc',
    hzjd:'http://172.27.2.48:18888/#/main/application',
    rce:'https://inentra.test.myathena.cn/#/',
}
export { debounce, throttle , history, links};