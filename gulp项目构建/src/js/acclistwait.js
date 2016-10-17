var root = window || {},
    util = root.util || {};

var AccListWait = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccListWait.prototype, {
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
            hrefParma = that.options.hrefParma,
            sendData = {
                // 会员类型
                actype: hrefParma.actype,
                // 会员手机号
                acphone: hrefParma.acphone,
                // 全局唯一编码
                uiqcd: hrefParma.uiqcd
            };
        
        // 获取账户列表
        that.getAcclist(sendData);
    },
    /**
     * 渲染会员账户列表
     * @parma {array}{1} aclist 证件集合
     */
    renderAccountList: function(aclist) {
        var that = this,
            aclist = aclist || [],
            aclistStr = '';

        // 
        $.each(aclist, function(i, n) {
            aclistStr += '<li val="' + n.acnum + '" acrdm="' + n.acrdm + '">' + n.acnum + '</li>';
        });
        // 渲染
        aclistStr && $('#list').html(aclistStr).show();   
    },
    /**
     * 获取账户列表
     * @parma {object}{1} 请求数据
     *        {number}{1} actype 会员账户类型
     *        {number}{1} acphone 会员账户手机号
     *        {number}{1} uiqcd 短信验证码时间戳
     */
    getAcclist: function(sendData) {
        var that = this;



/*// debug start
var response = {
    rpco: 200,
    //rpco: 404,
    body: {
        aclist: [1111111,2222222,333333333,444444444,55555555555,6666666666666,7777777777,8888888888,9999999999,1000000000000000]
    }  
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 渲染
        that.renderAccountList(body.aclist);
        break;
    // 没有找到对应数据
    case 404:
        $('#noList').show();
        break;
    default:
        util.tip('查询失败')
}
return;
// debug enb*/


        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'unacclist',
            data: sendData,
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 渲染
                        that.renderAccountList(body.aclist);
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
     * DOM事件代码
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*选项单击事件*/
        that.el.on(click, '.container li', function() {
            var parmas = {
                    actype: hrefParma.actype,
                    acphone: hrefParma.acphone,
                    acnum: $(this).attr('val'),
                    acrdm: $(this).attr('acrdm')/*,
                    mac: hrefParma.mac,
                    uiqcd: hrefParma.uiqcd*/
                };
            // 跳转
            hrefParma.cbu && util.href(hrefParma.cbu, parmas);
        });
    }
})