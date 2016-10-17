/**
 * yidao
 * created by 用车前端组
 */
"use strict";var root=window||{},util=root.util||{},CertificateType=function(t){this.options=$.extend({hrefParma:util.getHrefParma(),sel:""},t),this.sel=this.options.sel,this.el=$(this.sel)};$.extend(CertificateType.prototype,{init:function(){var t=this;t.load(),t.addEvent()},load:function(){var t=this;t.options.hrefParma},save:function(){util.api({url:"",type:"post",success:function(t){}})},addEvent:function(){var t=this,i=util.getClick();t.options.hrefParma;$("#list li").on(i,function(){var t=$(this);util.href("certificatedetail.html",{actype:t.attr("val")})})}});