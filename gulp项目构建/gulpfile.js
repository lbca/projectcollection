var gulp = require('gulp'),
    // gulp工具
    gulpUtil = require('gulp-util'),
    // 同步测试工具
    bs = require('browser-sync'),
    // 删除工具
    del = require('del'),
    // 头部文件添加
    header = require('gulp-header'),
    // 模块化加载
    webpack = require('webpack'),
    // 模块化加载配置文件
    webpackConfig = require('./webpack.config'),
    // js语法检测
    jshint = require('gulp-jshint'),
    // js压缩
    uglify = require('gulp-uglify'),
    // js编译
    babel = require('gulp-babel'),
    // css语法检测
    csslint = require('gulp-csslint'),
    // css压缩
    cleanCss = require('gulp-clean-css'),
    // css前缀补充
    autoprefixer = require('gulp-autoprefixer'),
    // html压缩
    htmlmin = require("gulp-htmlmin"),
    // image压缩
    imagemin = require('gulp-imagemin'),
    // png图片压缩插件
    pngquant = require('imagemin-pngquant'),
    // 静态资源路径变更
    rev = require('gulp-rev'),
    // 静态资源路径替换
    revCollector = require('gulp-rev-collector'),
    // 顺序执行
    gulpSequence = require('gulp-sequence');

