var root = window || {},
    util = root.util || {};

var MyShare = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma()
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(MyShare.prototype, {
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
        // 获取我的分享详情
        that.getMyShare();
    },
    /**
     * “我的分享”详情信息获取
     */
    getMyShare: function() {
        var that = this;



/*// debug start
var response = {
    rpco: 200,
    body: {
        nick: '落笔成爱',
        hporturl: 'http://img.woyaogexing.com/2016/03/13/62f2267f025b77d3!200x200.jpg',
        accatt: 88,
        accsc: 8000
    }
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 渲染“我的分享”
        that.renderMyShare(body);
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end
*/


        // 请求...
        util.api({
            surl: root.BSNS_API_PATH + 'myshare',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 渲染“我的分享”
                        that.renderMyShare(body);
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        }); 
    },
    /**
     * 渲染“我的分享””
     * @parma {object}{1} body “我的分享”信息对象
     */
    renderMyShare: function(body) {
        var that = this;

        // 昵称
        body.nick && $('#nick').html(body.nick);
        // 用户头像
        body.hporturl && $('#hporturl').attr('src', body.hporturl);
        // 累计的关注
        body.accatt && $('#accatt').html(body.accatt);
        /*// 累计的积分
        body.accsc && $('#accsc').html(body.accsc);*/

    },
    /**
     * 创建专属链接
     */
    creatLink: function() {
        var that = this;


/*// debug start
var response = {
    rpco: 200,
    body: {
        tk: '564654564654564564564645646465'
    }  
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 跳转分享页
        body.tk && util.href('invite.html', {tk: body.tk});
        break;
    default:
        util.tip('生成失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.BSNS_API_PATH + 'getk',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 跳转分享页
                        body.tk && util.href('invite.html', {tk: body.tk});
                        break;
                    default:
                        util.tip('生成失败')
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

        // “添加证件”点击事件
        that.el.on(click, '#crtlink', function() {
            // 创建分享链接
            that.creatLink();
        });
    }
})