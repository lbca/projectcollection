/**************************************************************
 说明：此页面为公共地址设置页面，分为三级（areaprovince.html -> areacity.html -> areadistrict.html）。
 参数：@parma {string}{1, 0} b 业务主键
       @parma {string}{1, 0} callBackUrl 回调页面，默认：发起页
 **************************************************************/
var root = window || {},
    util = root.util || {};

var NeiGouProvince = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        sel: ''
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(NeiGouProvince.prototype, {
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
        // 获取省
        that.getProvince();
    },
    /**
     * 渲染页面项
     * @parma {array}{1} arr 数据数组
     */
    renderItem: function(arr) {
        var html = '';
        arr = arr || [];

        for(var i = 0, j = arr.length; i < j; i++) {
            html += '<li val="' + arr[i].C + '">' + arr[i].N + '</li>';
        }
        $('#list').html(html);
    },
    /**
     * 获取省
     */
    getProvince: function() {
        var that = this;

        // 请求...
        util.api({
            surl: root.PVC_API_PATH + 'province.json',
            type: 'get',
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                // 渲染页面
                that.renderItem(response.province);
            },
            complete: function() {
                // 移除提示
                util.remComShow();
            }
        });  
    },
    /**
     * 事件代码
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;
        /*选项单击事件*/
        that.el.on(click, '#list li', function() {
            var proId = $(this).attr('val') || '',
                proName = $(this).text() || '',
                // 发送参数
                sendParma = {
                    p: proId,
                    //pt: proName,
                    cbu: hrefParma.cbu || hrefParma.ou
                };

            // 拼接参数
            hrefParma.gname && (sendParma.gname = hrefParma.gname);
            hrefParma.mob && (sendParma.mob = hrefParma.mob);
            hrefParma.refid && (sendParma.refid = hrefParma.refid);
            hrefParma.foi && (sendParma.foi = hrefParma.foi);

            // 业务主键
            hrefParma.b && (sendParma.b = hrefParma.b);
            // 跳转
            util.href('neigoucity.html', sendParma);
            /*$('li').removeClass('cur');
            $(this).addClass('cur');
            // 保持勾选效果
            setTimeout(function() {
                // 跳转
                util.href('areacity.html', sendParma);
            }, 100);*/

         

        });
    }
})