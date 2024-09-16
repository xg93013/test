
const throttle = (fn, delay = 200) => { //节流
    let handle;
    return () => {
        clearTimeout(handle);
        handle = setTimeout(() => {
            fn();
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

export { debounce, throttle }