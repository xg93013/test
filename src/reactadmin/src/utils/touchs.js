/**
 * @fileOverview
 * iOS系统中， 如果 在touchstart 中将 event.target 从Dom树上移除，
 * 则后续的 touchmove / touchend 均无法传递到 其原有父级元素上
 *
 * 此补丁通过在 touchstart 时，在 e.target 上添加监听 move/end
 * 随后判断此元素是否被移除，
 * 如果被移除，则在该元素曾在dom树上的最底层节点上，触发对应事件来达到事件沿dom树冒泡的效果
 *
 * @author iNahoo
 * @since 2017/7/13.
 */


/**
 * 判断节点是否在body下
 * ------------------------
 * @param node
 * @return {Boolean}
 */
function inBody(node) {
    return (node === document.documentElement) || (node === document.body) ? false : document.body.contains(node);
}

/**
 * 获取仍在dom树上的最深父节点
 * -------------------------
 * @param tree
  @return {}
 */
function getDomWhichOutsideBody(tree) {
    let n = tree[0];
    while (n.parentNode !== null) {
        n = n.parentNode;
    }
    let i = tree.indexOf(n);
    return i > -1 ? tree[i + 1] : null;
}

/**
 * 伪造的Touch事件并触发
 * ------------------------
 * @param event
 * @param tree
 */
function dispatchFakeEvent(event, tree) {
    //获取仍在dom树上的最深父节点 , 若节点不存在则直接返回
    const p = getDomWhichOutsideBody(tree);
    if (!p) return;

    //创建同名自定义事件
    const E = new CustomEvent(event.type, {
        bubbles: true,
    });

    //拷贝参数
    E.changedTouches = event.changedTouches;
    E.targetTouches = event.targetTouches;

    //触发事件
    p.dispatchEvent(E);
}

//监听事件
window.addEventListener('touchstart', e => {

    const t = e.target;

    /**
     * 计算元素初始dom树
     * -----------------
     * PS: 我总觉得这么做不太稳妥。
     */
    let n = t;
    const tree = [t];
    while (n.parentNode && n !== document.documentElement) {
        tree.push(n.parentNode);
        n = n.parentNode;
    }

    //事件handle
    const moveHandle = function(e) {

        //判断节点在不在Dom树下
        if (!inBody(e.target)) {
            dispatchFakeEvent(e, tree);
        }
    };

    const endHandle = function(e) {

        //判断节点在不在Dom树下
        if (!inBody(e.target)) {
            dispatchFakeEvent(e, tree);
        }

        //移除监听
        t.removeEventListener('touchmove', moveHandle);
        t.removeEventListener('touchend', endHandle);
    };

    //绑定事件
    t.addEventListener('touchmove', moveHandle);
    t.addEventListener('touchend', endHandle);

}, true);