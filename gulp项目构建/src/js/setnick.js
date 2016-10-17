var root = window || {},
    util = root.util || {};

var SetNick = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 昵称正则
        nickReg: /^[^\s]+$/,
        msg: {
            m1: '请输入昵称',
            m2: '不能包含空格'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetNick.prototype, {
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
        // 初始化昵称
        hrefParma.nick && $('#value').val(util.decode(hrefParma.nick));
    },
    /**
     * 保存 
     * @parma string {1} value 昵称
     */
    _save: function(value) {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modudtal',
            data: {
                mod: 1,
                nick: value
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
                    default:
                        util.tip('保存失败');
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
        // 昵称规则
        if(!that.options.nickReg.test(value)) {
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