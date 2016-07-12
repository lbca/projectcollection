module.exports = function(grunt) {
    // 
    var VERSION = "v1";
    // 文件地址
    var type = 1,
        html,
        htmlMin,
        /*json,
        jsonMin,*/
        css,
        cssMin,
        img,
        imgMin,
        js,
        jsMin,
        module,
        deployModule,
        // 部署日期
        deployDate = new Date();

    switch(type) {
        // 员工
        case 1:
            module = 'housekeeperforemployee';
            deployModule = 'employee';
            break;
        // 管家
        case 2:
            module = 'housekeeper';
            deployModule = 'guanjia';
            break;
    }

    // 部署日期
    deployDate = [deployDate.getFullYear(), deployDate.getMonth() + 1, deployDate.getDate()].join();

    html = module;
    htmlMin = 'D://webappdeploy/' + deployDate +'/html/' + deployModule + '/' + VERSION;

    //json = module + '/json';

    css = module + '/css';
    cssMin = 'D://webappdeploy/' + deployDate +'/css/' + deployModule + '/' + VERSION;

    img = module + '/img';
    imgMin = 'D://webappdeploy/' + deployDate +'/img/' + deployModule + '/' + VERSION;

    js = module + '/js';
    jsMin = 'D://webappdeploy/' + deployDate +'/js/' + deployModule + '/' + VERSION;


    //配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 清除目录
        clean: {
            html: htmlMin + '/**',
            css: cssMin,
            js: jsMin,
            img: imgMin,
            options: {
                force: true
            }
        },

        // css压缩
        cssmin: {
            options: {
                advanced: false,
                aggressiveMerging: false,
                compatibility: '*',
                restructuring: false,
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                    expand: true, // 启用动态扩展
                    cwd: css, // 源文件匹配都相对此目录
                    //src: ['**/*.css'], // 匹配模式
                    src: ['**'], // 匹配模式
                    dest: cssMin, // 目标路径前缀
                    ext: '.css', // 目标文件路径中文件的扩展名
                    extDot: 'last', // 扩展名始于文件名的第一个点号
                    filter: 'isFile'// 为文件
                }]
            }
        },

        // js压缩
        uglify: {
            options: {
                banner: '/**\n * <%= pkg.name %>\n * created by 国美管家前端组 on <%= grunt.template.today("yyyy-mm-dd") %>\n */\n',
            },
            bulid: {
                files: [{
                    expand: true, // 启用动态扩展
                    cwd: js, // 源文件匹配都相对此目录
                    //src: ['**/*.js'], // 匹配模式
                    src: ['**'], // 匹配模式
                    dest: jsMin, // 目标路径前缀
                    ext: '.js', // 目标文件路径中文件的扩展名
                    extDot: 'last', // 扩展名始于文件名的第一个点号
                    filter: 'isFile'// 为文件
                }]
            }
        },

        // img压缩
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: img,
                    //src: ['**/*.{png,jpg,jpeg,gif}'], 
                    src: ['**'], 
                    dest: imgMin,
                    filter: 'isFile'
                }]
            }
        },

        // copy
        copy: {
          main: {
            files: [
            // html文件
            {
              expand: true,
              cwd: html,
              src: ['**/*.html'],
              dest: htmlMin,
              filter: 'isFile'
            }, 
            // json文件夹
            {
              expand: true,
              cwd: html,
              src: ['json/**'],
              dest: htmlMin
            }],
            // 更换版本号
            options: {
                process: function (content, srcpath) {
                    // 版本号加一
                    return content.replace(/(\.(js|css)\?v=)\d+/g, function(str, $1, $2) {
                        return $1 + new Date().getTime();
                    });
                }
            }
          }
        }

    });

    // 加载指定插件任务  
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 默认执行的任务  
    grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'imagemin', 'copy']);
    //grunt.registerTask('default', ['uglify']);
};