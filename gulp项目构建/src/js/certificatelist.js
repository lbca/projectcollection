var root = window || {},
    util = root.util || {};

var CertificateList = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 证件类型
        ceType: {
            '1': '身份证',
            '2': '户口薄',
            '3': '护照',
            '4': '军官证',
            '5': '士兵证',
            '6': '港澳居民来往内地通行证',
            '7': '台湾同胞来往内地通行证',
            '8': '临时身份证',
            '9': '外国人居留证',
            '10': '警官证'
        },
        // 证件类型图片class
        cetic: {
            '1': 'i-shenfenzheng',
            '2': 'i-hukoubo',
            '3': 'i-huzhao',
            '4': 'i-junguan',
            '5': 'i-shibingi',
            '6': 'i-gangaotongxingzheng',
            '7': 'i-taiwan',
            '8': 'i-lingshi',
            '9': 'i-waiguoren',
            '10': 'i-jingguan'
        },
        // 证件列表
        celist: [],
        msg: {
            m1: '删除成功',
            m2: '是否删除当前证件？'
        },
        // 请求状态，用于ajax请求
        requestState: {
            deleteCerti: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(CertificateList.prototype, {
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

        // 获取证件列表
        that.getCertiList();
    },
    /**
     * 渲染证件列表
     * @parma {array}{1} celist 证件集合
     */
    renderCertiList: function(celist) {
        var that = this,
            celist = celist || [],
            celistStr = '',
            cetp = '',
            cetpName = '',
            cetpClass = '',
            ceno = '',
            oname = '',
            natly = '';

        // 
        $.each(celist, function(i, n) {
            cetp = n.cetp;
            cetpName = that.options.ceType[cetp] || '';
            cetpClass = that.options.cetic[cetp] || '';
            ceno = n.ceno || '';
            oname = n.oname || '';
            natly = n.natly || '';
            
            celistStr += '<li val="' + n.tsup + '" cetp="' + cetp + '">'
                       +   '<i class="text-icon i ' + cetpClass + '"></i>'
                       +   '<p class="tod">' + cetpName + '<span class="text-smallgray pl5">' + natly + '</span>' + '</p>'
                       +   '<p class="text-detail">'
                       +     '<span class="text-smallgray">' + oname + '</span>'
                       +     '<span class="text-rt">' + ceno + '</span>'
                       +   '</p>'
                       +   '<span class="btn-del dn"><i class="i i-delete1"></i></span>'
                       + '</li>';

        });

        // 渲染
        celistStr && $('#list').html(celistStr).show();
    },
    /**
     * 获取证件列表
     */
    getCertiList: function() {
        var that = this;
/*// debug start
var response = {
    "rpco": 200,
    "msg": "",
    "body": {
        "celist": [{
            "tsup": 1451378820879,
            "cetp": 0,
            "ceno": "**************3215",
            "oname": "小明",
            "natly": "加拿大"
        }, {
            "tsup": 1451378820880,
            "cetp": 1,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 2,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 3,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 4,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 5,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 6,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 7,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 8,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }, {
            "tsup": 1451378820880,
            "cetp": 9,
            "ceno": "**************3215",
            "oname": "小红",
            "natly": "俄罗斯"
        }]
    }
};
var rpco = response.rpco,
    body = response.body || {},
    celist = body.celist || [];

// 处理
switch(rpco) {
    case 200:
        that.options.celist = celist || [];
        // 渲染
        that.renderCertiList(celist);
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
return;
// debug end*/
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'certifilist',
            type: 'get',
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    celist = body.celist || [];

                // 处理
                switch(rpco) {
                    case 200:
                        that.options.celist = celist || [];
                        // 渲染
                        that.renderCertiList(celist);
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
            }
        });  
    },
    /**
     * _删除证件
     * @parma {number}{1} tsup 变更时间戳
     * @parma {number}{1} cetp 证件类型
     */
    _deleteCerti: function(tsup, cetp) {
        var that = this;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modcertifi',
            data: {
                tsup: tsup,
                cetp: cetp,
                state: util.OPT_STATE.DELETE
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.deleteCerti = false;
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
                        // 重新加载证件列表
                        window.location.reload();
                        //that.getCertiList();
                        break;
                    default:
                        util.tip('删除失败')
                }
            },
            complete: function() {
                that.options.requestState.deleteCerti = true; 
            }
        });
    },
    /**
     * 删除证件
     * @parma {number}{1} tsup 变更时间戳
     * @parma {number}{1} cetp 证件类型
     */
    deleteCerti: function(tsup, cetp) {
        var that = this;

        // 删除确认
        util.alert(that.options.msg.m2, {
            justOk: false,
            defBtnIndex: 1,
            okFn: function() {
                that._deleteCerti(tsup, cetp);
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

        /*“添加证件”点击事件*/
        that.el.on(click, '.js-addBind', function() {
            util.href('certificatetype.html');
        });

        /*解绑菜单单击*/
        that.el.on(click, '.js-unBind', function() {
            $('.btn-del').show();
        });

        /*隐藏解绑小图标*/
        $('.header, .container').on(click, function(e) {
            var target = $(e.target);
            // 隐藏删除图标
            target.is('.btn-del') || target.is('.js-unBind') || $('.btn-del').hide(); 
        });

        /*解绑按钮单击事件*/
        that.el.on(click, '.btn-del', function() {
            var liEL = $(this).closest('li'),
                tsup = liEL.attr('val'),
                cetp = liEL.attr('cetp');
            // 删除
            tsup && that.deleteCerti(tsup, cetp);
        });
    }
})