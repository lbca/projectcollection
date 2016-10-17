var root = window || {},
    util = root.util || {};

var AssetServiceRecord = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        asrlist: []
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AssetServiceRecord.prototype, {
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
     * 渲染资产服务记录
     * @parma {array}{1} asrlist 服务记录集合
     */
    renderAssetServiceRecordList: function(asrlist) {
        //var that = this,


    },
    /**
     * 获取资产服务记录
     */
    getAssetServiceRecordList: function() {
        var that = this;

        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'asserlist',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    asrlist = body.asrlist || [];

                // 处理
                switch(rpco) {
                    case 200:
                        that.options.asrlist = asrlist || [];
                        // 渲染
                        that.renderAssetServiceRecordList(asrlist);
                        break;
                    // 没有找到对应数据
                    case 404:
                        $('#noList').show();
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        }); 
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“添加证件”点击事件*/
        /*$('#list li').on(click, function() {
            util.href('AssetServiceRecord.html');
        });*/
    }
})