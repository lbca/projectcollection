var root = window || {},
	util = root.util || {};

var Set = function(opt) {
	this.options = $.extend({
		sel: '',
		hrefParma: util.getHrefParma(),
		// 性别枚举
		sex: {
			0: '未设置',
			1: '女',
			2: '男'
		},
		// 用户对象
		userdtal: {},
		// 滚动插件
		iScrollZoom: null,
        // 请求状态，用于ajax请求
        requestState: {
            changePwdOper: true
        }
	}, opt);

	this.sel = this.options.sel;
	this.el = $(this.sel);
};

$.extend(Set.prototype, {
	/**
	 * 初始化
	 */
	init: function() {
		var that = this;
		that.load();
		that.addEvent();
	},
	/**
	 * 加载
	 */
	load: function() {
		var that = this;
		// 加载用户详情
		that.getUserDetail();
	},
	/**
	 * 渲染个人详情
	 * @parma object {1} body 个人详情对象
	 */
	renderUserDetail: function(body) {
		var that = this,
			sex = that.options.sex[body.sex] || '未设置';
		// 用户头像
		body.hporturl && $('#headPort .userpic').attr('src', body.hporturl);
		// 昵称
		body.nick && $('#nickName .value').html(body.nick);
		// 美服号
		body.mbsn && $('#meiFuNum .value').html(body.mbsn);
		// 手机号
		body.mobile && $('#phoneNum .value').html(util.strEncrypt(body.mobile, 3, 4));
		// 邮箱
		body.email && $('#email .value').html(body.email);
		// 性别
		$('#sex .value').html(sex);
		// 地区
		body.region && $('#area .value').html(body.region);
		// 签名
		body.sign && $('#signature .value').html(body.sign);

		// 取消触摸效果
		body.mbsn && $('#meiFuNum').attr('nocge', true);
		body.mobile && $('#phoneNum').attr('nocge', true);
		body.email && $('#email').attr('nocge', true);
	},
	/**
	 * 获取用户详情
	 */
	getUserDetail: function() {
		var that = this;
		// 请求数据
		util.api({
			surl: root.MB_API_PATH + 'userdtal',
			//surl: 'js/a.json',
			type: 'get',
			success: function(response) {
				//response = response || {};
				var rpco = response.rpco,
					body = response.body || {};
				// 处理
				switch(rpco) {
					// 正常
					case 200:
						that.options.userdtal = body;
						that.renderUserDetail(body);
						break;
					default:
						util.tip('查询失败')
				}
			}
		});
	},
	/**
	 * 密码变更业务处理
	 */
	changePwdOper: function() {
		var that = this;

		// 请求...
		util.api({
            surl: root.MB_API_PATH + 'checkpwd',
            type: 'get',
            beforeSend: function() {
            	that.options.requestState.changePwdOper = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {},
                    ispwd = body.ispwd,
                    mod = body.mod,
                    ourl = '';
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                    	// 新设密码
						if(ispwd === 0 && mod === 1) {
							ourl = 'setpwd.html';
						} 
						// 修改密码
						else if(ispwd === 1 && mod === 1) {
							ourl = 'setpwdmod.html';
						}
						ourl && util.href(ourl);
                        break;
                    default:
                        util.tip('服务器开会小差···')
                }
            }
        });
	},
    /**
     * 创建专属链接
     */
    creatLink: function() {
        var that = this;



/*// debug start
var response = {
    rpco: 200,
    body: {
        tk: '564654564654564564564645646465'
    }  
};
var rpco = response.rpco,
    body;

// 处理
switch(rpco) {
    case 200:
        body = response.body || {};
        // 跳转分享页
        body.tk && util.href('invite.html', {tk: body.tk});
        break;
    default:
        util.tip('生成失败')
}
return;
// debug end
*/


        // 请求...
        util.api({
            surl: root.BSNS_API_PATH + 'getk',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco,
                    body;

                // 处理
                switch(rpco) {
                    case 200:
                        body = response.body || {};
                        // 跳转分享页
                        body.tk && util.href('invite.html', {tk: body.tk});
                        break;
                    default:
                        util.tip('生成失败')
                }
            }
        }); 
    },
	/**
	 * 业务处理
	 * @parma string {1} elId 元素id
	 */
	switchOperate: function(elId) {
		var that = this,
			parmas = {};

		switch (elId) {
			// 头像
			case "headPort":
				// 展示图片
				that.dlgimg($('#headPort img').get(0).src);
				break;
			// 昵称
			case "nickName":
				that.options.userdtal.nick && (parmas.nick = util.encode(that.options.userdtal.nick));
				util.href('setnick.html', parmas);
				break;
			// 美服号
			case "meiFuNum":
				that.options.userdtal.mbsn || util.href('setmeifunum.html');
				break;
			// 签名
			case "signature":
				that.options.userdtal.sign && (parmas.sign = util.encode(that.options.userdtal.sign));
				util.href('setsignature.html', parmas);
				break;
			// 手机号
			case "phoneNum":
				/*that.options.userdtal.mobile && (parmas.mobile = that.options.userdtal.mobile);
				that.options.userdtal.mbsn && (parmas.mbsn = that.options.userdtal.mbsn);
				util.href('setphone.html', parmas);*/
				that.options.userdtal.mbsn && (parmas.mbsn = that.options.userdtal.mbsn);
				that.options.userdtal.mobile || util.href('setphone.html', parmas); 
				break;
			// 常用地址
			case "address":
				util.href('addresslist.html');
				break;
			// 密码变更
			case "changePwd":
				that.options.requestState.changePwdOper && that.changePwdOper();
				break;
			// 性别
			case "sex":
				that.options.userdtal.sex && (parmas.sex = that.options.userdtal.sex);
				util.href('setsex.html', parmas);
				break;
			// 邮箱
			case "email":
				that.options.userdtal.email || util.href('setemail.html');
				break;
			// 证件
			case "papers":
				util.href('certificatelist.html');
				break;
			// 地区
			case "area":
				util.href('areaprovince.html', {
					b: '1'
				}, true);
				break;
			// 证件
			case "certifi":
				util.href('certificatelist.html');
				break;
			// 我的邀请
			case "myshare":
				// 生成我的邀请
				that.creatLink();
				break;
			// 卡号绑定
			case "kahaobd":
				// 打开卡号绑定页面
				util.href('acclist.html', {
					cbu: 'javascript:window.history.back();'
				});
				break;
			// 其他
			default:
				// nothing		
		}
	},
	/**
	 * 图片弹层
	 * @parma {string}{1} imgSrc 图片地址
	 */
	dlgimg: function(imgSrc) {
		var that = this,
			dlgimgHTML = '';
		// 清除
		$('.dialog-img').remove();
		// 放入
		dlgimgHTML = '<div class="dialog-img">'
            	   +	'<div class="tablecell">'
                   +        '<img src="' + imgSrc + '">'
            	   +    '</div>'
        		   + '</div>'
        // 放入
        $('body').append(dlgimgHTML);

        // 注册放大插件
        that.options.iScrollZoom = new IScroll('.dialog-img', { zoom: true, scrollX: true });
	},
	/**
	 * 事件代码
	 */
	addEvent: function() {
		var that = this,
			click = util.getClick();

		/*“值”单击事件*/
		that.el.on(click, '.container li', function() {
			that.switchOperate(this.id);
		});

		/*关闭图片查看*/
		that.el.on(click, '.dialog-img', function() {
			// 销毁缩放插件
			that.options.iScrollZoom.destroy();
			// 移除缩放插件
			$('.dialog-img').remove();
		});
	}
});