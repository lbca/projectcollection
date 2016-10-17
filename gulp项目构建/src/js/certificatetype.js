var root = window || {},
    util = root.util || {};

var CertificateType = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        sel: ''
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(CertificateType.prototype, {
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

        /*“添加证件”点击事件*/
        $('#list li').on(click, function() {
            var curEL = $(this);
            util.href('certificatedetail.html', { actype: curEL.attr('val') });
            /*// 显示勾选效果
            $('#list li').removeClass('cur');
            curEL.addClass('cur');
            // 保持勾选效果
            setTimeout(function() {
                util.href('certificatedetail.html', { actype: curEL.attr('val') });
            }, 100);*/
        });
    }
})