/*环形进度条*/

(function () {
    var add = function (v, n) {
        return v + n;
    };
    var del = function (v, n) {
        var back = (v - n);
        return back >= 0 ? back : 0;
    };
    var estimateAdd = function (v, n) {
        return v <= n;
    };
    var estimateDel = function (v, n) {
        return v >= n;
    }
    /*
    * options{
    * @param el:id值
    * @param width:宽度
    * @param height:高度
    * @param lineWidth:边框宽度 默认2
    * @param strokeStyle:边框颜色 默认#00ff00
    * @param startValue:开始值 默认1
    * @param endValue:结束值
    * @param time:间隔时间  默认2
    * }
    * */
    var Progress = window.Progress = function (options) {
        var wrapper = this.wrapper = document.getElementById(options.el);
        var canvas = this.canvas = wrapper;
        options.width=options.width;
        //options.width=options.width*2; //如果出现锯齿、则设置2倍宽度、canvas的css设置width=100%或者固定原本的数值
        this.w = options.width || canvas.width;
        this.h = options.height || options.width || canvas.height;
        if (canvas.getContext) {
            this.context = canvas.getContext('2d');
            this.wrapper.setAttribute('width', this.w + 'px');
            this.wrapper.setAttribute('height', this.h + 'px');
            this.init(options);
        }
    }
    Progress.prototype.init = function (options) {//设置原始值
        this.x = this.w / 2;
        this.y = this.w / 2;
        this.beginAngle = -Math.PI / 2;
        this.endAngle = 0;
        this.context.lineWidth = options.lineWidth || 2;
        this.context.lineWidth=this.context.lineWidth*2;
        this.r = this.w / 2 - (this.context.lineWidth / 2);
        this.context.strokeStyle = options.strokeStyle || "#00ff00";
        this.startValue = options.startValue || 0;
        this.endValue = options.endValue;
        this.time = options.time || 2;
    }
    Progress.prototype.draw = function () {//画图方法
        var context = this.context;
        var rangValue = Number(this.startValue);
        context.clearRect(0, 0, this.w, this.h);
        context.restore();
        this.drawWhite();
        this.endAngle = this.beginAngle + (rangValue / 360) * 2 * Math.PI;
        context.beginPath();
        context.arc(this.x, this.y, this.r, this.beginAngle, this.endAngle, false);
        context.stroke();
        context.save();
    }
    Progress.prototype.drawWhite = function () {//画白色圆框
        var context = this.context;
        context.save();
        context.beginPath();
        context.lineWidth = this.context.lineWidth-1; //设置线宽
        context.strokeStyle = "#fff";
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
        context.restore();
    },
        Progress.prototype.update = function (value, callback) {//更新数值
            if (typeof value !== 'undefined') {
                this.endValue = value;
            }

            _render(this, callback);
        },
        Progress.render = function (options) {//初始方法
            var instance = new Progress(options);
            _render(instance);
            return instance;
        },
        /*当前判断大小方法*/
        Progress.prototype.estimate = estimateAdd;
    /*当前计算方法*/
    Progress.prototype.figure = add;
    var _render = function (instance, callback) {//callback目前只有update时可以设置
        callback ? '' : callback = function () {
        };
        var num = instance.startValue - (360 * (instance.endValue / 100));
        if (num > 0) {//判断增加还是减少
            instance.figure = del;
            instance.estimate = estimateDel;
        } else {
            num = num * -1;
        }
        var circleInter;
        var time = (instance.time * 1000) / num;

         circleInter = setInterval(function () {
             var _startValue = instance.figure(instance.startValue, addn);
             var n = 360 * (instance.endValue / 100);
             if (instance.estimate(_startValue, n)) {
                 instance.startValue = _startValue;
                 instance.draw();
             } else {
                 clearInterval(circleInter);
             }
             callback();
         }, time);
    }
}(window));