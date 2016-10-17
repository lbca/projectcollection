/************************************************************************************************
********************************此文件为微信扫码联合登录js***************************************
*************************************************************************************************/
/**
 * 说明：此js无需依赖任何javascript工具包。
 */
/*此js为微信联合登录，无需依赖任何js*/
var WxJointLogin = function(opt) {
    // 基本参数
    this.wxloginSetting = {
        // 第三方页面显示二维码的容器id
        id: 'wxLoginBlock',
        // 应用唯一标识，在微信开放平台提交应用审核通过后获得
        appid: '',
        // 应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
        scope: 'snsapi_login',
        // 重定向地址，需要进行UrlEncode
        redirect_uri: WxJointLogin.DOMAIN_PATH + WxJointLogin.WXCOM_API_PATH + 'wxlg',
        // 用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验
        state: '',
        // 提供"black"、"white"可选，默认为黑色文字描述。详见文档底部FAQ
        style: '',
        // 自定义样式链接，第三方可根据实际需求覆盖默认样式。详见文档底部FAQ
        href: ''
    };

    // 扩展
    // 第三方页面显示二维码的容器id
    opt.id && (this.wxloginSetting.id = opt.id);
    // 
    opt.appid && (this.wxloginSetting.appid = opt.appid);
    // 
    opt.scope && (this.wxloginSetting.scope = opt.scope);
    // 
    opt.redirect_uri && (this.wxloginSetting.redirect_uri = opt.redirect_uri);
    // 
    opt.state && (this.wxloginSetting.state = opt.state);
    // 
    opt.style && (this.wxloginSetting.style = opt.style);
    // 
    opt.href && (this.wxloginSetting.href = opt.href);
};

/**
 * 属性
 */
// 
WxJointLogin.DOMAIN_PATH = window.location.protocol + '//' + window.location.host;
WxJointLogin.BASE_PATH = '/';
WxJointLogin.API_PATH = WxJointLogin.BASE_PATH + 'wxcommon/v1/';
// 微信公共接口
WxJointLogin.WXCOM_API_PATH = WxJointLogin.BASE_PATH + 'wxcommon/v1/';
WxJointLogin.VERSION = '1';
WxJointLogin.EMP_FUN = function() {};

/**
 * 初始化
 */
WxJointLogin.prototype.init = function() {
    var that = this;
    // 加载
    that.load();
    // 加载事件
    that.addEvent();
};
/**
 * 加载基础数据
 */
WxJointLogin.prototype.load = function() {
    var that = this;
    // 获取微信联合登录参数
    that.getWxJointLoginParma();
};
/**
 * 获取微信联合登录参数
 */
WxJointLogin.prototype.getWxJointLoginParma = function() {
    var that = this,
        // 参数
        hrefParma = WxJointLogin.getHrefParma(),
        // 登录成功后，重定向地址orginURI
        furl = hrefParma.orginURI || WxJointLogin.DOMAIN_PATH;

    // 请求...
    WxJointLogin.api({
        url: WxJointLogin.API_PATH + 'wxjlgpm',
        data: {
            furl: furl
        },
        type: 'post',
        success: function(response) {
            var rpco = response.rpco,
                body;
                
            // 业务处理
            switch(rpco) {
                case 200:
                    body = response.body || {};
                    // 初始化微信登录
                    that.initWxLogin({
                        appid: body.appid,
                        scope: body.scope,
                        state: body.state
                    });
                    break;
            }
        }
    });
};
/**
 * 初始化微信登录
 * @parma {object}{1} cfg 微信登录js配置
 *        {string}{1,0} id 第三方页面显示二维码的容器id
 *        {string}{1,0} appid 应用唯一标识，在微信开放平台提交应用审核通过后获得
 *        {string}{1,0} scope 应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
 *        {string}{1,0} redirect_uri 重定向地址，需要进行UrlEncode
 *        {string}{1,0} state 用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验
 *        {string}{1,0} style 提供"black"、"white"可选，默认为黑色文字描述。详见文档底部FAQ
 *        {string}{1,0} href 自定义样式链接，第三方可根据实际需求覆盖默认样式。详见文档底部FAQ
 */
WxJointLogin.prototype.initWxLogin = function(cfg) {
    var that = this;

    // 合并属性
    cfg.id && (that.wxloginSetting.id = cfg.id);
    cfg.appid && (that.wxloginSetting.appid = cfg.appid);
    cfg.scope && (that.wxloginSetting.scope = cfg.scope);
    cfg.redirect_uri && (that.wxloginSetting.redirect_uri = cfg.redirect_uri);
    cfg.state && (that.wxloginSetting.state = cfg.state);
    cfg.style && (that.wxloginSetting.style = cfg.style);
    cfg.href && (that.wxloginSetting.href = cfg.href);

    // 创建微信登录对象
    new WxLogin(that.wxloginSetting);
};
/**
 * DOM事件
 */
WxJointLogin.prototype.addEvent = function() {
    var that = this,
        click = WxJointLogin.getClick();

};

/**
 * 单击事件
 */
WxJointLogin.getClick = function() {
    return this.checkSupportTouch() ? 'tap' : 'click';
};
/**
 * 是否支持触摸事件
 */
