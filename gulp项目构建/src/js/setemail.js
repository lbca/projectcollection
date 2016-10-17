var root = window || {},
    util = root.util || {};

var SetEmail = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        emailReg: /^.+@.+\..+$/i,
        msg: {
            m1: '请输入邮箱',
            m2: '请输入正确邮箱',
            m3: '邮箱已绑定其他账户，请重新输入'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetEmail.prototype, {
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
     * 保存 
     * @parma string {1} value 昵称
     */
    _save: function(email) {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modudtal',
            data: {
                mod: 2,
                email: email
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.save = false;
            },
            success: function(response) {
                var rpco = response.rpco;

                // 处理
                switch(rpco) {
                    case 200:
                        // 
                        util.href('set.html');
                        break;
                    // 邮箱已存在
                    case 40016:
                        util.alert(that.options.msg.m3);
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
            // 修改值
            value = $('#value').val() || '';

        // 校验
        if(!that.options.requestState.save) { return false; }
        // 值
        if(!value) {
            util.tip(that.options.msg.m1);
            return false;
        }
        if(!that.options.emailReg.test(value)) {
            util.tip(that.options.msg.m2);
            return false;
        }

        // 保存

        /*// debug star
        util.href('set.html');
        return;
        // debug end*/

        that._save(value);
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
    }
})