/************************************************************************************************
********************************此文件为大数据埋码公共结构js*************************************
*************************************************************************************************/
/**
 * 说明：此js无需依赖任何javascript工具包。
 */
var root = window || {};
// 空方法
root.EMP_FUN = function() {};

// 大数据埋码对象
var BigDataCode = function(opt) {
	// 基本属性
	this.options = {
		// 埋码方案类型名称
		codeType: '',
		// 版本
		version: '1',
		// script默认类型
		scriptDefaultType: 'text/javascript',
		// 请求类型script数组，属性：{src: js请求地址, text: js文本内容, type: 请求文档类型, 默认"text/javascript", callback: 回调方法（可省略）}
		scriptArray: [],
		// js加载完成回调
		completeCallback: root.EMP_FUN
	}

	// 覆盖属性
	// 埋码方案类型名称
	opt.codeType && (this.options.codeType = opt.codeType);
	// 版本
	opt.version && (this.options.version = opt.version);
	// script默认类型
	opt.scriptDefaultType && (this.options.scriptDefaultType = opt.scriptDefaultType);
	// 请求类型script数组
	opt.scriptArray && (this.options.scriptArray = opt.scriptArray);
	// js加载完成回调
	opt.completeCallback && (this.options.completeCallback = opt.completeCallback);
};

// 扩展原型链
BigDataCode.prototype = {
	/**
	 * 初始化
	 */
	init: function() {
		var that = this;

		// 加载
		that.load();
		// 事件代码
		that.eventCode();
	},
	/**
	 * 加载
	 */
	load: function() {
		var that = this;
		// 将js写入页面
		that.writeCode();
	},
	/**
	 * 载入页面埋码相关js
	 */
	writeCode: function() {
		var that = this,
			// head标签
			headEL = document.getElementsByTagName('head')[0],
			// script标签
			scriptEL,
			// script对象
			script,
			// script加载数量
			scriptLoadCount = 0,
			// script加载完成数量
			scriptLoadCompleteCount = 0;

		// 遍历放入请求类型script
		for(var i = 0, j = that.options.scriptArray.length; i < j; i++) {
			// 创建script标签
			scriptEL = document.createElement('script');
			// 
			script = that.options.scriptArray[i];
			// 设置script属性
			scriptEL.type = script.type || that.options.scriptDefaultType;
			// 设置script请求路径
			if(script.src) {
				// 递增
				scriptLoadCount++;
				// 
				scriptEL.src = script.src + '?v=' + that.options.version;
			}
			//script.src && (scriptEL.src = script.src + '?v=' + that.options.version);
			// 写入内容
			script.text && (scriptEL.innerHTML = script.text);
			// 远程加载js
			// script加载完成触发事件
			(function(scriptEL, script) {
				//
				scriptEL.onload = scriptEL.onreadystatechange = function() {
					// 
					if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
						// 此处写需执行的方法...
						script.callback && script.callback();
						// 执行js加载完成回调
						(++scriptLoadCompleteCount === scriptLoadCount) && that.options.completeCallback();
						// 注销
						scriptEL.onload = scriptEL.onreadystatechange = null;
					}
				};
			})(scriptEL, script);			
			// 将js写入页面
			headEL.appendChild(scriptEL);
		}
	},
	/**
	 * 事件代码
	 */
	eventCode: function() {
		var that = this;
		// nothing...
	}
};

// 触发
var bigDataCode = new BigDataCode({
	// 埋码方案类型名称
	codeType: '友盟dplus',
	// 版本
	version: '1',
	// script默认类型
	scriptDefaultType: 'text/javascript',
	// 请求类型script数组，属性：{src: js请求地址, text: js文本内容, type: 请求文档类型, 默认"text/javascript", callback: 回调方法（可省略）}
	scriptArray: [{
		src: '//js.gomegj.com/guanjia/v1/stats-init.js'
	}, {
		src: '//js.gomegj.com/guanjia/v1/stats-api.js'
	}],
	// js加载完成触发回调
	completeCallback: function() {
		gjstats.page_view();
	}
});
bigDataCode.init();