var root = window || {};
root.BASE_PATH = '/';
root.API_PATH = root.BASE_PATH + '';
// 公共模块
root.CM_API_PATH = root.BASE_PATH + 'common/v1/';
// 会员模块
root.MB_API_PATH = root.BASE_PATH + 'member/v1/';
// 资产模块
root.AS_API_PATH = root.BASE_PATH + 'asset/v1/';
// 业务相关
root.BSNS_API_PATH = root.BASE_PATH + 'business/v1/';
// 资源分组
root.RESGRP_API_PATH = root.BASE_PATH + 'webres/v1/';
// 微信公共
root.WXCM_API_PATH = root.BASE_PATH + 'wxcommon/v1/';
//root.JKX_API_PATH = root.BASE_PATH + 'jkx/v1/';
// 极客修
root.WXP_API_PATH = root.BASE_PATH + 'wxpay/v1/sod/';
// 地区Json文件
root.PVC_API_PATH = root.BASE_PATH + 'json/pvc/';
// 服务地区Json文件
root.SERAREA_API_PATH = root.BASE_PATH + 'json/servicearea/';
// 电子说明书
root.EDOC_API_PATH = root.BASE_PATH + 'edoc/GomeWordWeb/asset/v1/wx/';
// 用户头像图片调用地址
root.USERPIC_API_PATH = root.BASE_PATH + 'member/v1/getheader?id=';
// 留言板地址
root.MSGBOARD_API_PATH = root.BASE_PATH + 'edoc/scmi/scmi/';
// 统计报表地址
root.REPORTCHART_API_PATH = root.BASE_PATH + 'stats/v1/';
// 内购会地址
root.PURCHASING_API_PATH = root.BASE_PATH + 'purchasing/v1/';
//
root.VERSION = '48';
root.EMPTY_FN = function() {};

// 工具箱
root.util = {
	// 公共定时器
	interval: {},
	// 不进行微信认证登录
	noWxLogin: window.NO_WXLOGIN/*,
	// 是否可发送ajax请求
	canSendAjax: true*/
};
// 操作状态
root.util.OPT_STATE = {
	// 启用/新增/修改(带主键)
	UPDATE: 1,
	// 禁用
	DISABLED: 2,
	// 删除
	DELETE: 3
};

/**
 * js小工具
 */
