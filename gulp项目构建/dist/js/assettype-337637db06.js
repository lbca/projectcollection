/**
 * yidao
 * created by 用车前端组
 */
"use strict";var root=window||{},util=root.util||{},AssetType=function(t){this.options=$.extend({hrefParma:util.getHrefParma(),sel:""},t),this.sel=this.options.sel,this.el=$(this.sel)};$.extend(AssetType.prototype,{init:function(){var t=this;t.load(),t.addEvent()},load:function(){var t=this;t.options.hrefParma},save:function(){util.api({url:"",type:"post",success:function(t){}})},switchOperate:function(t){switch(t){case"entityAsset":util.href("assetlist.html")}},addEvent:function(){var t=this,i=util.getClick();t.options.hrefParma;t.el.on(i,"#list li",function(){t.switchOperate(this.id)})}});