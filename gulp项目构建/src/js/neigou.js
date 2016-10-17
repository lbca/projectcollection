var root = window || {},
    util = root.util || {};

var NeiGou = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 正则
        reg: {
            // 姓名
            name: /^[\u4e00-\u9fa5a-zA-Z]+$/,
            // 手机
            phone: /^(((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[6|7|8]))\d{8}|(170[0|5|9])\d{7})$/
        },
        // 是否为修改
        isMod: true,
        // 活动信息
        activeInfo: {
            // 区域标识
            regid: '',
            // 感兴趣品类，注：","分割
            foi: ''
        },
        //
        msg: {
            m1: '姓名未填写',
            m2: '只能输入汉字和字母',
            m3: '手机号码未填写',
            m4: '手机号码格式错误',
            m5: '手机号已登记',
            m6: '推荐人编号错误',
            m7: '报名已截止',
            m8: '登记成功'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(NeiGou.prototype, {
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
    rpco: 200,
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
        // 是否为修改
        that.options.isMod = false;
        // 显示展示模块
        $('#view').show();
        // 显示“修改信息”按钮
        //$('#modify').show().css('display', 'block');
        $('#modify').removeClass('dn');
        break;
    // 未参加
    case 40005:
        // 切换修改模式
        that.switchModify();
        break;

    default:
        util.tip('查询失败')
}

// 渲染
that.renderActiveInfo(body);
// 获取感兴趣品类
that.getLikeCategory();
// 切换修改模式
hrefParma.isMod && that.switchModify();
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
                        // 是否为修改
                        that.options.isMod = false;
                        // 显示展示模块
                        $('#view').show();
                        // 显示“修改信息”按钮
                        $('#modify').removeClass('dn');
                        break;
                    // 未参加
                    case 40005:
                        // 切换修改模式
                        that.switchModify();
                        break;

                    default:
                        util.tip('查询失败')
                }

                // 渲染
                that.renderActiveInfo(body);
                // 获取感兴趣品类
                that.getLikeCategory();
                // 切换修改模式
                hrefParma.isMod && that.switchModify();
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
            atstate = body.atstate,
            name,
            phone,
            sendPerson,
            areaval;

        // 活动状态
        // 信息修改已截止 
        if(atstate == 2) {
            // 跳转展示页
            util.replace('neigouinfo.html');
        }
        // 活动进行中
        else {
            /*// 可修改活动信息
            // 姓名
            body.gname && $('.js_name').val(body.gname);
            // 手机
            body.mob && $('.js_phone').val(body.mob);
            // 推荐人编号
            body.refid && $('.js_sendPerson').val(body.refid);
            // 区域
            $('.js_areaval').html(hrefParma.areafull || body.regtxt);
            // 区域id
            that.options.activeInfo.regid = hrefParma.d || body.regid;
            // 感兴趣品类
            that.options.activeInfo.foi = body.foi || '';*/

            // 可修改活动信息
            // 姓名
            name = hrefParma.gname || body.gname || '';
            $('.js_name').val(name).html(name);
            // 手机
            phone = hrefParma.mob || body.mob || '';
            // 2016.08.25
            phone += '';
            phone = phone.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2');
            $('.js_phone').val(phone).html(phone);
            // 推荐人编号
            sendPerson = hrefParma.refid || body.refid || '';
            $('.js_sendPerson').val(sendPerson).html(sendPerson);
            // 区域
            $('.js_areaval').html(hrefParma.areafull || body.regtxt || '');
            // 区域id
            that.options.activeInfo.regid = hrefParma.d || body.regid;
            // 感兴趣品类
            that.options.activeInfo.foi = hrefParma.foi || body.foi || '';
        }

    },
    /**
     * 获取感兴趣的品类
     */
    getLikeCategory: function() {
        var that = this;


/*// debug star
var response = {
    rpco: 200,
    body: [{
        id: 1,
        name: '手机'
    }, {
        id: 2,
        name: '空调'
    }, {
        id: 3,
        name: '热水器'
    }, {
        id: 4,
        name: '彩电'
    }, {
        id: 5,
        name: '烟灶'
    }, {
        id: 6,
        name: '冰箱'
    }, {
        id: 7,
        name: '洗衣机'
    }, {
        id: 8,
        name: '电脑'
    }, {
        id: 9,
        name: '小家电'
    }, {
        id: 10,
        name: '数码'
    }, {
        id: 11,
        name: '其他'
    }]
};
var rpco = response.rpco,
    categoryList = response.body || {};

// 处理
switch(rpco) {
    case 200:
        // 渲染
        that.renderLikeCategory(categoryList);
        // 选中
        that.options.activeInfo.foi && that.selectLikeCategory(that.options.activeInfo.foi);
        break;
    // 没有找到对应数据
    case 404:
        //$('#noList').show();
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/




        // 请求
        util.api({
            surl: root.PURCHASING_API_PATH + 'getFoi',
            type: 'post',
            beforeSend: function() {
                // 加载提示
                //util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    categoryList = response.body || {};

                // 处理
                switch(rpco) {
                    case 200:
                        // 渲染
                        that.renderLikeCategory(categoryList);
                        // 选中
                        that.options.activeInfo.foi && that.selectLikeCategory(that.options.activeInfo.foi);
                        break;
                    // 没有找到对应数据
                    case 404:
                        //$('#noList').show();
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
     * 保存
     */
    save: function() {
        var that = this,
            // 姓名
            name = $('#mod .js_name').val(),
            // 手机
            phone = $('#mod .js_phone').val(),
            // 推荐人
            sendPerson = $('#mod .js_sendPerson').val(),
            // 感兴趣的分类
            category = '',
            // 地区
            regid = that.options.hrefParma.d,
            // 发请求参数
            data;

        // 有效性验证
        // 姓名
        if(!name) {
            util.tip(that.options.msg.m1);
            return false;
        }
        if(!that.options.reg.name.test(name)) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 手机
        if(!phone) {
            util.tip(that.options.msg.m3);
            return false;
        }
        if(!that.options.reg.phone.test(phone)) {
            util.tip(that.options.msg.m4);
            return false;
        }
        // 

        // 请求参数
        data = {
            gname: name,
            mob: phone
        };
        // 遍历获取感兴趣品类
        $('#mod .js_list .sel').each(function(i, n) {
            category += ',' + $(this).attr('val');
        });
        // 兴趣分类
        category && (data.foi = category = category.substring(1, category.length));
        // 推荐员工编号
        sendPerson && (data.refid = sendPerson);
        // 地区
        regid && (data.regid = regid);

        // _保存
        that._save(data);
    },
    /**
     * _保存
     * @parma {object}{1} data 请求参数
     */
    _save: function(data) {
        var that = this;

        if(!that.options.requestState.save) { return false; }


/*// debug star
var response = {
    rpco: 200,
    //rpco: 40002,
    body: {}
};
var rpco = response.rpco,
    categoryList = response.body || {};

// 处理
switch(rpco) {
    // 
    case 200:
        util.replace('neigou.html');

        //util.tip(that.options.msg.m8);
        //// 刷新页面
        //setTimeout(function() {
        //    window.location.reload();
        //}, 800);
        break;
    // 该手机号已登记
    case 40002:
        util.tip(that.options.msg.m5);
        break;
    // 推荐人编号错误
    case 40011:
        util.tip(that.options.msg.m6);
        break;
    // 报名已截止
    case 40012:
        util.tip(that.options.msg.m7);
        break;
    default:
        util.tip('提交失败');
}
return;
// debug end*/


        // 请求
        util.api({
            data: data,
            surl: root.PURCHASING_API_PATH + 'register',
            type: 'post',
            beforeSend: function() {
                // 加载提示
                //util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
                that.options.requestState.save = false;
            },
            success: function(response) {
                var rpco = response.rpco,
                    categoryList = response.body || {};

                // 处理
                switch(rpco) {
                    // 
                    case 200:
                        //window.location.reload();
                        util.replace('neigou.html');
                        /*util.tip(that.options.msg.m8);
                        // 刷新页面
                        setTimeout(function() {
                            window.location.reload();
                        }, 800);*/
                        break;
                    // 该手机号已登记
                    case 40002:
                        util.tip(that.options.msg.m5);
                        break;
                    // 推荐人编号错误
                    case 40011:
                        util.tip(that.options.msg.m6);
                        break;
                    // 报名已截止
                    case 40012:
                        util.tip(that.options.msg.m7);
                        break;
                    default:
                        util.tip('提交失败');
                }
            },
            complete: function() {
                // 移除提示
                //util.remComShow();
                that.options.requestState.save = true;
            }
        });
    },
    /**
     * 渲染证件列表
     * @parma {array}{1} list 品类集合
     */
    renderLikeCategory: function(list) {
        var that = this,
            listEL = $('.js_list');
            html = '';

        // 遍历
        for(var i = 0, j = list.length; i < j; i++) {
            html += '<span class="btn btn-gray tod js_category" val="' + list[i].id + '">' + list[i].name + '</span>';
        }
        
        // 放入页面
        html && listEL.html(html);
        // 计算外层包围框宽度
        listEL.width(listEL.filter(':visible').width() + parseInt($('.js_category').css('margin-right')));
    },
    /**
     * 选中感兴趣的品类
     * @parma {string}{1} splitStr 品类字符串，注：","分割
     */
    selectLikeCategory: function(splitStr) {
        var that = this,
            array = splitStr.split(',');

        // 遍历
        for(var i = 0, j = array.length; i < j; i++) {
            // 添加选中类
            $('.js_category[val="' + array[i] + '"]').addClass('sel');
        }
    },
    /**
     * 设置地区
     */
    setArea: function() {
        var that = this,
            // 姓名
            name = $('#mod .js_name').val(),
            // 手机
            phone = $('#mod .js_phone').val(),
            // 推荐人
            sendPerson = $('#mod .js_sendPerson').val(),
            // 感兴趣的分类
            category = '',
            // 地区
            regid = that.options.hrefParma.d,
            // 发请求参数
            data = {};

        // 遍历获取感兴趣品类
        $('#mod .js_list .sel').each(function(i, n) {
            category += ',' + $(this).attr('val');
        });

        // 拼接参数
        name && (data.gname = name);
        phone && (data.mob = phone);
        sendPerson && (data.refid = sendPerson);
        category && (data.foi = category = category.substring(1, category.length));

        // 
        util.href('neigouprovince.html', data, true);
    },
    /**
     * 切换修改模式
     */
    switchModify: function() {
        var that = this;
        // 隐藏展示模块
        $('#view').hide();
        // 隐藏“修改信息”按钮
        $('#modify').addClass('dn');
        // 显示录入模块
        $('#mod').show();
        // 显示“提交信息”按钮
        $('#save').removeClass('dn');
        // 设置为可修改
        that.options.isMod = true;
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 品类单击事件
        that.el.on(click, '.js_category', function() {
            // 
            that.options.isMod && $(this).toggleClass('sel');
        });
        
        // “提交信息”单击事件
        that.el.on(click, '#save', function() {
            // 
            that.save();
        });
        
        // “修改信息”单击事件
        that.el.on(click, '#modify', function() {
            that.switchModify();
        });

        // “地区”单击事件
        that.el.on(click, '#area', function() {
            // 
            that.options.isMod && that.setArea();
        });

        // 改变窗口大小
        $(window).resize(function() {
            var listEL = $('.js_list');
            // 计算外层包围框宽度
            listEL.width('100%');
            listEL.width(listEL.filter(':visible').width() + parseInt($('.js_category').css('margin-right')));
        });
    }
})