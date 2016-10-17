var root = window || {},
    util = root.util || {};

var SetSignature = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 签名正则
        signReg: /^[^\s]+$/,
        msg: {
            m1: '请输入签名',
            m2: '不能包含空格'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetSignature.prototype, {
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
        hrefParma.sign && $('#sign').html(util.decode(hrefParma.sign));
        // 设置签名剩余字数
        that.setSignTxtcou();
    },
    /**
     * 保存 
     * @parma string {1} value 昵称
     */
    _save: function(value) {
        var that = this;
        
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'modudtal',
            data: {
                mod: 8,
                sign: value
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.save = false;
            },
            success: function(response) {
                var rpco = response.rpco;

                // 处理
                switch(rpco) {
                    case 200:
                        // 
                        util.href('set.html');
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
            // 修改值
            value = $('#sign').val() || '';

        // 校验
        // 值
        if(!value) {
            util.tip(that.options.msg.m1);
            return false;
        }
        // 签名规则
        if(!that.options.signReg.test(value)) {
            util.tip(that.options.msg.m2);
            return false;
        }

        // 保存

        /*// debug star
        util.href('set.html');
        return;
        // debug end*/

        that._save(value);
    },
    /**
     * 设置签名剩余字数
     */
    setSignTxtcou: function() {
        var that = this;
        $('#signcou').html(function() { 
            var cou = $('#sign').attr('maxlength') - $('#sign').val().length;
            cou = cou < 0 ? 0 : cou;
            return '可输' + cou + '字'; 
        });
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

        /*可输入字数，keyup事件*/
        that.el.on('input propertychange', '#sign', function() {
            // 设置签名剩余字数
            that.setSignTxtcou();
        });
    }
})