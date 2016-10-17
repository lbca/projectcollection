var root = window || {},
    util = root.util || {};

var GomegjNews = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 分页信息
        pading: {
            // 当前页码
            currentPage: 1,
            // 每页显示条目数
            pageDataCount: 20,
            // 总条目数
            totalCount: 0
        },
        // 分页对象
        iscrollPaging: null,
        msg: {
        },
        // 请求状态，用于ajax请求
        requestState: {
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(GomegjNews.prototype, {
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
            // 资源ID
            rcid = hrefParma.rcid || '';

        // 设置返回按钮为首页
        (hrefParma.isfirst == 1) || $('.goBack').attr('href', 'javascript:util.href(\'index.html\');').show();

        // 获取资源
        that.getResource(rcid, that.options.pading.currentPage, that.options.pading.pageDataCount);
    },
    /**
     * 获取资源
     * @parma {number}{1, 0} rcid 资源ID
     * @parma {number}{1, 0} page 页号
     * @parma {number}{1, 0} len 每页记录数
     */
    getResource: function(rcid, page, len) {
        var that = this;

/*// debug star
var response = {
        rpco: 200,
        msg: '',
        body: {
            total: 100,
            res: [{
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 1
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 2222
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 1
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 546546
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 4
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 12
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 788
            }, {
                rsid: 1,
                title: '国内最大移动VR体验馆落户北京国美国美管家国内最大移动VR体验馆落户北京国美国美管家',
                iurl: '//img.gomegj.com/guanjia/v1/gomegj.png',
                href: 'http://www.baidu.com',
                rctime: new Date().getTime(),
                rdnum: 0
            }]
        }
    },
    rpco = response.rpco,
    body = response.body || {},
    // 资源集合
    res,
    // 总条数
    total;


// 处理
switch(rpco) {
    case 200:
        // 资源集合
        res = body.res || [];
        // 
        total = body.total || 0;
        // 渲染
        that.renderResource(body);

        // 创建分页对象
        if(!that.options.iscrollPaging) {
            // 创建
            that.options.iscrollPaging = new IscrollPaging({
                // 总条数
                totalCount: total,
                // 每页条数
                pageDataCount: that.options.pading.pageDataCount,
                // 加载数据方法
                loadDataFun: function() {
                    // 
                    that.options.pading.currentPage++;
                    // 查询数据
                    that.getResource(rcid, that.options.pading.currentPage, that.options.pading.pageDataCount);
                }
            });
            that.options.iscrollPaging.init();
        }
        // 加载分页
        else {
            // 
            that.options.iscrollPaging.reLoadPagingOption({
                // 当前页码
                currentPage: that.options.pading.currentPage,
                // 总数据条数
                totalCount: total
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
            surl: root.RESGRP_API_PATH + 'reslist',
            data: {
                rcid: rcid,
                page: page,
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
                    // 资源集合
                    res,
                    // 总条数
                    total;

                // 处理
                switch(rpco) {
                    case 200:
                        // 资源集合
                        res = body.res || [];
                        // 
                        total = body.total || 0;
                        // 渲染
                        that.renderResource(body);

                        // 创建分页对象
                        if(!that.options.iscrollPaging) {
                            // 创建
                            that.options.iscrollPaging = new IscrollPaging({
                                // 总条数
                                totalCount: total,
                                // 每页条数
                                pageDataCount: that.options.pading.pageDataCount,
                                // 加载数据方法
                                loadDataFun: function() {
                                    // 
                                    that.options.pading.currentPage++;
                                    // 查询数据
                                    that.getResource(rcid, that.options.pading.currentPage, that.options.pading.pageDataCount);
                                }
                            });
                            that.options.iscrollPaging.init();
                        }
                        // 加载分页
                        else {
                            // 
                            that.options.iscrollPaging.reLoadPagingOption({
                                // 当前页码
                                currentPage: that.options.pading.currentPage,
                                // 总数据条数
                                totalCount: total
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
     * 渲染资源分组
     * @parma {object}{1} body 资源对象
     */
    renderResource: function(body) {
        var that = this,
            // 资源列表
            res = body.res || [],
            //
            html = '',
            // 显示标题
            title,
            // 创建时间
            rctime = 0,
            // 阅读数
            rdnum = 0,
            // 最大显示字符数
            maxCharCount = parseInt(($('#list').width() - 124) / 16 * 2) - 2;

        // 标题
        body.cname && $('#title').html(body.cname);

        // 
        for(var i = 0, j = res.length; i < j; i++) {
            // 
            title = res[i].title || '';
            // 截取最大显示字符
            title = title.length > maxCharCount ? title.substring(0, maxCharCount) + '...' : title;
            // 创建时间
            rctime = res[i].rctime || '';
            // 截掉世纪
            rctime = util.formateDate(rctime, 'yyyy-MM-dd').substring(2);
            // 阅读数
            rdnum = res[i].rdnum || 0;
            // 大于9999后显示+
            (rdnum > 9999) && (rdnum = '9999+');
            //
            html += '<li href="' + res[i].href + '">'
                  +     '<i class="text-icon i" style="background-image: url(\'' + res[i].iurl + '\');"></i>'
                  +     '<div class="text-detail">' + title + '</div>'
                  //+     '<span class="btn-operate"><i class="i i-grayheart"></i></span>'
                  +     '<span class="lbtxt">' + rctime + '</span>'
                  +     '<span class="rbicontxt"><i class="i i-eye"></i>' + rdnum + '</span>'
                  + '</li>';
        }

        // 没有数据
        j || $('#noList').show();

        // 放入页面
        if(html) {
            $('.iscrollpading-pulltext').length === 1 ? $('.iscrollpading-pulltext').before(html) : $('#list').html(html);
        }
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 明细单击事件
        that.el.on(click, '#list li', function() {
            // 
            util.href($(this).attr('href'));
        });

        // 页面改变大小
        $(window).resize(function() {
            // 加载页面布局
            window.location.reload();  
        });


    }
})