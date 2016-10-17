var root = window || {},
    util = root.util || {};

var AccSearchInput = function(opt) {
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
        // 验证码重发倒计时
        downTime: 10,
        // 全局唯一编码
        uiqcd: '',
        msg: {
            m1: '请选择会员卡类型',
            m2: '会员卡类型有误，请重新选择',
            m3: '请输入会员卡号',
            m4: '该会员卡未绑定手机号',
            m5: '不存在此会员卡',
            m6: '会员卡类型下无此卡',
            m7: '验证码发送量已达今日上限',
            m8: '您当前的请求太频繁，休息一下5分钟后再尝试',
            m9: '请发送验证码进行短信验证',
            m10: '请输入短信验证码',
            m11: '短信验证码有误，请重新获取',
            m12: '短信验证码已超时，请重新获取',
            m13: '手机号有误，请重新尝试',
            m14: '会员卡已存在，不能重复绑定'
        },
        // 请求状态，用于ajax
        requestState: {
            getSendCodePhone: true,
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AccSearchInput.prototype, {
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

        // 账户类型名称
        hrefParma.actype && $('#actype').html(that.options.ACTYPE[hrefParma.actype] || '');
        // 会员账户账号
        hrefParma.acnum && $('#acnum').val(hrefParma.acnum);
        // 手机号
        hrefParma.acphone && $('#acphone').val(hrefParma.acphone);
    },
    /**
     * _保存
     * @parma {object}{1} account 账户对象
     *        {number}{1} actype 账户类型
     *        {string}{1} acnum 账户账号
     *        {string}{1} acrdm 会员卡随机码
     *        {number}{1} state 操作状态
     */
    _save: function(account) {
        var that = this;
        // 操作状态
        account.state = util.OPT_STATE.UPDATE;



/*// debug start
var response = {
    rpco: 200
};
var rpco = response.rpco;

// 处理
switch(rpco) {
    case 200:
        util.href('accsuccess.html');
        break;
    default:
        util.tip('保存失败')
}
return;
// debug end*/




        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modacc',
            data: account,
            type: 'post',
            beforeSend: function() {
                // 禁用按钮
                that.options.requestState.save = false;
                // 
            },
            success: function(response) {
                var rpco = response.rpco;

                // 处理
                switch(rpco) {
                    case 200:
                        util.href('accsuccess.html');
                        break;
                    // 短信验证码错误
                    case 40001:
                        util.tip(that.options.msg.m11);
                        break;
                    // 短信验证码已超时
                    case 40002:
                        util.tip(that.options.msg.m12);
                        break;
                    // 手机号错误
                    case 40003:
                        util.tip(that.options.msg.m13);
                        break;
                    // 会员卡已绑定
                    case 40004:
                        util.tip(that.options.msg.m14);
                        break;
                    default:
                        util.tip('保存失败')
                }
            },
            complete: function() {
                // 启用按钮
                that.options.requestState.save = true;
            }
        }); 
    },
    /**
     * 保存
     */
    save: function() {
        var that = this,
            // 会员卡类型
            actype = that.options.hrefParma.actype,
            // 会员账户
            acnum = that.options.hrefParma.acnum,
            /*// 短信验证码
            mac = that.options.hrefParma.mac,*/
            /*// 全局唯一编码
            uiqcd = that.options.hrefParma.uiqcd,*/
            // 会员卡随机码
            acrdm = that.options.hrefParma.acrdm;

        // 有效性验证
        // 账号类型
        if(!actype) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 账号类型有效性
        if(!that.options.ACTYPE[actype]) {
            util.tip(that.options.msg.m2);
            return false;
        }
        // 会员账号
        if(!acnum) {
            util.tip(that.options.msg.m3);
            return false;
        }
        /*// 短信发送唯一码
        if(!uiqcd) {
            util.tip(that.options.msg.m9);
            return false;
        }
        // 验证码
        if(!mac) {
            util.tip(that.options.msg.m10);
            return false;
        }*/
        // 会员随机码
        if(!acrdm) {
            return false;
        }

        // _保存
        that.options.requestState.save && that._save({
            actype: actype,
            acnum: acnum,
            acrdm: acrdm
            /*mac: mac,
            uiqcd: uiqcd*/
        });
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“绑定”单击事件*/
        that.el.on(click, '#save', function() {
            // 保存
            that.save();
        });
    }
})