WxJointLogin.checkSupportTouch = function() {
    return typeof window.document.ontouchstart !== 'undefined';
};
/**
 * 获取url参数
 * @parma {string}{1, 0} url 待解析路径
 */
WxJointLogin.getHrefParma = function(url) {
    var parma = {},
        // 参数数组
        parmaArr = [],
        item = '',
        // 下标
        i,
        j,
        k,
        n;

    if(url) {
        i = url.indexOf('?');
        url = i > -1 ? url.slice(i + 1) : '';
    } else {
        url = decodeURI(window.location.search.slice(1));
    }

    // 赋值
    parmaArr = url.split('&');
    for (var i in parmaArr) {
        item =  parmaArr[i];

        j =item.indexOf('=');
        // 不存在键值对
        if(j < 0) { continue; }

        k = item.slice(0, j);
        n = item.slice(j + 1);

        parma[k] = n;
        //parma[k] = k === 'cbu' ? util.decode(n) : n;
        //item[0] && (parma[item[0]] = item[0] === 'cbu' ? util.decode(item[1]) : item[1]);
    }
    return parma;
};
/**
 * ajax
 * @parma {object}{1} cfg ajax配置
 */
WxJointLogin.api = function(cfg) {
    // ajax配置
    var ajaxSettings = {
        // 请求地址
        url: '',
        // 请求参数
        data: {},
        // 超时时间
        timeout: 5000,
        // 请求类型
        type: 'post',
        // 异步请求
        async: false,
        // 数据类型
        dataType: 'json',
        // 内容类型，编码类型
        contentType: 'application/json; charset=utf-8',
        // 成功回调
        success: WxJointLogin.EMP_FUN,
        // 错误回调
        error: WxJointLogin.EMP_FUN,
        // 完成回调
        complete: WxJointLogin.EMP_FUN
    },
    // ajax对象
    xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
    // 数据数组
    dataStrArray = [],
    // 数据字符串
    dataStr = '',
    // 超时定时器
    timeoutObject;

    // 配置
    cfg.url && (ajaxSettings.url = cfg.url);
    cfg.data && (ajaxSettings.data = cfg.data);
    cfg.timeout && (ajaxSettings.timeout = cfg.timeout);
    cfg.type && (ajaxSettings.type = cfg.type);
    cfg.async && (ajaxSettings.async = cfg.async);
    cfg.dataType && (ajaxSettings.dataType = cfg.dataType);
    cfg.contentType && (ajaxSettings.contentType = cfg.contentType);
    cfg.success && (ajaxSettings.success = cfg.success);
    cfg.error && (ajaxSettings.error = cfg.error);
    cfg.complete && (ajaxSettings.complete = cfg.complete);

    // 监听状态
    xmlhttp.onreadystatechange = function() {
        // 完成
        if (xmlhttp.readyState == 4) {
            // 清空响应事件
            xmlhttp.onreadystatechange = WxJointLogin.EMP_FUN;
            // 清除超时定时器
            clearTimeout(timeoutObject)

            // 成功
            if((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status == 304) {
                try {
                    (ajaxSettings.dataType === 'json') && xmlhttp.responseText && ajaxSettings.success(JSON.parse(xmlhttp.responseText));
                } 
                catch(e) {
                    // 执行错误回调
                    ajaxSettings.error();
                    console.log('ajax send error...', e);
                }
            } 
            else {
                // 执行错误回调
                ajaxSettings.error();
            }
            // 完成回调
            ajaxSettings.complete();
          }
    };

    // 判断请求类型
    ajaxSettings.type = ajaxSettings.type.toUpperCase();

    // 转为字符串类型
    // 查询参数为json格式的post请求，直接转为字符串格式
    if(ajaxSettings.type === 'POST' && /application\/json;/.test(ajaxSettings.contentType)) {
        // 
        dataStr = JSON.stringify(ajaxSettings.data);
    } 
    else {
        // 拼接数据字符串
        for(var k in ajaxSettings.data) {
           (ajaxSettings.data.hasOwnProperty(k)) && dataStrArray.push(k + '=' + ajaxSettings.data[k]);
        }
        // 去除最后“&”
        dataStr = dataStrArray.join('&');
    }

    // 业务操作
    if(ajaxSettings.type === 'GET') {
        // 参数追加到请求路径
        ajaxSettings.url += (ajaxSettings.url.indexOf('?') > -1 ? '&' : '?') + dataStr;
        // get请求没有查询字符串
        dataStr = null;
    }

    // 超时处理
    ajaxSettings.timeout && (timeoutObject = setTimeout(function(){
        // 清空响应事件
        xmlhttp.onreadystatechange = WxJointLogin.EMP_FUN;
        // 中断请求
        xmlhttp.abort();
    }, ajaxSettings.timeout));

    // 避免缓存
    ajaxSettings.url += (ajaxSettings.url.indexOf('?') > -1 ? '&' : '?') + 'ct=' + new Date().getTime();
    // 准备发送
    xmlhttp.open(ajaxSettings.type, ajaxSettings.url, ajaxSettings.async);
    // 向请求添加 HTTP 头
    xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
    xmlhttp.setRequestHeader("Accept", 'application/json');
    xmlhttp.setRequestHeader("Content-Type", ajaxSettings.contentType);
    // 发送
    xmlhttp.send(dataStr);
};