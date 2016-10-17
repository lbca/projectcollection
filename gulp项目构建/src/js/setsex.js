var root = window || {},
    util = root.util || {};

var SetSex = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        msg: {
            m1: '请选择性别',
            m2: '保存成功'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetSex.prototype, {
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

        // 性别
        hrefParma.sex && $('#list li[val="' + hrefParma.sex + '"]').addClass('cur');
    },
    /**
     * _保存
     * @parma {number}{1} sex 性别，0：未设置，1：女性，2：男性。
     */
    _save: function(sex) {
        var that = this;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modudtal',
            data: {
                mod: 4,
                sex: sex
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
            sex = $('#list .cur').attr('val');

        if(!that.options.requestState.save) { return false; }

        // 非空验证
        if(!sex) {
            util.tip(that.options.msg.m1);
            return false;
        }

        /*// debug start
        util.href('set.html');
        return false;
        // debug end*/
        that._save(sex);
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

        /*性别选择*/
        that.el.on(click, '#list li', function() {
            $('#list li').removeClass('cur');
            $(this).addClass('cur');
        });
    }
})