var root = window || {},
    util = root.util || {};

var AccSearch = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 账户类型
        ACTYPE: {
            '1': '国美会员卡',
            '2': '永乐会员卡',
            '3': '大中会员卡',
            /*'4': '蜂星会员卡',*/
            '5': '库巴卡',
            '6': '极信国美卡',
            '7': '极信大中卡',
            '8': '极信永乐卡'
        },
        // 验证码重发倒计时
        downTime: 60,
        // 全局唯一编码
        uiqcd: '',
        // 验证码发送手机号
        phone: '',
        phoneReg : /^(((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[6|7|8]))\d{8}|(170[0|5|9])\d{7})$/, // 手机号正则
        msg: {
            m1: '请选择会员卡类型',
            m2: '会员卡类型有误，请重新选择',
            m3: '请输入手机号',
            m4: '验证码发送频繁',
            m5: '验证码发送量已达今日上限',
            m6: '请选择会员卡类型',
            m7: '会员卡类型有误，请重新选择',
            m8: '请获取验证码进行短信验证',
            m9: '请输入短信验证码',
            m10: '请输入正确的手机号',
            m11: '验证码错误',
            m12: '验证码已超时，请重新获取'
        },
        // 请求状态，用于ajax
        requestState: {
            getSendCodePhone: true,
            sendCode: true,
            checkCode: true,
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccSearch.prototype, {
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
            
        // 账户类型名称
        hrefParma.actype && $('#actype').html(that.options.ACTYPE[hrefParma.actype] || '');
        // 手机号
        hrefParma.phone && $('#phone').val(hrefParma.phone);
    },
    /**
     * 倒计时
     */
    countDown: function() {
        var that = this;
        // 倒计时
        util.countDown({
            elem: $('#sendCode'),
            downTime: that.options.downTime,
            formate: '已发（count）',
            callback: function() {
                that.options.requestState.sendCode = true;
            }
        });
    },
    /**
     * 发送验证码
     * @parma {string}{1} phone 接收验证码手机号
     */
    sendCode: function(phone) {
        var that = this,
            rpco;


/*// debug start
var response = {
    rpco: 200,    
    //rpco: 40001,    
    //rpco: 40002,    
    body: {
        uiqcd: '10086'
    }
};
var body;
rpco = response.rpco;

// 处理
switch(rpco) {
    // 正常
    case 200:
        body = response.body || {};
        // 倒计时
        that.countDown();
        // 验证码生成时间戳
        that.options.uiqcd = body.uiqcd;
        break;
    // 验证码发送已达当日上限
    case 40001:
        util.tip(that.options.msg.m4);
        // 禁用按钮
        break;
    // 验证码发送频繁
    case 40002:
        util.tip(that.options.msg.m5);
        break;
    default:
        util.tip('验证码发送失败');
}
return;
// debug end*/

        // 请求...
        util.api({
            surl: root.CM_API_PATH + 'getvm',
            data: {
                sphone: phone
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.sendCode = false;
            },
            success: function(response) {
                var body;
                rpco = response.rpco;

                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        body = response.body || {};
                        // 倒计时
                        that.countDown();
                        // 验证码生成时间戳
                        that.options.uiqcd = body.uiqcd;
                        break;
                    // 验证码发送已达当日上限
                    case 40001:
                        util.tip(that.options.msg.m4);
                        // 禁用按钮
                        break;
                    // 验证码发送频繁
                    case 40002:
                        util.tip(that.options.msg.m5);
                        break;
                    default:
                        util.tip('验证码发送失败');
                }
            },
            complete: function() {
                // 启用按钮
                (rpco !== 200) && (that.options.requestState.sendCode = true);
            }
        });     
    },
    /**
     * 发送验证码单击事件
     */
    sendCodeClick: function() {
        var that = this,
            // 会员卡类型
            actype = that.options.hrefParma.actype,
            // 手机号
            phone = $('#phone').val();

        // 有效性验证
        // 账号类型
        if(!actype) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 账号类型有效性
        if(!that.options.ACTYPE[actype]) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 手机号
        if(!phone) {
            util.tip(that.options.msg.m3);
            return false;
        }
        // 手机号规则
        if(!that.options.phoneReg.test(phone)) {
            util.tip(that.options.msg.m10);
            return false;
        }

        // 发送验证码
        that.options.requestState.sendCode && that.sendCode(phone);
    },
    /**
     * 校验短信验证码
     * @parma {string}{1} mac 验证码
     * @parma {long}{1} uiqcd 全局唯一编码
     */
    checkCode: function(mac, uiqcd) {
        var that = this;


/*// debug start
var response = {
    rpco: 200,  
    //rpco: 40001,  
    //rpco: 40002,  
    body: {
        uiqcd: '1111111'
    }
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};

        // 跳转查询会员卡列表页
        util.href('acclistwait.html', {
            actype: that.options.hrefParma.actype,
            acphone: $('#phone').val(),
            mac: mac,
            uiqcd: body.uiqcd,
            cbu: 'accsearchinput.html'
        });

        break;
    // 短信验证码错误
    case 40001:
        util.tip(that.options.msg.m11);
        break;
    // 短信验证码已超时
    case 40002:
        util.tip(that.options.msg.m12);
        break;
    default:
        util.tip('校验失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.CM_API_PATH + 'checkvm',
            data: {
                mac: mac,
                uiqcd: uiqcd
            },
            type: 'post',
            beforeSend: function() {
                // 禁用按钮
                that.options.requestState.checkCode = false;
            },
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};

                        // 跳转查询会员卡列表页
                        util.href('acclistwait.html', {
                            actype: that.options.hrefParma.actype,
                            acphone: $('#phone').val(),
                            //mac: mac,
                            uiqcd: body.uiqcd,
                            cbu: 'accsearchinput.html'
                        }, true);

                        break;
                    // 短信验证码错误
                    case 40001:
                        util.tip(that.options.msg.m11);
                        break;
                    // 短信验证码已超时
                    case 40002:
                        util.tip(that.options.msg.m12);
                        break;
                    default:
                        util.tip('验证码输入不正确')
                }
            },
            complete: function() {
                // 启用按钮
                that.options.requestState.checkCode = true;
            }
        }); 
    },
    /**
     * 查询按钮点击事件
     */
    searchClick: function() {
        var that = this,
            actype = that.options.hrefParma.actype,
            vcode = $('#vcode').val(),
            // 手机号
            phone = $('#phone').val();

        // 有效性验证
        // 会员卡类型
        if(!actype) {
            util.tip(that.options.msg.m6);
            return false;
        }
        // 会员卡有效性
        if(!that.options.ACTYPE[actype]) {
            util.tip(that.options.msg.m7);
            return false;
        }
        // 手机号
        if(!phone) {
            util.tip(that.options.msg.m3);
            return false;
        }
        // 手机号规则
        if(!that.options.phoneReg.test(phone)) {
            util.tip(that.options.msg.m10);
            return false;
        }
        // 是否发送过验证码
        if(!that.options.uiqcd) {
            util.tip(that.options.msg.m8);
            return false;
        }
        // 验证码
        if(!vcode) {
            util.tip(that.options.msg.m9);
            return false;
        }

        // 
        that.options.requestState.checkCode && that.checkCode(vcode, that.options.uiqcd);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;


        /*“验证码”单击事件*/
        that.el.on(click, '#sendCode', function() {
            that.sendCodeClick();
        });

        /*“查询”单击事件*/
        that.el.on(click, '#search', function() {
            // 查询
            that.searchClick();
        });
    }
})