$.extend(root.util, {
	/**
	 * 是否为微信浏览器
	 */
	isWeixin: function() {
		return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
	},
	/**
	 * 单击事件
	 */
	getClick: function() {
		return this.checkSupportTouch() ? 'tap' : 'click';
	},
	/**
	 * 手指按下事件
	 */
	getMousedown: function() {
		return this.checkSupportTouch() ? 'touchstart' : 'mousedown';
	},
	/**
	 * 手指抬起事件
	 */
	getMouseup: function() {
		return this.checkSupportTouch() ? 'touchend' : 'mouseup';
	},
	/**
	 * 手指移动事件
	 */
	getMousemove: function() {
		return this.checkSupportTouch() ? 'touchmove' : 'mousemove';
	},
	/**
	 * 是否支持触摸事件
	 * @return {boolean}{1} 是否支持，true：支持；false：不支持。
	 */
	checkSupportTouch: function() {
		//return window.document.hasOwnProperty("ontouchstart");
		return typeof window.document.ontouchstart !== 'undefined';
	},
	/**
	 * 字符显示加密
	 * @parma {string}{1} str 待加密字符串
	 * @parma {number}{1, 0} esi 加密开始下标，默认：0
	 * @parma {number}{1, 0} eco 加密字符数，默认：0
	 * @parma {string}{1, 0} ech 加密符号，默认：*
	 * @return {string} 已加密字符串
	 */
	strEncrypt: function(str, esi, eco, ech) {
		var str = str + '',
			estr = str,
			ech = ech || '*',
			// 结束位置
			eei = esi + eco - 1;
		return str && str.replace(/./g, function(s, i) {
			return (i >= esi && i <= eei) ? ech : s;
		});
	},
	/**
	 * 格式化日期
	 * @parma {number, string}{1} time 时间 number:毫秒数，日期字符串
	 * @parma {string}{1, 0} formate 格式化字符串
	 */
	formateDate: function(time, formate) {
		var result = '',
			year,
			month,
			day,
			hour,
			minute,
			second;

		(typeof time === 'string') && (time = time.replace(/-/g, '/'));
		time = new Date(time);

		// 为有效时间
		if(!isNaN(time.getTime())) {
			// 年
			year = time.getFullYear();
			// 月
			month = time.getMonth() + 1;
			(month < 10) && (month = '0' + month);
			// 日
			day = time.getDate();
			(day < 10) && (day = '0' + day);
			// 时
			hour = time.getHours();
			(hour < 10) && (hour = '0' + hour);
			// 分
			minute = time.getMinutes();
			(minute < 10) && (minute = '0' + minute);
			// 秒
			second = time.getSeconds();
			(second < 10) && (second = '0' + second);

			result = formate.replace(/yyyy/g, year).replace(/MM/g, month).replace(/dd/g, day).
			replace(/hh/g, hour).replace(/mm/g, minute).replace(/ss/g, second);
		}

		return result;
	},
	/**
	 * 获取url参数
	 * @parma {string}{1, 0} url 待解析路径
	 */
	getHrefParma: function(url) {
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

		// ou所在下标
		i = url.indexOf('ou=');
		// 截取ou，注：此参数必须位于最后
		if(i > -1) {
			parma.ou = url.slice(i + 3);
			// 清除ou部分
			url = url.slice(0, i);
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

			parma[k] = k === 'cbu' ? util.decode(n) : n;
			//item[0] && (parma[item[0]] = item[0] === 'cbu' ? util.decode(item[1]) : item[1]);
		}
		return parma;
	},
	/**
	 * 设置url参数
	 * @parma {string}{1} url 目标路径
	 * @parma {object}{1} parma 参数对象
	 * @return {string} url 操作完成路径
	 */
	setHrefParma: function(url, parma) {
		var parma = parma || {},
			parmaStr = '';

		// 参数
		parma = $.extend(util.getHrefParma(url), parma);

		if(url && parma) {
			// 去除参数
			url = url.replace(/\?.*$/, '');
			// 遍历放入
			for (var key in parma) {

				if(!parma.hasOwnProperty(key)) { continue; }
				// 
				if(key === 'ou' || key === 'cbu') { continue; }

				parmaStr += key + '=' + parma[key] + '&';
			}
			
			// 回调页面
			parma.cbu && (parmaStr += 'cbu=' + util.encode(parma.cbu) + '&');
			// 原地址
			parma.ou && (parmaStr += 'ou=' + parma.ou + '&');
			// 去除最后“&”
			parmaStr && (url += '?' + parmaStr.replace(/&$/, ''));
		}

		return url;
	},
	// /**
	//  * 跳转页面
	//  * @parma {string}{1} url 目标路径
	//  * @parma {object}{1, 0} urlParma 追加参数
	//  * @parma {boolean}{1, 0} isReserveParma 是否清除原路径参数
	//  */
	// href: function(url, urlParma, isReserveParma) {
	// 	var parmaStr = '',
	// 		// 获取并解密当前路径
	// 		curUrl = decodeURI(window.location.href),
	// 		pathname = decodeURI(window.location.pathname),
	// 		item;

	// 	urlParma = urlParma || {};

	// 	// 清除原始链接
	// 	curUrl = (isReserveParma ? curUrl.replace(/\?.*$/g, '') : curUrl);
	// 	// 清除域名
	// 	curUrl = curUrl.slice(curUrl.indexOf(pathname));

	// 	// 放入参数
	// 	for (var key in urlParma) {
	// 		if(urlParma.hasOwnProperty(key)) {
	// 			item = urlParma[key];

	// 			// callBackUrl时需base64加密
	// 			(key === 'callBackUrl') && urlParma[key] && (item = util.encode(urlParma[key]));

	// 			parmaStr += '&' + key + '=' + item;
	// 		}
	// 	};

	// 	// 链接存在参数
	// 	parmaStr && (url += (url.indexOf('?') > -1 ? '&' : '?') + parmaStr.slice(1));

	// 	// 拼接当前地址
	// 	url += (url.indexOf('?') > -1 ? '&' : '?') + 'ou=' + curUrl;

	// 	// 加密并跳转
	// 	window.location.href = encodeURI(url);
	// },
	/**
	 * 获取跳转路径
	 * @parma {object}{1} opt 配置参数
	 *        {string}{1} url 目标路径
	 *        {object}{1, 0} urlParma 追加参数
	 *        {boolean}{1, 0} isSaveou 是否保留原路径
	 * @return {string}{1} url 跳转路径 
	 */
	getJumpUrl: function(opt) {
		var that = this,
			// 目标路径
			url = opt.url,
			// 追加参数
			urlParma = opt.urlParma,
			// 是否保留原路径
			isSaveou = opt.isSaveou,
			// 获取并解密当前路径
			curUrl = decodeURI(window.location.pathname + window.location.search);

		// url为javascript代码
		if(url.indexOf('javascript:') === 0) {
			// nothing...
		} 
		// 正常路径
		else {
			// 
			urlParma = urlParma || {};

			// 保留原路径
			isSaveou && (urlParma.ou = curUrl);

			// 页面版本号
			urlParma.v = root.VERSION;

			// 设置参数
			url = util.setHrefParma(url, urlParma);
		}

		return encodeURI(url);
	},
	/**
	 * 跳转页面
	 * @parma {string}{1} url 目标路径
	 * @parma {object}{1, 0} urlParma 追加参数
	 * @parma {boolean}{1, 0} isSaveou 是否保留原路径
	 */
	href: function(url, urlParma, isSaveou) {
		// 跳转
		window.location.href = util.getJumpUrl({
			url: url,
			urlParma: urlParma,
			isSaveou: isSaveou
		});
	},
	/**
	 * 替换页面
	 * @parma {string}{1} url 目标路径
	 * @parma {object}{1, 0} urlParma 追加参数
	 * @parma {boolean}{1, 0} isSaveou 是否保留原路径
	 */
	replace: function(url, urlParma, isSaveou) {
		// 跳转
		window.location.replace(util.getJumpUrl({
			url: url,
			urlParma: urlParma,
			isSaveou: isSaveou
		}));
	},
	/**
	 * 封装ajax
	 */
	api: function(opts) {
		var that = this,
			success = opts.success || root.EMPTY_FN,
			error = opts.error || root.EMPTY_FN,
			complete = opts.complete || root.EMPTY_FN,
			beforeSend = opts.beforeSend || root.EMPTY_FN,
			ct = new Date().getTime();

		// 
		//if(!util.canSendAjax) { return false; }

		opts.url = opts.surl ? opts.surl : (root.API_PATH + opts.url);

		opts.url += (opts.url.indexOf('?') > -1 ? '&' : '?') + 'ct=' + ct;

		opts = $.extend({
			"timeout": 10000,
			"type": 'post',
			"async": true, //默认异步请求
			"dataType": 'json',
			"contentType": 'application/json; charset=utf-8'
		}, opts, {
			success: function(responseData, textStatus, jqXHR) {
				if(responseData && responseData.rpco) {
					return responseData.rpco === 401 ? util.login(responseData.furl) : success.apply(this, arguments);
				}
				else {
					return success.apply(this, arguments);
				}
			},
			beforeSend: function() {
				return beforeSend.apply(this, arguments);
			},
			error: function(jqXHR, textStatus) {
				// 网络异常
				util.comShow({txt: '您的网络异常，加载失败，请您<br>重新尝试', link: 'javascript: window.location.reload();', btn: '重新加载', icl: 'i-abnormal'});
				return error.apply(this, arguments);
			},
			complete: function(jqXHR, textStatus) {
				return complete.apply(this, arguments);
			}
		});
		if(opts.type == "post" && opts.data) {
			opts.data = JSON.stringify(opts.data);
		}
		var jqAjax = $.ajax(opts);
		return jqAjax;
	}
});

