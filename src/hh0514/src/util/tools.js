export default {
    /* 
        param num{Number} 数字
        param noAutoFit{Boolean} 是否禁止转换为平方千米
        param digit{Number} 需要的有效位数（不包含小数点）
     */
    convertArea(num, noAutoFit, digit){
        var unit = 1e6;
        
        if (num >= 1e4 || !noAutoFit) {
            var temp = (num/unit);
            if (!isNaN(digit)) {
                if ((temp+'').includes('.')) {
                    return temp.toFixed(digit - (temp+'').split('.')[0].length);
                } else {
                    return Math.round(temp)+'';
                }
            } else {
                return temp * 1
            }
            // return (num/unit).toFixed(isNaN(digit) ? 6 : digit) * 1;
        } else {
            return num;
        }
    },
    convertRate(rate, withUnit){
        if (!rate) {
            rate = 0; 
        }
        return (rate*100).toFixed(2) + (withUnit ? " "+"%" : '');
    },
    convertExponent(num){
        if (isNaN(num)) {
            return 0;
        }
        return Math.round(num*100);
    },
    fitDigit(num, digit){
        if (!num) {
            num = 0;
        }
        // let temp = '0';
        // while (temp.length < digit) {
        //     temp+='0';
        // }
        return (num+'').padStart(digit,'0')
    },
    fitViewPx(num) {
        if (this.$store.state.view.bigScreen) {
            return `${num * 4}px`;
        }
        return `${num}px`
    },
    renderCollection : {
        waterType(type) {
            return type == 'T' ? "江河" : '湖泊';
        }
    },
    getDateRange(count, pType){
        return (function(currentDate){
            var tempArr = [];

            for (var i =0 ;i<count*1; i++) {
                tempArr.unshift(new DateObj(currentDate));
                currentDate.setMonth(currentDate.getMonth() - 1);
            }

            function DateObj (dateO) {
                Object.defineProperty(this,'label',{
                    get(){
                        return this.year + "年" + this.month + "月"
                    },
                    set(val){
                        val
                    }
                })
                // this.label = {
                // }
                this.year = dateO.getFullYear();
                this.month = dateO.getMonth() + 1;
                this.toolTip = [{label:'污染指数',value:Math.floor(Math.random()*101)}]
                if (pType) {
                    this.toolTip.unshift({label:'污染类型',value: pType})
                }
            }
            return tempArr;
        })(new Date(2019, 2))
    }
}

