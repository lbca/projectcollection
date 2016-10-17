var root = window || {},
    util = root.util || {};

var SetAddress = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        phoneReg: /^(((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[6|7|8]))\d{8}|(170[0|5|9])\d{7})$/, // 手机号正则
        // 联系人正则
        cnameReg: /^[\u4e00-\u9fa5a-zA-Z]+$/,
        // 社区地址正则
        addrReg: /^[^\s]+$/,
        // 常用住址详情
        address: {
            // 区县编码
            area: '',
            // 联系人姓名
            cname: '',
            // 联系电话
            cphone: '',
            // 社区地址
            addr: '',
            // 门牌号
            hnum: '',
            // 变更时间戳
            tsup: '',
            state: 1
        },
        msg: {
            m1: '联系人姓名不能为空',
            m2: '联系电话不能为空',
            m3: '区域信息有误请重新选择',
            m4: '社区地址不能为空',
            m5: '门牌号不能为空',
            m6: '跳转页面，将失去当前录入的信息',
            m7: '请输入正确的手机号',
            m8: '联系人只能包含汉字或字母',
            m9: '社区地址不能包含空格',
            m10: '社区地址只支持6~28个字符',
            m11: '常用地址超限，请删除部分地址后添加'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetAddress.prototype, {
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
            // 区县id
            disId = hrefParma.d || '';
            // 区域信息字符串，省+市+城
            //region = '';


        // 地址基本信息
        if(disId) {
            that.options.address.area = disId;
            that.getRegion(disId);
        }
        // 获取地区全称
        /*// 变更时间戳
        if(hrefParma.tsup) {
            that.options.address.tsup = hrefParma.tsup;
        }*/

        // 区域信息
        /*if(hrefParma.proName && hrefParma.cityName && hrefParma.disName) {
           region = hrefParma.proName + hrefParma.cityName + hrefParma.disName;
        }*/

        // 载入基本信息
        /*// 联系人
        hrefParma.cname && $('#cname').val(hrefParma.cname);
        // 联系电话
        hrefParma.cphone && $('#cphone').val(hrefParma.cphone);*/
        // 区域信息
        //region && $('#region').html(region);
        /*// 社区地址
        hrefParma.addr && $('#addr').val(hrefParma.addr);
        // 门牌号
        hrefParma.hnum && $('#hnum').val(hrefParma.hnum);*/
    },
    /**
     * 获取地区全称
     * @parma {number}{1} disId 区编号
     */
    getRegion: function(disId) {
        var that = this,
            // 省编码
            proId = disId.slice(0, 2) + '0000',
            // 市编码
            cityId = disId.slice(0, 4) + '00',
            // 地区全称
            region = '';

        // 请求...
        util.api({
            surl: root.PVC_API_PATH + proId + '.json',
            type: 'get',
            success: function(response) {
                // 市集合
                var citys = response.cld || [],
                    // 县集合
                    dists = [],
                    // 
                    item = {};

                // 追加省名称
                //region += response.N;

                // 遍历城市
                for(var i = 0, j = citys.length; i < j; i++) {
                    item = citys[i] || {};
                    // 匹配
                    if(cityId == item.C) {
                        // 追加城市名称
                        region += ' ' + item.N;
                        dists = item.cld;

                        // 遍历区
                        for(var i = 0, j = dists.length; i < j; i++) {
                            item = dists[i] || {};
                            // 匹配
                            if(disId == item.C) {
                                // 追加区县名称
                                //region += ' ' + item.N;
                                region = item.F;
                                break;
                            }
                        }
                        break;
                    }
                }

                // 渲染页面
                $('#region').html(region);
            }
        });  
    },
    /**
     * _保存
     * @parma {object}{1, 0} address 地址详情
     */
    _save: function(address) {
        var that = this;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modaddr',
            data: address,
            type: 'post',
            beforeSend: function() {
                that.options.requestState.save = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        util.href('addresslist.html');
                        break;
                    // 地址数量超过20
                    case 40006:
                        util.tip(that.options.msg.m11);
                        break;
                    default:
                        util.tip('保存失败')
                }
            },
            complete: function() {
                that.options.requestState.save = true; 
            }
        });

    },
    /**
     * 保存
     */
    save: function() {
        var that = this,
            tsup = that.options.address.tsup,
            area = that.options.address.area,
            cname = $('#cname').val(),
            cphone = $('#cphone').val(),
            addr = $('#addr').val(),
            hnum = $('#hnum').val();

        // 允许请求
        if(!that.options.requestState.save) { return false; }

        // 有效性验证
        if(!cname) {
            util.tip(that.options.msg.m1);
            return false;
        }
        if(!that.options.cnameReg.test(cname)) {
            util.tip(that.options.msg.m8);
            return false;
        }
        if(!cphone) {
            util.tip(that.options.msg.m2);
            return false;
        }
        if(!that.options.phoneReg.test(cphone)) {
            util.tip(that.options.msg.m7);
            return false;
        }
        if(!area) {
            util.tip(that.options.msg.m3);
            return false;
        }
        if(!addr) {
            util.tip(that.options.msg.m4);
            return false;
        }
        if(addr.length < 6 || addr.length > 28) {
            util.tip(that.options.msg.m10);
            return false;   
        }
        if(!that.options.addrReg.test(addr)) {
            util.tip(that.options.msg.m9);
            return false;
        }
        if(!hnum) {
            util.tip(that.options.msg.m5);
            return false;
        }

        // 常用地址详情
        $.extend(that.options.address, {
            tsup: tsup,
            area: area,
            cname: cname,
            cphone: cphone,
            addr: addr,
            hnum: hnum,
            state: util.OPT_STATE.UPDATE
        });
        
        // 事件戳为空时为新增操作
        that.options.address.tsup || (delete that.options.address.tsup);

        /*// debug start
        util.href('addresslist.html');
        return false;
        // debug end*/

        // 保存
        that._save(that.options.address);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*保存按钮*/
        that.el.on(click, '#save', function() {
            that.save();
        });

        /*手机号文本框限制输入*/
        that.el.on('input propertychange', '#cphone', function(e) {
            var value = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(value);
        });

        /*“区域”单击事件*/
        that.el.on(click, '#region', function() {
            //util.href('addresslist.html?ou=set.html');
            util.alert(that.options.msg.m6, {
                justOk: false,
                defBtnIndex: 1,
                okFn: function() {
                    // 打开省页面
                    util.href('areaprovince.html', {
                        cbu: 'setaddress.html'
                    });
                }
            });
        });
    }
})