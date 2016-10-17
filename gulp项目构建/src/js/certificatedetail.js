var root = window || {},
    util = root.util || {};

var CertificateDetail = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 姓名正则
        certNameReg: /^[^\s]+$/,
        // 证件号正则
        certNoReg: /^[^\s]+$/,
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
        // 证件对象
        certificate: {
            // 证件类型
            cetp: '',
            // 持有人姓名
            oname: '',
            // 证件号码
            ceno: '',
            state: 1
        },
        msg: {
            m1: '请输入证件持有者姓名',
            m2: '请输入证件号',
            m3: '新增成功',
            m4: '证件类型错误，请重新选择',
            m5: '不可重复绑定同一类型证件',
            m6: '姓名不能包含空格',
            m7: '证件号不能包含空格'
        },
        // 请求状态，用于ajax
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(CertificateDetail.prototype, {
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
            hrefParma = this.options.hrefParma,
            cetp = hrefParma.actype || '',
            certType = that.options.ceType[cetp] || '';
        // 保存证件类型
        that.options.certificate.cetp = cetp;
        // 显示证件类型
        certType && $('#certType').html(certType);
    },
    /**
     * _保存
     * @parma {object}{1} certificate 证件信息
     */
    _save: function(certificate) {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modcertifi',
            data: certificate,
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
                        util.href('certificatelist.html');
                        /*util.tip(that.options.msg.m3);
                        setTimeout(function() {
                            util.href('certificatelist.html');
                        }, 300);*/
                        break;
                    // 已绑定该类型证件
                    case 40002:
                        util.tip(that.options.msg.m5);
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
     *保存
     */
    save: function() {
        var that = this,
            certName = $('#certName').val(),
            certNo = $('#certNo').val();

        if(!that.options.requestState.save) { return false; }

        // 有效性验证
        if(!that.options.certificate.cetp) {
            util.tip(that.options.msg.m4);
            return false;
        }
        if(!certName) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 名称规则
        if(!that.options.certNameReg.test(certName)) {
            util.tip(that.options.msg.m6);
            return false;
        }
        if(!certNo) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 证件号规则
        if(!that.options.certNoReg.test(certNo)) {
            util.tip(that.options.msg.m7);
            return false;
        }

        // 
        $.extend(that.options.certificate, {
            oname: certName,
            ceno: certNo,
            state: util.OPT_STATE.UPDATE
        });

        /*// debug start
            util.tip(that.options.msg.m3);
            util.href('certificatelist.html');
            return false;
        // debug end*/
        that._save(that.options.certificate);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“添加证件”点击事件*/
        that.el.on(click, '#save', function() {
            that.save();
        });
    }
})