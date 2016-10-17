var root = window || {},
    util = root.util || {};

var SetMeiFuNum = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 美服号正则
        mfREG: /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/,
        // 纯数字正则
        numREG: /^\d+$/,
        msg: {
            m1: '请输入美服号',
            m2: '美服号只支持字母和数字',
            m3: '美服号支持6~16位字符',
            m4: '该美服号已存在',
            m5: '美服号不能为纯数字'
        },
        // 请求状态，用于ajax请求
        requestState: {
            save: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(SetMeiFuNum.prototype, {
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

    },
    /**
     * 保存 
     * @parma string {1} value 昵称
     */
    _save: function(value) {
        var that = this;
        // 请求...
        util.api({
            surl: root.MB_API_PATH + 'bindmsdn',
            data: {
                mbsn: value
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
                    // 用户会员号已存在
                    case 40001:
                        util.tip(that.options.msg.m4);
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
            value = $('#value').val() || '';

        // 有效性验证
        if(!that.options.requestState.save) { return false; }
        // 值
        if(!value) {
            util.tip(that.options.msg.m1);
            return false;
        }
        if(that.options.numREG.test(value)) {
            util.tip(that.options.msg.m5);
            return false;
        }
        if(!that.options.mfREG.test(value)) {
            util.tip(that.options.msg.m2);
            return false;
        }
        if(value.length < 6 || value.length > 16) {
            util.tip(that.options.msg.m3);
            return false;
        }


        // 保存

        /*// debug star
        util.href('set.html');
        return;
        // debug end*/

        that._save(value);
    },
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*保存按钮*/
        that.el.on(click, '#save', function() {
            that.save();
        });
    }
})