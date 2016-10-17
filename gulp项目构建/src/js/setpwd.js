var root = window || {},
    util = root.util || {};

var SetPwd = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 密码正则
        pwdReg: /^[^\u4e00-\u9fa5\s]+$/,
        msg: {
            m1: '请输入密码',
            m2: '请输入确认密码',
            m3: '两次输入不一致',
            m4: '密码设置成功',
            m5: '密码长度限制为6~18位',
            m6: '密码不能包含汉字或空格'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetPwd.prototype, {
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
    },
    /**
     * _保存
     * @parma {string}{1} password 密码
     */
    _save: function(password) {
        var that = this;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modupwd',
            data: {
                npwd: password
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
                        util.tip(that.options.msg.m4);
                        setTimeout(function() {
                            util.href('set.html');
                        }, 300);
                        break;
                    default:
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
            newPwd = $('#newPwd').val(),
            cfmPwd = $('#cfmPwd').val();

        if(!that.options.requestState.save) { return false; }

        // 非空验证
        // 新密码
        if(!newPwd) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 密码规则
        if(!that.options.pwdReg.test(newPwd)) {
            util.tip(that.options.msg.m6);
            return false;   
        }
        // 长度
        if(newPwd.length < 6 || newPwd.length > 18) {
            util.tip(that.options.msg.m5);
            return false;
        }
        // 确认密码
        if(!cfmPwd) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 确认密码
        if(newPwd != cfmPwd) {
            util.tip(that.options.msg.m3);
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
        that._save(newPwd);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*保存按钮*/
        $('#save').on(click, function() {
            that.save();
        });
    }
})