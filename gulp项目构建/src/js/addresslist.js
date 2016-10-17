var root = window || {},
    util = root.util || {};

var AddressList = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 地址集合
        addlist: [],
        // 默认常用地址
        daddr: '',
        msg: {
            m1: '删除成功',
            m2: '是否删除当前地址？',
            m3: '当前地址已为默认地址',
            m4: '设置成功'
        },
        // 请求状态，用于ajax
        requestState: {
            deladdress: true,
            setDefault: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AddressList.prototype, {
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
        // 查询常用地址
        that.getAddressList();
    },
    /**
     * 渲染常用地址列表
     *  @parma {array}{1} addlist 地址列表
     *  @parma {number}{1} daddr 默认地址
     */
    renderAddressList: function(addlist, daddr) {
        var that = this,
            addlist = addlist || [],
            addlistStr = '';

        // 
        $.each(addlist, function(i, n) {
            var cname = n.cname || '',
                cphone = n.cphone || '',
                faddr = n.region + ' ' + n.addr + ' ' + n.hnum || '',
                lastuse = '';
            // 默认地址
            if(n.tsup === daddr) {
                lastuse = '最后使用';
                // 默认地址下标
                that.options.daddr = n.tsup;
            }
            // 拼接
            addlistStr += '<li val="' + n.tsup + '">'
                        +   '<p>' + cname + '&nbsp;&nbsp;&nbsp;&nbsp;' + cphone +'</p>'
                        +   '<p class="text-detail">' + faddr + '</p>'
                        +   '<span class="setdefault">' + lastuse + '</span>'
                        //+   '<span class="setdefault red">' + lastuse + '</span>'
                        //+   '<span class="setdefault ' + color + '">设为默认</span>'
                        +   '<span class="btn-del dn"><i class="i i-delete1"></i></span>'
                        + '</li>';
        });

        // 渲染
        addlistStr && $('#list').html(addlistStr).show();
    },
    /**
     * 获取常用地址列表
     */
    getAddressList: function() {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'addrlist',
            type: 'get',
            /*beforeSend: function() {
                // 禁用分页
                that.options.canPaging = false;
            },*/
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    addlist = body.addlist || [],
                    // 默认地址主键
                    daddr = that.options.daddr = body.daddr || '';
                // 处理
                switch(rpco) {
                    case 200:
                        that.options.addlist = addlist || [];
                        // 渲染
                        that.renderAddressList(addlist, daddr);
                        // 显示删除菜单
                        $('.menu .js-unBind').show();
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
            }/*,
            complete: function() {
                // 刷新效果
                $('#loadFooter').hide();
                // 启用分页
                that.options.canPaging = true;
            }*/
        });  
    },
    /**
     * _删除常用地址
     * @parma {number}{1} tsup 变更时间戳
     */
    _deladdress: function(tsup) {
        var that = this;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modaddr',
            data: {
                tsup: tsup,
                state: util.OPT_STATE.DELETE
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.deladdress = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        /*$('#list li[val="' + tsup + '"]').remove();
                        // 无数据时显示添加提示
                        if($('#list li').length === 0) {
                            $('#list').hide();
                            $('#noList').show();
                            // 隐藏删除菜单
                            $('.menu .js-unBind').hide();
                        }*/
                        // 重新加载地址列表
                        window.location.reload();
                        //that.getAddressList();

                        break;
                    default:
                        util.tip('删除失败')
                }
            },
            complete: function() {
                that.options.requestState.deladdress = true; 
            }
        });
    },
    /**
     * 删除常用地址
     * @parma {number}{1} tsup 变更时间戳
     */
    deladdress: function(tsup) {
        var that = this;

        // 删除确认
        util.alert(that.options.msg.m2, {
            justOk: false,
            defBtnIndex: 1,
            okFn: function() {

                that._deladdress(tsup);
            }
        });
    },
    // /**
    //  * _设置默认常用地址
    //  * @parma {number}{1} daddr 地址主键
    //  */
    // _setDefault: function(tsup) {
    //     var that = this;

    //     // 请求...
    //     util.api({
    //         surl: root.MB_API_PATH + 'addrdef',
    //         data: {
    //             tsup: tsup
    //         },
    //         type: 'post',
    //         beforeSend: function() {
    //             that.options.requestState.setDefault = false;
    //         },
    //         success: function(response) {
    //             //response = response || {};
    //             var rpco = response.rpco,
    //                 body = response.body || {};
    //             // 处理
    //             switch(rpco) {
    //                 // 正常
    //                 case 200:
    //                     // 设置默认
    //                     $('.setdefault').removeClass('red');
    //                     $('#list li[val="' + tsup + '"] .setdefault').addClass('red');
    //                     that.options.daddr = tsup;
    //                     util.tip(that.options.msg.m4);
    //                     // 重新加载地址列表
    //                     //that.getAddressList();
    //                     break;
    //                 default:
    //                     util.tip('设置失败')
    //             }
    //         },
    //         complete: function() {
    //             that.options.requestState.setDefault = true; 
    //         }
    //     });
    // },
    // /**
    //  * 设置默认常用地址
    //  * @parma {number}{1} tsup 变更时间戳
    //  */
    // setDefault: function(tsup) {
    //     var that = this;
    //     // 
    //     if(!that.options.requestState.setDefault) { return false; }
    //     // 
    //     if(tsup == that.options.daddr) {
    //         util.tip(that.options.msg.m3);
    //     } 
    //     else {
    //         that._setDefault(tsup);
    //     }
    // },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*绑定单击*/
        that.el.on(click, '.js-addBind', function() {
            util.href('areaprovince.html', {
                cbu: 'setaddress.html'
            });
        });

        /*解绑菜单单击*/
        that.el.on(click, '.js-unBind', function() {
            $('.btn-del').show();
            // “设为默认”置灰
            $('.setdefault').addClass('gray');
        });

        /*隐藏解绑小图标*/
        $('.header, .container').on(click, function(e) {
            var target = $(e.target);
            // 隐藏删除图标，启用“设为默认”
            if(!target.is('.btn-del') && !target.is('.js-unBind')) {
                $('.btn-del').hide();
                $('.setdefault').removeClass('gray');
            }
        });

        /*解绑按钮单击事件*/
        that.el.on(click, '.btn-del', function() {
            var tsup = $(this).closest('li').attr('val');
            // 删除
            tsup && that.deladdress(tsup);
        });

        /*“设为默认”单击事件*/
        /*that.el.on(click, '.setdefault:not(.gray)', function() {
            var tsup = $(this).closest('li').attr('val');
            tsup && that.setDefault(tsup);
        });*/
    }
})