var root = window || {},
	util = root.util || {};
root.EMP_FUN = function() {};

//  微信js通用参数
//  success：接口调用成功时执行的回调函数。
//  fail：接口调用失败时执行的回调函数。
//  complete：接口调用完成时执行的回调函数，无论成功或失败都会执行。
//  cancel：用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
//  trigger: 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。

// 微信js配置
var WxConfig = function(opt) {
	// 注入权限验证配置
	var cfg = {
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: '', // 必填，公众号的唯一标识
		timestamp: '', // 必填，生成签名的时间戳
		nonceStr: '', // 必填，生成签名的随机串
		signature: '', // 必填，签名，见附录1
		jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	};

	this.options = {};
	// 配置
	this.options.cfg = {};
	// 验证成功执行
	this.options.ready = opt.ready || root.EMP_FUN;
	// 验证失败执行
	this.options.error = opt.error || root.EMP_FUN;

	// 扩展
	$.extend(this.options.cfg, cfg, opt.cfg, this.getWxConfigParmas());
};

$.extend(WxConfig.prototype, {
	/**
	 * 初始化
	 */
	init: function() {
		var that = this;
		that.load();
	},
	/**
	 * 加载
	 */
	load: function() {
		var that = this;
		// 微信配置
		wx.config(that.options.cfg);
		// 成功回调
		wx.ready(that.options.ready);
		// 失败回调
		wx.error(that.options.error);
	},
	/**
	 * 获取微信配置参数
	 * @return {object} result 微信配置参数
	 */
	getWxConfigParmas: function() {
		var that = this,
			// 当前网页的URL，不包含#及其后面部分
			curl = location.href.split('#')[0],
			result = {};

		// 请求...
        util.api({
            surl: root.WXCM_API_PATH + 'wxpm',
            data: {
            	curl: curl
            },
            type: 'post',
            async: false,
            success: function(response) {
                var rpco = response.rpco,
                	body;

                // 处理
                switch(rpco) {
                    case 200:
                    	body = response.body || {};
                    	// 公众号的唯一标识
                    	body.appId && (result.appId = body.appId);
                    	// 生成签名的时间戳
                    	body.timestamp && (result.timestamp = body.timestamp);
                    	// 生成签名的随机串
                    	body.nonceStr && (result.nonceStr = body.nonceStr);
                    	// 签名
                    	body.signature && (result.signature = body.signature);
                        break;
                }
            }
        });

		return result;
	}
});