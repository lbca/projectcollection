var root = window || {},
    util = root.util || {};

var OrdersDetEty = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 发票信息
        ivifm: {
            1: '已开',
            2: '未开'
        },
        // 全部配送方式
        dtwayAll: {
            1: '用户自提',
            2: '集中配送',
            3: '安装带货',
            4: '配送自提',
            5: '门店配送',
            6: '厂家安装带货',
            7: '待预约配送'
        },
        // 列表最小高度
        listMinHeight: 178,
        msg: {}
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(OrdersDetEty.prototype, {
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

        // 获取实物订单详情
        that.getEntityOrderDetail(hrefParma.otn, hrefParma.dodt);
    },
    /**
     * 获取实物订单详情
     * @parma {string}{1} otn 订单号
     * @parma {number}{1} dodt 创建订单时间
     */
    getEntityOrderDetail: function(otn, dodt) {
        var that = this;



/*
// debug star
var response = {
    rpco: 200,
    msg: '',
    body: {
        dodt: 1462052000000,
        spnm: '北京马甸桥',
        spep: 'gaoqw',
        spsr: '国美电器',
        atdvtt: 1462052000000,
        atdvte: 1462819604000,
        atitcts: 1462082000000,
        atitcte: 1462819604000,
        cname: '高启文',
        cphone: '13581664235',
        faddr: '北京市朝阳区霄云路鹏润大厦B座5层5050',
        sdodt: 1462052000000,
        dtway: 2,
        ivifm: 2,
        gtam: 10000,
        frgt: 500,
        ramp: 10500,
        gdls: [{
            odste: 1,
            otn: '11111111',
            dodt: 1462819604000,
            gdsid: '11111111',
            gdnm: '格力2匹立式空调',
            gdpr: 8000,
            gdnu: 8,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }, {
            odste: 1,
            otn: '11111111',
            dodt: 11111111,
            gdsid: '11111111',
            gdnm: '70寸液晶电视',
            gdpr: 1000,
            gdnu: 10,
            gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305'
        }]
    }
};
var rpco = response.rpco,
    body = response.body || {};

// 处理
switch(rpco) {
    case 200:
        // 渲染实物单详情
        that.renderEntityOrderDetail(body);
        break;
    // 没有找到对应数据
    case 404:
        // 加载提示
        util.comShow({txt: '非常抱歉，您访问的订单不存在', icl: 'i-page'});
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/








        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'etoddt',
            data: {
                otn: otn,
                dodt: dodt
            },
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {};

                // 处理
                switch(rpco) {
                    case 200:
                        // 渲染实物单详情
                        that.renderEntityOrderDetail(body);
                        break;
                    // 没有找到对应数据
                    case 404:
                        // 加载提示
                        util.comShow({txt: '非常抱歉，您访问的订单不存在', icl: 'i-page'});
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        });  
    },
    /**
     * 渲染实物订单详情
     * @parma {object}{1} body 实物订单详情对象
     */
    renderEntityOrderDetail: function(body) {
        var that = this,
            // 售货员信息
            salesclerkInfo = body.spnm  + '-售货员' + body.spep,
            // 商品html文档
            goodsHtml = '',
            // 商品列表
            gdls = body.gdls || [],
            // 商品总数量
            gdnu = 0,
            // 配送时间
            atdvt = '',
            // 预约安装时间
            atitct = '',
            // 发票信息
            ivifm,
            // 实际费用
            actualMoney = 0;

        // 售货员信息
        $('#salesclerkInfo').html(salesclerkInfo);  

        // 渲染商品列表
        // 拼接头部
        goodsHtml = '<ul class="list-text icon">';
        for(var i = 0, j = gdls.length; i < j; i++) {
            //
            goodsHtml += '<li>'
                      +     '<img class="text-icon" src="' + gdls[i].gdiul + '">'
                      +     '<div class="text-detail tod wp70">' + gdls[i].gdnm + '</div>'
                      +     '<div class="text-detail">价格：' + (gdls[i].gdpr / 100).toFixed(2) + '</div>'
                      +     '<div class="text-detail">' + gdls[i].gdnu + '件</div>';

            // 只有集中配送才有订单状态
            (body.dtway === 2) && (goodsHtml += '<span class="btn btn-linear js-orderstate" otn="' + gdls[i].otn + '">配送状态</span>');

            goodsHtml += '</li>';

            // 商品总数量
            gdnu += gdls[i].gdnu;
        }

        // 小于2项时不存在展开
        if(j < 2) {
            $('.js-moregoods').remove();
        } 
        else {
            // 设置列表最大高度
            $('#list').height(that.options.listMinHeight);
        }

        // 拼接尾部
        goodsHtml += '</ul>';


        // 商品数量
        $('#productCount').html(gdnu);
        // 放入页面
        $('#list').html(goodsHtml);

        // 供货商家
        body.spsr && $('#spsr').html(body.spsr);
        
        // 预约送货时间
        body.atdvtt && (atdvt += util.formateDate(body.atdvtt, 'yyyy-MM-dd hh:mm')) && body.atdvte && (atdvt += '~' +util.formateDate(body.atdvte, 'MM-dd hh:mm'));
        // 预约送货时间
        atdvt && $('#atdvt').html(atdvt);

        // 预约安装
        body.atitcts && (atitct += util.formateDate(body.atitcts, 'yyyy-MM-dd hh:mm')) && body.atitcte && (atitct += '~' +util.formateDate(body.atitcte, 'MM-dd hh:mm'));
        // 预约安装时间
        atitct && $('#atitct').html(atitct);

        // 联系人姓名
        body.cname && $('#cname').html(body.cname);
        // 联系电话
        body.cphone && $('#cphone').html(body.cphone);
        // 完整地址
        body.faddr && $('#faddr').html(body.faddr);

        // 订单号
        that.options.hrefParma.otn && $('#otn').html(that.options.hrefParma.otn);
        // 下单时间
        body.sdodt && $('#sdodt').html(util.formateDate(parseInt(body.sdodt), 'yyyy-MM-dd hh:mm'));
        // 配送方式
        body.dtway && $('#dtway').html(that.options.dtwayAll[body.dtway]);
        // 发票信息
        ivifm = that.options.ivifm[body.ivifm] || '';
        ivifm && $('#ivifm').html(ivifm);

        // 总额商品
        if(body.gtam) {
            $('#gtam').html('¥' + (body.gtam / 100).toFixed(2));   
            actualMoney += body.gtam;
        }
        // 运费
        if(body.frgt) {
            $('#frgt').html('¥' + (body.frgt / 100).toFixed(2));
            actualMoney += body.frgt;
        }
        // 实际费用
        actualMoney && $('#actualMoney').html('¥' + (actualMoney / 100).toFixed(2));
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 商品单击事件
        that.el.on(click, '.js-orderstate', function() {
            // 订单号
            var otn = $(this).attr('otn') || '',
                // 发送参数
                sendParma = {
                    otn: otn,
                    dodt: hrefParma.dodt
                };
            // 打开页面
            util.href('ordersstaety.html', sendParma);
        });

        // 展开按钮
        that.el.on(click, '#openMoreGoods', function() {
            // 隐藏当前按钮
            $(this).hide();
            // 显示收起按钮
            $('#closeMoreGoods').show();
            //
            $('#list').animate({
                'height': $('#list li').length * $('#list li:first').height()
            }, 'ease-out');
        });


        // 收起按钮
        that.el.on(click, '#closeMoreGoods', function() {
            // 隐藏当前按钮
            $(this).hide();
            // 显示收起按钮
            $('#openMoreGoods').show();
            //
            $('#list').animate({
                'height': 2 * $('#list li:first').height() - 2
            }, 'ease-out');
        });
    }
})