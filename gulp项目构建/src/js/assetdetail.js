var root = window || {},
    util = root.util || {};

var AssetDetail = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 资产编号
        asnum: '',
        // 最大上传数量
        maxupcount: 2,
        // 发票图片数量
        upcount: 0,
        // 电子说明书数据
        instrData: {
            // 分组编号
            gid: 0,
            // 文档编号
            did: 0,
            // 终端类型
            tmid: 536940544,
            // 文档标题
            headTxt: ''
        },
        msg: {
            m1: '没有找到该资产',
            m2: '上传成功',
            m3: '上传失败',
            m4: '删除成功',
            m5: '删除失败',
            m6: '发票图片最多上传2张',
            m7: '资产图片上传成功',
            m8: '该功能暂未开通，敬请期待'
        },
        // 请求状态，用于ajax
        requestState: {
            saveAseqinimg: true,
            delAseqinimg: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AssetDetail.prototype, {
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
        that.options.asnum = hrefParma.asnum;
        // 加载资产详情
        that.getAssetDetail(hrefParma.asnum);
    },
    /**
     * 渲染资产详情
     * @parma {object}{1} asset 资产详情
     */
    renderAssetDetail: function(asset) {
        var that = this,
            // 资产菜单集合
            asmus = asset.asmus || [],
            listEL = $('#list'),
            aseilist = asset.aseilist || [];

        // 资产图片路径
        asset.asimgu && $('#asimgu').attr('src', asset.asimgu);
        // 资产名称
        asset.asname && $('#asname').html(asset.asname);
        // 功能列表
        for(var i = 0, j = asmus.length; i < j; i++) {
            // 放入
            listEL.append($('#menu' + asmus[i]).show());
        }
        /*// 电子保修卡链接地址
        $('#asewcu').attr('href', asset.asewcu);
        // 产品说明书链接地址
        $('#aspmu').attr('href', asset.aspmu);*/
        // 资产发票
        /*for(var i = 0, j = aseilist.length; i < j; i++) {
            $('<span class="img-block" val="' + aseilist[i].aseiin + '"><img class="js-dlgimg" src="' + aseilist[i].aseiiu + '"><span class="btn-del dn"></span><i class="i i-delete1 dn"></i></span>').insertBefore($('#uploadasei'));
        }*/
        // 资产发票上传功能
        //(aseilist.length < that.options.maxupcount) || $('#uploadasei').hide();
        // 发票数
        //that.options.upcount = aseilist.length;
    },
    /**
     * 加载资产详情
     * @parma {number}{1} asnum 资产编号
     */
    getAssetDetail: function(asnum) {
        var that = this;

/*// debug start
var response = {
    rpco: 200,
    body: {
        gid: 1,
        did: 2,
        asname: '苹果iphone 6s plus',
        asimgu: 'http://img1.gomein.net.cn/image/bbcimg/production_image/nimg/201511/30/16/25/121861438a8809fb3f25_800.jpg',
        asmus: [3,4,1,2]
    }
};
var rpco = response.rpco,
    body = response.body || {};
// 处理
switch(rpco) {
    // 正常
    case 200:
        // 重新加载地址列表
        that.renderAssetDetail(body);
        break;
    default:
        util.tip('删除失败');
        util.href('assetlist.html');
}
return;
// debug end
*/


        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'assdtal',
            data: {
                asnum: asnum
            },
            type: 'get',
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        // 赋值说明书
                        // 分组编号
                        that.options.instrData.gid = body.gid;
                        // 文档编号
                        that.options.instrData.did = body.did;
                        // 文档标题
                        that.options.instrData.headTxt = body.asname;
                        // 渲染资产详情
                        that.renderAssetDetail(body);
                        break;
                    default:
                        util.tip('查询失败');
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
            hrefParma = that.options.hrefParma,
            //touchTime = 1000,
            touchClock = {};

        // 电子保修卡
        that.el.on(click, '#asewcu', function() {
            util.href('electrcard.html', {asnum: hrefParma.asnum});
        });

        // 电子说明书
        that.el.on(click, '#aspmu', function() {
            that.options.instrData.gid && util.href('instruction.html', {
                gid: that.options.instrData.gid, 
                did: that.options.instrData.did, 
                tmid: that.options.instrData.tmid,
                headTxt: that.options.instrData.headTxt
            });
        });

        // “服务类型”点击提示
        that.el.on(click, '#serviceType a', function() {
            util.tip(that.options.msg.m8);
        });

    }
})