import * as screenfull from "screenfull";

const throttle = (fn, delay = 200) => {
    //节流
    let handle;
    return e => {
        console.log('resize')
        clearTimeout(handle);
        handle = setTimeout(() => {
            fn(e);
        }, delay);
    };
};

const debounce = (fn, delay = 200) => {
    //防抖
    let runFlag = false;
    return e => {
        if (runFlag) {
            return false;
        }
        runFlag = true;
        setTimeout(() => {
            fn(e);
            runFlag = false;
        }, delay);
    };
};

export { debounce, throttle };