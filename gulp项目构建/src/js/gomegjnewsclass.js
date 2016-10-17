var root = window || {},
    util = root.util || {};

var GomegjNewsClass = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 默认rcid（美刊）
        /*defaultRcid: 5,*/
        defaultRcid: 0,
        //
        msg: {
        },
        // 请求状态，用于ajax请求
        requestState: {
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(GomegjNewsClass.prototype, {
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
            // 资源分类ID
            rcid = hrefParma.rcid || that.options.defaultRcid;

        // 设置返回按钮为首页
        (hrefParma.isfirst == 1) || $('.goBack').attr('href', 'javascript:util.href(\'index.html\');').show();

        // 获取资源分组
        that.getResourceGroup(rcid);
    },
    /**
     * 获取资源分组
     * @parma {number}{1, 0} rcid 资源分类ID
     */
    getResourceGroup: function(rcid) {
        var that = this;

/*// debug star
var response = {
        rpco: 200,
        msg: '',
        body: {
            cname: 'ceshi',
            subs: [{
                rcid: 1,
                cname: '全部',
                sgt: 1,
                iurl: '//img.gomegj.com/guanjia/v1/appointment.png'
            }, {
                rcid: 2,
                cname: '新闻公告2',
                sgt: 1,
                iurl: '//img.gomegj.com/guanjia/v1/appointment.png'
            }, {
                rcid: 3,
                cname: '新闻公告3',
                sgt: 2,
                iurl: '//img.gomegj.com/guanjia/v1/appointment.png'
            }, {
                rcid: 4,
                cname: '新闻公告4',
                sgt: 3,
                iurl: '//img.gomegj.com/guanjia/v1/appointment.png'
            }, {
                rcid: 5,
                cname: '新闻公告5',
                sgt: 1,
                iurl: '//img.gomegj.com/guanjia/v1/appointment.png'
            }, {
                rcid: 5,
                cname: '新闻公告5',
                sgt: 1,
                iurl: '//img.gomegj.com/guanjia/v1/appointment.png'
            }]
        }
    },
    rpco = response.rpco,
    body = response.body || {},
    subs = body.subs || [];

// 处理
switch(rpco) {
    case 200:
        // 渲染
        that.renderResourceGroup(body);
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
            surl: root.RESGRP_API_PATH + 'subgrp',
            data: {
                rcid: rcid
            },
            type: 'get',
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    subs = body.subs || [];

                // 处理
                switch(rpco) {
                    case 200:
                        // 渲染
                        that.renderResourceGroup(body);
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
     * 渲染资源分组
     * @parma {object}{1} body 分类对象
     */
    renderResourceGroup: function(body) {
        var that = this,
            // 
            subs = body.subs || [],
            //
            html = '',
            // 跳转地址
            href,
            // 明细条数
            itemCount = 0;

        // 标题
        body.cname && $('#title').html(body.cname);

        //
        for(var i = 0, j = subs.length; i < j; i++) {
            // 清空
            href = '';
            // 
            switch(subs[i].sgt) {
                // 分组节点
                case 1:
                case 5:
                    href = 'gomegjnewsclass.html?rcid=' + subs[i].rcid;
                    break;
                // 资源节点
                case 2:
                case 6:
                    href = 'gomegjnews.html?rcid=' + subs[i].rcid;
                    break;
                // 同时包含分组和资源
                case 3:
                case 7:
                    href = 'javascript:;';
                    break;
            }

            // 挑出“全部”分组
            if(subs[i].sgt === 5 || subs[i].sgt === 6) {
                // 放入全部
                $('#allNews').html('全部').attr('href', href).show();
                continue;
            }

            //
            /*html += '<li href="' + href + '">'
                  +     '<img class="text-icon" src="' + subs[i].iurl + '">'
                  +     '<div class="text-detail tod">' + subs[i].cname + '</div>'
                  + '</li>';*/
            
            html += '<span class="timgbtxtblk ' + ((++itemCount) % 3 === 0 ? 'bdr0' : '') + ' js-listItem" href="' + href + '">'
                 +      '<img class="timgbtxtblk-img" src="' + subs[i].iurl + '">'
                 +      '<span class="timgbtxtblk-txt tod">' + subs[i].cname + '</span>'
                 +  '</span>';
        }

        // 没有数据
        j || $('#noList').show();

        // 放入页面
        html && $('#list').html(html);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 明细单击事件
        that.el.on(click, '.js-listItem', function() {
            // 
            util.href($(this).attr('href'), {isfirst: 1});
        });
    }
})