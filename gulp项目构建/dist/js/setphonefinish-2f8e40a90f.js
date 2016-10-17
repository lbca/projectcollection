/**
 * yidao
 * created by 用车前端组
 */
"use strict";var root=window||{},util=root.util||{},SetPhoneFinish=function(t){this.options=$.extend({sel:"",hrefParma:util.getHrefParma()},t),this.sel=this.options.sel,this.el=$(this.sel)};$.extend(SetPhoneFinish.prototype,{init:function(){var t=this;t.load(),t.addEvent()},load:function(){var t=this,e=t.options.hrefParma;$("#phone").html(e.phone||""),"del"===e.operate?$("#del").show():$("#mod").show()},addEvent:function(){var t=this,e=util.getClick();t.options.hrefParma;t.el.on(e,".js-ok",function(){util.href("set.html")})}});