// Gulp 工具
var GulpTool = function() {
	var that = this,
		options = {},
		url = {};
	// 属性
	this.options = {
		// 当前时间戳
		ts: Date.now(),
		// 路径
		url: {
			// 开发目录
			src: 'src/',
			// 打包目录
			dist: 'dist/',
			// 所有匹配
			allMatch: '**/*',
			// html
			html: '',
			// html文件匹配
			htmlMatch: '*.html',
			// css
			css: 'css/',
			// css文件匹配
			cssMatch: '**/*.css',
			// css文件线上路径
			cssOnline: '//css.yongche.com/',
			// js
			js: 'js/',
			// js文件匹配
			jsMatch: '**/*.js',
			// js文件线上路径
			jsOnline: '//js.yongche.com/',
			// img
			img: 'img/',
			// img文件匹配
			imgMatch: '**/*',
			// img文件线上路径
			imgOnline: '//img.yongche.com/',
			// json
			json: 'json/',
			// json匹配
			jsonMatch: '**/*.json',
			// 变更文件名json文件
			rev: 'rev/',
			// 监听文件目录
			watchGlob: 'src/**/*',
            // 临时文件夹（用于删除）
            tempArray: ['src/js/public']
		},
		// css压缩配置
		mcCfg: {
		    advanced: false,
		    aggressiveMerging: false,
		    compatibility: '*',
		    /*compatibility: 'ie8',*/
		    restructuring: false,
		    shorthandCompacting: false,
		    roundingPrecision: -1
		},
		// css前缀补充配置
		afCfg: {
	        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
	        cascade: true,
	        remove: true
	    },
	    // html压缩配置
	    hmCfg: {
			minifyCSS: {},
			minifyJS: true,
			useShortDoctype: true,
			collapseWhitespace: true
		},
		// 图片压缩配置
		imCfg: {
			plugins: [imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()],
	        //verbose: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    },
	    // 文件名替换配置
	    rcCfg: {
           replaceReved: true,
           dirReplacements: {}
        },
	    // 热部署配置
	    bsCfg: {
			// 调试ui
			// ui: {
			// 	port: 3001
			// },
			ui: false,
			// 服务器
			server: {
				baseDir: ''
			},
			// 端口号
			port: 3000,
			// log等级
			logLevel: 'info',
			// log前缀
			//logPrefix: 'browsersync:',
			// 文件变动记录
			logFileChanges: true,
			// 在线模式
			online: false,
			// 启动时自动代开网址
			open: true,
			// 浏览器提示
			notify: false/*,
			// 代理
			proxy: 'baidu.com'*/
		}
	};

	options = that.options;
	url = options.url;

	// 扩展
	options.hmCfg.minifyCSS = options.mcCfg;
	//
	options.bsCfg.server.baseDir = options.url.src;
	//
	options.rcCfg.dirReplacements[url.css] = url.cssOnline;
	options.rcCfg.dirReplacements[url.js] = url.jsOnline;
    options.rcCfg.dirReplacements[url.img] = url.imgOnline;
    options.rcCfg.dirReplacements['../' + url.img] = url.imgOnline;
};

/**
 * 扩展
 */
GulpTool.prototype = {
	/**
	 * 文件清空
	 */
    clean: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 配置文件
			delCfg = {
				force: true
			};
		// 清空目标目录
		return del([url.dist], delCfg);
    },
    /**
     * 清理临时文件夹
     */
    cleanTempFolder: function() {
        var that = this,
            // 构造属性
            options = that.options,
            // 路径
            url = options.url,
            // 配置文件
            delCfg = {
                force: true
            };
        // 清空目标目录
        return del(url.tempArray, delCfg);
    },
    /**
     * js语法检测
     */
    jshnit: function() {
        var that = this,
            // 构造属性
            options = that.options,
            // 路径
            url = options.url;
        
        return gulp.src(url.src + url.js + url.jsMatch)
                   .pipe(jshint())
                   .pipe(jshint.reporter());
    },
    /**
     * 模块化加载
     */
    webpack: function(callback) {
        var that = this,
            // 构造属性
            options = that.options,
            // 路径
            url = options.url;

        // 执行
        webpack(webpackConfig,  function(err, stats) {
            if(err) {
                throw new gutil.PluginError("webpack", err);
            }
            // gulpUtil.log("[webpack]", stats.toString({
            //     // output options
            // }));
            callback();
        });
    },
    /**
	 * js压缩
	 */
    uglify: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 头部模板
    		banner = '',
    		// 头部模板数据
    		data = {},
    		// 日期
    		now = new Date();

    	banner += '/**\n'
	 			+ ' * yidao\n'
                //+ ' * created by 用车前端组 on ' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '\n'
	 			+ ' * created by 用车前端组\n'
	 			+ ' */\n';
		
    	return gulp.src(url.src + url.js + url.jsMatch)
                   // 编译
                   .pipe(babel())
                   // 压缩
		           .pipe(uglify().on('error', function(err) {
                        // 打印错误log
                        var cause = err.cause || {};
                        //
                        gulpUtil.log(gulpUtil.colors.bold.bgRed('message:' + cause.message));
                        gulpUtil.log(gulpUtil.colors.bold.bgRed('filename:' + cause.filename));
                        gulpUtil.log(gulpUtil.colors.bold.bgRed('line:' + cause.line));
                        gulpUtil.log(gulpUtil.colors.bold.bgRed('col:' + cause.col));
                        gulpUtil.log(gulpUtil.colors.bold.bgRed('pos:' + cause.pos));
                   }))
		           // 添加头部注释
		           .pipe(header(banner, data))
		           .pipe(rev())
    	           .pipe(gulp.dest(url.dist + url.js))
		           .pipe(rev.manifest())
        		   .pipe(gulp.dest(url.dist + url.rev + url.js));
    },
    /**
     * css语法检测
     */
    csslint: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url;
		
    	return gulp.src(url.src + url.css + url.cssMatch)
		           .pipe(csslint())
		           .pipe(csslint.formatter());
    },
    /**
	 * css压缩
	 */
    cleanCss: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// css压缩配置
            mcCfg = options.mcCfg,
    		// 头部模板
    		banner = '',
    		// 头部模板数据
    		data = {},
    		// 日期
    		now = new Date();

    	banner += '/**\n'
	 			+ ' * yidao\n'
                //+ ' * created by 用车前端组 on ' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '\n'
	 			+ ' * created by 用车前端组\n'
	 			+ ' */\n';
		
    	return gulp.src(url.src + url.css + url.cssMatch)
    	           .pipe(cleanCss(mcCfg))
		           // 添加头部注释
		           .pipe(header(banner, data))
		           .pipe(rev())
    	           .pipe(gulp.dest(url.dist + url.css))
		           .pipe(rev.manifest())
        		   .pipe(gulp.dest(url.dist + url.rev + url.css));
    },
    /**
	 * css前缀补充
	 */
    autoprefixer: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 配置
    		afCfg = options.afCfg;
		
    	return gulp.src(url.dist + url.css + url.cssMatch)
                   .pipe(autoprefixer(afCfg))
                   .pipe(gulp.dest(url.dist + url.css));
    },
    /**
	 * html压缩
	 */
    htmlmin: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 配置
    		hmCfg = options.hmCfg;

    	return gulp.src(url.src + url.html + url.htmlMatch)
    	           .pipe(htmlmin(hmCfg))
    	           .pipe(gulp.dest(url.dist + url.html));
    },
    /**
	 * 图片压缩
	 */
    imagemin: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 配置
    		imCfg = options.imCfg;
		
    	return gulp.src(url.src + url.img + url.imgMatch)
                   .pipe(imagemin(imCfg))
		           .pipe(rev())
    	           .pipe(gulp.dest(url.dist + url.img))
		           .pipe(rev.manifest())
        		   .pipe(gulp.dest(url.dist + url.rev + url.img));
    },
    /**
     * css静态资源路径替换
     */
    cssRevCollector: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 配置
    		rcCfg = options.rcCfg;

    	return gulp.src([url.dist + url.rev + url.jsonMatch, 
    					 url.dist + url.css + url.cssMatch])
                   .pipe(revCollector(rcCfg))
                   .pipe(gulp.dest(url.dist + url.css));
    },
    /**
     * html静态资源路径替换
     */
    htmlRevCollector: function() {
        var that = this,
            // 构造属性
            options = that.options,
            // 路径
            url = options.url,
            // 配置
            rcCfg = options.rcCfg;

        return gulp.src([url.dist + url.rev + url.jsonMatch, 
                         url.dist + url.html + url.htmlMatch])
                   .pipe(revCollector(rcCfg))
                   .pipe(gulp.dest(url.dist + url.html));
    },
    /**
	 * 热部署
	 */
    bs: function() {
    	var that = this,
    		// 构造属性
    		options = that.options,
    		// 路径
    		url = options.url,
    		// 配置
    		bsCfg = options.bsCfg;
		
    	// 启测试服务器
	    bs.init(bsCfg);

	    // 文件监控
		gulp.watch(url.watchGlob, {}, function() {
			// 刷新浏览器
			bs.reload();
		});
    }
};

