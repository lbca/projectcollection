var root = window || {},
    util = root.util || {};

var Coupons = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 优惠券状态，默认：未使用
        couponState: 1,
        // 优惠券对应样式
        coutpClass: {
            // 管家券
            1: 'blue',
            // 商家券
            2: ''
        },
        // 优惠券类型
        couponType: {
            // 管家券
            1: '管家券',
            // 商家券
            2: '商家券'
        },
        // 优惠券详情
        viewDetails: {},
        // 当前页码
        curpg: 1,
        // 每页条目数
        len: 15,
        // 总条目数
        tpage: 0,
        // 分页对象
        iscrollPaging: null,
        // 消息
        msg: {
            m1: '未使用',
            m2: '添加优惠券',
            m3: '请输入优惠券编号',
            m4: '请输入优惠券密码',
            m5: '优惠券编号有误',
            m6: '您的优惠券密码不正确，<br>绑定失败',
            m7: '您的优惠券密码已被使用，<br>无法再次绑定',
            m8: '优惠券已过期',
            m9: '优惠券绑定操作频繁',
            m10: '添加成功',
            m11: '请输入优惠券号',
            m12: '请输入优惠券密码',
        },
        // 请求状态
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(Coupons.prototype, {
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

        // 获取优惠券
        that.getCoupons(that.options.couponState, that.options.curpg, that.options.len);
    },
    /**
     * 初始化重新加载券列表
     */
    reLoadCoupons: function() {
        var that = this;

        // 初始化分页
        // 当前页码
        that.options.curpg = 1;
        // 总条目数
        that.options.tpage = 0;
        // 分页对象
        if(that.options.iscrollPaging) {
            // 销毁
            that.options.iscrollPaging.scrollDestroy();
            // 清空对象
            that.options.iscrollPaging = null;
        }
        // 清空列表
        $('#list').html('');

        // 加载券列表
        that.getCoupons(that.options.couponState, that.options.curpg, that.options.len);
    },
    /**
     * 获取优惠券
     * @parma {number}{1} coust 优惠券状态
     * @parma {number}{1} curpg 当前页码
     * @parma {number}{1} len 每页条目数
     */
    getCoupons: function(coust, curpg, len) {
        var that = this;



/*// debug star
var response = {
    rpco: 200,
    msg: '',
    body: {
        tpage: 3,
        couuc: 8,
        coulst: [{
            coutp: 1,
            counum: '111111111',
            counm: '我是优惠券名称',
            couat: '我是限定使用说明文字',
            coumat: '金额限定使用说明文字',
            coucut: 1464327955432,
            coucute: 1464427955432,
            coumy: 100000,
            cpdtlst: [{
                cdlb: '哈哈哈哈',
                cdtxt: '呵呵呵呵呵'
            }, {
                cdlb: '1哈哈哈哈',
                cdtxt: '1呵呵呵呵呵'
            }, {
                cdlb: '2哈哈哈哈',
                cdtxt: '2呵呵呵呵呵'
            }]
        }, {
            coutp: 2,
            counum: '111111wwww',
            counm: '我是优惠券名称',
            couat: '我是限定使用说明文字',
            coumat: '金额限定使用说明文字',
            coucut: 1464327955432,
            coucute: 1464427955432,
            coumy: 100000,
            cpdtlst: [{
                cdlb: '111111111',
                cdtxt: '111111111111'
            }, {
                cdlb: '222222222',
                cdtxt: '222222222222'
            }, {
                cdlb: '3333333',
                cdtxt: '33333333333333'
            }]
        }, {
            coutp: 1,
            counum: '111111',
            counm: '我是优惠券名称',
            couat: '我是限定使用说明文字',
            coumat: '金额限定使用说明文字',
            coucut: 1464327955432,
            coucute: 1464427955432,
            coumy: 100000
        }, {
            coutp: 1,
            counum: '111111',
            counm: '我是优惠券名称',
            couat: '我是限定使用说明文字',
            coumat: '金额限定使用说明文字',
            coucut: 1464327955432,
            coucute: 1464427955432,
            coumy: 100000
        }]
    }
};
var rpco = response.rpco,
    body = response.body || {},
    // 优惠券列表
    coulst,
    // 总页数
    tpage;

// 处理
switch(rpco) {
    case 200:
        // 资源集合
        coulst = body.coulst || [];
        // 
        tpage = body.tpage || 0;
        // 渲染
        that.renderCoupons(body);

        // 不存在数据
        (tpage === 0) && (coulst.length === 0) && $('#noList').show();

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
                    that.getCoupons(that.options.couponState, that.options.curpg, that.options.len);
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


return false;
// debug end*/





        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'coupons',
            data: {
                coust: coust,
                curpg: curpg,
                len: len
            },
            type: 'get',
            // 去除iscroll两次单击bug
            async: false,
            beforeSend: function() {
                // 加载提示
                //util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    // 优惠券列表
                    coulst,
                    // 总页数
                    tpage;

                // 处理
                switch(rpco) {
                    case 200:
                        // 资源集合
                        coulst = body.coulst || [];
                        // 
                        tpage = body.tpage || 0;
                        // 渲染
                        that.renderCoupons(body);

                        // 不存在数据
                        (tpage === 0) && (coulst.length === 0) && $('#noList').show();

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
                                    that.getCoupons(that.options.couponState, that.options.curpg, that.options.len);
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
                //util.remComShow();
            }
        });  

    },
    /**
     * 渲染优惠券
     * @parma {object}{1} body 优惠券对象
     */
    renderCoupons: function(body) {
        var that = this,
            // 优惠券列表
            coulst = body.coulst || [],
            // 优惠券类型样式
            coutpClass = '',
            html = '';

        // 未使用个数
        body.couuc && $('#navTab a[value="1"]').find('span').html(that.options.msg.m1 + '(' + body.couuc + ')');
        // 优惠券列表
        for(var i = 0, j = coulst.length; i < j; i++) {
            // 券样式
            coutpClass = that.options.coutpClass[coulst[i].coutp] || '';

            html += '<div class="coupon ' + coutpClass + ' js-coupon" counum="' + coulst[i].counum + '">'
                 +      '<span class="coupon-ltxt"><span class="dtc va-m">' + (that.options.couponType[coulst[i].coutp] || '') + '</span></span>'
                 +      '<div class="coupon-rblk">'
                 +          '<span class="coupon-rblk-ltxt tod">¥<span class="big-txt">' + (coulst[i].coumy/100) + '</span></span>'
                 +          '<div class="coupon-hltxt tod">仅限' + coulst[i].couat + '服务使用</div>';

            coulst[i].coumat && (html += '<div class="coupon-txt tod">满' + coulst[i].coumat + '元可用</div>');

            html +=         '<div class="dashline-gray1"></div>'
                 +          '<div class="coupon-rblk-tip">'
                 +              '<a class="coupon-ltip js-viewDetail" href="javascript:;"><i class="i i-ckxq"></i>查看详情</a>'
                 +              '<span class="coupon-rtip">' + util.formateDate(coulst[i].coucut, 'yyyy.MM.dd') + '--' + util.formateDate(coulst[i].coucute, 'yyyy.MM.dd') + '</span>'
                 +          '</div>'
                 +      '</div>'
                 +  '</div>';

            // 放入优惠券详情
            that.options.viewDetails[coulst[i].counum] = coulst[i].cpdtlst;
        }
        // 隐藏无数据提示
        $('#noList').hide();
        // 放入页面
        $('.iscrollpading-pulltext').length === 1 ? $('.iscrollpading-pulltext').before(html) : $('#list').html(html).show();
    },
    /**
     * _添加优惠券
     * @parma string{1} counum 优惠券编号
     * @parma string{1} coupw 优惠券密码
     */
    _addCoupon: function(counum, coupw) {
        var that = this;




/*// debug star
var response = {
    rpco: 200,
    msg: ''
};
var rpco = response.rpco;

// 处理
switch(rpco) {
    // 绑定成功
    case 200:
        // 
        util.tip(that.options.msg.m10, {iconClass: 'i-chenggong'});
        // 重新加载券列表
        that.reLoadCoupons();
        break;
    // 优惠券不存在
    case 40001:
        util.tip(that.options.msg.m5, {iconClass: 'i-gantan'});
        break;
    // 优惠券密码错误
    case 40002:
        util.tip(that.options.msg.m6, {iconClass: 'i-cha', duration: 1200});
        break;
    // 优惠券已绑定
    case 40003:
        util.tip(that.options.msg.m7, {iconClass: 'i-gantan', duration: 1200});
        break;
    // 优惠券已过期
    case 40004:
        util.tip(that.options.msg.m8, {iconClass: 'i-gantan'});
        break;
    // 优惠券绑定操作频繁
    case 40005:
        util.tip(that.options.msg.m9, {iconClass: 'i-gantan'});
        break;
    default:
        util.tip('添加失败', {iconClass: 'i-cha'})
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'actcou',
            data: {
                counum: counum,
                coupw: coupw
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.save = false;
            },
            success: function(response) {
                var rpco = response.rpco;

                // 处理
                switch(rpco) {
                    // 绑定成功
                    case 200:
                        // 
                        util.tip(that.options.msg.m10, {iconClass: 'i-chenggong'});
                        // 重新加载券列表
                        that.reLoadCoupons();
                        break;
                    // 优惠券不存在
                    case 40001:
                        util.tip(that.options.msg.m5, {iconClass: 'i-gantan'});
                        break;
                    // 优惠券密码错误
                    case 40002:
                        util.tip(that.options.msg.m6, {iconClass: 'i-cha', duration: 1500});
                        break;
                    // 优惠券已绑定
                    case 40003:
                        util.tip(that.options.msg.m7, {iconClass: 'i-gantan', duration: 1500});
                        break;
                    // 优惠券已过期
                    case 40004:
                        util.tip(that.options.msg.m8, {iconClass: 'i-gantan'});
                        break;
                    // 优惠券绑定操作频繁
                    case 40005:
                        util.tip(that.options.msg.m9, {iconClass: 'i-gantan'});
                        break;
                    default:
                        util.tip('添加失败', {iconClass: 'i-cha'})
                }
            },
            complete: function() {
                that.options.requestState.save = true; 
            }
        });
    },
    /**
     * 添加优惠券
     */
    addCoupon: function() {
        var that = this,
            // 优惠券编号文本框
            counumInput = $('.dialog .alert-input input:eq(0)'),
            // 优惠券密码文本框
            coupwInput = $('.dialog .alert-input input:eq(1)'),
            // 优惠券编号
            counum = counumInput.val(),
            // 优惠券密码
            coupw = coupwInput.val();

        // 有效性验证
        if(!that.options.requestState.save) {return true;}
        // 编号
        if(!counum) {
            // 聚焦
            counumInput.focus();
            return false;
        }
        // 密码
        if(!coupw) {
            // 聚焦
            coupwInput.focus();
            return false;
        }

        // 验证通过
        // _添加优惠券
        that._addCoupon(counum, coupw);
    },
    /**
     * 查看详情
     * @parma {string}{1} counum 优惠券编号
     */
    viewDetail: function(counum) {
        var that = this,
            // 详情集合
            cpdtlst = that.options.viewDetails[counum] || [],
            // 详情文本
            detailHtml = '',
            // 弹层html
            html = '';

        // 拼接详情
        for(var i = 0, j = cpdtlst.length; i < j; i++) {
            // 
            detailHtml += cpdtlst[i].cdlb + cpdtlst[i].cdtxt + '<br>';
        }

        // 为空时不显示
        if(!detailHtml) { return false; }

        html += '<div class="dialog js-couponDetail">'
             +      '<div class="tablecell">'
             +          '<div class="dialog-context">'
             +              '<div class="ttl">优惠券详情<span class="opctbig js-couponDetailClose"><i class="i i-delete2"></i></span></div>'
             +              '<div class="txt">' + detailHtml + '</div>'
             +          '</div>'
             +      '</div>'
             +  '</div>';

        // 放入页面
        that.el.append(html);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 添加优惠券单击事件
        that.el.on(click, '#addCoupon', function() {
            // 弹出录入层
            util.prompt('', {
                // 提示文字
                title: that.options.msg.m2,
                // 文本框placehoder
                inpuPlaceholderArray: [that.options.msg.m11, that.options.msg.m12],
                // 存在取消按钮
                justOk: false,
                // 确定按钮回调
                okFn: function() {
                    // 添加优惠券
                    return that.addCoupon();
                },
                // 取消按钮回调
                cancelFn: function() {
                    // nothing...
                }
            });
        });

        // 导航切换事件
        that.el.on(click, '#navTab a', function() {
            // 优惠券状态
            that.options.couponState = $(this).attr('value');
            // 重新加载
            that.reLoadCoupons();
        });

        // 优惠券查看详情 
        that.el.on(click, '.js-viewDetail', function() {
            // 优惠券编号
            var counum = $(this).closest('.js-coupon').attr('counum');
            // 查看详情
            that.viewDetail(counum);
        });

        // 优惠券查看详情关闭
        that.el.on(click, '.js-couponDetailClose', function() {
            // 移除
            $(this).closest('.js-couponDetail').remove();
        });
    }
})