var root = window || {},
    util = root.util || {};

var AssetType = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        sel: ''
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AssetType.prototype, {
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
     *保存
     */
    save: function() {
        util.api({
            'url': '',
            'type': 'post',
            success: function(response) {

            }
        });
    },
    /**
     * 业务处理
     * @parma string {1} elId 元素id
     */
    switchOperate: function(elId) {
        var that = this,
            parmas = {};

        switch (elId) {
            // 实物资产
            case "entityAsset":
                util.href('assetlist.html');
                break;
            // 其他
            default:
                // nothing      
        }
    },
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*类型单击事件*/
        that.el.on(click, '#list li', function() {
            that.switchOperate(this.id);
        });
    }
})