var gulpTool = new GulpTool();

// 文件清空
gulp.task('clean', function() {
	return gulpTool.clean();
});

// 模块化
gulp.task('webpack', function(callback) {
    gulpTool.webpack(callback);
});

// js语法检测
gulp.task('jshnit', function() {
	// 
	return gulpTool.jshnit();
});

// js压缩
gulp.task('uglify', function() {
    // 
    return gulpTool.uglify();
});

// css语法检测
gulp.task('csslint', function() {
	// 
	return gulpTool.csslint();
});

// css压缩
gulp.task('cleanCss', function() {
	// 
	return gulpTool.cleanCss();
});

// css前缀补充
gulp.task('autoprefixer', function() {
    // 
    return gulpTool.autoprefixer();
});

// html压缩
gulp.task('htmlmin', function () {
	// 
    return gulpTool.htmlmin();
});

// 图片压缩
gulp.task('imagemin', function () {
	// 
    return gulpTool.imagemin();
});

// css静态资源路径替换
gulp.task('cssRevCollector', function () {
	// 
    return gulpTool.cssRevCollector();
});

// html静态资源路径替换
gulp.task('htmlRevCollector', function () {
    // 
    return gulpTool.htmlRevCollector();
});

// 临时文件夹清理
gulp.task('cleanTempFolder', function() {
    return gulpTool.cleanTempFolder();
});

// 热部署
gulp.task('bs', function() {
	// 配置文件
	gulpTool.bs();
});

// 打包
gulp.task('build', gulpSequence('clean', /*'jshnit', */'webpack', 'uglify', 'cleanCss', 'autoprefixer', 
    'htmlmin', 'imagemin', 'cssRevCollector', 'htmlRevCollector', 'cleanTempFolder'));

// 默认任务
gulp.task('default', ['build']);