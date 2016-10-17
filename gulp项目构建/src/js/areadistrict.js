var root = window || {},
    util = root.util || {};

var AreaDistrict = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 县对象
        dstrict: {
            p: 0,
            pn: '',
            c: 0,
            cn: '',
            d: 0,
            dn: ''
        },
        msg: {
            m1: '城市选择有误',
            m2: '修改成功'
        },
        // 请求状态，用于ajax请求
        requestState: {
            setareaSave: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AreaDistrict.prototype, {
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();
        that.addEvent();
        //that.loadGoBack();
    },
    // /**
    //  * 加载返回按钮
    //  */
    // loadGoBack: function() {
    //     var ou = util.getHrefParma().ou;
    //     // 加载返回按钮
    //     ou && $('.goBack').attr('href', ou).show();
    // },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this,
            hrefParma = that.options.hrefParma,
            // 市编码
            cityId = hrefParma.c || '';
        // 获取县
        that.getDistrict(cityId);
    },
    /**
     * 渲染页面项
     * @parma {array}{1} arr 数据数组
     */
    renderItem: function(arr) {
        var html = '';
        arr = arr || [];

        for(var i = 0, j = arr.length; i < j; i++) {
            html += '<li val="' + arr[i].C + '">' + arr[i].N + '</li>';
        }
        $('#list').html(html);
    },
    /**
     * 获取市
     * @parma {number}{1} cityId 市编号
     */
    getDistrict: function(cityId) {
        var that = this,
            proId = cityId.slice(0, 2) + '0000';

        // 请求...
        util.api({
            surl: root.PVC_API_PATH + proId + '.json',
            type: 'get',
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                // 市集合
                var citys = response.cld || [],
                    // 县集合
                    dists = [],
                    item = {};
                // 省编码
                that.options.dstrict.p = response.C;
                // 省名称
                that.options.dstrict.pn = response.N;
                // 
                for(var i = 0, j = citys.length; i < j; i++) {
                    item = citys[i] || {};
                    // 匹配
                    if(cityId == item.C) {
                        // 省编码
                        that.options.dstrict.c = item.C;
                        // 省名称
                        that.options.dstrict.cn = item.N;
                        dists = item.cld;
                        break;
                    }
                }

                // 渲染页面
                that.renderItem(dists);
            },
            complete: function() {
                // 移除提示
                util.remComShow();
            }
        });  
    },
    /**
     * 设置地区-保存
     * @parma {number}{1} disId 地区城市编码
     */
    setareaSave: function(disId) {
        var that = this;

        if(!that.options.requestState.setareaSave) { return false; }
        // 非空验证
        if(!disId) {
            alert(that.options.msg.m1);
            return false;
        }

        /*// debug start
        //util.href('set.html', {}, true);
        util.href('set.html');
        return false;
        // debug end*/

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modudtal',
            data: {
                mod: 16,
                area: disId
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.setareaSave = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        //alert(that.options.msg.m2);
                        util.href('set.html');
                        break;
                    default:
                        util.tip('保存失败')
                }
            },
            complete: function() {
                that.options.requestState.setareaSave = true; 
            }
        });
    },
    /**
     * 保存
     */
    save: function() {
        var that = this,
            hrefParma = that.options.hrefParma,
            disId = that.options.dstrict.d,
            disName = that.options.dstrict.dn,
            // 业务类型
            b = hrefParma.b,
            // 地区详情
            parma = {
                d: that.options.dstrict.d
            };

        // 根据业务类型，处理业务
        switch (b) {
            // 个人设置-地区
            case '1':
                that.setareaSave(disId);
                break;
            default:
                // 重定向回调页
                util.href(hrefParma.cbu, parma);
        }
    },
    /**
     * 事件代码
     */
    addEvent: function() {
        var that = this,
            click = util.getClick();

        /*选项单击事件*/
        that.el.on(click, '#list li', function() {
            // 县id
            that.options.dstrict.d = $(this).attr('val') || '';
            // 县名称
            that.options.dstrict.dn = $(this).text() || '';

            that.save();
            
            /*$('li').removeClass('cur');
            $(this).addClass('cur');
            // 保持勾选效果
            setTimeout(function() {
                that.save();
            }, 100);*/
        });
    }
})