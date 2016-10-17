var root = window || {},
    util = root.util || {};

var SelectDatePlug = function(opt) {
    var that = this;

    this.options = $.extend({
        // 确定回调函数
        okFn: function() { that.el.hide(); },
        // 取消回调函数
        canFn: function() { that.el.hide(); },
        // 下拉框插件对象
        selectPlug: null,
        // iscroll对象
        iscroll: {
            year: null,
            month: null,
            day: null
        },
        // 显示名称后缀
        nameSuffix: {
            year: '年',
            month: '月',
            day: '日'
        },
        // 数据对象
        select: {
            year: null,
            month: null,
            day: null
        },
        // 宽度
        width: {
            year: '33%',
            month: '22%',
            day: '24%'
        },
        // 
        sel: '.js-selectDateDialog',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);

    // 自执行
    this.init();
};

$.extend(SelectDatePlug.prototype, {
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

        // 设置下拉列表数据
        that.setSelectData();
    },
    /**
     * 设置下拉列表数据
     */
    setSelectData: function() {
        var that = this,
            // 年
            yearData = that.options.select.year = {
                width: that.options.width.year,
                scrollEnd: function() {
                    that.reLoadDaySelectData();
                },
                selectData: that.getYearSelectData()
            },
            // 月
            monthData = that.options.select.month = {
                width: that.options.width.month,
                scrollEnd: function() {
                    that.reLoadDaySelectData();
                },
                selectData: that.getMonthSelectData()
            },
            // 日
            dayData = that.options.select.day = {
                width: that.options.width.day,
                scrollEnd: function() {},
                selectData: that.getDaySelectData()
            },
            // 下拉框插件数据
            selectList= [];

        // 获取年展示数据
        selectList.push(yearData);
        // 获取月展示数据
        selectList.push(monthData);
        // 获取日展示数据
        selectList.push(dayData);

        // 创建下拉对象
        that.options.selectPlug = new SelectPlug({
            okFn: that.options.okFn,
            canFn: that.options.canFn,
            selectList: selectList
        });
        
        // 年iscroll对象
        that.options.iscroll.year = that.options.selectPlug.options.iscroll[0];
        // 月iscroll对象
        that.options.iscroll.month = that.options.selectPlug.options.iscroll[1];
        // 日iscroll对象
        that.options.iscroll.day = that.options.selectPlug.options.iscroll[2];
    },
    /**
     * 重新加载day数据
     */
    reLoadDaySelectData: function() {
        var that = this,
            // 下拉插件对象
            selectPlug = that.options.selectPlug,
            // 年值
            yearValue = that.getYear(),
            // 月值
            monthValue = that.getMonth(),
            // 
            selectData = that.getDaySelectData(yearValue, monthValue);

        // 重新设置数据集合
        that.options.select.day.selectData = selectData;
        // 重新加载日iscroll对象
        that.options.iscroll.day = selectPlug.reLoadSelectData(that.options.iscroll.day, that.options.select.day);
    },
    /**
     * 获取年
     */
    getYear: function() {
        var that = this;
        return that.options.selectPlug.getSelectValue(that.options.iscroll.year);
    },
    /**
     * 获取月
     */
    getMonth: function() {
        var that = this;
        return that.options.selectPlug.getSelectValue(that.options.iscroll.month);
    },
    /**
     * 获取日
     */
    getDay: function() {
        var that = this;
        return that.options.selectPlug.getSelectValue(that.options.iscroll.day);
    },
    /**
     * 设置年
     */
    setYear: function(year) {
        var that = this,
            // 
            wrapperEL = $(that.options.iscroll.year.wrapper),
            // 目标选中的下标
            selectIndex = wrapperEL.find('li[value="' + year + '"]').index();

        // 到达目标页
        that.options.iscroll.year.goToPage(0, selectIndex);
    },
    /**
     * 设置月
     */
    setMonth: function(month) {
        var that = this,
            // 
            wrapperEL = $(that.options.iscroll.month.wrapper),
            // 目标选中的下标
            selectIndex = wrapperEL.find('li[value="' + month + '"]').index();

        // 到达目标页
        that.options.iscroll.month.goToPage(0, selectIndex);
    },
    /**
     * 设置日
     */
    setDay: function(day) {
        var that = this,
            // 
            wrapperEL = $(that.options.iscroll.day.wrapper),
            // 目标选中的下标
            selectIndex = wrapperEL.find('li[value="' + day + '"]').index();

        // 到达目标页
        that.options.iscroll.day.goToPage(0, selectIndex);
    },
    /**
     * 获取年下拉列表数据
     * @result {array}{1} selectData 数据列表
     *         {string}{1} name 数据显示名称
     *         {string}{1} value 数据值
     */
    getYearSelectData: function() {
        var that = this,
            // 当前年
            curYear = new Date().getFullYear(),
            selectData = [/*{
                name: '请选择',
                value: ''
            }*/];

        // 拼接数据
        for(var i = curYear; i >= 2016; i--) {
            // 放入值
            selectData.push({
                name: i + that.options.nameSuffix.year,
                value: i
            });
        }
        return selectData;
    },
    /**
     * 获取月下拉列表数据
     * @result {array}{1} selectData 数据列表
     *         {string}{1} name 数据显示名称
     *         {string}{1} value 数据值
     */
    getMonthSelectData: function() {
        var that = this,
            selectData = [/*{
                name: '请选择',
                value: ''
            }*/];

        // 拼接数据
        for(var i = 1; i <= 12; i++) {
            // 放入值
            selectData.push({
                name: i + that.options.nameSuffix.month,
                value: i
            });
        }
        return selectData;
    },
    /**
     * 获取日下拉列表数据
     * @parma {string}{1} year 年
     * @parma {string}{1} month 月
     * @result {array}{1} selectData 数据列表
     *         {string}{1} name 数据显示名称
     *         {string}{1} value 数据值
     */
    getDaySelectData: function(year, month) {
        var that = this,
            month = month || '1',
            day = 0,
            selectData = [/*{
                name: '请选择',
                value: ''
            }*/];

        // 计算天数
        switch(month) {
            // 31天
            case '1':
            case '3':
            case '5':
            case '7':
            case '8':
            case '10':
            case '12':
                day = 31;
                break;
            // 30天
            case '4':
            case '6':
            case '9':
            case '11':
                day = 30;
                break;
            // 特殊2月
            case '2':
                day = year % 4 === 0 ? 29 : 28;
        }

        // 拼接数据
        for(var i = 1; i <= day; i++) {
            // 放入值
            selectData.push({
                name: i + that.options.nameSuffix.day,
                value: i
            });
        }
        return selectData;
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

    }
});