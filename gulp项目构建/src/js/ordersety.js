var root = window || {},
    util = root.util || {};

var OrdersEty = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 当前页码
        curpg: 1,
        // 每页条目数
        len: 15,
        // 总条目数
        tpage: 0,
        // 分页对象
        iscrollPaging: null,
        msg: {}
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(OrdersEty.prototype, {
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

        // 获取实物订单
        that.getEntityOrder(that.options.curpg, that.options.len);
    },
    /**
     * 获取实物订单
     * @parma {number}{1,0} curpg 当前页码
     * @parma {number}{1,0} len 每页条目数
     */
    getEntityOrder: function(curpg, len) {
        var that = this;



/*
// debug star
var response = {
    rpco: 200,
    msg: '',
    body: {
        tpage: 2,
        odlst: [{
            otn: 'aaaaaaaa',
            dodt: 1462052000000,
            odpri: 888886,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 1462052000000,
                gdsid: 'pd1111111',
                gdnm: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                gdpr: 1111111,
                gdnu: 10,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            },{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 1462052000000,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            },{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 1462052000000,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            },{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            },{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            },{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888888,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'bbbbbbbb',
            dodt: 2222222,
            odpri: 3333333,
            sodlst: [{
                odste: 1,
                otn: 'bbbbbbbb',
                dodt: 2222222,
                gdsid: 'pd1111111',
                gdnm: 'qwertyuiop',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }, {
            otn: 'aaaaaaaa',
            dodt: 11111111,
            odpri: 888881,
            sodlst: [{
                odste: 1,
                otn: 'subaaaaaaaa',
                dodt: 11111111,
                gdsid: 'pd1111111',
                gdnm: '大家好，我是一个商品',
                gdpr: 1111111,
                gdnu: 1,
                gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
            }]
        }]
    }
};
var rpco = response.rpco,
    body = response.body || {},
    // 订单集合
    odlst,
    // 总页数
    tpage,
    // 订单状态
    odst;

// 处理
switch(rpco) {
    case 200:
        // 资源集合
        odlst = body.odlst || [];
        // 
        tpage = body.tpage || 0;
        // 渲染
        that.renderEntityOrder(odlst, odst);

        // 创建分页对象
        if(!that.options.iscrollPaging) {
            // 创建
            that.options.iscrollPaging = new IscrollPaging({
                // 总页数
                totalPage: tpage,
                // 每页条数
                pageDataCount: that.options.len,
                // 加载数据方法
                loadDataFun: function() {
                    // 
                    that.options.curpg++;
                    // 查询数据
                    that.getEntityOrder(that.options.curpg, that.options.len);
                }
            });
            that.options.iscrollPaging.init();
        }
        // 加载分页
        else {
            // 
            that.options.iscrollPaging.reLoadPagingOption({
                // 当前页码
                currentPage: that.options.curpg,
                // 总页数
                totalPage: tpage
            });
        }
        break;
    // 没有找到对应数据
    case 404:
        $('#noList').show();
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'etodlst',
            data: {
                curpg: curpg,
                len: len
            },
            type: 'get',
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    // 订单集合
                    odlst,
                    // 总页数
                    tpage,
                    // 订单状态
                    odst;

                // 处理
                switch(rpco) {
                    case 200:
                        // 资源集合
                        odlst = body.odlst || [];
                        // 
                        tpage = body.tpage || 0;
                        // 渲染
                        that.renderEntityOrder(odlst, odst);

                        // 创建分页对象
                        if(!that.options.iscrollPaging) {
                            // 创建
                            that.options.iscrollPaging = new IscrollPaging({
                                // 总页数
                                totalPage: tpage,
                                // 每页条数
                                pageDataCount: that.options.len,
                                // 加载数据方法
                                loadDataFun: function() {
                                    // 
                                    that.options.curpg++;
                                    // 查询数据
                                    that.getEntityOrder(that.options.curpg, that.options.len);
                                }
                            });
                            that.options.iscrollPaging.init();
                        }
                        // 加载分页
                        else {
                            // 
                            that.options.iscrollPaging.reLoadPagingOption({
                                // 当前页码
                                currentPage: that.options.curpg,
                                // 总页数
                                totalPage: tpage
                            });
                        }
                        break;
                    // 没有找到对应数据
                    case 404:
                        $('#noList').show();
                        break;
                    default:
                        util.tip('查询失败')
                }
            },
            complete: function() {
                // 移除提示
                util.remComShow();
            }
        });  

    },
    /**
     * 渲染实物订单
     * @parma {array}{1} odlst 实物订单列表
     * @parma {number}{1,0} odst 订单状态
     */
    renderEntityOrder: function(odlst, odst) {
        var that = this,
            html = '',
            // 内部html文档
            innerHtml = '',
            // 子订单列表
            sodlst = '',
            // 商品数量
            goodsCount = 0;

        // 遍历渲染
        for(var i = 0, j = odlst.length; i < j; i++) {
            // 商品列表
            sodlst = odlst[i].sodlst || [];
            // 清空
            innerHtml = '';
            goodsCount = 0;

            // 头部
            html += '<div class="goods-show js-goods" otn="' + odlst[i].otn + '" dodt="' + odlst[i].dodt + '">'
                 +      '<div class="goods-show-header">'
                 +          '<span class="goods-show-date">' + util.formateDate(odlst[i].dodt, 'yyyy-MM-dd') + '</span>'
                 +      '</div>';

            // 存在一条商品
            if(sodlst.length === 1) {
                html += '<ul class="list-text icon">'
                     +      '<li>'
                     +          '<img class="text-icon" src="' + sodlst[0].gdiul + '" alt="">'
                     +          '<div class="text-detail">' + (sodlst[0].gdnm || '') + '</div>'
                     //+          '<!-- <i class="i i-gt"></i> -->'
                     +      '</li>'
                     +  '</ul>';

                // 商品数量累加
                goodsCount++;
            } 
            // 存在多条商品
            else {
                html += '<div class="goods-show-imglist">';
                // 遍历放入
                for(var a = 0, b = sodlst.length; a < b; a++) {
                    html += '<img class="goods-show-imglist-img" src="' + sodlst[a].gdiul + '">';
                    // 商品数量累加
                    goodsCount += sodlst[a].gdnu;
                }
                html += '</div>';
            }

            // 底部
            html +=      '<div class="goods-show-footer">订单金额：<span class="hightlight-text">￥' + parseFloat(odlst[i].odpri/100).toFixed(2) + '</span>共' + goodsCount + '件商品</div>'
                 +    '</div>';
        }

        // 放入页面
        $('.iscrollpading-pulltext').length === 1 ? $('.iscrollpading-pulltext').before(html) : $('#list').html(html).show();
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 订单明细单击事件
        that.el.on(click, '#list .js-goods', function() {
            // 订单号
            var otn = $(this).attr('otn') || '',
                // 时间戳
                dodt = $(this).attr('dodt') || '',
                // 发送参数
                sendParma = {
                    otn: otn,
                    dodt: dodt
                };
            // 打开页面
            util.href('ordersdetety.html', sendParma);
        });
    }
})