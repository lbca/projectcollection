// javascript document
/****************************************************
介绍：倒计时插件。
用法：

<span id="countdown1">倒计时开始</span>
<span id="countdown2">倒计时开始</span>
<span id="countdown3">倒计时开始</span>
<span id="countdown4">倒计时开始</span>

//
var countdown = new CountDown({
  countDownList: [{
    sel: '#countdown1',
    endTime: 'xxxx/xx/xx 16:25:20',
    callback: function() {
      console.log('complete 1!')
    }
  }, {
    sel: '#countdown2',
    endTime: '2017/07/25 16:30',
    callback: function() {
      console.log('complete 2!')
    }
  }, {
    sel: '#countdown3',
    endTime: 1500971530446,
    callback: function() {
      console.log('complete 3!')
    }
  }, {
    sel: '#countdown4',
    endTime: '2017/07/25',
    callback: function() {
      console.log('complete 4!')
    }
  }, {
    endTime: '2017/07/25 16:25:20',
    callback: function() {
      console.log('custom event!')
    }
  }]
})
countdown.init()
****************************************************/
var ROOT = ROOT || {},
    WIN = window || {},
    DOC = WIN.document || {},
    EMPTY_FUN = function() {}
//
var util = WIN.util || {}

/**
 * 构造器
 * @param {object} opt 参数
 */
var CountDown = function(opt) {
  var that = this,
      nowTime = Date.now()

  that.opt = $.extend({
    // 当前时间
    _nowTime: nowTime,
    // 完成所有倒计时
    _completeAll: false,
    // 倒计时集合临时对象，格式如下：{ endTime: 0, el: node, complete: false}
    _countDownListTEMP: [],
    // 同步服务器时间，间隔时长，默认：20s
    _syncSysTimeSpeed: 1000 * 20,
    // 服务器时间已经同步
    _sysTimeIsSync: false,
    // 样式
    style: 'ch',
    // 同步服务器时间
    notSyncSysTime: false,
    // 倒计时集合，格式如下：{ sel: '#countDown', endTime: 0, callback: EMPTY_FUN}
    countDownList: []
  }, opt)
}

