 var root = window || {},
    util = root.util || {};

var Index = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(Index.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();
        // 加载事件
        that.addEvent();
    },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this;
        // 加载页面布局
        that.loadPageLayout();
        // 显示
        $('.container').show();
    },
    /**
     * 加载页面布局
     */
    loadPageLayout: function() {
        var that = this,
            // 文档宽
            width = $(document).width(),
            // 每一项元素
            els = $('.list-labelvalue .li-div');

        // 大于等于375时图标一行三个
        if(width >= 375) {
            width = '33.3%';
        } else {
            width = '50%';
        }

        // 初始化居中状态
        els.css('text-align', 'left');

        // 遍历设置居中状态
        $('.list-labelvalue').each(function() {
            // 
            $('.li-div', this).each(function(i, n) {
                // 
                switch(width) {
                    // 
                    case '50%':
                        // 第二个靠中间
                        (i % 2 === 1) && $(n).css('text-align', 'center');
                        break;
                    // 
                    case '33.3%':
                        // 第二个靠中间
                        (i % 3 === 1) && $(n).css('text-align', 'center');
                        // 第三个靠右排
                        (i % 3 === 2) && $(n).css('text-align', 'right');
                        break;
                }
            });
        });

        // 设置宽度
        els.width(width);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 页面改变大小
        $(window).resize(function() {
            // 加载页面布局
            that.loadPageLayout();  
        });

    }
})