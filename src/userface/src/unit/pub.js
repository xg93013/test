const throttle = (fn, delay = 200) => {
    //节流
    let handle;
    return e => {
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

const formatContent = (arr, content) => {
    let res = content;
    let outArr = [...arr];
    if (outArr.length > 0) {
        outArr.sort((a, b) => {
            return a.length - b.length;
        });
    }
    if (res != null && res != "") {
        for (let i = 0; i < outArr.length; i++) {
            let reg = `/${outArr[i]}/g`;
            res = res.replace(
                eval(reg),
                `<label style='color:#e83c3f !important'>${outArr[i]}</label>`
            );
        }
    } else {
        res = "";
    }
    return res;
};
export { debounce, throttle, formatContent };