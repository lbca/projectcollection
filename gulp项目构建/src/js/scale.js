/**
 * 元素缩放插件
 * 基于zepto
 */
var Scale = function(opt) {
	this.options = $.extend({
		// 待缩放元素选择器
		sel: '',
		scale: {
			// 放大缓冲系数
			buffer: 0.25,
			// 初始“x”值
			oX: 0,
			// 初始“y”值
			oY: 0,
			// 上一次“x”值
			x: 0,
			// 上一次“y”值
			y: 0,
			// 初始“x”差值
			oDiffX: 0,
			// 初始“y”差值
			oDiffY: 0,
			// 放大比例
			scaNum: 0,
			// 上一次移动距离
			lastDiff: 0
		}
	}, opt);

	// 待缩放元素
	this.el = $(this.options.sel);
};

// 实现
$.extend(Scale.prototype, {
	/**
	 * 初始化
	 */
	init: function() {
		var that = this;
		that.domEvents();
	},
	/**
	 * 清除缩放
	 */
	clearScale: function() {
		var that = this;
		// 清空缩放
		that.options.scale.lastDiff = 0;
		that.options.scale.scaNum = 1;
		that.scale(1);
		// 清空移动
		that.options.scale.x = 0;
		that.options.scale.y = 0;
		that.translate(0, 0);
	},
	/**
	 * 移动
	 * @parma {number} x “x”轴移动距离
	 * @parma {number} y “y”轴移动距离
	 */
	translate: function(x, y) {
		var that = this,
			scaNum = that.options.scale.scaNum || 1,
			// 缩放样式
			cssTxt = 'scale(' + scaNum + ') translate(' + x + 'px, ' + y + 'px)';
		// 
		that.el.css({
			'position': 'relative',
			'left': x + 'px',
			'top': y + 'px'
		});

		//
		/*var that = this,
			scaNum = that.options.scale.scaNum || 1,
			// 缩放样式
			cssTxt = 'scale(' + scaNum + ') translate(' + x + 'px, ' + y + 'px)';*/
		
		//return;
		// 缩放
		/*that.el.css({
			'-webkit-transform': cssTxt,
			'transform': cssTxt
		});*/
	},
	/**
	 * 缩放
	 * @parma {number} scale 放大指数，注：包含小数。
	 */
	scale: function(scale) {
		var that = this,
			scale = scale || 1,
			// 缩放样式
			cssTxt = 'scale(' + scale + ')';

		//return;
		// 缩放
		that.el.css({
			'-webkit-transform': cssTxt,
			'transform': cssTxt
		});
	},
	/**
	 * 获取“x”最大移动值
	 * @return {number} result 最大移动值
	 */
	getMaxX: function() {
		var that = this,
			// 窗口宽度
			winW = that.el.parent().width(),
			// 差值
			diffW = that.el.width() - winW;

		//$('.test:eq(0)').html('winw:' + winW + ' imgw:' + that.el.width() + '; diffw:' + diffW + ' result:' + (diffW < 0 ? 0 : parseInt(diffW / 2)));
		return diffW < 0 ? 0 : parseInt(diffW / 2);
	},
	/**
	 * 获取“y”最大移动值
	 * @return {number} result 最大移动值
	 */
	getMaxY: function() {
		var that = this,
			// 窗口高度
			winH = that.el.parent().height(),
			// 差值
			diffH = that.el.height() - winH;
		return diffH < 0 ? 0 : parseInt(diffH / 2);
	},
	/**
	 * 获取两手指坐标“x”的差值
	 * @parma {object}{1} e 时间对象
	 * @return {number}{1} result 差值
	 */
	getDiffX: function(e) {
		var touches = e.touches || [],
			result = 0;

		// 存在多指
		if(touches.length > 1) {
			result = touches[0].clientX - touches[1].clientX;
		}

		return Math.abs(result);
	},
	/**
	 * 获取两手指坐标“y”的差值
	 */
	getDiffY: function(e) {
		var touches = e.touches || [],
			result = 0;

		// 存在多指
		if(touches.length > 1) {
			result = touches[0].clientY - touches[1].clientY;
		}

		return Math.abs(result);	
	},
	/**
	 * 触摸开始事件
	 */
	touchstart: function(e) {
		var that = this,
			touches = e.touches || [];
		
		// 移动
		if(touches.length <= 1) {
			// 获取初始“x”值
			that.options.scale.oX = touches[0].clientX;
			// 获取初始“y”值
			that.options.scale.oY = touches[0].clientY;
		} 
		// 缩放
		else {
			// 获取初始“x”差值
			that.options.scale.oDiffX = that.getDiffX(e);
			// 获取初始“y”差值
			that.options.scale.oDiffY = that.getDiffY(e);
		}
	},
	/**
	 * 触摸移动事件
	 */
	touchmove: function(e) {
		var that = this,
			touches = e.touches || [],
			// 初始“x”值
			oX = that.options.scale.oX,
			// 初始“x”值
			oY = that.options.scale.oY,
			// 获取新“x”值
			nX = touches[0].clientX,
			// 获取新“Y”值
			nY = touches[0].clientY,
			// 获取上一次“x”值
			x = that.options.scale.x,
			// 获取上一次“Y”值
			y = that.options.scale.y,
			// 初始“x”差值
			oDiffX = that.options.scale.oDiffX,
			// 初始“y”差值
			oDiffY = that.options.scale.oDiffY,
			// 获取新“x”差值
			nDiffX = that.getDiffX(e),
			// 获取新“Y”差值
			nDiffY = that.getDiffY(e),
			// “x”移动距离
			diffX = nDiffX - oDiffX,
			// “y”移动距离
			diffY = nDiffY - oDiffY,
			// 手指最大移动距离
			diff = Math.abs(Math.abs(diffX) < Math.abs(diffY) ? diffY : diffX),
			// 上次移动距离
			lastDiff = that.options.scale.lastDiff,
			// 缩放缓冲
			buffer = that.options.scale.buffer,
			// 放大比例
			scaNum,
			// 是放大操作
			isScaBig,
			// “X”最大移动距离
			maxX,
			// “Y”最大移动距离
			maxY;

		// 单指（拖动）
		if(touches.length <= 1) {
			// 计算最大值
			maxX = that.getMaxX();
			maxY = that.getMaxY();

			// 计算“x”值
			x = parseInt((nX - oX) / 10 + x);
			// 计算“y”值
			y = parseInt((nY - oY) / 10 + y);

			// 最大值限制
			if(Math.abs(x) > maxX) {
				x = x < 0 ? maxX * -1 : maxX;
			}
			if(Math.abs(y) > maxY) {
				y = y < 0 ? maxY * -1 : maxY;
			}

			//$('.test:eq(1)').html('x:' + x + ' <= maxX:' + maxX + '; y:' + y + ' <= maxY' + maxY + '; scaNum' + that.options.scale.scaNum);

			// 记录“x”值
			that.options.scale.x = x;
			// 记录“y”值
			that.options.scale.y = y;
			//
			that.translate(x, y);
		} 
		// 多指（缩放）
		else {
			// 是否为放大
			(oDiffY < nDiffY || oDiffX < nDiffX) && (isScaBig = true);
			// 计算移动距离
			diff = isScaBig ? lastDiff + diff : lastDiff - diff;
			// 移动距离最小为0
			(diff < 0) && (scaNum = 0);
			// 记录移动差值
			that.options.scale.lastDiff = diff;
			// 支持1位小数
			scaNum = parseFloat(diff * 0.01 * buffer).toFixed(1);
			// 最小值为1
			(scaNum < 1) && (scaNum = 1);
			// 最大值为15
			(scaNum > 15) && (scaNum = 15);
			// 记录缩放比例
			that.options.scale.scaNum = scaNum;
			// 缩放
			that.scale(scaNum);
		}
	},
	/**
	 * 触摸结束事件
	 */
	touchend: function(e) {
		var that = this,
			touches = e.touches || [],
			// 获取上一次“x”值
			x = that.options.scale.x,
			// 获取上一次“Y”值
			y = that.options.scale.y,
			// 放大比例
			scaNum = that.options.scale.scaNum;
		
		// 移动
		if(touches.length <= 1) {
			(x )
		} 
		// 缩放
		else {

		}
	},
	/**
	 * DOM事件
	 */
	domEvents: function() {
		var that = this;

		that.el.on('touchstart', function(e) {
			that.touchstart(e);
		});

		that.el.on('touchmove', function(e) {
			that.touchmove(e);
		});

		that.el.on('touchend', function(e) {
			that.touchend(e);
		});

		setInterval(function() {
			that.clearScale();
		}, 5000);
	}
});