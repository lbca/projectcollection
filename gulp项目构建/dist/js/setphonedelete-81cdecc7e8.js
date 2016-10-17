/**
 * yidao
 * created by 用车前端组
 */
"use strict";var root=window||{},util=root.util||{},SetPhoneDelete=function(t){this.options=$.extend({hrefParma:util.getHrefParma(),sel:""},t),this.sel=this.options.sel,this.el=$(this.sel)};$.extend(SetPhoneDelete.prototype,{init:function(){var t=this;t.load(),t.addEvent()},load:function(){var t=this;t.options.hrefParma},save:function(){util.api({url:"",type:"post",success:function(t){}})},addEvent:function(){var t=this,e=util.getClick();t.options.hrefParma;$("#ok").on(e,function(){util.href("set.html")})}});