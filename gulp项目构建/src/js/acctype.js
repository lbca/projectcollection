var root = window || {},
    util = root.util || {};

var AccType = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        sel: ''
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccType.prototype, {
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

        /*会员卡类型点击事件*/
        that.el.on(click, '#list li', function() {
            /*// 显示勾选效果
            $('#list li').removeClass('cur');
            $(this).addClass('cur');
            // 保持勾选效果
            setTimeout(function() {
                util.href('accinput.html', { actype: $(this).attr('val') });
            }, 100);*/

            util.href('accinput.html', { actype: $(this).attr('val') });
        });
    }
})