/**
 * yidao
 * created by 用车前端组
 */
"use strict";var root=window||{},util=root.util||{},AccSuccess=function(t){this.options=$.extend({hrefParma:util.getHrefParma(),sel:""},t),this.sel=this.options.sel,this.el=$(this.sel)};$.extend(AccSuccess.prototype,{init:function(){var t=this;t.load(),t.addEvent()},load:function(){var t=this;t.options.hrefParma},addEvent:function(){var t=this,i=util.getClick();t.options.hrefParma;t.el.on(i,"#ok",function(){util.href("acclist.html")})}});