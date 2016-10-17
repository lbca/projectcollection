var root = window || {},
    util = root.util || {};

var AccInput = function(opt) {
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
        msg: {
            m1: '请选择会员卡类型',
            m2: '会员卡类型有误，请重新选择',
            m3: '请输入会员卡号',
            m4: '该会员卡未绑定手机号',
            m5: '不存在此会员卡',
            m6: '会员卡类型下，不存在该会员卡',
            m7: '验证码发送量已达今日上限',
            m8: '您当前的请求太频繁，休息一下5分钟后再尝试',
            m9: '请发送验证码进行短信验证',
            m10: '请输入短信验证码',
            m11: '短信验证码有误，请重新获取',
            m12: '短信验证码已超时，请重新获取',
            m13: '手机号有误，请重新尝试',
            m14: '会员卡已存在，不能重复绑定'
        },
        // 请求状态，用于ajax
        requestState: {
            getSendCodePhone: true,
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccInput.prototype, {
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

        // 会员账户账号
        hrefParma.acnum && $('#acnum').val(hrefParma.acnum);
        // 账户类型名称
        hrefParma.actype && $('#actype').html(that.options.ACTYPE[hrefParma.actype] || '');
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
                that.options.requestState.getSendCodePhone = true;
            }
        });
    },
    /**
     * 发送短信验证码
     * @parma {string}{1} actype 会员卡类型
     * @parma {string}{1} acnum 会员卡号
     */
    getSendCodePhone: function(actype, acnum) {
        var that = this,
            rpco;


/*// debug start
var response = {
    rpco: 200,
    //rpco: 40001,
    //rpco: 40002,
    //rpco: 40003,
    //rpco: 40004,
    //rpco: 40005,
    body: {
        uiqcd: '123456789',
        empn: '135****4236'
    }
};
var body;
    rpco = response.rpco;
// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 全局唯一编码
        that.options.uiqcd = body.uiqcd;
        // 已加密手机号
        body.empn && $('#mobile').html(body.empn) && $('#sendTip').show();
        // 倒计时
        that.countDown();
        break;
    // 会员卡无绑定手机号
    case 40001:
        util.tip(that.options.msg.m4);
        break;
    // 会员卡错误
    case 40002:
        util.tip(that.options.msg.m5);
        // 禁用按钮
        break;
    // 会员卡类型错误
    case 40003:
        util.tip(that.options.msg.m6);
        break;
    // 验证码发送已达当日上限
    case 40004:
        util.tip(that.options.msg.m7);
        break;
    // 验证码发送频繁
    case 40005:
        util.tip(that.options.msg.m8);
        break;
    default:
        util.tip('请求失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'acbdph',
            data: {
                actype: actype,
                acnum: acnum
            },
            type: 'post',
            async: false,
            beforeSend: function() {
                // 禁用按钮
                that.options.requestState.getSendCodePhone = false;
                // 
            },
            success: function(response) {
                var body;
                rpco = response.rpco;
                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 全局唯一编码
                        that.options.uiqcd = body.uiqcd;
                        // 已加密手机号
                        body.empn && $('#mobile').html(body.empn) && $('#sendTip').show();
                        // 倒计时
                        that.countDown();
                        break;
                    // 会员卡无绑定手机号
                    case 40001:
                        util.tip(that.options.msg.m4);
                        break;
                    // 会员卡错误
                    case 40002:
                        util.tip(that.options.msg.m5);
                        // 禁用按钮
                        break;
                    // 会员卡类型错误
                    case 40003:
                        util.tip(that.options.msg.m6);
                        break;
                    // 验证码发送已达当日上限
                    case 40004:
                        util.tip(that.options.msg.m7);
                        break;
                    // 验证码发送频繁
                    case 40005:
                        util.tip(that.options.msg.m8);
                        break;
                    default:
                        util.tip('请求失败')
                }
            },
            complete: function() {
                // 启用按钮
                (rpco !== 200) && (that.options.requestState.getSendCodePhone = true);
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
            // 会员卡号
            acnum = $('#acnum').val();

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
        // 会员账号
        if(!acnum) {
            util.tip(that.options.msg.m3);
            return false;
        }

        // 发送验证码
        that.options.requestState.getSendCodePhone && that.getSendCodePhone(actype, acnum);
    },
    /**
     * _保存
     * @parma {object}{1} account 账户对象
     *        {number}{1} actype 账户类型
     *        {string}{1} acnum 账户账号
     *        {string}{1} acpwd 账户密码
     *        {number}{1} state 操作状态
     */
    _save: function(account) {
        var that = this;
        // 操作状态
        account.state = util.OPT_STATE.UPDATE;



/*// debug start
var response = {
    rpco: 200
};
var rpco = response.rpco;

// 处理
switch(rpco) {
    case 200:
        util.href('accsuccess.html');
        break;
    default:
        util.tip('保存失败')
}
return;
// debug end*/


        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modacc',
            data: account,
            type: 'post',
            beforeSend: function() {
                // 禁用按钮
                that.options.requestState.save = false;
                // 
            },
            success: function(response) {
                var rpco = response.rpco;

                // 处理
                switch(rpco) {
                    case 200:
                        util.href('accsuccess.html');
                        break;
                    // 短信验证码错误
                    case 40001:
                        util.tip(that.options.msg.m11);
                        break;
                    // 短信验证码已超时
                    case 40002:
                        util.tip(that.options.msg.m12);
                        break;
                    // 手机号错误
                    case 40003:
                        util.tip(that.options.msg.m13);
                        break;
                    // 会员卡已绑定
                    case 40004:
                        util.tip(that.options.msg.m14);
                        break;
                    default:
                        util.tip('保存失败')
                }
            },
            complete: function() {
                // 启用按钮
                that.options.requestState.save = true;
            }
        }); 
    },
    /**
     * 保存
     */
    save: function() {
        var that = this,
            // 会员卡类型
            actype = that.options.hrefParma.actype,
            // 会员账户
            acnum = $('#acnum').val(),
            // 短信验证码
            mac = $('#vcode').val(),
            // 全局唯一编码
            uiqcd = that.options.uiqcd;

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
        // 会员账号
        if(!acnum) {
            util.tip(that.options.msg.m3);
            return false;
        }
        // 短信发送唯一码
        if(!uiqcd) {
            util.tip(that.options.msg.m9);
            return false;
        }
        // 验证码
        if(!mac) {
            util.tip(that.options.msg.m10);
            return false;
        }

        // _保存
        that.options.requestState.save && that._save({
            actype: actype,
            acnum: acnum,
            mac: mac,
            uiqcd: uiqcd
        });
    },
    /**
     * 显示会员卡绑定规则
     */
    cardBindRule: function() {
        var that = that,
            html = '';

        // 移除
        $('.dialog').remove();

        html = '<div class="dialog">'
             +      '<div class="tablecell">'
             +          '<div class="dialog-context no-txtidt">'
             +              '<div class="ttl">绑定会员卡<span class="opctbig" id="dialogClose"><i class="i i-delete2"></i></span></div>'
             +              '<div class="txt">'
             +                  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;指绑定国美旗下公司给予用户注册的会员卡，包含国美电器、大中电器、永乐电器等不同国美旗下品牌公司会员卡，目前仅支持绑定线下会员卡。<br>'
             +                  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了您的账户信息安全，只能绑定本人持有的会员卡，如绑定非本人会员卡，国美管家接收到用户申述后有权单方面解绑会员卡绑定。<br>'
             +                  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;国美管家将获取您通过会员卡关联的用户、订单、商品等相关信息，国美管家提供对会员卡信息转化为资产、保修管理、电子说明书等服务，并为用户提供根据会员卡信息进行针对性服务。对于用户会员卡信息是否存在缺失及会员卡找回国美管家不承担相关责任与义务。<br>'
             +                  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;会员卡如解绑，会员卡所关联信息将同步移除，由于解绑会员卡造成的损失国美管家不承担相关责任。国美管家不提供会员卡信息找回、密码找回等功能，如遇会员卡遗失等问题请联系办卡单位进行处理，国美管家仅提供会员卡绑定必要验证程序，如由于用户自行丢失会员卡造成会员卡被其它用户绑定，国美管家不承担相关责任，如遇会员卡已被绑定，请及时联系客服进行处理。'
             +              '</div>'
             +          '</div>'
             +      '</div>'
             + '</div>';

        // 放入页面
        $('body').append(html);
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

        /*“绑定”单击事件*/
        that.el.on(click, '#save', function() {
            // 保存
            that.save();
        });

        // 手机号查询会员卡单击事件
        that.el.on(click, '#accsearch', function(e) {
            util.href('accsearch.html', {actype: hrefParma.actype});
        });

        // “绑定说明”关闭按钮
        that.el.on(click, '#dialogClose', function() {
            $('.dialog').addClass('dn');
        });

        // 会员卡绑定规则
        that.el.on(click, '#cardBindRule', function() {
            // 显示会员卡绑定规则
            that.cardBindRule();
        });
    }
})