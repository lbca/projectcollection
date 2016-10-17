var root = window || {},
    util = root.util || {};

var NeiGouCity = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(NeiGouCity.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();
        that.addEvent();
        //that.loadGoBack();
    },
    // /**
    //  * 加载返回按钮
    //  */
    // loadGoBack: function() {
    //     var ou = util.getHrefParma().ou;
    //     // 加载返回按钮
    //     ou && $('.goBack').attr('href', ou).show();
    // },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this,
            hrefParma = that.options.hrefParma,
            proId = hrefParma.p || '';
        // 获取市编码
        that.getCity(proId);
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
     * 获取市
     * @parma {number}{1} proId 省编号
     */
    getCity: function(proId) {
        var that = this;

        // 请求...
        util.api({
            surl: root.PVC_API_PATH + proId + '.json',
            type: 'get',
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                // 渲染页面
                that.renderItem(response.cld);
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
            // 市id
            var cityId = $(this).attr('val') || '',
                // 市名称
                cityName = $(this).text() || '',
                // 发送参数
                sendParma = {
                    //pt: hrefParma.pt,
                    c: cityId,
                    //ct: cityName,
                    cbu: hrefParma.cbu
                };

            // 拼接参数
            hrefParma.gname && (sendParma.gname = hrefParma.gname);
            hrefParma.mob && (sendParma.mob = hrefParma.mob);
            hrefParma.refid && (sendParma.refid = hrefParma.refid);
            hrefParma.foi && (sendParma.foi = hrefParma.foi);

            // 业务主键
            hrefParma.b && (sendParma.b = hrefParma.b);
            util.href('neigoudistrict.html', sendParma);
            
            /*$('li').removeClass('cur');
            $(this).addClass('cur');
            // 保持勾选效果
            setTimeout(function() {
                util.href('areadistrict.html', sendParma);
            }, 100);*/
        });
    }
})