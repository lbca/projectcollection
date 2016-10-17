var root = window || {},
    util = root.util || {};

var Invite = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        msg: {
            m1: '当前链接已失效'
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(Invite.prototype, {
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

/*// debug start
hrefParma.tk = '245456465465';
// debug end
*/


        // 根据token值获取二维码及其他分享信息
        hrefParma.tk && that.getEwmAndInfoByTk(hrefParma.tk);
    },
    /**
     * 根据token获取认为吗及其他信息
     * @parma {String}{1} tk token唯一标记
     */
    getEwmAndInfoByTk: function(tk) {
        var that = this;

/*
// debug start
var response = {
    rpco: 200,
    body: {
        uri: 'http://qr.api.cli.im/qr?data=www.gome.com.cn&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=c46c0b4bb77565f6dc2558a7ca0f260e',
        nick: '我是昵称',
        hporturl: 'http://img.lanrentuku.com/img/allimg/1508/51-150R51UU30-L.jpg'
    }
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 渲染页面信息
        that.renderEwmAndInfo(body);
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.BSNS_API_PATH + 'tkewmxx',
            data: {
                tk: tk
            },
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 渲染页面信息
                        that.renderEwmAndInfo(body);
                        break;
                    // 当前链接已失效
                    case 40001:
                        util.tip(that.options.msg.m1);
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        }); 
    },
    /**
     * 渲染页面信息
     * @parma {object}{1} body 二维码及详情对象
     */
    renderEwmAndInfo: function(body) {
        var that = this;

        // 二维码
        body.uri && $('#ewm').attr('src', body.uri);
        // 用户昵称
        body.nick && $('#nick').html(body.nick);
        // 用户头像url
        body.hporturl && $('#hporturl').attr('src', body.hporturl);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;
    }
})