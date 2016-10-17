var root = window || {},
    util = root.util || {};

var SetPhoneFinish = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetPhoneFinish.prototype, {
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

        // 
        $('#phone').html(hrefParma.phone || '');
        // 业务处理
        hrefParma.operate === 'del' ? $('#del').show() : $('#mod').show();
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“下一步”点击事件*/
        that.el.on(click, '.js-ok', function() {
            util.href('set.html');
        });
    }
})