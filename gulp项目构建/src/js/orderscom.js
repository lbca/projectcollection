var root = window || {},
    util = root.util || {};

var OrdersCom = function(opt) {
    this.options = $.extend({
    	cur: '',
    	// 导航列表
        navs : [
        	{name: '待支付', href: 'sod/unpay'},
        	{name: '实物单', href: 'javascript:util.href(\'ordersety.html\');'},
        	{name: '服务单', href: 'sod/orderList'},
        	{name: '虚拟单', href: 'javascript:util.href(\'ordersvir.html\');'}
        ]
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);

    // 自调用
    this.init();
};

$.extend(OrdersCom.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
    	that.renderNav();    
    },
    /**
     * 跳转下一个菜单
     */
    nextNav: function() {
        var that = this,
            // 当前选中菜单下标
            cridx = $('nav:first .cur').index() || 0,
            // 最大下标
            maxidx = $('nav:first a').length - 1,
            // 跳转路径
            url;

        // 下一菜单下表
        cridx += 1;
        // 最小为0
        maxidx = maxidx < 0 ? 0 : maxidx;
        // 超过最大下标时，设置为0
        cridx = cridx > maxidx ? maxidx : cridx;
        // 获取路径
        url = $('nav:first a:eq(' + cridx + ')').attr('href');

        // 跳转
        url && util.href(url);
    },
    /**
     * 加载导航
     */
    renderNav: function() {
    	var that = this,
    		navs = that.options.navs || [],
    		cur = that.options.cur,
    		navHTML = '';

    	for(var i = 0, j = navs.length; i < j; i++) {
    		navHTML += '<a ' + (navs[i].name === cur ? 'class="cur" href="javascript:;"' : 'href="' + navs[i].href+ '"') + '><span>' + navs[i].name + '</span></a>';
    	}

    	// 放入
    	$('nav:first').html(navHTML);
    }
});