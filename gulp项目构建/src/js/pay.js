var root = window || {},
    util = root.util || {};
// 空方法    
root.EMP_FUN = function() {};

var Pay = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 订单号
        otn: '',
        // 下单时间戳
        dodt: 0,
        // 微信支付参数
        wxpc: {
            // 公众号的唯一标识
            appId: '',
            // 支付签名时间戳
            timestamp: '',
            // 支付签名随机串
            nonceStr: '',
            // 统一支付接口返回的prepay_id参数值
            package: '',
            // 签名方式
            signType: '',
            // 支付签名
            paySign: '',
            // 支付成功后的回调函数
            success: this.paySuccess
        },
        // 优惠券
        coupon: {
            // 券编号
            counum: 0,
            // 券金额
            coumy: 0
        },
        // 可选择优惠券
        canSelectCoupon: false,
        // 支付方式
        mops: {
            1: '微信支付',
            2: '快捷支付'
        },
        msg: {
            m1: '订单信息错误',
            m2: '支付签名时间戳不能为空',
            m3: '支付签名随机串不能为空',
            m4: '统一支付值不能为空',
            m5: '签名方式不能为空',
            m6: '支付签名不能为空',
            m7: '无可用优惠券',
            m8: '支付单有误，不可继续操作'
        },
        // 请求状态，用于ajax请求
        requestState: {
            //createOrder: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(Pay.prototype, {
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

        // 记录券信息
        // 编号
        hrefParma.counum && (that.options.coupon.counum = hrefParma.counum);
        // 金额
        hrefParma.coumy && (that.options.coupon.coumy = hrefParma.coumy);

        // 订单号
        that.options.otn = hrefParma.otn || '';
        // 获取订单详情
        that.options.otn && that.getOrderDetail(that.options.otn);
    },
    /**
     * 渲染订单详情
     * @parma {object}{1} order 订单对象
     */
    renderOrderDetail: function(order) {
        var that = this,
            // 上次支付方式
            lmop = order.lmop || 0,
            // 支付方式
            mopn = that.options.mops[lmop],
            // 订单金额
            odmy = order.odmy || 0,
            // 应付金额
            amp = order.amp || 0,
            // 使用优惠券金额
            couponMoney = 0,
            // 优惠券模块标签
            couponEL = $('#coupon'),
            // 优惠券金额标签
            coumyEL = $('#coumy');

        // 订单名称
        order.odna && $('#odna .value').html(order.odna);
        // 订单号
        that.options.otn && $('#otn .value').html(that.options.otn.replace(/_.*$/, ''));
        // 支付方式
        mopn && $('#mopn .value').html(mopn);

        // 优惠券
        // 订单存在优惠券时，不可选择券
        if(order.counum) {
            // 记录券信息
            that.options.coupon = {
                // 编号
                counum: order.counum,
                // 金额
                coumy: order.coumy
            };
            // 优惠金额
            //couponMoney = order.coumy;
            // 优惠金额
            order.coumy && coumyEL.html('-¥' + (order.coumy/100).toFixed(2) + '元');
            // 显示优惠券模块
            couponEL.show();
        } 
        // 存在可使用的优惠券
        else if(order.coucc) {
            // 可选择优惠券
            that.options.canSelectCoupon = true;
            // 优惠金额
            // 存在选中优惠券
            if(that.options.coupon.counum) {
                // 优惠金额
                couponMoney = that.options.coupon.coumy;
                // 优惠金额
                couponMoney && coumyEL.html('-¥' + (couponMoney/100).toFixed(2) + '元');
            } 
            // 不存在优惠券
            else {
                coumyEL.html('未选择');
            }
            // 放入可使用张数
            order.coucc && $('#coucc').html('(' + order.coucc + '张可用)');
            // 最高折扣
            order.coumcm && $('#coumcm').html('最高可折扣' + (order.coumcm/100).toFixed(2) + '元').show();
            // 显示优惠券模块
            couponEL.show();
        }

        // 应付金额
        amp = amp - couponMoney;
        amp = amp < 0 ? 0 : amp;
        amp = '¥' + parseFloat(amp / 100).toFixed(2);
        $('#amp .value').html(amp);

        // 订单金额
        odmy = '¥' + parseFloat(odmy/100).toFixed(2);
        $('#odmy .value').html(odmy);

        /*// 移除弹层
        util.remComShow();*/
    },
    /**
     * 获取订单详情
     * @parma {string}{1} otn 订单号 
     */
    getOrderDetail: function(otn) {
        var that = this;


/*// debug star
var response = {
    rpco: 200,
    msg: '',
    body: {
        odna: '我是订单名称',
        lmop: 1,
        amp: 20000,
        //counum: '123456789',
        coumy: 500,
        coucc: 5,
        coumcn: '999999999',
        coumcm: 500
    }
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 记录下单时间
        body.dodt && that.options.dodt = body.dodt;
        // 渲染订单详情
        that.renderOrderDetail(body);
        // 移除提示
        util.remComShow();
        break;
    default:
        util.comShow({txt: that.options.msg.m8, icl: 'i-page'});
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.WXP_API_PATH + 'oddtal',
            data: {
                otn: otn
            },
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 记录下单时间
                        body.dodt && (that.options.dodt = body.dodt);
                        // 渲染订单详情
                        that.renderOrderDetail(body);
                        break;
                    default:
                        util.comShow({txt: that.options.msg.m8, icl: 'i-page'});
                }
            },
            complete: function() {
                // 移除提示
                util.remComShow();
            }
        });

    },
    /**
     * 微信支付
     * @parma {object}{1} cfg 微信支付参数
     */
    WeChatPay: function(cfg) {
        var that = this;

/*// debug star
util.href('paytest.html?otn=' + that.options.otn);
return;
// debug end*/

        // 支付签名时间戳
        // 数据有效性验证
        if(!cfg.timestamp) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 支付签名随机串
        if(!cfg.nonceStr) {
            util.tip(that.options.msg.m3);
            return false;
        }
        // 统一支付接口返回的prepay_id参数值
        if(!cfg.package) {
            util.tip(that.options.msg.m4);
            return false;
        }
        // 签名方式
        if(!cfg.signType) {
            util.tip(that.options.msg.m5);
            return false;
        }
        // 支付签名
        if(!cfg.paySign) {
            util.tip(that.options.msg.m6);
            return false;
        }

        wx.chooseWXPay({
            timestamp: cfg.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: cfg.nonceStr, // 支付签名随机串，不长于 32 位
            package: cfg.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: cfg.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: cfg.paySign, // 支付签名
            success: function (res) {
                // 跳转订单详情页
                util.href('//wap.gomegj.com/spay/pay_notify?orderId=' + that.options.otn);
            },
            cancel: function() {
                // 启用按钮
                //$('#toPay').removeAttr('disabled');
            },
            fail: function(msg) {
                util.href('//wap.gomegj.com/spay/pay_notify?orderId=' + that.options.otn);
            }
        });
    },
    /**
     * _支付
     * @parma {string}{1} otn 订单号
     * @parma {string}{1} timestamp 生成签名的时间戳
     * @parma {string}{1} counum 优惠券编号
     * @parma {number}{1} coumy 优惠券编号
     */
    _pay: function(otn, timestamp, counum, coumy) {
        var that = this,
            // 发送数据
            data = {
                otn: otn,
                timestamp: timestamp
            };
            
        // 优惠券编号
        counum && (data.counum = counum);
        // 优惠券金额
        coumy && (data.coumy = coumy);

        //alert(otn);
        // 请求...
        util.api({
            surl: root.WXP_API_PATH + 'odpyst',
            data: data,
            type: 'get',
            beforeSend: function() {
                // 禁用按钮
                $('#toPay').attr('disabled', true);
            },
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:

                        // 零元订单
                        if(typeof response.body === 'undefined') {
                            // 直接完成支付，跳转订单详情页
                            util.href('/spay/pay_notify', {
                                orderId: otn
                            });
                        } 
                        // 非零元订单，需微信支付
                        else {
                            // 
                            body = response.body || {};
                            // 生成签名的随机串
                            that.options.wxpc.nonceStr = body.nonceStr;
                            // 统一支付接口返回的prepay_id参数值
                            that.options.wxpc.package = body.pack;
                            // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            that.options.wxpc.signType = body.signType;
                            // 支付签名
                            that.options.wxpc.paySign = body.paySign;

                            // 微信支付
                            that.WeChatPay(that.options.wxpc);
                        }
                        
                        break;
                    default:
                        util.tip("支付失败");
                }
            },
            error: function() {
                // 启用按钮
                $('#toPay').removeAttr('disabled');
            }
        });
    },
    /**
     * 支付
     */
    pay: function() {
        var that = this;

        // 数据有效性验证out_trade_no
        if(!that.options.otn) {
            util.tip(that.options.msg.m1);
            return false;
        }

        // _支付
        that._pay(that.options.otn, that.options.wxpc.timestamp, that.options.coupon.counum,  that.options.coupon.coumy);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 保存按钮
        that.el.on(click, '#toPay:not([disabled])', function() {
            // 支付
            that.pay();
        });

        // 选择优惠券
        that.el.on(click, '#coupon', function() {
            // 回调地址
            var cbu = location.pathname + '?otn=' + that.options.otn;

            // 可选择
            if(that.options.canSelectCoupon) {
                // 打开省页面
                util.href('couponsuse.html', {
                    // 回调页面
                    cbu: cbu,
                    // 订单号
                    otn: that.options.otn,
                    // 下单时间戳
                    dodt: that.options.dodt
                });
            }
        });
    }
})