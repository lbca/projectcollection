var root = window || {},
    util = root.util || {};

var SetPwdmod = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 全局唯一码
        uiqcd: '',
        // 密码正则
        pwdReg: /^[^\u4e00-\u9fa5\s]+$/,
        msg: {
            m1: '请输入原始密码',
            m2: '请输入新密码',
            m3: '请输入确认密码',
            m4: '新密码和确认密码输入不一致',
            m5: '请输入验证码',
            m6: '密码长度限制为6~18位',
            m7: '原始密码错误',
            m8: '验证码错误',
            m9: '修改次数已达今日上限',
            m10: '密码不能包含汉字或空格'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true,
            setVerCode: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetPwdmod.prototype, {
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
        // 加载验证码
        that.setVerCode();
    },
    /**
     * 设置验证码
     */
    setVerCode: function() {
        var that = this,
            imgEL = $('#vimg');
        // 
        if(!that.options.requestState.setVerCode) { return false; }

        // 请求...
        util.api({
            surl: root.CM_API_PATH + 'getvc',
            type: 'get',
            beforeSend: function() {
                that.options.requestState.setVerCode = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        // 唯一码
                        that.options.uiqcd = body.uiqcd;
                        // 显示验证码
                        imgEL.attr('src', body.vcode);
                        break;
                    default:
                        util.tip('验证码获取失败')
                }
            },
            complete: function() {
                that.options.requestState.setVerCode = true; 
            }
        });
    },
    /**
     * _保存
     * @parma {string}{1} oPwd 原密码
     * @parma {string}{1} nPwd 新密码
     * @parma {string}{1} vcode 验证码
     */
    _save: function(oPwd, nPwd, vcode) {
        var that = this;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modupwd',
            data: {
                npwd: nPwd,
                opwd: oPwd,
                vcode: vcode,
                uiqcd: that.options.uiqcd
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.save = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        util.href('set.html');
                        /*util.tip(that.options.msg.m4);
                        setTimeout(function() {
                            util.href('set.html');
                        }, 300);*/
                        break;
                    // 原始密码输入错误
                    case 40001:
                        // 重新加载验证码
                        that.setVerCode();
                        util.tip(that.options.msg.m7);
                        break;
                    // 验证码错误
                    case 40002:
                        // 重新加载验证码
                        that.setVerCode();
                        util.tip(that.options.msg.m8);
                        break;
                    // 修改次数已达日上限
                    case 40101:
                        // 重新加载验证码
                        that.setVerCode();
                        util.tip(that.options.msg.m9);
                        break;
                    default:
                        // 重新加载验证码
                        that.setVerCode();
                        util.tip('保存失败')
                }
            },
            complete: function() {
                that.options.requestState.save = true; 
            }
        });
    },
    /**
     *保存
     */
    save: function() {
        var that = this,
            oPwd = $('#oPwd').val(),
            nPwd = $('#nPwd').val(),
            cfmNPwd = $('#cfmNPwd').val(),
            vcode = $('#vcode').val();

        if(!that.options.requestState.save) { return false; }

        // 有效性验证
        // 原密码
        if(!oPwd) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 长度
        if(oPwd.length < 6 || oPwd.length > 18) {
            util.tip(that.options.msg.m6);
            return false;
        }
        // 新密码
        if(!nPwd) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 密码规则
        if(!that.options.pwdReg.test(nPwd)) {
            util.tip(that.options.msg.m10);
            return false;   
        }
        // 长度
        if(nPwd.length < 6 || nPwd.length > 18) {
            util.tip(that.options.msg.m6);
            return false;
        }
        // 确认密码
        if(!cfmNPwd) {
            util.tip(that.options.msg.m3);
            return false;
        }
        // 确认密码
        if(cfmNPwd != nPwd) {
            util.tip(that.options.msg.m4);
            return false;
        }
        // 验证码
        if(!vcode) {
            util.tip(that.options.msg.m5);
            return false;
        }
        /*// debug start
            util.tip(that.options.msg.m4);
            setTimeout(function() {
                util.href('set.html');
            }, 300);
            return false;
        // debug end*/
        // _保存
        that._save(oPwd, nPwd, vcode);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*保存按钮*/
        that.el.on(click, '#save', function() {
            that.save();
        });

        /*换验证码*/
        that.el.on(click, '#vimg', function() {
            that.setVerCode();
        });
    }
})