/**
 * 公共展示工具
 */
$.extend(root.util, {
	/**
	 * 弹出框
	 * @parma{string}{1} content 提示信息
	 * @parma{object}{1, 0} parmas 参数
	 *       {string}{1, 0} title 提示抬头文字，默认：提示
	 *       {boolean}{1, 0} justOk 只有确定按钮，默认：true
	 *       {string}{1, 0} txtal 文字对齐方式，默认：center
	 *       {number}{1, 0} defBtnIndex 默认按钮下标，默认：-1
	 *       {string}{1, 0} okBtnText 确认按钮文案，默认：确认
	 *       {string}{1, 0} cancelBtnText 取消按钮文案，默认：取消
	 *       {function}{1, 0} okFn 确认回调
	 *       {function}{1, 0} cancelFn 取消回调
	 */
	alert: function(content, parmas) {
		// 配置
		var cfg = $.extend({
				content: '',
				title: '提示',
				txtal: 'center',
				justOk: true,
				defBtnIndex: -1,
				okBtnText: '确定',
				cancelBtnText: '取消',
				okFn: function() {},
				cancelFn: function() {}
			}, parmas),
			alertHTML = '';

		// 清空原层
		$('.dialog').remove();
		
		// 展示
		alertHTML = '<div class="dialog">' 
				  + 	'<div class="tablecell">' 
				  + 		'<div class="alert">' 
				  + 			'<div class="alert-title">' + cfg.title + '</div>' 
				  + 			'<div class="alert-content" style="text-align: ' + cfg.txtal + ';">' + content + '</div>'
			//<div class="alert-input">账户：<input id="lgtk" type="text" placeholder="请输入姓名" maxlength="16"></div>
			//<div class="alert-input mb20">密码：<input id="lgpwd" type="password" placeholder="请输入密码" maxlength="18"></div>
				  + 			'<div class="alert-btn">' + '<span id="alert-ok">' + cfg.okBtnText + '</span>' + '<span id="alert-cancel">' + cfg.cancelBtnText + '</span>' + '</div>' 
				  + 		'</div>' 
				  + 	'</div>' 
				  + '</div>';
		// 放入dom
		$('body').append(alertHTML);

		// 仅显示确认按钮
		cfg.justOk && $('#alert-cancel').remove();
		// 高亮按钮
		(cfg.defBtnIndex > -1) && $('.alert-btn span:eq(' + cfg.defBtnIndex + ')').css('font-weight', 'bold');

		// 确认按钮单击事件
		$('#alert-ok').off().on('click', function() {
			// 清空原层
			$('.dialog').remove();
			cfg.okFn && cfg.okFn();
		});

		// 取消按钮单击事件
		$('#alert-cancel').off().on('click', function() {
			// 清空原层
			$('.dialog').remove();
			cfg.cancelFn && cfg.cancelFn();
		});
	},
	/**
	 * 录入弹出框
	 * @parma{string}{1} content 提示信息
	 * @parma{object}{1, 0} parmas 参数
	 *       {array}{1, 0} inpuPlaceholderArray 文本框placeholder
	 *       {string}{1, 0} title 提示抬头文字，默认：提示
	 *       {boolean}{1, 0} justOk 只有确定按钮，默认：true
	 *       {string}{1, 0} txtal 文字对齐方式，默认：center
	 *       {number}{1, 0} defBtnIndex 默认按钮下标，默认：-1
	 *       {string}{1, 0} okBtnText 确认按钮文案，默认：确认
	 *       {string}{1, 0} cancelBtnText 取消按钮文案，默认：取消
	 *       {function}{1, 0} okFn 确认回调
	 *       {function}{1, 0} cancelFn 取消回调
	 */
	prompt: function(content, parmas) {
		// 配置
		var cfg = $.extend({
				content: '',
				inpuPlaceholderArray: [],
				title: '提示',
				txtal: 'center',
				justOk: true,
				defBtnIndex: -1,
				okBtnText: '确定',
				cancelBtnText: '取消',
				okFn: function() {},
				cancelFn: function() {}
			}, parmas),
			alertHTML = '',
			// 文本框html
			inputHTML = '';

		// 清空原层
		$('.dialog').remove();
		
		// 放入文本框
		for(var i = 0, j = cfg.inpuPlaceholderArray.length; i < j; i++) {
			inputHTML += '<div class="alert-input '+ (i === j-1 ? 'mb20' : '') +'"><input class="wl100" id="lgtk" type="text" placeholder="' + cfg.inpuPlaceholderArray[i] + '" maxlength="32"></div>';
		}

		// 展示
		alertHTML = '<div class="dialog">' 
				  + 	'<div class="tablecell">' 
				  + 		'<div class="alert prompt">' 
				  + 			'<div class="alert-title">' + cfg.title + '</div>' 
				  + 			'<div class="alert-content" style="text-align: ' + cfg.txtal + ';">' + content + '</div>'
				  +             inputHTML

				  /*+'<div class="alert-input">账户：<input id="lgtk" type="text" placeholder="请输入姓名" maxlength="16"></div>'
				  +'<div class="alert-input mb20">密码：<input id="lgpwd" type="password" placeholder="请输入密码" maxlength="18"></div>'*/

				  + 			'<div class="alert-btn">' + '<span id="alert-ok">' + cfg.okBtnText + '</span>' + '<span id="alert-cancel">' + cfg.cancelBtnText + '</span>' + '</div>' 
				  + 		'</div>' 
				  + 	'</div>' 
				  + '</div>';


		// 放入dom
		$('body').append(alertHTML);

		// 仅显示确认按钮
		cfg.justOk && $('#alert-cancel').remove();
		// 高亮按钮
		(cfg.defBtnIndex > -1) && $('.alert-btn span:eq(' + cfg.defBtnIndex + ')').css('font-weight', 'bold');

		// 确认按钮单击事件
		$('#alert-ok').off().on('click', function() {
			/*// 先执行回调
			cfg.okFn && cfg.okFn();
			// 清空原层
			$('.dialog').remove();*/

			// 存在回调方法
			if(cfg.okFn) {
				//
				(cfg.okFn() !== false) && $('.dialog').remove();
			} 
			// 不存在回调
			else {
				// 清空原层
				$('.dialog').remove();
			}
		});

		// 取消按钮单击事件
		$('#alert-cancel').off().on('click', function() {
			/*// 先执行回调
			cfg.cancelFn && cfg.cancelFn();
			// 清空原层
			$('.dialog').remove();*/

			// 存在回调方法
			if(cfg.cancelFn) {
				//
				(cfg.cancelFn() !== false) && $('.dialog').remove();
			} 
			// 不存在回调
			else {
				// 清空原层
				$('.dialog').remove();
			}
		});
	},
	/**
	 * 小提示
	 * @parma {string}{1} text 提示内容
	 * @parma {object}{1, 0} opt 配置
	 *        {number}{1, 0} duration 持续时间，单位：毫秒
	 *        {number}{1, 0} iconClass 图标的类名
	 */
	tip: function(text, opt) {
		var text = text || '',
			tipHTML = '',
			// 参数
			opt = opt || {},
			// 持续时间
			duration = opt.duration || '800',
			// 图标类名
			iconClass = opt.iconClass || '';

		// 清空原层
		$('.alert-tip').remove();

		// 存在图标
		if(iconClass) {
			tipHTML = '<div class="alert-tip"><span class="msg msg-icon"><i class="i ' + iconClass + '"></i>' + text + '</span></div>';
		} 
		// 普通消息提示
		else {
			tipHTML = '<div class="alert-tip"><span class="msg">' + text + '</span></div>';
		}

		// 放入dom
		$('body').append(tipHTML);

		// 自动消失		
		clearInterval(util.interval);
		util.interval = setTimeout(function() {
			util.interval = setInterval(function() {
				var opacity = parseFloat($('.alert-tip').css('opacity') - 0.1).toFixed(1);
				if(opacity > 0) {
					$('.alert-tip').css('opacity', opacity);
				} else {
					clearInterval(util.interval);
					$('.alert-tip').remove();
				}
			}, 50);
		}, duration);
	},
	/**
	 * 倒计时
	 * @parma {object}{1} elem 元素
	 * 		  {number}{1, 0} downTime 倒计时长，单位：秒。默认60
	 * 		  {string}{1, 0} formate 格式化
	 * 		  {function}{1, 0} callback 回调函数
	 */
	countDown: function(options) {
		var elem = options.elem || {},
			// 默认60s
			downTime = options.downTime || 60,
			formate = options.formate || 'count',
			callback = $.isFunction(options.callback) ? options.callback : function() {},
			// 倒计时时间
			interval = elem.get(0).id + 'Interval',
			// 原显示
			oldText = elem.text();
		// 清空定时器
		clearInterval(util[interval]);
		// 初始化倒计时时间
		elem.html(formate.replace(/count/, downTime)).addClass('countdown');

		// 开启定时器
		util[interval] = setInterval(function() {
			// 循环次数累加
			downTime--;

			// 递减
			if(downTime > 0) {
				elem.html(function(i, n) {
					return formate.replace(/count/, downTime);
				});
			}
			// 清空定时器
			else {
				clearInterval(util[interval]);
				// 
				elem.removeClass('countdown').html(oldText);
				// 回调
				callback();
			}
		}, 1000);
	},
	/**
	 * 公共显示
	 * @parma {string}{1} opts
	 * 		  {string}{1} txt 提示文字
	 * 		  {string}{1} btn 按钮文字
	 * 		  {string}{1} link 跳转链接
	 * 		  {string}{1} icl 图标类样式 
	 *                        网络已断开: 'i-disconnect', 
	 *                        网络异常: 'i-abnormal', 
	 *                        没有数据: 'i-order', 
	 *                        没有找到页面: 'i-page', 
	 *                        加载中: 'i-load ro360'
	 */
	comShow: function(opts) {
		var opts = opts || {},
			txt = opts.txt || '',
			btn = opts.btn || '',
			link = opts.link || 'javascript:;',
			icl = opts.icl || '',
			html = '';

		html += '<div class="tuwen maxtop bcgray" id="commonShow">'
			  + 	'<div class="tu">'
			  + 		'<i class="i ' + icl + '"></i>'
			  + 	'</div>';
		// 标题
		txt && (html += '<p class="wen">' + txt + '</p>');
		// 按钮
		btn && (html += '<a class="btn btn-footer" href="' + link + '" >' + btn + '</a>');
		html += '</div>';

		// 移除
		util.remComShow();
		$('body').append(html);

		// 设置显示位置、大小
		$('#commonShow').css({
			'top': $('.container').css('top'),
			'bottom': '0'
		});
	},
	/**
	 * 移除“公共显示”
	 */
	remComShow: function() {
		$('#commonShow').remove();
	},
	/**
	 * 单击灰底效果
	 * @parma {bject}{1} el 目标元素
	 */
	clickGrayEffect: function(el) {
		var y = el.offset().top,
			h = el.height();

		// 移除效果
		util.remClickGrayEffect();
		// 放入效果
		$('body').append('<div id="clickGrayEffect" style="width: 100%; height: ' + (h + 1) + 'px; position: absolute; top: ' + (y - 1) + 'px; left: 0; background-color: rgba(0, 0, 0, .1);"></div>');
		// 抬起时，移除效果
		$('#clickGrayEffect').on(util.getMouseup(), function() {
			util.remClickGrayEffect();
		});
	},
	/**
	 * 移除“单击灰底效果”
	 */
	remClickGrayEffect: function() {
		// 移除效果
		$('#clickGrayEffect').remove();
	}
});

