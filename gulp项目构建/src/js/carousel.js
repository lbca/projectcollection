var root = window || {},
    util = root.util || {};

var Carousel = function(opt) {
    this.options = $.extend({
        // 轮播对象集合
        carouselList: {},
        // iscroll配置
        iScrollConfig: {
            // 
            //mouseWheel: true,
            // 开启横向滚动
            scrollX: true, 
            // 关闭纵向滚动
            scrollY: false, 
            // 开启系统纵向滚动轴
            eventPassthrough: true,
            // 是否开启动量动画，关闭可以提升效率
            momentum: false,
            //hScrollbar: false,
            // 以“a”分割
            snap: 'a'            
        },
        // 轮播间隔时间，单位：毫秒
        carouselTime: 5000,
        // 触摸启动定时器，等待间隔，单位：毫秒
        carouselWaitTime: 3000,
        // 轮播定时器集合
        carouselIntervalList: {},
        // 轮播是否刷新过（用于避免多次复制轮播元素）
        carouselPassFirstRefresh: {}
    }, opt);

};

$.extend(Carousel.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        // 加载
        that.load();
        // 
        that.addEvent();
    },
    /**
     * 加载
     */
    load: function() {
        var that = this;
        // 加载轮播
        that.loadCarousel();
        // 跳转应该显示的第一项
        that.showFirstCarouselItem();
        // 绑定事件
        that.bindCarouselEvent();
        // 开启轮播定时切换
        that.setCarouselInterval();
    },
    /**
     * 加载轮播
     */
    loadCarousel: function() {
        var that = this;
        // 计算轮播大小
        that.calculateCarousel();
        // 刷新全部轮播对象
        that.refreshCarousel();
    },
    /**
     * 计算轮播
     */
    calculateCarousel: function() {
        var that = this;

        // 遍历刷入轮播
        $('.carousel').each(function(i, n) {
            // 最大宽度
            var maxWth = $(n).width(),
                // 轮播元素个数
                itmCont = $('.item-blk > *', n).length,
                // 首个轮播元素
                firstEL,
                // 末尾轮播元素
                lastEL;

            // 轮播项大于1时，需动态首尾新增对象
            if(itmCont > 1 && !that.options.carouselPassFirstRefresh[i]) {
                // 记录已经刷新
                that.options.carouselPassFirstRefresh[i] = true;
                // 新增两个元素
                itmCont += 2;
                //
                firstEL = $('.item-blk > *:first', n).clone();
                lastEL = $('.item-blk > *:last', n).clone();
                // 复制首个元素到尾部
                firstEL.insertAfter($('.item-blk > *:last', n));
                // 复制尾部元素到首个
                lastEL.insertBefore($('.item-blk > *:first', n));
            }

            // 设置元素大小
            $('.item-blk > *', n).width(maxWth);
            // 设置元素容器的大小
            $('.item-blk', n).width(maxWth * itmCont).css('visibility', 'visible');
        });
    },
    /**
     * 刷新轮播
     */
    refreshCarousel: function() {
        var that = this;

        // 遍历刷入轮播
        $('.carousel').each(function(i, n) {
            // 轮播元素个数
            var itmCont = $('.item-blk > *', n).length;

            // 轮播数小于2时，返回
            if(itmCont < 2) { return true; }

            // 
            that.options.carouselList[i] = that.refreshItemCarousel(n, that.options.carouselList[i]);
        });
    },
    /**
     * 刷新单个轮播
     * @parma {object}{1} carcontainer 轮播容器
     * @parma {object}{0, 1} carousel 轮播控制器
     * @return {object} carousel
     */
    refreshItemCarousel: function(carcontainer, carousel) {
        var that = this;
        // 存在则刷新，不存在就新建
        carousel ? carousel.refresh() : (carousel = new IScroll(carcontainer, that.options.iScrollConfig));
        return carousel;
    },
    /**
     * 跳转应该显示的第一项
     */
    showFirstCarouselItem: function() {
        var that = this;

        // 遍历轮播
        $('.carousel').each(function(i, n) {
            // 获取轮播对象
            var carousel = that.options.carouselList[i],
                // 轮播元素个数
                itmCont = $('.item-blk > *', n).length;

            // 轮播数小于2时，返回
            if(itmCont < 2) { return true; }

            // 跳转应该显示的第一项
            carousel.goToPage(1, 0, 0);
        });
    },
    /**
     * 设置轮播定时器
     */
    setCarouselInterval: function() {
        var that = this;

        // 遍历轮播
        $('.carousel').each(function(i, n) {
            // 轮播元素个数
            var itmCont = $('.item-blk > *', n).length;

            // 轮播数小于2时，返回
            if(itmCont < 2) { return true; }

            // 设置定时器
            that.setItemCarouselInterval(i);
        });
    },
    /**
     * 设置轮播定时器
     * @parma {number}{1} carouselIndex 轮播下表
     */
    setItemCarouselInterval: function(carouselIndex) {
        var that = this;

        // 清除定时器
        clearInterval(that.options.carouselIntervalList[carouselIndex]);

        // 设置定时器
        that.options.carouselIntervalList[carouselIndex] = setInterval(function() {
            // 走下一页
            that.options.carouselList[carouselIndex].next();
        }, that.options.carouselTime);
    },
    /**
     * 绑定轮播事件
     */
    bindCarouselEvent: function() {
        var that = this;

        // 遍历轮播
        $('.carousel').each(function(i, n) {
            // 获取轮播对象
            var carousel = that.options.carouselList[i],
                // 轮播元素个数
                itmCont = $('.item-blk > *', n).length;

            // 不存在轮播对象
            if(!carousel) { return true; }
            // 轮播数小于2时，返回
            if(itmCont < 2) { return true; }

            // “滚动结束”事件
            carousel.on('scrollEnd', function() {
                // 当前页面
                var curPageIndex = this.currentPage.pageX;

                // 为首个时，快速转到最后一个，实现连滚效果
                if(curPageIndex === 0) {
                    carousel.goToPage(itmCont - 2, 0, 0);
                }
                // 为最后时，快速转到首个，实现连滚效果
                else if(curPageIndex === itmCont - 1) {
                    carousel.goToPage(1, 0, 0);
                }

                // 重新获取当前页
                curPageIndex = this.currentPage.pageX - 1;

                // 清空控制器选中状态
                $('.contrl-blk a', n).removeClass('cur');
                // 设置控制器选中
                $('.contrl-blk a', n).eq(curPageIndex).addClass('cur');
            });

            // “触摸开始”事件
            $(n).on('touchstart', function() {
                // 清除定时器
                clearInterval(that.options.carouselIntervalList[i]);
            });

            // “触摸结束”事件
            $(n).on('touchend', function() {
                // 等待间隔
                setTimeout(function() {
                    // 启动定时器
                    that.setItemCarouselInterval(i);
                }, that.options.carouselWaitTime);
            });

        });
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick();

        // 窗口大小改变事件
        $(window).on('resize', function() {
            // 加载轮播
            that.loadCarousel();
        });
    }
})