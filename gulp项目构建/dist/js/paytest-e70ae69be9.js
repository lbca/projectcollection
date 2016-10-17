/**
 * yidao
 * created by 用车前端组
 */
"use strict";var root=window||{},util=root.util||{};root.EMP_FUN=function(){};var PayTest=function(t){this.options=$.extend({sel:"",hrefParma:util.getHrefParma(),otn:"",requestState:{}},t),this.sel=this.options.sel,this.el=$(this.sel)};$.extend(PayTest.prototype,{init:function(){var t=this;t.load(),t.addEvent()},load:function(){var t=this,o=t.options.hrefParma;t.options.otn=o.otn||""},pay:function(t){util.api({surl:root.WXP_API_PATH+"testwxpaysta",data:{otn:t},type:"get",async:!1,success:function(t){var o=t.rpco;switch(o){case 200:util.alert("支付成功");break;default:util.tip("支付失败")}},error:function(){}})},addEvent:function(){var t=this,o=util.getClick();t.options.hrefParma;t.el.on(o,"#toPay",function(){t.pay(t.options.otn)})}});