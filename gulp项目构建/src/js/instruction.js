/**
 * Created by alisa on 2016/2/23.
 */
var root = root || window;
util = root.util || {};

var Introduction = function(opt) {
    this.options = $.extend({
        hrefParma: util.getHrefParma(),
        contTitle: '',
        altText: '<p class="text-alt">点击按钮加载详情</p>',
        idSet: {},
        // 最后一级目录的时候
        renderPara: '',
        btnAll: false,
        // 目录子内容显示与否
        show: false,
        // 表格滚动
        myScroll: true,
        scrollPara: {
            eventPassthrough: true,
            scrollX: true,
            freeScroll: true
        },
        // 头部标题
        headTxt: ''
    }, opt);
    this.link = this.options.link + '.html';
    this.sel = this.options.sel;
    this.el = $(this.sel);
};

$.extend(Introduction.prototype, {
    init: function() {
        var that = this;
        that.load();
        that.addEvent();
    },
    /**
     * [获得参数，请求本页数据]
     * 
     */
    load: function() {
        var that = this,
            // url参数;
            hrefParma = that.options.hrefParma;

        that.options.headTxt = hrefParma.headTxt;
        // 3.31添加第一次进入说明书显示资产名称方法
        //that.renderTitle();

        // 3.29渲染使用手册目录页返回按钮
        that.instructionuseBtn();

        // 4.6渲染员工使用手册目录页返回按钮
        that.instructionuseempBtn();

        //  请求数据
        that.request(hrefParma);
    },
    /**
     * [renderTreeTwo 加载页面有子内容，子目录]
     * @param  {[JSON]} treeArr [请求获得的数据body]
     * 
     */
    renderTreeTwo: function(treeArr) {
        var that = this;
        var html = '';
        // 相应主体
        var treeBody = treeArr || {},
            // 目录数组
            clstArr = treeBody.clst || [],
            // 目录子内容
            pc = treeBody.pc || '',
            // 目录编号
            pid = treeBody.pid || '',
            // 目录
            cn = treeBody.cn || '',
            // 子目录的clstpid
            clstPid,
            // 下级目录cade
            cade,
            // 主目录类名
            mainClass;

        // 保存当前目录
        that.options.contTitle = cn;
        mainClass = 'padding-big';
        pc = '<div class="content" id="content">' + that.options.altText + '</div><div class="menu"><span id="menu" pid=' + pid + '></span></div>';

        for (var i = 0, l = clstArr.length; i < l; i++) {
            var arr = clstArr[i];
            cn = arr.cn || '';
            clstPid = arr.pid || '';
            cade = arr.cade || '';


            //pfc = prfix ? prfix + '.' + parseInt(i + 1) : i + 1;
            html += '<div class="click-tip" pid=' + clstPid + ' cade=' + cade + '>' + cn + '</div>';

        }

        html = pc + '<div id="catalog" class="catalog ' + mainClass + '">' + html + '</div>';
        that.render(html, that.options.renderPara);
    },
    /**
     * [renderCatalogTwo 只加载目录]
     * @param  {[type]} treeArr [请求得到的body数据]
     * 
     */
    renderCatalogTwo: function(treeArr) {
        var that = this;
        var html = '';
        // 相应主体
        var treeBody = treeArr || {},
            // 目录数组
            clstArr = treeBody.clst || [],
            // 目录
            cn = treeBody.cn || '',
            // 子目录的clstpid
            clstPid,
            // 下级目录cade
            cade,
            //主目录类名
            mainClass;

        // 保存当前目录
        that.options.contTitle = cn;
        mainClass = 'padding-small';

        for (var i = 0, l = clstArr.length; i < l; i++) {
            var arr = clstArr[i];
            cn = arr.cn || '';
            clstPid = arr.pid || '';
            cade = arr.cade || '';
            html += '<div class="click-tip" pid=' + clstPid + ' cade=' + cade + '>' + cn + '</div>';
        }
        html = '<div id="catalog" class="catalog ' + mainClass + '">' + html + '</div>';
        that.render(html, that.options.renderPara);
    },
    /**
     * [renderContent 加载页面内容，最后页面内容]
     * @param  {[type]} treeArr [请求得到的body数据]
     * 
     */
    renderContent: function(treeArr) {
        var that = this;
        var html = '';
        // 相应主体
        var treeBody = treeArr || {},
            // 目录子内容
            pc = treeBody.pc || '',
            // 父级页编号
            ppid = treeBody.ppid || '',
            // 上一页编号
            rpid = treeBody.rpid || '',
            // 下一页编号
            npid = treeBody.npid || '',
            // 临时空对象
            temp = {},
            // 目录
            cn = treeBody.cn || '',
            // 子目录的clstpid
            clstPid;

        // 保存当前目录
        that.options.contTitle = cn;
        that.options.btnAll = true;
        // 每点击一次，放一次
        // temp['pid'] = pid ||'';
        temp['ppid'] = ppid || '';
        temp['npid'] = npid || '';
        temp['rpid'] = rpid || '';
        that.options.idSet = temp;

        html = '<div class="content" id="content">' + pc + '</div>';
        that.options.btnAll = true;
        that.clickEvent = null;
        that.render(html, that.options.renderPara);
    },
    /**
     * [renderChildContent 按钮点击渲染目录上方子内容]
     * @param  {[type]} treeArr [请求得到的body数据]
     * 
     */
    renderChildContent: function(treeArr) {
        var that = this;
        var html = '';
        // 相应主体
        var treeBody = treeArr || {},
            // 目录子内容
            pc = treeBody.pc || '';
        that.options.renderPara = 'childContent';
        that.options.show = false;

        $('#content').append(pc);
        $('#content p').addClass('disable');
        $('#menu').addClass('bg-img');
    },
    /**
     * [render 加载的内容渲染页面中]
     * @param  {[string]} html [页面的内容]
     * @param  {[type]} para [description]
     * 
     */
    render: function(html, para) {
        var that = this,
            hrefParma = that.options.hrefParma,
            title = that.options.contTitle;
        // console.log(3);

        // 写入当前章节标题
        // 3.31解决频闪问题跳转此页面时候会先显示目录，删掉默认‘目录’
        // title = title || '目&nbsp;录';
        // $('#title').html(title);
        if (that.options.link === 'instructionuse' && !parseInt(that.options.hrefParma.pid)) {
            $('#title').html(title);
        } 
        // 员工使用手册
        else if(that.options.link === 'instructionuseemp' && !parseInt(that.options.hrefParma.pid)) {
            $('#title').html(title);
        } 
        else {
            parseInt(that.options.hrefParma.pid) ? $('#title').html(title) : $('#title').html(that.options.headTxt);
            //that.renderTitle();
            //$('#title').html(that.options.headTxt)
        }
        // 写入页面内容
        $(".container").html(html);
        hrefParma.pid && that.renderBtn();
    },
    /**
     * 最初,table/text/img直接加载到页面时的方法
     */
    // 初始化设置table/text/img
    // setContent: function(para) {
    //     var that = this;
    //     var arr = [],
    //         ele,
    //         // 父元素
    //         outerDiv;
    //     outerDiv = $('#content');
    //     ele = outerDiv.children('div');
    //     // console.log(para);
    //     if (para) {
    //         that.clickEvent = null;
    //         return;
    //     }
    //     for (var i = 0; i < ele.length; i++) {
    //         // 用来检查都有哪些元素被添加text/img/table;
    //         arr.push(that.isText($(ele[i])));
    //         // 计算#content总高度
    //         that.calcHeight($(ele[i]));
    //         // 给图片，table添加说明文字
    //         that.interate($(ele[i]));
    //     }
    //     // 有pc内容的时候，pid有的时候，就显示
    //     if (that.options.pc) {
    //         $('.menu').removeClass('disable');
    //     }
    // },

    /**
     * [toggleBtn 显示与隐藏的方法]
     * @param  {[id]} e    [切换类的选择器]
     * @param  {[class]} attr [切换类的类名]
     * @param  {[boolean]} bool [决定当前元素隐藏还是显示]
     * 
     */
    toggleBtn: function(e, attr, bool) {
        bool ? $(e).addClass(attr) : $(e).removeClass(attr);
    },
    /**
     * [renderBtn 渲染按钮出现与隐藏]
     * 
     */
    renderBtn: function() {

        var that = this,
            id = that.options.idSet,
            href = that.options.hrefParma;
        // 标题主目录按钮
        parseInt(href.pid) ? $('#mainCatalog').show() : $('#mainCatalog').hide();
        //that.toggleBtn('#mainCatalog', 'show', parseInt(href.pid));
        // add by gaoqw start 20160328
        // 切换container position
        that.options.btnAll && $('.container').addClass('hsft');
        // add by gaoqw end 20160328
        //that.toggleBtn('.footer', 'show', that.options.btnAll);
        that.options.btnAll ? $('.footer').show() : $('.footer').hide();

    },
    /**
     * [instructionuseBtn 渲染使用手册目录按钮显示与隐藏]
     * 
     */
    instructionuseBtn: function() {
        var that = this;

        if (that.options.link === 'instructionuse' && !parseInt(that.options.hrefParma.pid)) {
            //$('.goBack').attr('style', 'display:none');
            // addby gaoqiwen 2016.05.18 star
            $('.goBack').attr('href', 'javascript:util.href(\'index.html\');');
            // addby gaoqiwen 2016.05.18 end
        };

    },
    /**
     * [instructionuseempBtn 渲染员工使用手册目录按钮显示与隐藏]
     * 
     */
    instructionuseempBtn: function() {
        var that = this;

        if (that.options.link === 'instructionuseemp' && !parseInt(that.options.hrefParma.pid)) {
            $('.goBack').attr('style', 'display:none');
        };
    },
    /**
     * [clickEvent 子内容部分交互操作，加载后，点击隐藏或者显示]
     * 
     */
    clickEvent: function() {
        var that = this;
        $('#content p').removeClass('disable');
        $('#content').children('.img,.table,.text,.listtext-fh,.listtext-bh').addClass('disable');
        $('#menu').removeClass('bg-img');
        that.options.show = true;
    },
    /**
     * [request AJAX请求页面内容]
     * @param  {[string]} para [页面中拿来的pid]
     * @param  {[string]} load [boolean 来确定是否在页面子内容中显示]
     * @
     */
    request: function(para, load) {
        var that = this;

        switch (that.options.link) {
            // 说明书
            case 'instruction':
                that.getInstruction(para, load);
                break;
            // 使用手册
            case 'instructionuse':
                that.getInstructionUse(para, load);
                break;
            // 员工使用手册
            case 'instructionuseemp':
                that.getInstructionUseEmp(para, load);
                break;
        }
    },
    /**
     * 获取使用说明书
     */
    getInstruction: function(para, load) {
        var that = this;
        var href = that.options.hrefParma;
        var pid, method,
            cade = '';

        // 请求的pid
        pid = para.pid || 0;
        load && (cade = 1);
        util.api({
            surl: root.EDOC_API_PATH + 'pmdq',
            data: {
                pid: pid,
                gid: href.gid,
                did: href.did,
                tmid: href.tmid,
                cade: cade
            },
            type: 'get',
            beforeSend: function() {},
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    code = parseInt(body.cade);

                // 1、内容 2、目录 3、内容和目录
                method = code === 1 ? 'renderContent' : code === 3 ? 'renderTreeTwo' : 'renderCatalogTwo';

                // 处理
                load && (method = 'renderChildContent');
                switch (rpco) {
                    case 200:
                        that[method](body);
                        break;
                    case 404:
                        // 弹出信息提示框；
                        break;
                }
            },
            complete: function() {}
        });

    },
    /**
     * 获取用户手册
     */
    getInstructionUse: function(para, load) {
        var that = this;
        var href = that.options.hrefParma;
        var pid, method,
            cade = '';

        // 请求的pid
        pid = para.pid || 0;
        load && (cade = 1);
        util.api({
            surl: root.EDOC_API_PATH + 'usmuqr',
            data: {
                pid: pid,
                cade: cade
            },
            type: 'get',
            beforeSend: function() {},
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    code = parseInt(body.cade);

                // 1、内容 2、目录 3、内容和目录
                method = code === 1 ? 'renderContent' : code === 3 ? 'renderTreeTwo' : 'renderCatalogTwo';

                // 处理
                load && (method = 'renderChildContent');
                switch (rpco) {
                    case 200:
                        that[method](body);
                        break;
                    case 404:
                        // 弹出信息提示框；
                        break;
                }
            },
            complete: function() {}
        });
    },
    /**
     * 获取员工用户手册
     */
    getInstructionUseEmp: function(para, load) {
        var that = this;
        var href = that.options.hrefParma;
        var pid, method,
            cade = '';

        // 请求的pid
        pid = para.pid || 0;
        load && (cade = 1);
        util.api({
            surl: root.EDOC_API_PATH + 'clmuqr',
            data: {
                pid: pid,
                cade: cade
            },
            type: 'get',
            beforeSend: function() {},
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {},
                    code = parseInt(body.cade);

                // 1、内容 2、目录 3、内容和目录
                method = code === 1 ? 'renderContent' : code === 3 ? 'renderTreeTwo' : 'renderCatalogTwo';

                // 处理
                load && (method = 'renderChildContent');
                switch (rpco) {
                    case 200:
                        that[method](body);
                        break;
                    case 404:
                        // 弹出信息提示框；
                        break;
                }
            },
            complete: function() {}
        });
    },
    /**
     * [scrollTable 滑动控件，目前只用来小MI4手机表格无法滑动问题]
     * 
     */
    scrollTable: function() {
        var that = this;
        var scrollTable = $('.table');
        scrollTable.each(function(i, e) {
            new IScroll(e, that.options.scrollPara);
        });
        that.options.myScroll = false;
    },

    /**
     * [addEvent 页面绑定监听事件]
     */
    addEvent: function() {
        var that = this,
            click = util.getClick(),
            hrefParma = that.options.hrefParma,
            href = {};
        // 传递资产名称3.31
        href.headTxt = that.options.headTxt;
        // 传递的分组分类信息3.31
        href.gid = hrefParma.gid;
        href.did = hrefParma.did;
        href.tmid = hrefParma.tmid;
        // 回到主目录
        that.el.on(click, '#mainCatalog', function() {
            //location.href = 'index.jsp?pid=0';
            href.pid = 0;
            // href.gid = hrefParma.gid;
            // href.did = hrefParma.did;
            // href.tmid = hrefParma.tmid;

            util.href(that.link, href);
        });

        // 收起事件
        that.el.on(click, '#content', function() {
            if (that.clickEvent) {
                that.clickEvent();
            };
            return false;
        });

        // 加载事件
        that.el.on(click, '#menu', function() {
            // 请求内容
            var pid = {
                pid: $(this).attr('pid')
            };

            if (that.options.renderPara !== 'childContent') {
                that.request(pid, '1');
                return;
            }
            var e = $('#content'),
                // 说明文字P
                p = $(e).children('p'),
                // img
                imgTable = $(e).children('.img,.table,.text,.listtext-bh,.listtext-fh');

            // 显示或者隐藏
            if (!that.options.show) {
                that.options.show = true;
                that.toggleBtn(p, 'disable', !that.options.show);
                that.toggleBtn(imgTable, 'disable', that.options.show);
                //that.toggleBtn(e, 'restore', !that.options.show);
                that.toggleBtn($('#menu'), 'bg-img', !that.options.show);

                if (that.options.myScroll) {
                    that.scrollTable();
                };
            } else {
                that.options.show = false;
                // $('#content').html(that.options.altText);
                that.toggleBtn(p, 'disable', !that.options.show);
                that.toggleBtn(imgTable, 'disable', that.options.show);
                // that.toggleBtn(e, 'restore', !that.options.show);
                that.toggleBtn($('#menu'), 'bg-img', !that.options.show);
            }
        });

        // 点击标题
        that.el.on(click, '.click-tip', function() {
            // 1、得到参数pid
            var pid = $(this).attr('pid');
            // 2、跳转页面，请求数据
            // href.gid = hrefParma.gid;
            // href.did = hrefParma.did;
            // href.tmid = hrefParma.tmid;
            href.pid = pid;
            util.href(that.link, href);
        });

        // 上一页
        that.el.on(click, '#prev', function() {
            // 1、跳转页面，请求数据
            href.pid = that.options.idSet.rpid;
            // href.gid = hrefParma.gid;
            // href.did = hrefParma.did;
            // href.tmid = hrefParma.tmid;
            util.href(that.link, href);
        });

        // 下一页
        that.el.on(click, '#next', function() {
            // 1、跳转页面，请求数据

            href.pid = that.options.idSet.npid;
            // href.gid = hrefParma.gid;
            // href.did = hrefParma.did;
            // href.tmid = hrefParma.tmid;
            util.href(that.link, href);
        });
        // 上级目录
        that.el.on(click, '#prevCatalog', function() {
            // 1、跳转页面，请求数据

            href.pid = that.options.idSet.ppid;
            // href.gid = hrefParma.gid;
            // href.did = hrefParma.did;
            // href.tmid = hrefParma.tmid;
            //hrefParma.ppid = that.options.idSet.ppid;
            util.href(that.link, href);
        });
    }
});
