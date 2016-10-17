var root = window || {},
    util = root.util || {};

var SetPhoneInput = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        phoneReg : /^(((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[6|7|8]))\d{8}|(170[0|5|9])\d{7})$/, // 手机号正则
        // 操作状态，add：新增，mod：修改，del：删除。
        operate: '',
        oldPhone: '',
        msg: {
            m1: '请输入手机号',
            m2: '请输入正确的手机号'
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};
$.extend(SetPhoneInput.prototype, {
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
            oldPhone = hrefParma.phone || '',
            operate = hrefParma.operate || '';

        // 操作状态
        that.options.operate = operate;
        // 原手机号
        that.options.oldPhone = oldPhone;

        // 业务操作
        switch(operate) {
            // 增
            case 'add':
                $('#add').show();
                break;
            // 改
            case 'mod':
                $('#oldPhone').html(oldPhone);   
                $('#mod').show();
                break;
            // 删
            case 'del':
                $('#del').show();
                break;
        }
    },
    /**
     * 下一步
     */
    goNextStep: function() {
        var that = this,
            // 手机号
            newPhone = $('.js-phone:visible').val(),
            // 旧手机号
            oldPhone = that.options.oldPhone,
            operate = that.options.operate,
            sendParma = {};

        // 修改时验证码发送手机号为原手机号
        if(operate === 'mod') {
            // 有效性验证
            if(!oldPhone || !that.options.phoneReg.test(oldPhone)) { return false; }
            sendParma.sphone = oldPhone;
        }

        // 非空验证
        if(!newPhone) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 手机号格式错误
        if(!that.options.phoneReg.test(newPhone)) {
            util.tip(that.options.msg.m2);
            return false;
        }
       
        $.extend(sendParma, {
            operate: operate,
            phone: newPhone
        });
        // 下一步
        util.href('setphonevcode.html', sendParma);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*“下一步”点击事件*/
        that.el.on(click, '#nextStep', function() {
            that.goNextStep(); 
        });

        /*手机号文本框限制输入*/
        that.el.on('input propertychange', '#phone', function(e) {
            var value = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(value);
        });
    }
});