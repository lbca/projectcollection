var root = window || {},
    util = root.util || {};

var SetPhoneDelete = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        sel: ''
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetPhoneDelete.prototype, {
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
     *保存
     */
    save: function() {
        util.api({
            'url': '',
            'type': 'post',
            success: function(response) {

            }
        });
    },
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“下一步”点击事件*/
        $('#ok').on(click, function() {
            util.href('set.html');
        });
    }
})