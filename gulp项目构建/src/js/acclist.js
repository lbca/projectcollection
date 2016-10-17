var root = window || {},
    util = root.util || {};

var AccList = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 账户类型
        ACTYPE: {
            '1': '国美会员卡',
            '2': '永乐会员卡',
            '3': '大中会员卡',
            /*'4': '蜂星会员卡',*/
            '5': '库巴卡',
            '6': '极信国美卡',
            '7': '极信大中卡',
            '8': '极信永乐卡'
        },
        // 证件类型图片class
        actic: {
            '1': 'i-gomecard',
            '2': 'i-yonglecard',
            '3': 'i-dazhongcard',
            '4': 'i-gomecard',
            '5': 'i-gomecard',
            '6': 'i-gomecard',
            '7': 'i-gomecard',
            '8': 'i-gomecard'
        },
        // 账号集合
        aclist: [],
        msg: {
            m1: '账户删除成功',
            m2: '是否删除当前会员卡？'
        },
        // 请求状态，用于ajax
        requestState: {
            delAccount: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccList.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();
        that.addEvent();
        // 加载返回按钮
        that.loadGoBack();
    },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this,
            hrefParma = that.options.hrefParma;

        that.getAccountList();
    },
    /**
     * 加载返回按钮
     */
    loadGoBack: function() {
        var that = this,
            hrefParma = that.options.hrefParma;
        // 存在回调页面，则返回采取回调页面
        hrefParma.cbu && $('.goBack').attr('href', 'javascript:util.href(\'' + hrefParma.cbu + '\');').show();
    },
    /**
     * 渲染会员账户列表
     * @parma {array}{1} aclist 账户集合
     */
    renderAccountList: function(aclist) {
        var that = this,
            aclist = aclist || [],
            aclistStr = '',
            actype = '',
            actypeName = '',
            actypeClass = '',
            acnum = '';

        // 
        $.each(aclist, function(i, n) {
            actype = n.actype || '';
            actypeClass = that.options.actic[actype] || '&nbsp;';
            actypeName = that.options.ACTYPE[actype] || '&nbsp;';
            acnum = n.acnum || '&nbsp;';

            aclistStr += '<li actype="' + actype + '" acnum="' + acnum + '">'
                       +   '<i class="accicon i ' + actypeClass + '"></i>'
                       +   '<p class="acctype">' + actypeName + '</p>'
                       +   '<p class="acccode">会员卡</p>'
                       +   '<p class="accnum">' + acnum + '</p>'
                       +   '<span class="btn-del dn"></span><i class="i i-del dn"></i>'
                       + '</li>';
        });

        // 渲染
        aclistStr && $('#list ul').html(aclistStr) && $('#list').show();
    },
    /**
     * 获取会员账户列表
     */
    getAccountList: function() {
        var that = this;

/*// debug start
var response = {
    rpco: 200,
    body: {
        aclist: [{
            tsup: 1452652341201,
            actype: 1,
            acnum: '111111111111'
        },{
            tsup: 1452652341202,
            actype: 2,
            acnum: '222222222222'
        },{
            tsup: 1452652341202,
            actype: 2,
            acnum: '222222222222'
        },{
            tsup: 1452652341202,
            actype: 2,
            acnum: '222222222222'
        },{
            tsup: 1452652341203,
            actype: 3,
            acnum: '333333333333'
        },{
            tsup: 1452652341204,
            actype: 4,
            acnum: '444444444444'
        }]
    } 
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        that.options.aclist = body.aclist;
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
// debug end*/


        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'acclist',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        that.options.aclist = body.aclist;
                        // 渲染
                        that.renderAccountList(body.aclist);
                        break;
                    // 没有找到对应数据
                    case 404:
                        $('#noList').show();
                        $('#js-unBind').hide();
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        });  
    },
    /**
     * 删除账户
     * @parma {string}{1} acnum 会员账户账号
     * @parma {number}{1} actype 会员账户类型
     */
    _delAccount: function(acnum, actype) {
        var that = this;

/*// debug start
var response = {
    rpco: 200,
    body: {}
};
var rpco = response.rpco,
    body = response.body || {};
// 处理
switch(rpco) {
    // 正常
    case 200:
        //$('#list li[actype="' + actype + '"][acnum="' + acnum + '"]').remove();
        // 重新加载地址列表
        window.location.reload();
        //that.getAccountList();
        break;
    default:
        util.tip('删除失败')
}
return;
// debug end*/


        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modacc',
            data: {
                acnum: acnum,
                actype: actype,
                state: util.OPT_STATE.DELETE
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.delAccount = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        //$('#list li[actype="' + actype + '"][acnum="' + acnum + '"]').remove();
                        // 重新加载地址列表
                        window.location.reload();
                        //that.getAccountList();
                        break;
                    default:
                        util.tip('删除失败')
                }
            },
            complete: function() {
                that.options.requestState.delAccount = true; 
            }
        });
    },
    /**
     * 删除常用地址
     * @parma {string}{1} acnum 会员账户账号
     * @parma {number}{1} actype 会员账户类型
     * @parma {number}{1} curIn 当前列下标
     */
    delAccount: function(acnum, actype) {
        var that = this;

        // 删除确认
        util.alert(that.options.msg.m2, {
            justOk: false,
            defBtnIndex: 1,
            okFn: function() {

                that._delAccount(acnum, actype);
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

        /*添加账户点击事件*/
        that.el.on(click, '.js-addBind', function() {
            util.href('acctype.html');
        });

        /*解绑菜单单击*/
        that.el.on(click, '.js-unBind', function() {
            $('.btn-del, .i-del').show();
        });

        /*隐藏解绑小图标*/
        $('.header, .container').on(click, function(e) {
            var target = $(e.target);
            // 隐藏
            if(!target.is('.btn-del, .js-unBind')) {
                $('.btn-del, .i-del').hide();    
            }
        });

        /*解绑按钮单击事件*/
        that.el.on(click, '.btn-del', function() {
            var liEL = $(this).closest('li'),
                acnum = liEL.attr('acnum') || '',
                actype = liEL.attr('actype') || '';
            // 删除
            that.delAccount(acnum, actype);
        });
    }
})