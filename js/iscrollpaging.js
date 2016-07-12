var root = window || {},
    util = root.util || {};

var IscrollPaging = function(opt) {
    // 配置
    this.options = $.extend({
        sel: '.iscrollpading',
        // 下拉明细项容器选择器
        pullListSel: '.iscrollpading-list', 
        // 下拉显示文字标签选择器
        pullTextSel: '.iscrollpading-pulltext', 
        // iscroll对象
        scroll: null,
        // iscroll对象配置
        scrollOption: {
            // 鼠标滚轮
            mouseWheel: true,
            // 滚动轴
            scrollbars: true,
            // 滚动轴渐变
            fadeScrollbars: true,
            // 滚动事件监听级别
            probeType: 2,
            // 启动单击事件
            click: true
        },
        // 拉动多大距离去加载数据
        pullWidthForLoad: 20,
        // 最后一次滚动位置
        lastPullY: 0,
        // 滚动结束回调事件
        loadDataFun: null,
        // 当前页码
        currentPage: 1,
        // 每页显示数据量
        pageDataCount: 20,
        // 总数据条数
        totalCount: 0,
        // 总页数
        totalPage: 0,
        // 最后一页
        lastPage: false,
        // 消息文字
        msg: {
            m1: '上拉显示更多',
            m2: '释放显示更多',
            m3: '正在加载',
            m4: '最后一页'
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(IscrollPaging.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        // 加载
        that.load();
        // 
        /*that.addEvent();*/
    },
    /**
     * 加载
     */
    load: function() {
        var that = this,
            // 总页数
            totalPage = that.options.totalPage || Math.ceil(that.options.totalCount / that.options.pageDataCount);

        // 加载iscroll
        that.options.scroll = new IScroll(that.options.sel, that.options.scrollOption);
        // 存在分页
        if(totalPage > 1) {
            // 放入页面标签
            $(that.options.pullListSel).append('<span class="iscrollpading-pulltext">' + that.options.msg.m1 + '</span>');
            // 绑定事件
            that.addEvent();
            // 重新加载iscroll
            that.options.scroll.refresh();
        }
    },
    /**
     * 注销iscroll
     */
    scrollDestroy: function() {
        var that = this;
        that.options.scroll && that.options.scroll.destroy();
    },
    /**
     * 刷新iscroll
     */
    scrollRefresh: function() {
        var that = this;
        that.options.scroll && that.options.scroll.refresh();
    },
    /**
     * 加载分页信息
     * @parma {object}{1} opt 配置属性
     *        {number}{1, 0} currentPage 当前页码
     *        {number}{1, 0} pageDataCount 每页显示数据量
     *        {number}{1, 0} totalCount 总数据条数
     *        {number}{1, 0} totalPage 总页数
     *        {boolean}{1, 0} lastPage 最后一页
     */
    reLoadPagingOption: function(opt) {
        var that = this;
        // 合并配置
        $.extend(that.options, opt);
        // 总页数
        that.options.totalPage = that.options.totalPage || Math.ceil(that.options.totalCount / that.options.pageDataCount);
        // 设置最后一页状态
        that.options.lastPage = that.options.totalPage == that.options.currentPage;
        // 重置下拉提示语
        // 正在加载
        $(that.options.pullTextSel).html(that.options.msg.m1);
        // 最后一页
        that.options.lastPage && $(that.options.pullTextSel).html(that.options.msg.m4);
        // 重新加载iscroll
        that.options.scroll.refresh();
    },
    /**
     * 滚动事件
     * @parma {object}{1} scroll iscroll对象
     */
    scroll: function(scroll) {
        var that = this,
            // 拉动距离
            pullWidth = scroll.maxScrollY - scroll.y;

        // 最后一页，停止加载
        if(that.options.lastPage) { return false; }

        // 释放显示更多
        if(pullWidth >= that.options.pullWidthForLoad) {
            //
            $(that.options.pullTextSel).html(that.options.msg.m2);
        } 
        // 上拉显示更多
        else if(pullWidth < that.options.pullWidthForLoad) {
            //
            $(that.options.pullTextSel).html(that.options.msg.m1);
        }

        // 记录最后一次滚动位置
        that.options.lastPullY = scroll.y;
    },
    /**
     * 滚动结束事件
     * @parma {object}{1} scroll iscroll对象
     */
    scrollEnd: function(scroll) {
        var that = this,
            // 拉动距离
            pullWidth = scroll.maxScrollY - that.options.lastPullY;

        // 最后一页，停止加载
        if(that.options.lastPage) { return false; } 
        // 释放显示更多
        if(pullWidth >= that.options.pullWidthForLoad) {
            // 加载数据
            that.loadData();
        }
    },
    /**
     * 加载数据
     */
    loadData: function() {
        var that = this;
        // 正在加载
        $(that.options.pullTextSel).html(that.options.msg.m3);
        // 加载数据
        that.options.loadDataFun && that.options.loadDataFun();
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick();

        // 监听滚动事件
        that.options.scroll.on('scroll', function() {
            // 滚动事件
            that.scroll(this);
        });

        // 监听滚动结束事件
        that.options.scroll.on('scrollEnd', function() {       
            // 滚动结束事件
            that.scrollEnd(this);
        });

        // 加载数据点击事件
        that.el.on(click, that.options.pullTextSel, function() {
            // 最后一页，停止加载
            if(that.options.lastPage) { return false; } 

            // 加载数据
            that.loadData();
        });
    }
})