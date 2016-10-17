var root = window || {},
    util = root.util || {};

var AccSm = function(opt) {
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
        // 会员账户类型
        actype: 0,
        // 会员卡号
        acnum: '',
        // 会员卡手机号和用户绑定手机号存在情况
        mcpnt: 0,
        // 全球唯一码
        uiqcd: 0,
        // 邀请人id
        ivtid: 0,
        msg: {
            m4: '该会员卡未绑定手机号',
            m5: '不存在此会员卡',
            m6: '会员卡类型下无此卡',
            m7: '验证码发送量已达今日上限',
            m8: '您当前的请求太频繁，休息一下5分钟后再尝试',
            m10: '请输入短信验证码',
            m11: '请发送验证码进行短信验证',
            m12: '短信验证码有误，请重新获取',
            m13: '短信验证码已超时，请重新获取',
            m14: '手机号有误，请重新尝试',
            m15: '会员卡已存在，不能重复绑定'
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

$.extend(AccSm.prototype, {
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

/*// debug start
hrefParma.tk = 123456;
// debug end*/


        // 获取会员卡详情
        hrefParma.tk && that.getAccDetail(hrefParma.tk);
    },
    /**
     * 倒计时
     */
    countDown: function() {
        var that = this;
        // 倒计时
        util.countDown({
            elem: $('.js-vcode'),
            downTime: that.options.downTime,
            formate: '已发（count）',
            callback: function() {
                that.options.requestState.getSendCodePhone = true;
            }
        });
    },
    /**
     * 获取会员卡详情
     * @parma {string}{1} tk token标识
     */
    getAccDetail: function(tk) {
        var that = this;


/*// debug start
var response = {
    rpco: 200,
    body: {
        actype: 1,
        //actype: 2,
        //actype: 3,
        //actype: 4,
        //actype: 5,
        //actype: 6,
        //actype: 7,
        //actype: 8,
        acnum: 888888888,
        mcpnt: 0,
        mcpnt: 1,
        mcpnt: 2,
        //mcpnt: 3,
        //mcpnt: 4,
        empn: '135****4236'
    }  
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 会员卡手机号和用户绑定手机号存在情况
        that.options.mcpnt = body.mcpnt;
        // 会员卡类型
        that.options.actype = body.actype;
        // 会员卡号
        that.options.acnum = body.acnum;
        // 邀请人id
        that.options.ivtid = body.ivtid;
        // 渲染页面信息
        that.renderAccDetail(body);
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.BSNS_API_PATH + 'tkbdacc',
            data: {
                tk: tk
            },
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 会员卡手机号和用户绑定手机号存在情况
                        that.options.mcpnt = body.mcpnt;
                        // 会员卡类型
                        that.options.actype = body.actype;
                        // 会员卡号
                        that.options.acnum = body.acnum;
                        // 邀请人id
                        that.options.ivtid = body.ivtid;
                        // 渲染页面信息
                        that.renderAccDetail(body);
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        });  
    },
    /**
     * 渲染会员卡详细信息
     * @parma {object}{1} body 会员卡详情
     */
    renderAccDetail: function(body) {
        var that = this,
            // 会员账户类型名称
            actypeTxt = that.options.ACTYPE[body.actype] || '';

        // 业务类型
        actypeTxt && $('#acctype').html(actypeTxt);
        // 会员卡图标
        $('#acctypetu').addClass(that.options.actic[body.actype]);
        // 会员卡号
        body.acnum && $('#acnum').html(body.acnum);

        // 业务处理
        switch(body.mcpnt) {
            // 存在会员卡手机号
            case 1:// 此处故意省去break
            // 同时存在
            case 3:
                // 加密手机号
                body.empn && $('#cardPhone').html(body.empn);
                // 用会员手机号绑定
                $('#hasCardPhone').show();
                break;
            // 存在用户绑定手机号
            case 2:
                // 加密手机号
                body.empn && $('#userPhone').val(body.empn);
                // 用用户手机号绑定
                $('#hasUserPhone').show();
                // 显示注意事项
                $('.dialog').removeClass('dn')
                break;
            // 不存在手机号
            case 4:
                // 显示不可绑定文案
                $('#unhave').show();
                break;
        }
    },
    /**
     * 发送短信验证码
     * @parma {string}{1} actype 会员卡类型
     * @parma {string}{1} acnum 会员卡号
     * @parma {string}{1} mcpnt 会员卡手机号和用户绑定手机号存在情况
     */
    getSendCodePhone: function(actype, acnum, mcpnt) {
        var that = this,
            rpco;

        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'acbdph',
            data: {
                actype: actype,
                acnum: acnum,
                mcpnt: mcpnt
            },
            type: 'post',
            async: false,
            beforeSend: function() {
                // 禁用按钮
                that.options.requestState.getSendCodePhone = false;
                // 
            },
            success: function(response) {
                var body;
                rpco = response.rpco;
                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 全局唯一编码
                        that.options.uiqcd = body.uiqcd;
                        // 已加密手机号
                        //body.mobile && $('#mobile').html(mobile) && $('#sendTip').show();
                        // 倒计时
                        that.countDown();
                        break;
                    // 会员卡无绑定手机号
                    case 40001:
                        util.tip(that.options.msg.m4);
                        break;
                    // 会员卡错误
                    case 40002:
                        util.tip(that.options.msg.m5);
                        // 禁用按钮
                        break;
                    // 会员卡类型错误
                    case 40003:
                        util.tip(that.options.msg.m6);
                        break;
                    // 验证码发送已达当日上限
                    case 40004:
                        util.tip(that.options.msg.m7);
                        break;
                    // 验证码发送频繁
                    case 40005:
                        util.tip(that.options.msg.m8);
                        break;
                    default:
                        util.tip('请求失败')
                }
            },
            complete: function() {
                // 启用按钮
                (rpco !== 200) && (that.options.requestState.getSendCodePhone = true);
            }
        }); 
    },
    /**
     * _保存
     * @parma {object}{1} account 账户对象
     *        {number}{1} actype 账户类型
     *        {string}{1} acnum 账户账号
     *        {string}{1} mac 短信
     *        {string}{1} uiqcd 全局唯一码
     *        {string}{1} ivtid 邀请人id
     */
    _save: function(account) {
        var that = this;
        // 操作状态
        account.state = util.OPT_STATE.UPDATE;


/*// debug start
var response = {
    rpco: 200,
    //rpco: 40001,
    //rpco: 40002,
    //rpco: 40003,
    //rpco: 40004,
    body: {}

};
var rpco = response.rpco,
    body = response.body || {},
    // 返回码
    uiqcd = body.uiqcd;

// 处理
switch(rpco) {
    case 200:
        util.href('accsuccess.html');
        break;
    // 短信验证码错误
    case 40001:
        util.tip(that.options.msg.m12);
        break;
    // 短信验证码已超时
    case 40002:
        util.tip(that.options.msg.m13);
        break;
    // 手机号错误
    case 40003:
        util.tip(that.options.msg.m14);
        break;
    // 会员卡已绑定
    case 40004:
        util.tip(that.options.msg.m15);
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
                var rpco = response.rpco,
                    body = response.body || {},
                    // 返回码
                    uiqcd = body.uiqcd;

                // 处理
                switch(rpco) {
                    case 200:
                        util.href('accsuccess.html');
                        break;
                    // 短信验证码错误
                    case 40001:
                        util.tip(that.options.msg.m12);
                        break;
                    // 短信验证码已超时
                    case 40002:
                        util.tip(that.options.msg.m13);
                        break;
                    // 手机号错误
                    case 40003:
                        util.tip(that.options.msg.m14);
                        break;
                    // 会员卡已绑定
                    case 40004:
                        util.tip(that.options.msg.m15);
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
            // 短信验证码
            mac = $('.js-mac:visible').val();

        // 有效性验证
        // 
        if(!that.options.uiqcd) {
            util.tip(that.options.msg.m11);
            return false;
        }
        // 验证码
        if(!mac) {
            util.tip(that.options.msg.m10);
            return false;
        }

        // _保存
        that.options.requestState.save && that._save({
            actype: that.options.actype,
            acnum: that.options.acnum,
            mac: mac,
            uiqcd: that.options.uiqcd,
            ivtid: that.options.ivtid
        });
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 发送验证码
        that.el.on(click, '.js-vcode', function() {
            // 发送验证码
            that.options.requestState.getSendCodePhone && that.getSendCodePhone(that.options.actype, that.options.acnum, that.options.mcpnt);
        });

        // 绑定按钮
        that.el.on(click, '.js-save:visible', function() {
            // 发送验证码
            that.save();
        });
        
        // “绑定说明”关闭按钮
        that.el.on(click, '#dialogClose', function() {
            $('.dialog').addClass('dn');
        });
    }
})