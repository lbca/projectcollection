var root = window || {},
    util = root.util || {};

var ElectrCard = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        // 数字正则
        INT_REG: /^\d+$/,
        // 小数正则
        FLOAT_REG: /^\d+(\.\d+)?$/,
        // 日期正则
        DATE_REG: /^(19[7-9][0-9]|2\d{3})-([1-9]|0[1-9]|1[0-2])-([1-9]|[0-2][0-9]|3[0-1])$/,
        // 微信加载成功状态
        wcSuccess: false,
        msg: {
            m1: '保存成功',
            m2: '请核对扫码内容'
        },
        // 请求状态，用于ajax
        requestState: {
            wcSuccess: false,
            delAccount: true
        }
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(ElectrCard.prototype, {
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
hrefParma.asnum = '8888888';
// debug end*/



        // 获取电子保修卡详情
        hrefParma.asnum && that.getElectrCard(hrefParma.asnum);
    },
    /**
     * 获取电子保修卡详情
     * @parma {number}{1} asnum 资产编号
     */
    getElectrCard: function(asnum) {
        var that = this;

/*// debug start
var response = {
    rpco: 200,
    body: {
        gdna: '三星 Note 5',
        sctm: 1449063011189,
        dotw: 1459063011189,
        wcbic: [{
            gid: 1,
            lbttl: '我是标题一',
            wcbicc: [{
                lbid: 100,
                lbttl: '我是子标题一',
                lbvl: '我是子内容一',
                dttp: 23,
                optp: 0
            }, {
                lbid: 200,
                lbttl: '我是子标题二',
                lbvl: '我是子内容二',
                dttp: 24,
                optp: 10
            }, {
                lbid: 300,
                lbttl: '我是子标题三',
                lbvl: '我是子内容三',
                dttp: 25,
                optp: 11
            }, {
                lbid: 400,
                lbttl: '我是子标题四',
                lbvl: '我是子内容四',
                dttp: 26,
                optp: 12
            }, {
                lbid: 500,
                lbttl: '我是子标题五',
                lbvl: '1459168175052',
                dttp: 93,
                optp: 10
            }]
        }, {
            gid: 1,
            lbttl: '我是标题一',
            wcbicc: [{
                lbid: 100,
                lbttl: '我是子标题一',
                lbvl: '我是子内容一',
                optp: 0
            }, {
                lbid: 200,
                lbttl: '我是子标题二',
                lbvl: '我是子内容二',
                optp: 10
            }, {
                lbid: 300,
                lbttl: '我是子标题三',
                lbvl: '我是子内容三',
                optp: 11
            }, {
                lbid: 400,
                lbttl: '我是子标题四',
                lbvl: '我是子内容四',
                optp: 12
            }, {
                lbid: 500,
                lbttl: '我是子标题五',
                lbvl: '我是子内容五',
                optp: 13
            }]
        }, {
            gid: 1,
            lbttl: '我是标题一',
            wcbicc: [{
                lbid: 100,
                lbttl: '我是子标题一',
                lbvl: '我是子内容一',
                optp: 0
            }, {
                lbid: 200,
                lbttl: '我是子标题二',
                lbvl: '我是子内容二',
                optp: 10
            }, {
                lbid: 300,
                lbttl: '我是子标题三',
                lbvl: '我是子内容三',
                optp: 11
            }, {
                lbid: 400,
                lbttl: '我是子标题四',
                lbvl: '我是子内容四',
                optp: 12
            }, {
                lbid: 500,
                lbttl: '我是子标题五',
                lbvl: '我是子内容五',
                optp: 13
            }]
        }]
    }
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 渲染
        that.renderElectrCard(body);
        break;
    default:
        util.tip('查询失败')
}
return;
// debug end*/



        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'awwcdtl',
            data: {
                asnum: asnum
            },
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 渲染
                        that.renderElectrCard(body);
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        });  
    },
    /**
     * 渲染电子保修卡
     * @parma {object}{1} body 电子保修卡对象
     */
    renderElectrCard: function(body) {
        var that = this,
            // 保修截止时间
            dotw,
            // 
            html = '',
            // 
            item,
            //
            val;

        // 商品名称
        body.gdna && $('#gdna').html(body.gdna);

        // 保修剩余天数
        dotw = body.dotw - body.sctm;
        dotw = isNaN(dotw) ? 0 : dotw;

        // 厂商电话
        body.mfpn && $('#mfpn').attr('href', 'tel:' + body.mfpn).html(body.mfpn);

        // 未知
        if(!body.dotw) {
            $('#unknow').show();
        }
        // 在保
        else if(dotw > 0) {
            // 转为天，并渲染
            $('#dotw').html(parseInt(dotw / 1000 / 60 / 60 / 24) + 1);
            $('#have').show();
        } 
        // 过保
        else if(dotw < 0) {
            $('#nohave').show();
        }

        // 渲染数据项
        body.wcbic = body.wcbic || [];
        for (var i = 0, j = body.wcbic.length; i < j; i++) {

            html += '<ul class="list-labelvalue">';

            // 渲染条目
            body.wcbic[i].wcbicc = body.wcbic[i].wcbicc || [];
            for (var x = 0, y = body.wcbic[i].wcbicc.length; x < y; x++) {
                //
                item = body.wcbic[i].wcbicc[x];
                //
                val = item.lbvl || '';

                // 数据类型转换
                switch(item.dttp) {
                    // TIMESTAMP
                    case 93:
                        // 转为number
                        val = parseInt(val);
                        // 有效性验证，大于1
                        if(val > 1) {
                            val = util.formateDate(val, 'yyyy-MM-dd');
                        } 
                        // 数据为空，内容显示为空
                        else {
                            val = '';
                        }
                        break;
                    // MONEY
                    case 94:
                        val && (val = parseFloat(val / 100).toFixed(2));
                        break;
                }

                // 操作状态
                switch(item.optp) {
                    // 未定义控制器，文本内容直接显示
                    case 0:
                        html += '<li lbid="' + item.lbid + '" optp="' + item.optp + '" dttp="' + item.dttp + '">'
                             +      '<label>' + item.lbttl + '</label>'
                             +      '<span class="value">' + val + '</span>'
                             +  '<li>';
                        break;
                    // 文本编辑控制器
                    case 10:
                        html += '<li lbid="' + item.lbid + '" optp="' + item.optp + '" dttp="' + item.dttp + '">'
                             +      '<label class="rd-st">' + item.lbttl + '</label>'
                             +      '<input class="value" placeholder="请输入' + item.lbttl + '" maxlength="64" value="' + val + '" orival="' + val + '"/>'
                             +  '<li>';
                        break;
                    // 文本编辑控制器，辅助二维码扫描
                    case 11:
                        html += '<li lbid="' + item.lbid + '" optp="' + item.optp + '" dttp="' + item.dttp + '">'
                             +      '<label class="rd-st">' + item.lbttl + '</label>'
                             +      '<span class="btn-opct js-saoma"><i class="i i-saoma"></i></span>'
                             +      '<input class="value" placeholder="请输入' + item.lbttl + '" maxlength="64" value="' + val + '" orival="' + val + '"/>'
                             +  '<li>';
                        break;
                    // 文本编辑控制器，辅助图片文件上传
                    case 12:
                        break;
                }
            }

            html += '</ul>';
        }

        html && $('#wcbic').html(html) && that.setVlaueElWidth();
    },
    /**
     * 设置所有显示内容标签宽度
     */
    setVlaueElWidth: function() {
        var that = this;
        // 
        $('.list-labelvalue .value').each(function(i, n) {
            var liEL = $(this).closest('li'),
                lbW = liEL.find('label').width() + 20,
                wth = 100 - (lbW / liEL.width() * 100).toFixed(2) + '%',
                // css数据对象
                cssData = {width: wth};
            // 
            (liEL.find('.btn-opct').length > 0) && (cssData['padding-right'] = '40px');
            // 设置样式
            $(this).css(cssData);
        });
    },
    /**
     * 显示保存按钮
     */
    showSaveButton: function() {
        var that = this;
        // 
        $('.container').addClass('hsft');
        $('.footer').show();
    },
    /**
     * 隐藏保存按钮
     */
    hideSaveButton: function() {
        var that = this;
        // 
        $('.container').removeClass('hsft');
        $('.footer').hide();
    },
    /**
     * 扫码
     * @parma {object}{1} ipt 目标文本框
     */
    saoma: function(ipt) {
        var that = this;
        // 扫码
        that.options.wcSuccess && wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var code = res.resultStr || '';
                // 去除无用前缀
                code = code.replace(/.*,/, '');
                // 放入目标元素
                ipt.val(code); // 当needResult 为 1 时，扫码返回的结果
                //
                util.tip(that.options.msg.m2);
                // 显示保存按钮
                that.showSaveButton();
            }
        });
    },
    /**
     * _保存
     * @parma {object} data 修改内容对象
     *        {long} asnum 资产编号
     *        {array} wcbic 保修卡基本信息集合
     *          {number} lbid 标签编号
     *          {string} lbvl 标签内容
     */
    _save: function(data) {
        var that = this;

/*// debug start
console.log(data);
var response = {
    rpco: 200
};
var rpco = response.rpco,
    body;
// 处理
switch(rpco) {
    case 200:
        util.tip(that.options.msg.m1);
        // 隐藏保存按钮
        that.hideSaveButton();
        break;
    default:
        util.tip('保存失败')
}
return;
// debug end*/
        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'modawwc',
            data: data,
            type: 'post',
            success: function(response) {
                var rpco = response.rpco,
                    body;
                // 处理
                switch(rpco) {
                    case 200:
                        util.tip(that.options.msg.m1);
                        // 隐藏保存按钮
                        that.hideSaveButton();
                        break;
                    default:
                        util.tip('保存失败')
                }
            }
        });  
    },
    /**
     * 校验数据类型
     * @return {boolean} result 返回值
     */
    checkDataType: function() {
        var that = this,
            result = true;

        // 遍历
        $('.list-labelvalue input:visible').each(function(i, n) {
            var liEL = $(this).closest('li'),
                // 标签
                labTxt = liEL.find('label').html(),
                // 数据类型
                dttp = parseInt(liEL.attr('dttp')),
                // 值
                val = $(this).val();

            // 数据类型判断
            switch(dttp) {
                // OBJECT
                case 0:
                    break;
                // BYTE
                case 21:
                    break;
                // SHORT
                case 22:
                    break;
                // INTEGER
                case 23:// 省略break
                // LONG
                case 24:
                    // 整数正则
                    if(val && !that.options.INT_REG.test(val)) { 
                        result = false; 
                        util.tip('“' + labTxt + '”只能为整数哦~');
                        // 跳出循环
                        return false;
                    }
                    break;
                // FLOAT
                case 25:// 省略break
                // DOUBLE
                case 26:
                // MONEY
                case 94:
                    // 整数正则
                    if(val && !that.options.FLOAT_REG.test(val)) { 
                        result = false; 
                        util.tip('“' + labTxt + '”只能为小数哦~');
                        // 跳出循环
                        return false;
                    }
                    break;
                // STRING
                case 33:
                    break;
                // BYTES
                case 54:
                    break;
                // TIMESTAMP
                case 93:
                    // 日期正则
                    if(val && !that.options.DATE_REG.test(val)) { 
                        result = false; 
                        util.tip('“' + labTxt + '”支持格式为“xxxx-xx-xx”');
                        // 跳出循环
                        return false;
                    }
                    break;
                // 未知
                default:
            }

        });
        return result;
    },
    /**
     * 保存
     */
    save: function() {
        var that = this,
            // 保存数据
            data = {};

        // 有效性验证
        // 校验数据类型
        if ( !that.checkDataType() ) { return false; };
        // 数据有效性

        // 
        // 资产编号
        data.asnum = that.options.hrefParma.asnum;
        // 保修卡基本信息集合
        data.wcbic = [];
        // 拼接请求参数
        $('.list-labelvalue input:visible').each(function(i, n) {
            var liEL = $(this).closest('li'),
                // 标签编号
                lbid = liEL.attr('lbid'),
                // 数据类型
                dttp = parseInt(liEL.attr('dttp')),
                // 值
                val = $(this).val(),
                // 原始值
                orival = $(this).attr('orival');

            // 未发生变更
            if(val == orival) { return true; }

            // 数据类型转换
            switch(dttp) {
                // TIMESTAMP
                case 93:
                    val && (val = new Date(val.replace(/-/g, '/')).getTime());
                    break;
            }

            data.wcbic.push({
                lbid: lbid,
                lbvl: val
            });
        });

        // 未进行修改，不提交后台
        if(data.wcbic.length === 0) {
            //
            util.tip(that.options.msg.m1);
            // 隐藏保存按钮
            that.hideSaveButton();
        } 
        // 请求后台，保存数据
        else {
            // _保存
            that._save(data);
        }

    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        // 保修卡须知菜单单击事件 dialog
        that.el.on(click, '#bxkxz', function() {
            $('.dialog').removeClass('dn');
        });

        // “绑定说明”关闭按钮
        that.el.on(click, '#dialogClose', function() {
            $('.dialog').addClass('dn');
        });

        // 文本框获取焦点时显示保存按钮
        that.el.on('focus', 'input.value', function() {
            // 显示保存按钮
            that.showSaveButton();
        });

        // 扫码单击事件
        that.el.on(click, '.js-saoma', function(e) {
            // 扫码
            that.saoma($(this).closest('li').find('input.value'));
        });

        // 保存按钮单击事件
        that.el.on(click, '#save', function() {
            // 保存
            that.save();
        });
    }
})