var root = window || {},
    util = root.util || {};

var SetPhone = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        phone: '',
        // 美服号
        mbsn: '',
        msg: {
            m1: '是否确认解绑当前手机号？<br>解绑后该号码将不能作为登录名使用。',
            m2: '若解绑手机号，需设置美服号'
        },
        requestState: {
            delphone: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetPhone.prototype, {
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
            phone = hrefParma.phone;

        that.options.phone = phone;
        that.options.mbsn = hrefParma.mbsn || '';
        // 业务处理
        // 修改
        if(phone) {
            $('#phone').html(phone);
            $('#have').show();
            // 显示删除菜单
            $('.header .btn').show();
        } 
        // 新增
        else {
            $('#unHave').show();
        }
    },
    /**
     * _删除手机号
     * @parma {number} phone 手机号
     */
    _delphone: function(phone) {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modmobile',
            data: {
                mobile: phone,
                state: util.OPT_STATE.DELETE
            },
            type: 'post',
            beforeSend: function() {
                // 禁用按钮
                that.options.requestState.delphone = false;
                // 
            },
            success: function(response) {
                var rpco = response.rpco;

                // 处理
                switch(rpco) {
                    case 200:
                        util.href('setphonefinish.html', {
                            phone: phone,
                            operate: 'del'
                        });
                        break;
                    default:
                        util.tip('解绑失败')
                }
            },
            complete: function() {
                // 启用按钮
                that.options.requestState.delphone = true;
            }
        }); 
    },
    /**
     * 删除手机号
     */
    delphone: function() {
        var that = this;
/*//debug start
util.href('setphonefinish.html', {
    phone: phone,
    operate: 'del'
});
return false;
//debug end*/
        if(!that.options.mbsn) {
            util.alert(that.options.msg.m2);
            return false;
        }
        // 解绑提示框
        util.alert(that.options.msg.m1, {
            defBtnIndex: 1,
            justOk: false,
            okFn: function() {
                var phone = that.options.phone;
                // 解绑
                // 数据有效性
                if(!that.options.requestState.delphone) { return false; }
                if(!phone) { return false; }

                that._delphone(phone);
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

        /*“绑定手机号”点击事件*/
        that.el.on(click, '#addBind', function() {
            util.href('setphoneinput.html', {
                operate: 'add'
            });
        });

        /*“修改手机号”单击事件*/
        that.el.on(click, '#modBind', function() {
            util.href('setphoneinput.html', {
                operate: 'mod',
                phone: that.options.phone
            });
        });

        /*“解绑手机号”单击事件*/
        that.el.on(click, '#unBind', function() {
            that.delphone();
        });
    }
})