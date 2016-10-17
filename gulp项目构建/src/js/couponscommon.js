var root = window || {},
    util = root.util || {};

var CouponsCommon = function(opt) {
    this.options = $.extend({
    	cur: '',
    	// 导航列表
        navs : [
        	{name: '未使用', href: 'javascript:;', value: 1},
        	{name: '已过期', href: 'javascript:;', value: 2},
        	{name: '已使用', href: 'javascript:;', value: 3}
        ],
        // 点击标签，不跳页面，进行转换
        convertNav: false
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);

    // 自调用
    this.init();
};

$.extend(CouponsCommon.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        // 渲染导航栏
    	that.renderNav();
        // 绑定事件
        that.addEvent();
    },
    /**
     * 跳转下一个菜单
     */
    /*nextNav: function() {
        var that = this,
            // 当前选中菜单下标
            cridx = $('.nav-tab:first .cur').index() || 0,
            // 最大下标
            maxidx = $('.nav-tab:first a').length - 1,
            // 跳转路径
            url;

        // 下一菜单下表
        cridx += 1;
        // 最小为0
        maxidx = maxidx < 0 ? 0 : maxidx;
        // 超过最大下标时，设置为0
        cridx = cridx > maxidx ? maxidx : cridx;
        // 获取路径
        url = $('.nav-tab:first a:eq(' + cridx + ')').attr('href');

        // 跳转
        url && util.href(url);
    },*/
    /**
     * 加载导航
     */
    renderNav: function() {
    	var that = this,
    		navs = that.options.navs || [],
    		cur = that.options.cur,
    		navHTML = '';

    	for(var i = 0, j = navs.length; i < j; i++) {
    		navHTML += '<a ' + (navs[i].value === cur ? 'class="cur" href="javascript:;"' : 'href="' + navs[i].href + '"') + ' value="' + navs[i].value + '"' + '>'
                    +      '<span>' + navs[i].name + '</span>'
                    +  '</a>';
    	}

    	// 放入
    	$('.nav-tab:first').html(navHTML);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 导航单击事件
        that.options.convertNav && $('.nav-tab:first').find('> a').on(click, function() {
            // 移除选中状态
            $('.nav-tab:first').find('.cur').removeClass('cur');
            // 当前选中
            $(this).addClass('cur');
        });
    }
});