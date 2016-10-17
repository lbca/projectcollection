var root = window || {},
    util = root.util || {};

var SetPhoneVcode = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        phone: '',
        // 验证码发送手机号
        sphone: '',
        // 验证码重发倒计时
        downTime: 60,
        // 操作状态
        operate: '',
        // 验证码生成时间戳
        uiqcd: '',
        msg: {
            m1: '请输入验证码',
            m2: '验证码不正确，请重新输入',
            m3: '短信验证码已超时，请重新获取',
            m4: '手机号已存在，不可重复绑定',
            m5: '验证码发送已达当日上限',
            m6: '您当前的请求太频繁，休息一下5分钟后再尝试',
            m7: '短信验证码，发送手机号有误',
            m8: '验证短信发送失败',
            m9: '手机号绑定成功'
        },
        // 请求状态，用于ajax
        requestState: {
            sendCode: true,
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetPhoneVcode.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();
        that.addEvent();
        // 自定义返回按钮加载
        //that.loadGoBack();
    },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this,
            hrefParma = that.options.hrefParma,
            phone = hrefParma.phone || '',
            // 验证码接收手机号
            sphone = hrefParma.sphone || phone;
        // 手机号
        that.options.phone = phone;
        that.options.sphone = sphone;
        // 操作状态
        that.options.operate = hrefParma.operate || '';

        // 发送验证码
        //sphone && that.sendCode(sphone);
    },
    // /**
    //  * 加载返回按钮
    //  */
    // loadGoBack: function() {
    //     var that = this,
    //         ou = that.options.hrefParma.ou,
    //         phone = that.options.phone,
    //         oldPhone = util.getHrefParma(ou).phone;

    //     // 替换原始手机号
    //     if(oldPhone) {
    //         ou = ou.indexOf('&') > -1 ? ou.replace(/phone=.*&/, 'phone=' + phone + '&') : ou.replace(/phone=.*/, 'phone=' + phone);
    //     } 
    //     // 新增手机号参数
    //     else {
    //         ou = util.setHrefParma(ou, { phone: that.options.hrefParma.phone });
    //     }
    //     // 加载返回按钮
    //     ou && $('.goBack').attr('href', ou).show();
    // },
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
            rpco,
            body;

        if(!that.options.requestState.sendCode) { return false; }

        // 验证码发送按钮
        var scBtn = $('#sendCode');
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
                rpco = response.rpco;
                body = response.body || {};

                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        // 倒计时
                        that.countDown();
                        // 验证码生成时间戳
                        that.options.uiqcd = body.uiqcd;
                        break;
                    // 验证码发送频繁
                    case 40002:
                        util.tip(that.options.msg.m6);
                        break;
                    // 验证码发送已达当日上限
                    case 40001:
                        util.tip(that.options.msg.m5);
                        // 禁用按钮
                        break;
                    default:
                        util.tip(that.options.msg.m8);
                }
            },
            complete: function() {
                // 启用按钮
                (rpco !== 200) && (that.options.requestState.sendCode = true);
            }
        });    
    },
    /**
     * _保存
     * @parma {string}{1} phone 手机号
     * @parma {string}{1} vcode 验证码
     * @parma {number}{1} uiqcd 验证码生成时间戳
     * @parma {number}{1} state 操作状态
     */
    _save: function(phone, vcode, uiqcd, state) {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modmobile',
            data: {
                mobile: phone,
                mac: vcode,
                uiqcd: uiqcd,
                state: state
            },
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
                        util.href('setphonefinish.html', {
                            phone: phone
                        });
                        break;
                    // 短信验证码错误
                    case 40001:
                        util.tip(that.options.msg.m2);
                        break;
                    // 短信验证码已超时
                    case 40002:
                        util.tip(that.options.msg.m3);
                        break;
                    // 该手机号已绑定
                    case 40003:
                        util.tip(that.options.msg.m4);
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
     *保存
     */
    save: function() {
        var that = this,
            phone = that.options.phone,
            vcode = $('#vcode').val(),
            state = '';

        // 校验
        if(!that.options.requestState.save) { return false; }
        // 手机号
        if(!phone) { 
            util.tip(that.options.msg.m7);
            return false; 
        }
        // 验证码
        if(!vcode) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 操作状态
        switch(that.options.operate) {
            // 增
            case 'add':
            // 改
            case 'mod':
                state = util.OPT_STATE.UPDATE
                break;
            // 删
            case 'del':
                state = util.OPT_STATE.DELETE;
                break;
        }

        // 保存
        that._save(phone, vcode, that.options.uiqcd, state);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*获取验证码*/
        that.el.on(click, '#sendCode', function() {
            var sphone = that.options.sphone;
            if(!that.options.requestState.sendCode) { return false; }

            // 非空
            if(!sphone) { 
                util.tip(that.options.msg.m7);
                return false; 
            }

            // 发送验证码
            that.sendCode(sphone);
        });

        /*下一步*/
        that.el.on(click, '#nextStep', function() {
            that.save();
        });

        /*手机号文本框限制输入*/
        that.el.on('input propertychange', '#vcode', function(e) {
            var value = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(value);
        });
    }
})