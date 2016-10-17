var root = window || {},
    util = root.util || {};

var Loginput = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        msg: {
            m1: '请输入账号',
            m2: '请输入密码',
            m3: '账号输入有误',
            m4: '账号不能为空',
            m5: '手机号码有误',
            m6: '账号不能包含字符和汉字',
            m7: '账号不存在，赶快去注册吧',
            m8: '密码错误',
            m9: '密码长度过短',
            m10: '密码长度过长',
            m11: '密码不能为空',
            m12: '暂不支持邮箱登陆',
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(Loginput.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.addEvent();
    },
    /**
     * 保存 
     * @parma string {1} lgtk 登录标识
     * @parma string {1} lgpwd 登录密码
     */
    _login: function(lgtk, lgpwd) {
        var that = this;
        // 请求...
        util.api({
            surl: root.CM_API_PATH + 'login',
            data: {
                lgtk: lgtk,
                lgpwd: lgpwd
            },
            type: 'post',
            async: false,
            success: function(response) {
                var rpco = response.rpco,
                    ou = that.options.hrefParma.ou || 'set.html';
                    
                // 处理
                switch(rpco) {
                    case 200:
                        // 
                        util.href(ou);
                        break;
                    // 账号超出限制长度
                    case 40001:
                        util.tip(that.options.msg.m3);
                        break;
                    // 账号为空
                    case 40002:
                        util.tip(that.options.msg.m4);
                        break;
                    // 手机号格式有误
                    case 40003:
                        util.tip(that.options.msg.m5);
                        break;
                    // 账号不包含字符、汉字
                    case 40004:
                        util.tip(that.options.msg.m6);
                        break;
                    // 账号不存在，但格式正确
                    case 40101:
                        util.tip(that.options.msg.m7);
                        break;
                    // 密码错误
                    case 40102:
                        util.tip(that.options.msg.m8);
                        break;
                    // 密码过短
                    case 40011:
                        util.tip(that.options.msg.m9);
                        break;
                    // 密码过长
                    case 40012:
                        util.tip(that.options.msg.m10);
                        break;
                    // 密码为空
                    case 40013:
                        util.tip(that.options.msg.m11);
                        break;
                    // 暂时不支持邮箱
                    case 40050:
                        util.tip(that.options.msg.m12);
                        break;
                    default:
                        util.tip('登录失败');
                }
            }
        });
    },
    /**
     *保存
     */
    login: function() {
        var that = this,
            // 修改值
            lgtk = $('#lgtk').val(),
            lgpwd = $('#lgpwd').val();

        // 值
        if(!lgtk) {
            util.tip(that.options.msg.m1);
            return false;
        }
        if(!lgpwd) {
            util.tip(that.options.msg.m2);
            return false;
        }

        // 保存

        /*// debug star
        util.href('set.html');
        return;
        // debug end*/

        that._login(lgtk, lgpwd);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*保存按钮*/
        that.el.on(click, '#login', function() {
            that.login();
        });

        /*文本框keyup实事件*/
        that.el.on('input propertychange', 'input', function() {
            var cou = 0;
            $('input').each(function(i, n) { $(this).val() && cou++; });
            (cou === 2) ? $('#login').addClass('act') : $('#login').removeClass('act');
        });

    }
})