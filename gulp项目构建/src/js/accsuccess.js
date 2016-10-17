var root = window || {},
    util = root.util || {};

var AccSuccess = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        sel: ''
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccSuccess.prototype, {
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
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“添加证件”点击事件*/
        that.el.on(click, '#ok', function() {
            util.href('acclist.html');
        });
    }
})