$.extend(CountDown.prototype, {
  /**
   * 初始化
   */
  init: function() {
    var that = this

    that.load()
    that.event()
  },
  /**
   * 加载
   */
  load: function() {
    var that = this,
        opt = that.opt

    // 同步系统时间
    opt.notSyncSysTime || that.syncSysTime()
    // 倒计时
    that.countDown()
  },
  /**
   * 同步系统时间
   */
  syncSysTime: function() {
    var that = this,
        opt = that.opt

    ;(function timeout() {
      // 获取服务器时间
      that.getSysTime()
      // 未结束时，继续
      opt._completeAll || setTimeout(timeout, opt._syncSysTimeSpeed)
    })()
  },
  /**
   * 获取服务器时间
   */
  getSysTime: function() {
    var that = this,
        opt = that.opt

    // 请求...
    util.api({
      surl: '//gdt.lexue.com/activity/sysTime',
      type: 'get',
      dataType: 'jsonp',
      jsonp: 'cp',
      success: function(response) {
        // 服务器时间
        opt._nowTime = response.time

        // 第一次同步服务器时间
        if(!opt._sysTimeIsSync) {
          // 
          opt._sysTimeIsSync = true
        }

      }
    })
  },
  /**
   * 倒计时
   */
  countDown: function() {
    var that = this,
        opt = that.opt,
        speed = 1000

    // 倒计时处理函数
    that.countDownHandle()

    // 
    setTimeout(function timeout() {
      //
      opt._nowTime += speed
      // 未结束
      if(!opt._completeAll) {
        // 倒计时处理函数
        that.countDownHandle()
        // 递归
        setTimeout(timeout, speed)
      }
    }, speed)

  },
  /**
   * 倒计时处理函数
   */
  countDownHandle: function() {
    var that = this,
        opt = that.opt,
        countDownList = opt.countDownList
    // 
    countDownList.forEach(function(n, i) {
      // 倒计时临时对象
      var countDownTEMP = opt._countDownListTEMP[i],
          // 当前时间
          now = new Date(opt._nowTime),
          //
          year, month, day, hour, minute, second,
          //
          timeSurplus,
          // 比较时间结果
          comparisonTimeResult,
          // 显示内容
          showText = ''

      // 临时变量为空时，新建变量
      if(!countDownTEMP) {
        // 
        countDownTEMP = {
          el: DOC.querySelector(n.sel),
          complete: false,
          // 无限
          infinite: n.endTime.search(/x/i) > -1 ? true : false
        }
        // 获取时间
        $.extend(countDownTEMP, that.getEndtimeObject(n.endTime))
        // 放入临时集合
        opt._countDownListTEMP.push(countDownTEMP)
      }
      // 
      if(countDownTEMP.complete === true) { return true }

      // 比较时间
      comparisonTimeResult = that.comparisonTime(countDownTEMP, now)

      // 结束，结束时间-当前时间，小于等于0，则已经结束
      if(comparisonTimeResult <= 0) {
        // 
        if(comparisonTimeResult === 0 || !countDownTEMP.hasExecuted) {
          // 
          countDownTEMP.infinite || (countDownTEMP.complete = true)
          // 更新全局complete
          that.setGlobalComplete()
          // 设置“已执行”
          countDownTEMP.hasExecuted = true
          //
          n.callback && n.callback()
        } 
      }
      // 未结束 
      else {
        // 计算剩余时间
        timeSurplus = that.computeEndTime(n.endTime) - opt._nowTime

        showText = that.getTimeSurplusShowText(timeSurplus, opt.style)
      }

      // 设置显示
      countDownTEMP.el && (countDownTEMP.el.textContent = showText)
    })
  },
  /**
   * 获取剩余时间显示文字
   * @param  {number} timestamp 时间戳
   * @param  {string} style     样式
   * @return {string}           显示文本
   */
  getTimeSurplusShowText: function(timestamp, style) {
    var year, month, day, hour, minute, second

    // 天
    day = Math.floor(timestamp / (1000 * 60 * 60 * 24))
    // 时
    hour = Math.floor(timestamp % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
    // 分
    minute = Math.floor(timestamp % (1000 * 60 * 60) / (1000 * 60))
    // 秒
    second = Math.floor(timestamp % (1000 * 60) / 1000)

    // 样式
    switch(style) {
      case 'ch':
        return (day + '天'+ hour + '时' + minute + '分' + second + '秒').replace(/^(0[天时分秒])+/g, '')
      // 默认
      default:
        return ''
    }
  },
  /**
   * 比较时间
   * @param  {object} arrivalDateObject 待到达时间
   * @param  {date} targetDate          目标时间
   * @return {boolean}                  是否到达
   */
  comparisonTime: function(arrivalDateObject, targetDate) {
    var arrivalDateNumber = 0,
        targetDateNumber = 0

    // year
    if(arrivalDateObject.year !== undefined) {
      arrivalDateNumber += arrivalDateObject.year * 10000000000
      targetDateNumber += targetDate.getFullYear() * 10000000000
    }
    // month
    if(arrivalDateObject.month !== undefined) {
      arrivalDateNumber += (arrivalDateObject.month - 1) * 100000000
      targetDateNumber += targetDate.getMonth() * 100000000
    }
    // day
    if(arrivalDateObject.day !== undefined) {
      arrivalDateNumber += arrivalDateObject.day * 1000000
      targetDateNumber += targetDate.getDate() * 1000000
    }
    // hour
    if(arrivalDateObject.hour !== undefined) {
      arrivalDateNumber += arrivalDateObject.hour * 10000
      targetDateNumber += targetDate.getHours() * 10000
    }
    // minute
    if(arrivalDateObject.minute !== undefined) {
      arrivalDateNumber += arrivalDateObject.minute * 100
      targetDateNumber += targetDate.getMinutes() * 100
    }
    // minute
    if(arrivalDateObject.second !== undefined) {
      arrivalDateNumber += arrivalDateObject.second
      targetDateNumber += targetDate.getSeconds()
    }

    return arrivalDateNumber - targetDateNumber 
  },
  /**
   * 获取结束时间对象
   * @param  {string} endtime 结束时间字符串，格式：yyyy/MM/dd hh:mm:ss
   * @return {object}         结束时间对象
   */
  getEndtimeObject: function(endtime) {
    var endtimeObject = {},
        year, month, day, hour, minute, second

    endtime = endtime || ''

    // year
    year = Number(endtime.replace(/^(\d{4}).*/g, '$1'))
    // month
    month = Number(endtime.replace(/^\w{4}\/(\d{1,2}).*/g, '$1'))
    // day
    day = Number(endtime.replace(/^\w{4}\/\w{1,2}\/(\d{1,2}).*/g, '$1'))
    // hour
    hour = Number(endtime.replace(/^\w{4}\/\w{1,2}\/\w{1,2}\s(\d{1,2}).*/g, '$1'))
    // minute
    minute = Number(endtime.replace(/^\w{4}\/\w{1,2}\/\w{1,2}\s\w{1,2}:(\d{1,2}).*/g, '$1'))
    // second
    second = Number(endtime.replace(/^\w{4}\/\w{1,2}\/\w{1,2}\s\w{1,2}:\w{1,2}:(\d{1,2})/g, '$1'))

    // 赋值
    isNaN(year) || (endtimeObject.year = year)
    isNaN(month) || (endtimeObject.month = month)
    isNaN(day) || (endtimeObject.day = day)
    isNaN(hour) || (endtimeObject.hour = hour)
    isNaN(minute) || (endtimeObject.minute = minute)
    isNaN(second) || (endtimeObject.second = second)

    return endtimeObject
  },
  /**
   * 计算结束时间
   * @param  {string|number} endTime 结束时间
   * @return {string|number}         计算后结束时间
   */
  computeEndTime: function(endTime) {
    var that = this,
        opt = that.opt,
        // 
        nowDate = new Date(opt._nowTime)
    
    endTime = endTime || opt._nowTime

    // 字符串类型
    if(typeof endTime === 'string') {
      // year
      endTime = endTime.replace(/^x{4}/g, nowDate.getFullYear())
      // month
      endTime = endTime.replace(/^(\d{4}\/)x{1,2}/g, '$1' + (nowDate.getMonth() + 1))
      // day
      endTime = endTime.replace(/^(\d{4}\/\d{1,2}\/)x{1,2}/g, '$1' + nowDate.getDate())
      // hour
      endTime = endTime.replace(/^(\d{4}\/\d{1,2}\/\d{1,2}\s{1})x{1,2}/g, '$1' + nowDate.getHours())
      // minute
      endTime = endTime.replace(/^(\d{4}\/\d{1,2}\/\d{1,2}\s{1}\d{1,2}:)x{1,2}/g, '$1' + nowDate.getMinutes())
      // second
      endTime = endTime.replace(/^(\d{4}\/\d{1,2}\/\d{1,2}\s{1}\d{1,2}:\d{1,2}:)x{1,2}/g, '$1' + nowDate.getSeconds())
      //
      endTime = new Date(endTime).getTime()
    }

    return endTime
  },
  /**
   * 设置全局完成状态
   */
  setGlobalComplete: function() {
    var that = this,
        opt = that.opt,
        countDownListTEMP = opt._countDownListTEMP

    opt._completeAll = countDownListTEMP.length === opt.countDownList.length && countDownListTEMP.every(function(n, i) {
      return n.complete
    })
  },
  /**
   * 增加倒计时项
   * @param {object} countDown 倒计时项
   */
  addCountDown: function(countDown) {
    var that = this

    countDown && that.opt.countDownList.push(countDown)
  },
  /**
   * 事件
   */
  event: function() {
    var that = this
    // nothing...
  }
})

// export window
WIN.CountDown = CountDown
