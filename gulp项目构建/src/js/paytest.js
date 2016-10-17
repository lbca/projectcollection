var root = window || {},
    util = root.util || {};
// 空方法    
root.EMP_FUN = function() {};

var PayTest = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 订单号
        otn: '',
        // 请求状态，用于ajax请求
        requestState: {
            //createOrder: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(PayTest.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();
        that.addEvent();
    },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this,
            hrefParma = that.options.hrefParma;

        // 订单号
        that.options.otn = hrefParma.otn || '';
    },
    /**
     * 支付
     * @parma {string}{1} otn 订单号
     */
    pay: function(otn) {
        var that = this;
            
        // 请求...
        util.api({
            surl: root.WXP_API_PATH + 'testwxpaysta',
            data: {
                otn: otn
            },
            type: 'get',
            async: false,
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        util.alert('支付成功');
                        break;
                    default:
                        util.tip("支付失败");
                }
            },
            error: function() {
                // 启用按钮
            }
        });
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 支付按钮
        that.el.on(click, '#toPay', function() {
            // 支付
            that.pay(that.options.otn);
        });
        
    }
})