var root = window || {},
    util = root.util || {};

var SelectPlug = function(opt) {
    this.options = $.extend({
        // select集合，[{width: '', default: 0, scrollEnd: null, selectData: [{name: '', value: ''}]}]
        selectList: [],
        // 确定回调函数
        okFn: function() { that.el.hide(); },
        // 取消回调函数
        canFn: function() { that.el.hide(); },
        // iscroll列表
        iscroll: [],
        // iscroll配置
        iScrollConfig: {
            //mouseWheel: true,
            // 关闭横向滚动
            scrollX: false, 
            // 开启纵向滚动
            scrollY: true,
            // 弹力动画效果
            bounce: false,
            // 开启系统纵向滚动轴
            //eventPassthrough: true,
            // 是否开启动量动画，关闭可以提升效率
            //momentum: false,
            // 滚动事件监听级别
            probeType: 3,
            //hScrollbar: false,
            // 以“a”分割
            snap: 'li'
        },
        // 
        sel: '.js-selectplug',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);

    // 自执行
    this.init();
};

$.extend(SelectPlug.prototype, {
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
        // 渲染遍历数据集合
        that.renderSelect(that.options.selectList);
        // 刷入iscroll
        that.initIscroll();
    },
    /**
     * 初始化iscroll
     */
    initIscroll: function() {
        var that = this;

        // 遍历
        $('.selectplug-data').each(function(i, n) {
            // 对应select数据对象
            var select = that.options.selectList[i] || {},
                // 
                iscroll = that.creatIscroll(n, select);

            // 放入列表
            that.options.iscroll.push(iscroll);
        });
    },
    /**
     * 创建iscroll
     * @parma {object}{1} select select数据对象
     * @return {object}{1} iscroll iscroll对象
     */
    creatIscroll: function(wrapper, select) {
        var that = this;
            // 
            iscroll = new IScroll(wrapper, that.options.iScrollConfig),
            // 
            zsEL = $(wrapper).find('.js-selectdatazs');
        // 系统必要滚动事件，用于同步虚拟和真实下拉框位置
        (function(zsEL) {
            // 
            iscroll.on('scroll', function() {
                // 同步虚拟和真实下拉框位置
                zsEL.css('top', this.y);
            });
        })(zsEL);
        // 绑定自定义事件
        // 用户点击屏幕，但是还未初始化滚动前
        select.beforeScrollStart && iscroll.on('beforeScrollStart', select.beforeScrollStart);
        // 初始化滚动后又取消
        select.scrollCancel && iscroll.on('scrollCancel', select.scrollCancel);
        // 开始滚动
        select.scrollStart && iscroll.on('scrollStart', select.scrollStart);
        // 滚动中
        select.scroll && iscroll.on('scroll', select.scroll);
        // 滚动结束
        select.scrollEnd && iscroll.on('scrollEnd', select.scrollEnd);
        // 轻击屏幕左、右
        select.flick && iscroll.on('flick', select.flick);

        return iscroll;
    },
    /**
     * 重新设置下拉列表数据
     * @parma {object}{1} iscroll iscroll对象 
     * @parma {object}{1} select 下拉列表数据对象
     * @return {object}{1} iscroll iscroll对象
     */
    reLoadSelectData: function(iscroll, select) {
        var that = this,
            // 下拉框外层容器
            selectDataEL = $(iscroll.wrapper),
            // 获取新html
            html = that.getSelectDataHtml(select.selectData);

        // 重新放入内容
        selectDataEL.html(html);
        // 注销
        that.scrollDestroy(iscroll);
        // 新建
        return that.creatIscroll(selectDataEL.get(0), select);
    },
    /**
     * 渲染下拉列表数据
     * @parma {array}{1} selectList 
     */
    renderSelect: function(selectList) {
        var that = this,
            // 每一项下拉框对象
            select,
            // 下拉框对象
            selectData,
            // 
            html = '';

        // 遍历select数据
        for(var i = 0, j = selectList.length; i < j; i++) {

            // 每项
            select = selectList[i];
            // select数据
            selectData = select.selectData || [];
            // 拼接自字符串
            html += '<div class="selectplug-data" ' + (select.width ? ('style="width: ' + select.width + ';"') : '') + '>'
                 +      that.getSelectDataHtml(selectData)
                 +  '</div>';
        }
        // 放入页面
        $('.js-selectplugSelected').html(html);
    },
    /**
     * 获取下拉列表内html
     * @parma {array}{1} selectData 下拉列表数据集合
     * @result {object} result 文档对象
     *         {string} htmlXN 虚拟文档片段
     *         {string} htmlZS 真实文档片段
     */
    getSelectDataHtml: function(selectData) {
        var that = this,
            // 虚拟文档
            htmlXN = '<ul class="selectplug-data-xn js-selectdataxn">',
            // 真实文档
            htmlZS = '<ul class="selectplug-data-zs js-selectdatazs">',
            // 
            html;

        // 拼接内容项
        for(var i = 0, j = selectData.length; i < j; i++) {
            htmlXN += '<li value="' + selectData[i].value + '">&nbsp;</li>';
            htmlZS += '<li class="js-selectdatazs" value="' + selectData[i].value + '">' + selectData[i].name + '</li>';
        }

        htmlXN += '</ul>';
        htmlZS += '</ul>';

        html = htmlXN + htmlZS;
        return html;
    },
    /**
     * 注销iscroll
     */
    scrollDestroy: function(iscroll) {
        var that = this;
        iscroll && iscroll.destroy();
    },
    /**
     * 刷新iscroll
     * @parma {object}{1} iscroll iscroll对象
     */
    scrollRefresh: function(iscroll) {
        var that = this;
        iscroll && iscroll.refresh();
    },
    /**
     * 刷新全部iscroll
     * @parma {object}{1} iscroll iscroll对象
     */
    refreshAllScroll: function() {
        var that = this,
            // 
            iscrollArray = that.options.iscroll;

        // 遍历所有iscroll
        for(var i = 0, j = iscrollArray.length; i < j; i++) {
            // 刷新
            iscrollArray[i] && iscrollArray[i].refresh();
        }
    },
    /**
     * 获取全部下拉列表值
     * @parma {array}{1} iscrollArray 下拉列表iscroll对象集合
     * @result {array}{1} result 下拉列表选中值集合
     */
    getAllSelectValue: function(iscrollArray) {
        var that = this,
            result = [];

        // 遍历获取所有值
        for(var i = 0, j = iscrollArray.length; i < j; i++) {
            // 获取单个值
            result.push(that.getSelectValue(iscrollArray[i]));
        }

        return result;
    },
    /**
     * 获取下拉列表值
     * @parma {object}{1} iscroll 下拉列表iscroll对象
     * @result {string}{1} result 当前下拉框选中值
     */
    getSelectValue: function(iscroll) {
        var that = this,
            // 下拉框外层容器
            selectDataEL = $(iscroll.wrapper),
            // 当前选中下标
            curIndex = Math.abs(iscroll.y / selectDataEL.find('.js-selectdataxn li:first').height()),
            // 当前选中元素
            curEL = selectDataEL.find('.js-selectdataxn li').eq(curIndex),
            // 返回值
            result = curEL.attr('value') || '';
        return result;
    },
    /**
     * 获取下拉列表显示值
     * @parma {object}{1} iscroll 下拉列表iscroll对象
     * @result {string}{1} result 当前下拉框选中显示值
     */
    getSelectLabelValue: function(iscroll) {
        var that = this,
            // 下拉框外层容器
            selectDataEL = $(iscroll.wrapper),
            // 当前选中下标
            curIndex = Math.abs(iscroll.y / selectDataEL.find('.js-selectdatazs li:first').height()),
            // 当前选中元素
            curEL = selectDataEL.find('.js-selectdatazs li').eq(curIndex),
            // 返回值
            result = curEL.html() || '';
        return result;
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 确定按钮单击事件
        that.el.on(click, '.js-okBtn', function() {
            // 确定回调
            that.options.okFn();
        });

        // 取消按钮单击事件
        that.el.on(click, '.js-canBtn', function() {
            // 取消回调
            that.options.canFn();
        });
    }
});