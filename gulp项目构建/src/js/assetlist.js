var root = window || {},
    util = root.util || {};

var AssetList = function(opt) {
    this.options = $.extend({
        sel: '',
        hrefParma: util.getHrefParma(),
        msg: {
            m1: '资产删除成功',
            m2: '是否删除当前资产？',
            m3: '资产编号有误',
            m4: '资产名称不能为空',
            m5: '保存成功'
        },
        // 请求状态，用于ajax请求
        requestState: {
            deleteAsset: true
        },
        // 滚动插件
        iScrollZoom: null
    }, opt);

    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(AssetList.prototype, {
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
        // 加载资产列表
        that.getAssetList();
    },
    /**
     * 获取资产列表
     */
    getAssetList: function() {
        var that = this;


        /*// debug start
// 显示菜单
        $('.js-btn-menu').show();
        var response = {
            rpco: 200,
            body: {
                aslist: [{
                    asnum: 111111111111111,
                    asname: '苹果iphone 6s plus 128g',
                    brdnm: '苹果',
                    mdnm: '6s plus',
                    asimgu: 'http://img4.gomein.net.cn/image/prodimg/production_image/201509/21/1123040379/1000817594_210.jpg',
                    aswaew: 1,
                    svtplst: [1, 2, 3, 4, 5, 6]
                }, {
                    asnum: 222222222222222,
                    asname: '苹果iphone 6s plus 128g',
                    brdnm: '苹果',
                    mdnm: '6s plus',
                    asimgu: 'http://img4.gomein.net.cn/image/prodimg/production_image/201509/21/1123040379/1000817594_210.jpg',
                    aswaew: 2,
                    svtplst: [1, 2, 3, 4, 5, 6]
                }, {
                    asnum: 33333333333333333,
                    asname: '苹果iphone 6s plus 128g',
                    brdnm: '苹果',
                    mdnm: '6s plus',
                    asimgu: 'http://img4.gomein.net.cn/image/prodimg/production_image/201509/21/1123040379/1000817594_210.jpg',
                    aswaew: 3,
                    svtplst: [3, 4]
                }, {
                    asnum: 4444444444444444,
                    asname: '苹果iphone 6s plus 128g',
                    brdnm: '苹果',
                    mdnm: '6s plus',
                    asimgu: 'http://img4.gomein.net.cn/image/prodimg/production_image/201509/21/1123040379/1000817594_210.jpg',
                    aswaew: 4,
                    svtplst: [4, 5, 6]
                }, {
                    asnum: 55555555555555,
                    asname: '苹果iphone 6s plus 128g',
                    brdnm: '苹果',
                    mdnm: '6s plus',
                    asimgu: 'http://img4.gomein.net.cn/image/prodimg/production_image/201509/21/1123040379/1000817594_210.jpg',
                    aswaew: 0,
                    svtplst: [1, 5, 6]
                }]
            }
        };
        var rpco = response.rpco,
            body = response.body || {},
            aslist = body.aslist || [];

        // 处理
        switch(rpco) {
            case 200:
                // 渲染
                that.renderAssetList(aslist);
                break;
            // 没有找到对应数据
            case 404:
                $('#noList').show();
                break;
            default:
                util.tip('查询失败')
        }
        return;
        // debug end*/


        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'asslist',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    aslist = body.aslist || [];

                // 处理
                switch(rpco) {
                    case 200:
                        // 渲染
                        that.renderAssetList(aslist);
                        // 显示菜单
                        $('.js-btn-menu').show();
                        break;
                    // 没有找到对应数据
                    case 404:
                        $('#noList').show();
                        break;
                    default:
                        util.tip('查询失败')
                }
            }
        }); 
    },
    /**
     * 渲染资产列表
     * @parma {array}{1} aslist 资产列表
     */
    renderAssetList: function(aslist) {
        var that = this,
            aslist = aslist || [],
            aslistStr = '',
            txt,
            cls,
            svtpHTML = '',
            svtp = {
                1: '<span class="btn btn-linear" style="">维修</span>',
                2: '<span class="btn btn-linear" style="">回收</span>',
                3: '<span class="btn btn-linear" style="">清洗</span>',
                4: '<span class="btn btn-linear" style="">买延保</span>',
                5: '<span class="btn btn-linear" style="">安装</span>',
                6: '<span class="btn btn-linear" style="">配件</span>'
            },
            // 资产名称
            asname = '';

        // 
        $.each(aslist, function(i, n) {
            
            switch(n.aswaew) {
                // 在保、无延保
                // 在保、有延保
                case 1:// 故意无break
                case 2:
                    txt = '在保';
                    cls = 'btn-ylw';
                    break;
                // 过保、无延保
                // 过保、有延保
                case 3:// 故意无break
                case 4:
                    txt = '过保';
                    cls = 'btn-gray';
                    break;
                default:
                    txt = '状态未知';
                    cls = 'btn-gray';
            }

            // 清空
            svtpHTML = '';
            // 服务
            if(n.svtplst) {
                for(var i = 0, j = n.svtplst.length; i < j; i++) {

                    // 只显示前三
                    if(i > 2) { break; } 
                    // 拼接
                    svtpHTML += (svtp[n.svtplst[i]] || '');
                }
            }

            // 资产名称
            asname = n.asname || '';

            aslistStr += '<ul class="list-text icon" val="' + n.asnum + '">'
                      +  '    <li>'
                      +  '        <img class="text-icon i " src="' + n.asimgu + '">'
                      +  '        <input class="txt-ipt" type="text" orival="' + asname + '" value="' + asname + '" maxlength="35" readonly><span class="btn btn-red dn js-save" >保存</span>'
                      +  '        <div class="txt-blk">'
                      +  '            品牌：<span>' + (n.brdnm || '') + '</span>'
                      +  '        </div>'
                      +  '        <div class="txt-blk">'
                      +  '            型号：<span>' + (n.mdnm || '') + '</span>'
                      +  '        </div>'
                      +  '        <div class="smlbtn-blk">'
                      +  '            <span class="btn ' + cls + '">' + txt + '</span>'
                      +  '        </div>'
                      //+  '        <i class="i i-gt"></i>'
                      +  '        <span class="btn-del dn"><i class="i i-delete1"></i></span>'
                      +  '        <span class="btn-edt dn"><i class="i i-edit2"></i></span>'
                      +  '    </li>'
                      +  '    <li>' + svtpHTML + '</li>'
                      +  '</ul>';
        });

        // 渲染
        aslistStr && $('#list').html(aslistStr).show();
    },
    /**
     * 删除地址
     * @parma {number}{1} asnum 资产编号
     */
    _deleteAsset: function(asnum) {
        var that = this;
/*// debug start
var response = {
    rpco: 200
};
var rpco = response.rpco,
    body = response.body || {};
// 处理
switch(rpco) {
    // 正常
    case 200:
        //$('li[val="' + asnum + '"]').closest('ul').remove();
        //util.tip(that.options.msg.m1);
        // 重新加载地址列表
        //that.getAssetList();
        window.location.reload();
        break;
    default:
        util.tip('删除失败')
}
return;
// debug end*/
        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'modass',
            data: {
                asnum: asnum,
                state: util.OPT_STATE.DELETE
            },
            type: 'post',
            beforeSend: function() {
                that.options.requestState.deleteAsset = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        //$('li[val="' + asnum + '"]').closest('ul').remove();
                        //util.tip(that.options.msg.m1);
                        // 重新加载地址列表
                        //that.getAssetList();
                        window.location.reload();
                        break;
                    default:
                        util.tip('删除失败')
                }
            },
            complete: function() {
                that.options.requestState.deleteAsset = true; 
            }
        });
    },
    /**
     * 删除资产
     * @parma {number}{1} asnum 资产编号
     */
    deleteAsset: function(asnum) {
        var that = this;
        // 删除确认
        util.alert(that.options.msg.m2, {
            justOk: false,
            defBtnIndex: 1,
            okFn: function() {
                that._deleteAsset(asnum);
            }
        });
    },
    /**
     * _保存资产名称
     * @parma {number}{1} asnum 资产编号
     * @parma {string}{1} asname 资产名称
     */
    _saveAssetName: function(asnum, asname) {
        var that = this;
/*// debug start
var response = {
    rpco: 200
};
var rpco = response.rpco,
    body;
// 处理
switch(rpco) {
    case 200:
        // 启用文本框编辑状态并聚焦
        $('ul[val="' + asnum + '"] .txt-ipt').attr('readonly', true);
        // 变换保存按钮为编辑按钮
        $('ul[val="' + asnum + '"] .btn-edt').show();
        $('ul[val="' + asnum + '"] .js-save').hide();
        // 
        util.tip(that.options.msg.m5);
        break;
    default:
        util.tip('保存失败');
}
return;
// debug end*/
        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'modass',
            data: {
                asnum: asnum,
                asname: asname,
                state: util.OPT_STATE.UPDATE
            },
            type: 'post',
            success: function(response) {
                var rpco = response.rpco,
                    body;
                // 处理
                switch(rpco) {
                    case 200:
                        // 启用文本框编辑状态并聚焦
                        $('ul[val="' + asnum + '"] .txt-ipt').attr('readonly', true);
                        // 变换保存按钮为编辑按钮
                        $('ul[val="' + asnum + '"] .btn-edt').show();
                        $('ul[val="' + asnum + '"] .js-save').hide();
                        // 
                        util.tip(that.options.msg.m5);
                        break;
                    default:
                        util.tip('保存失败');
                }
            }
        }); 
    },
    /**
     * 保存资产名称
     * @parma {object}{1} crtEL 当前点击的保存按钮
     */
    saveAssetName: function(crtEL) {
        var that = this,
            ulEL = crtEL.closest('ul'),
            // 资产编号
            asnum = ulEL.attr('val'),
            // 资产名称
            asname = ulEL.find('.txt-ipt').val(),
            // 原值
            orival = ulEL.find('.txt-ipt').attr('orival');

        // 有效性验证
        // 资产编号
        if(!asnum) {
            util.tip(that.options.msg.m3);
            return false;
        }
        // 资产名称
        if(!asname) {
            util.tip(that.options.msg.m4);
            return false;
        }
        // 未发生变更
        if(asname === orival) {
            // 启用文本框编辑状态并聚焦
            ulEL.find('.txt-ipt').attr('readonly', true);
            // 变换保存按钮为编辑按钮
            ulEL.find('.btn-edt').show();
            ulEL.find('.js-save').hide();
            // 
            util.tip(that.options.msg.m5);
            return false;
        }
        
        // 保存资产名称
        that._saveAssetName(asnum, asname);
    },
    /**
     * DOM事件
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma;

        /*解绑菜单单击*/
        that.el.on(click, '.js-unBind', function() {
            $('.btn-del').show();
        });
        // 编辑名称菜单单击
        that.el.on(click, '.js-editName', function() {
            $('.btn-edt').show();
        });

        /*隐藏解绑小图标*/
        $('.header, .container').on(click, function(e) {
            var crEL = $(e.target);
            
            if(crEL.is('.btn-del, .btn-edt, .js-editName, .js-unBind')) {
                // nothing...
            } 
            // 隐藏删除、修改图标
            else {
                $('.btn-del').hide(); 
                // 不存在编辑操作
                if($('.js-save:visible').length === 0) {
                    $('.btn-edt').hide(); 
                }
            }
        });

        // 删除按钮单击事件
        that.el.on(click, '.btn-del, .i-delete1', function(e) {
            // 删除
            that.deleteAsset($(this).closest('ul').attr('val'));
        });

        // 编辑名称按钮单击事件
        that.el.on(click, '.btn-edt', function(e) {
            // 先保存上次的修改
            $('.js-save:visible').not($(this)).trigger(click);

            // 父级节点
            var prtEL = $(this).closest('ul');
            // 启用文本框编辑状态并聚焦
            prtEL.find('.txt-ipt').removeAttr('readonly').focus();
            // 变换编辑按钮为保存按钮
            $(this).hide();
            prtEL.find('.js-save').show();
        });

        /*“账户明细”单击事件*/
        that.el.on(click, '.list-text', function() {
            // 存在操作时不跳转页面
            if($('.js-save, .btn-del, .btn-edt').find(':visible').length > 0) { return; }
            // 跳转详情页
            util.href('assetdetail.html', {asnum: $(this).attr('val')});
        });

        // 保存按钮单击事件
        that.el.on(click, '.js-save', function(e) {
            // 保存资产名称
            that.saveAssetName($(this));
        });

    }
})