/**
 * 公共模块代码
 */
$.extend(root.util, {
	/**
	 * 通用功能
	 */
	loadCommonActionLoad: function() {
		// 微信登录
		util.noWxLogin || util.wxlogin();
		// 加载返回按钮
		util.loadGoBack();
		// 加载菜单事件
		util.loadMenuEvent();
		// 加载文本框清空按钮
		util.loadInputClearBtn();
		// 加载“回车键”提交表单
		util.loadEnterKeySubmit();
		// 加载点击变灰效果
		util.loadClickGrayEffect();
		// 加载数字文本框输入限制
		util.loadNumberInputLimit();

		//util.inputClear();
	},
	/**
	 * 加载返回按钮
	 */
	loadGoBack: function() {
		var ou = util.getHrefParma().ou;
		// 加载返回按钮
		//ou && $('.goBack').attr('href', ou).show();
		$('.goBack').attr('href') || $('.goBack').attr('href', 'javascript:window.history.back();');

	},
	/**
	 * 加载菜单单击事件
	 */
	loadMenuEvent: function() {
		var menu = $('.header .menu');
		if(!menu.length) {
			return false;
		}

		$(document).on(util.getClick(), function(e) {
			var tag = $(e.target);
			if(tag.is('.header .btn') || tag.is('.header .btn .i-more') && menu.is(':hidden')) {
				menu.show();
				return;
			}
			menu.hide();
		});
	},
	/**
	 * 加载文本框清空按钮
	 */
	loadInputClearBtn: function() {
		$('.js-clearInput').off().on(util.getClick(), function() {
			$(this).parent().find('input').val('');
		});
	},
	/**
	 * 加载“回车键”提交表单
	 */
	loadEnterKeySubmit: function() {

		$('input, textarea').on('keyup', function(e) {
			// 13是回车键值
			(e.keyCode === 13) && $('.js-entersave').trigger(util.getClick());
		});
	},
	/**
	 * 清空页面文本框
	 */
	/*inputClear: function() {
		// 文本框
		$('input').val('');
		// 文本域
		$('textarea').html('');
	},*/
	/**
	 * 加载点击变灰效果
	 */
	loadClickGrayEffect: function() {
		// 绑定按下事件
		$('[cge]').on('touchstart', 'li:not([nocge])',function() {
			// 新增效果
			util.clickGrayEffect($(this));
		});
		// 绑定抬起事件
		$('[cge]').on('touchend', 'li:not([nocge])',function() {
			// 移除效果
			util.remClickGrayEffect();
		});
		// 绑定移动事件
		$('[cge]').on('touchmove', function() {
			// 移除效果
			util.remClickGrayEffect();
		});
	},
	/**
	 * 加载数字文本框输入限制*/
	loadNumberInputLimit: function() {
		// 
		$(document).on('input propertychange', 'input.js-number', function() {
			var value = $(this).val().replace(/[^0-9]/g, '');
            $(this).val(value);
		});
	},
	/**
	 * 微信认证登录
	 */
	wxlogin: function() {
		// 微信回调码
		var hrefParma = util.getHrefParma(),
			wxcode = hrefParma.code,
			wxstate = hrefParma.state;

		// 认证登录
		if(wxcode) {
			// 请求...
			util.api({
				surl: root.CM_API_PATH + 'wxlogin',
				data: {
					wxcode: wxcode,
					wxstate: wxstate
				},
				type: 'post',
				async: false,
				success: function(response) {
					// 状态码
					var rpco = response.rpco;
					// 
					switch(rpco) {
						// 用户未关注国美管家
						case 201:
							// 提示用户
							//util.alert('您还没有关注我们的微信公众号，<br>赶快关注吧~');
							util.href('/accsmfail.html');
							// 取消后续ajax操作
							//util.canSendAjax = false;
							break
						// 微信回调码错误
						case 40001:// 省略break
						// 域名错误
						case 40002:// 省略break
						// 用户登录信息写入失败
						case 50001:
							// 重新登录
							//util.login();
					}
				}
			});
		}
	},
	/**
	 * 登录
	 * @parma {string}{1, 0} ou 登录成功跳转页面
	 */
	login: function(ou) {

		// 微信登录
		if(util.isWeixin()) {
			// 提示用户
			util.alert('您的访问已超时，页面将重新刷新。', {
				justOk: false,
				defBtnIndex: 0,
				okFn: function() {
					// 跳转微信登录链接
					var furl = root.WXCM_API_PATH + 'wxrc?furl=' + window.location.href;
					util.href(furl);
				}
			});
		}
		// 系统登录
		else {
			ou ? util.href('/login.html', {ou: ou}) : util.href('/login.html', {}, true);
		}
	}
});

/**
 * Base64 encode / decode
 */
$.extend(root.util, {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode: function(input) {

		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = this._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if(isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				util._keyStr.charAt(enc1) + util._keyStr.charAt(enc2) +
				util._keyStr.charAt(enc3) + util._keyStr.charAt(enc4);
		}
		return output;
	},
	// public method for decoding
	decode: function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = util._keyStr.indexOf(input.charAt(i++));
			enc2 = util._keyStr.indexOf(input.charAt(i++));
			enc3 = util._keyStr.indexOf(input.charAt(i++));
			enc4 = util._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if(enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = this._utf8_decode(output);
		return output;
	},
	// private method for UTF-8 encoding
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if(c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
});

// 通用功能加载
util.loadCommonActionLoad();