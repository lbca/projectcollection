var root = window || {},
    util = root.util || {};

var NeiGouInfo = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        //
        msg: {
            m1: '909内购会活动登记已结束'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(NeiGouInfo.prototype, {
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
        // 获取活动信息
        that.getActiveInfo();
    },
    /**
     * 获取活动信息
     */
    getActiveInfo: function() {
        var that = this,
            hrefParma = that.options.hrefParma;


/*// debug star
var response = {
    rpco: 40005,
    body: {
        mob: 13581664235,
        gname: '高启文',
        regid: 123,
        refid: '5456465465465465',
        foi: '1,2,3',
        atstate: 1,
        tkseq: 'G233 2132 133',
        regtxt: '北京市丰台区',
        qrcode: '//img.gomegj.com/guanjia/v1/gjewm.png'
    }
};
var rpco = response.rpco,
    body = response.body || {};

// 处理
switch(rpco) {
    // 存在
    case 200:
        // 渲染
        that.renderActiveInfo(body);
        break;
    // 未参加
    case 40005:
        //
        util.tip(that.options.msg.m1, {duration: 100000});
        // 隐藏内容区
        $('.container').hide();
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/



        // 请求
        util.api({
            surl: root.PURCHASING_API_PATH + 'getGcInfo',
            type: 'get',
            beforeSend: function() {
                // 加载提示
                //util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {};

                // 处理
                switch(rpco) {
                    // 存在
                    case 200:
                        // 渲染
                        that.renderActiveInfo(body);
                        break;
                    // 未参加
                    case 40005:
                        //
                        util.tip(that.options.msg.m1, {duration: 100000});
                        // 隐藏内容区
                        $('.container').hide();
                        break;
                    default:
                        util.tip('查询失败')
                }
                
            },
            complete: function() {
                // 移除提示
                //util.remComShow();
            }
        });
    },
    /**
     * 渲染活动信息
     * @parma {object}{1} body 活动信息对象
     */
    renderActiveInfo: function(body) {
        var that = this,
            // 
            hrefParma = that.options.hrefParma,
            // 活动状态
            atstate = body.atstate;

        // 姓名
        body.gname && $('.js_name').html(body.gname);
        // 手机
        body.mob && $('.js_phone').html(body.mob);
        // 推荐人编号
        body.refid && $('.js_sendPerson').html(body.refid);
        // 区域
        body.regtxt && $('.js_areaval').html(body.regtxt);
        // 入场券号
        body.tkseq && $('.js_tkseq').html(body.tkseq);
        // 二维码
        body.qrcode && $('.js_ewm').attr('src', body.qrcode);
        // 感兴趣品类
        //that.options.activeInfo.foi = body.foi || '';
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // “使用说明”单击事件
        that.el.on(click, '#useRule', function() {
            // 
            $('#dialog').removeClass('dn');
        });

        // “使用说明”关闭按钮
        that.el.on(click, '#dialogClose', function() {
            $('.dialog').addClass('dn');
        });
        
    }
})