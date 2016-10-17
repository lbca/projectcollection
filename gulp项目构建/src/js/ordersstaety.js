var root = window || {},
    util = root.util || {};

var OrdersStaEty = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 订单状态
        orderstate: {
            1: ' ',
            2: ' ',
            3: ' ',
            9: ' ',
            20: '已预约',
            21: '下单成功',
            22: '取消成功',
            23: '已确认',
            24: '待评价',
            25: '已评价',
            41: '已预付',
            42: '支付成功',
            43: '已申请退款',
            44: '退款申请通过',
            45: '退款成功',
            81: '已接单',
            82: '预约成功',
            83: '预约失败',
            84: '已出库',
            85: '已转运',
            86: '已妥投',
            87: '已拒收'
        },
        msg: {
            m1: '请输入昵称'
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(OrdersStaEty.prototype, {
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

        // 获取实物订单状态详情
        that.getEntityOrderStateDetail(hrefParma.otn, hrefParma.dodt);
    },
    /**
     * 获取实物订单状态详情
     * @parma {string}{1} otn 订单号
     * @parma {number}{1} dodt 创建订单时间
     */
    getEntityOrderStateDetail: function(otn, dodt) {
        var that = this;



/*
// debug star
var response = {
    rpco: 200,
    msg: '',
    body: {
        atdvtt: 1462132000000,
        atdvte: 1462809600000,
        odste: 1,
        gdsid: 11111111,
        gdnm: '西门子双开门三层柜式冰箱',
        gdpr: 88888888,
        gdnu: 1000,
        gdiul: 'http://wap.gomegj.com/member/v1/getheader?id=774689600214925305',
        sdfmcl: [{
            sdfmst: '1',
            sdfmwd: 'lrtyuiokplfcgvybunimo,gvhjbnkm,opcrtvybunimo,p.crvtybunimo,,p.',
            sdfmtm: 1462032000000
        },{
            sdfmst: '2',
            sdfmwd: 'lrtyuiokplfcgvybunimo,gvhjbnkm,opcrtvybunimo,p.crvtybunimo,,p.',
            sdfmtm: 1462032000000
        },{
            sdfmst: '3',
            sdfmwd: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
            sdfmtm: 1462032000000
        },{
            sdfmst: '9',
            sdfmwd: '大家好大家好大家好大家好大家好大家好大家好大家好',
            sdfmtm: 1462232000000
        }]
    }
};
var rpco = response.rpco,
    body = response.body || {};

// 处理
switch(rpco) {
    case 200:
        // 渲染实物单详情
        that.renderEntityOrderStateDetail(body);
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
            surl: root.AS_API_PATH + 'etodsta',
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
                        that.renderEntityOrderStateDetail(body);
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
     * 渲染实物订单状态详情
     * @parma {object}{1} body 实物订单详情对象
     */
    renderEntityOrderStateDetail: function(body) {
        var that = this,
            // 配送时间
            atdvt = '',
            // 送装信息集合
            sdfmcl = body.sdfmcl || [],
            html = '';

        // 订单号
        that.options.hrefParma.otn && $('#otn').html(that.options.hrefParma.otn);
        // 商品图片
        body.gdiul && $('#gdiul').attr('src', body.gdiul);
        // 商品名称
        body.gdnm && $('#gdnm').html(body.gdnm);
        // 商品金额
        body.gdpr && $('#gdpr').html(parseFloat(body.gdpr/100).toFixed(2));
        // 商品数量
        body.gdnu && $('#gdnu').html(body.gdnu);

        // 预约送货时间
        //body.atdvtt && (atdvt += util.formateDate(body.atdvtt, 'yyyy-MM-dd hh:mm')) && body.atdvte && (atdvt += '~' +util.formateDate(body.atdvte, 'hh:mm'));
        // 预约送货时间
        atdvt && $('#atdvt').html(atdvt);

        // 渲染送装记录
        for(var i = 0, j = sdfmcl.length; i < j; i++) {
            html += '<li class="' + (i === 0 ? 'cur' : '') + (i === j-1 ? ' last' : '') + '">'
                 +      '<div class="list-text-title tod">' + (that.options.orderstate[sdfmcl[i].sdfmst] || '&nbsp;') + '</div>'
                 +      '<div class="text-detail">' + (sdfmcl[i].sdfmwd || '&nbsp;') + '</div>'
                 +      '<span class="topright">' + util.formateDate(sdfmcl[i].sdfmtm, 'yyyy-MM-dd hh:mm') + '</span>'
                 +  '</li>';
        }
        
        //
        html ? $('#sdfmcl').html('<ul class="list-text">' + html + '</ul>').show() : $('#sdfmcl').remove();
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 
    }
})