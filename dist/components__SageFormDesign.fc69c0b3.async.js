(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"359h":function(e,a,t){"use strict";t.r(a);var n=t("k1fw"),r=t("jrin"),l=t("tJVT"),o=t("q1tI"),i=t.n(o),c=t("R+Pm"),d=t("ngQI"),s=t("0Owb"),u=t("EwqE"),m=t.n(u),p=Object(c["a"])({scriptUrl:"//at.alicdn.com/t/font_2351139_fhn4kx6vwdb.js"}),f=function(e){var a=e.id,t=e.label,n=e.dragIndex,r=e.icon;return i.a.createElement(d["b"],{draggableId:a,index:n},(function(e,a){return i.a.createElement("div",Object(s["a"])({ref:e.innerRef,className:m.a.componentsitem},e.draggableProps,e.dragHandleProps),i.a.createElement("div",{className:m.a.componentsbody},i.a.createElement(p,{type:r,style:{fontSize:"16px"}}),i.a.createElement("span",{className:m.a.componentstext},t)))}))},b=function(e){var a=Object(o["useState"])(e.items),t=Object(l["a"])(a,2),n=t[0];t[1];return i.a.createElement(d["c"],{droppableId:"droppable-components",isDropDisabled:!0},(function(e,a){return i.a.createElement("div",Object(s["a"])({ref:e.innerRef,className:m.a.componentsdraggable},e.droppableProps),n.map((function(e,a){return i.a.createElement(f,{id:e.id,label:e.label,key:e.id,dragIndex:a,icon:e.icon})})),e.placeholder)}))},g=b,h=(t("14J3"),t("BMrR")),E=(t("jCWc"),t("kPKH")),x=(t("giR+"),t("fyUT")),v=(t("y8nQ"),t("Vl3Y")),_=(t("5NDa"),t("5rEg")),w=(t("n+Aq"),{required:"${label}\u662f\u5fc5\u586b\u9879!"}),y=_["a"].TextArea,I=function(e,a){var t=e.board,r=e.items,c=v["a"].useForm(),u=Object(l["a"])(c,1),p=u[0],f=function(a){var t=a[0].name[0],n=a[0].value;e.onChangeComponentForm(t,n)},b=function(a){e.changeBoard(a)},g=function(e,a,r){return Object(n["a"])({padding:"12px 10px 0",borderRadius:"6px",outline:"none",background:e||a===t.id?"#f6f7ff":"#FFFFFF"},r)};return Object(o["useImperativeHandle"])(a,(function(){return{getForm:function(){return p}}})),i.a.createElement(d["c"],{droppableId:"droppable-board",direction:"vertical"},(function(e,a){return i.a.createElement("div",Object(s["a"])({ref:e.innerRef,className:m.a.centorboardrow},e.droppableProps),i.a.createElement("div",{style:{paddingTop:"10px"}},i.a.createElement(v["a"],{form:p,validateMessages:w,className:"sage-editor-form",labelAlign:"right",labelCol:{span:3},wrapperCol:{span:21},onFieldsChange:f},i.a.createElement(h["a"],{span:24},r.map((function(e,a){return i.a.createElement(d["b"],{key:e.id,draggableId:e.id,index:a},(function(a,t){var n=e.config,r=null,l=n.componentWidth?{width:n.componentWidth}:{};switch(e.type){case"input":r=i.a.createElement(_["a"],{placeholder:n.placeholder,style:l,maxLength:n.maxLength,allowClear:n.clearable,readOnly:n.readonly,disabled:n.disabled});break;case"textarea":r=i.a.createElement(y,{placeholder:n.placeholder,style:l,maxLength:n.maxLength,autoSize:{minRows:n.minRows,maxRows:n.maxRows},allowClear:n.clearable,readOnly:n.readonly,disabled:n.disabled});break;case"password":r=i.a.createElement(_["a"].Password,{placeholder:n.placeholder,style:l,maxLength:n.maxLength,autoSize:{minRows:n.minRows,maxRows:n.maxRows},allowClear:n.clearable,readOnly:n.readonly,disabled:n.disabled});break;case"number":r=i.a.createElement(x["a"],{defaultValue:n.defaultValue,placeholder:n.placeholder,style:l,min:n.min,max:n.max,step:n.step,precision:n.precision,readOnly:n.readonly,disabled:n.disabled});break;default:break}return i.a.createElement(E["a"],Object(s["a"])({ref:a.innerRef},a.draggableProps,a.dragHandleProps,{span:24,className:m.a.boardcol,style:g(t.isDragging,e.id,a.draggableProps.style),onClick:function(){return b(e.id)}}),i.a.createElement(v["a"].Item,{label:n.label,name:n.fieldId,initialValue:n.defaultValue},r))}))}))))),e.placeholder)}))},C=i.a.forwardRef(I),O=(t("Znn+"),t("ZTPi")),F=t("GPtQ"),V={input:{label:"\u5355\u884c\u6587\u672c",fieldId:"",placeholder:"\u8bf7\u8f93\u5165\u5355\u884c\u6587\u672c",componentWidth:"100%",defaultValue:"",maxLength:"",clearable:!0,readonly:!1,disabled:!1,required:!0},textarea:{label:"\u591a\u884c\u6587\u672c",fieldId:"",placeholder:"\u8bf7\u8f93\u5165\u591a\u884c\u6587\u672c",componentWidth:"100%",defaultValue:"",maxLength:"",minRows:4,maxRows:4,clearable:!0,readonly:!1,disabled:!1,required:!0},password:{label:"\u5bc6\u7801",fieldId:"",placeholder:"\u8bf7\u8f93\u5165\u5bc6\u7801",componentWidth:"100%",defaultValue:"",maxLength:"",clearable:!0,readonly:!1,disabled:!1,required:!0},number:{label:"\u8ba1\u6570\u5668",fieldId:"",placeholder:"\u8ba1\u6570\u5668",componentWidth:"200px",defaultValue:"",min:1,max:100,step:1,precision:"",readonly:!1,disabled:!1,required:!0}},j=V,k=F["a"].deepClone(j["input"]),R=function(e,a){var t=e.fieldValues,n=void 0===t?k:t,r=v["a"].useForm(),c=Object(l["a"])(r,1),d=c[0],u={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:16}}},m=function(a){e.onFieldsChange(a[0].name[0],a[0].value)},p=function(e){};return Object(o["useImperativeHandle"])(a,(function(){return{getForm:function(){return d}}})),i.a.createElement(v["a"],Object(s["a"])({},u,{form:d,name:"propsForm",onFieldsChange:m,onFinish:p}),i.a.createElement(v["a"].Item,{name:"fieldId",label:"\u5b57\u6bb5\u540d",initialValue:n.fieldId},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"label",label:"\u6807\u9898",initialValue:n.label},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"placeholder",label:"\u5360\u4f4d\u63d0\u793a",initialValue:n.placeholder},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"componentWidth",label:"\u7ec4\u4ef6\u5bbd\u5ea6",initialValue:n.componentWidth},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"defaultValue",label:"\u9ed8\u8ba4\u503c",initialValue:n.defaultValue},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"maxLength",label:"\u6700\u591a\u8f93\u5165",initialValue:n.maxLength},i.a.createElement(_["a"],{addonAfter:"\u4e2a\u5b57\u7b26"})))},N=i.a.forwardRef(R),L=F["a"].deepClone(j["textarea"]),S=function(e,a){var t=e.fieldValues,n=void 0===t?L:t,r=v["a"].useForm(),c=Object(l["a"])(r,1),d=c[0],u={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:16}}},m=function(a){e.onFieldsChange(a[0].name[0],a[0].value)},p=function(e){};return Object(o["useImperativeHandle"])(a,(function(){return{getForm:function(){return d}}})),i.a.createElement(v["a"],Object(s["a"])({},u,{form:d,name:"propsForm",onFieldsChange:m,onFinish:p}),i.a.createElement(v["a"].Item,{name:"fieldId",label:"\u5b57\u6bb5\u540d",initialValue:n.fieldId},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"label",label:"\u6807\u9898",initialValue:n.label},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"placeholder",label:"\u5360\u4f4d\u63d0\u793a",initialValue:n.placeholder},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"componentWidth",label:"\u7ec4\u4ef6\u5bbd\u5ea6",initialValue:n.componentWidth},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"defaultValue",label:"\u9ed8\u8ba4\u503c",initialValue:n.defaultValue},i.a.createElement(_["a"],null)),i.a.createElement(v["a"].Item,{name:"minRows",label:"\u6700\u5c0f\u884c\u6570",initialValue:n.minRows},i.a.createElement(x["a"],null)),i.a.createElement(v["a"].Item,{name:"maxRows",label:"\u6700\u5927\u884c\u6570",initialValue:n.maxRows},i.a.createElement(x["a"],null)),i.a.createElement(v["a"].Item,{name:"maxLength",label:"\u6700\u591a\u8f93\u5165",initialValue:n.maxLength},i.a.createElement(_["a"],{addonAfter:"\u4e2a\u5b57\u7b26"})))},T=i.a.forwardRef(S),A=O["a"].TabPane,P=function(e,a){var t=e.board,n=(e.items,Object(o["useRef"])()),r=function(e){},l=function(a,n){e.onChangeBoard(t.id,a,n)};return Object(o["useImperativeHandle"])(a,(function(){return{getForm:function(){return n.current.getForm()}}})),i.a.createElement("div",null,i.a.createElement(O["a"],{defaultActiveKey:"1",onChange:r,className:m.a.righttab},i.a.createElement(A,{tab:"\u7ec4\u4ef6\u5c5e\u6027",key:"1"},"input"===t.type?i.a.createElement(N,{ref:n,onFieldsChange:l,fieldValues:t.config}):null,"textarea"===t.type?i.a.createElement(T,{ref:n,onFieldsChange:l,fieldValues:t.config}):null),i.a.createElement(A,{tab:"\u8868\u5355\u5c5e\u6027",key:"2"},"Content of Tab Pane 2")))},D=i.a.forwardRef(P),W=Object(c["a"])({scriptUrl:"//at.alicdn.com/t/font_2351139_fhn4kx6vwdb.js"}),q=function(){var e=Object(o["useState"])([{id:"component-input",type:"input",label:"\u5355\u884c\u6587\u672c",icon:"icon-input"},{id:"component-textarea",type:"textarea",label:"\u591a\u884c\u6587\u672c",icon:"icon-textarea"},{id:"component-password",type:"password",label:"\u5bc6\u7801",icon:"icon-password"},{id:"component-number",type:"number",label:"\u8ba1\u6570\u5668",icon:"icon-number"},{id:"component-rich-text",type:"rich-text",label:"\u7f16\u8f91\u5668",icon:"icon-rich-text"}]),a=Object(l["a"])(e,2),t=a[0],c=(a[1],Object(o["useState"])([])),s=Object(l["a"])(c,2),u=s[0],p=s[1],f=Object(o["useState"])({}),b=Object(l["a"])(f,2),h=b[0],E=b[1],x=Object(o["useRef"])(),v=Object(o["useRef"])(),_=function(e,a,t){for(var n=F["a"].deepClone(u),l=0;l<n.length;l++)if(n[l].id===e){if(n[l].config[a]=t,"defaultValue"===a&&x.current){var o=x.current.getForm();o.setFieldsValue(Object(r["a"])({},n[l].config.fieldId,t))}break}p(n)},w=function(e,a){for(var t=F["a"].deepClone(u),n=0;n<t.length;n++)if(t[n].config.fieldId===e){t[n].config.defaultValue=a;break}if(p(t),h.config.fieldId===e&&("input"===h.type||"textarea"===h.type))for(var r=0;r<t.length;r++)if(t[r].config.fieldId===e){if(v.current){var l=v.current.getForm();l.setFieldsValue({defaultValue:a})}break}},y=function(e){for(var a=F["a"].deepClone(u),t=0;t<a.length;t++)if(a[t].id===e){var r=F["a"].deepClone(a[t]);if(r.type===h.type&&v.current){var l=v.current.getForm();l.setFieldsValue(Object(n["a"])({},r.config))}E(r);break}},I=function(e){console.log(e);var a,r=e.destination,l=e.source,o=e.draggableId,i=F["a"].deepClone(t),c=F["a"].deepClone(u);if(-1!==l.droppableId.indexOf("droppable-components")&&(a=i[l.index]),-1!==l.droppableId.indexOf("droppable-board")&&(a=c[l.index]),r&&-1===r.droppableId.indexOf("droppable-components")){var d=c[r.index],s=l.index,m=r.index;if(console.warn("startIndex",s),console.warn("finishIndex",m),!d||a.id!==d.id){if(-1!==l.droppableId.indexOf("droppable-board"))c.splice(s,1),c.splice(m,0,a);else if(-1!==l.droppableId.indexOf("droppable-components")){var f=o.substr("components".length);if(a.id="board-".concat(c.length),a.type=f,a.config=F["a"].deepClone(j[f]),a.config.fieldId="field_".concat((new Date).getTime()),c.splice(m,0,a),a.type===h.type&&v.current){var b=v.current.getForm();b.setFieldsValue(Object(n["a"])({},a.config))}E(a)}p(c)}}};return i.a.createElement("div",{className:m.a.container},i.a.createElement(d["a"],{onDragEnd:I},i.a.createElement("div",{className:m.a.leftboard},i.a.createElement("div",{className:m.a.logowrapper}),i.a.createElement("div",{className:m.a.leftscrollbar},i.a.createElement("div",{className:m.a.componentslist},i.a.createElement("div",null,i.a.createElement("div",{className:m.a.componentstitle},i.a.createElement(W,{type:"icon-component",style:{fontSize:"16px",marginRight:"4px"}}),i.a.createElement("span",null,"\u8f93\u5165\u578b\u7ec4\u4ef6")),i.a.createElement(g,{items:t}))))),i.a.createElement("div",{className:m.a.centerboard},i.a.createElement("div",{className:m.a.actionbar}),i.a.createElement("div",{className:m.a.centerscrollbar},i.a.createElement(C,{ref:x,board:h,items:u,onChangeComponentForm:w,changeBoard:y})))),i.a.createElement("div",{className:m.a.rightboard},i.a.createElement(D,{ref:v,board:h,items:u,onChangeBoard:_})))};a["default"]=q},EwqE:function(e,a,t){e.exports={container:"container___2i0aT",leftboard:"leftboard___39X5g",logowrapper:"logowrapper___2uAcg",leftscrollbar:"leftscrollbar___2Vz68",componentslist:"componentslist___3sor0",componentstitle:"componentstitle___2FZTb",componentsdraggable:"componentsdraggable___3HG2F",componentsitem:"componentsitem___3F89U",componentsbody:"componentsbody___3-614",componentstext:"componentstext___1_3Cm",centerboard:"centerboard___U_uXn",actionbar:"actionbar___UqGtu",centerscrollbar:"centerscrollbar___3UsJw",centorboardrow:"centorboardrow___IItWR",boardcol:"boardcol___3WsiD",rightboard:"rightboard___1s3CL",righttab:"righttab___1VI2n"}},GPtQ:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_exports__["a"]={deepClone:function(e){var a;if("object"==typeof e)if(null===e)a=null;else if(e instanceof Array){a=[];for(var t=0,n=e.length;t<n;t++)a.push(this.deepClone(e[t]))}else for(var r in a={},e)a[r]=this.deepClone(e[r]);else a=e;return a},loading:{show:function(){window.layer&&layer.load(2,{shade:[.2,"#fff"]})},hide:function(){window.layer&&layer.closeAll("loading")}},appendSelectData:function(e){if(!(e instanceof Array))return[{code:"",value:"\u65e0"}];if(0===e.length)return[{code:"",value:"\u65e0"}];console.log("bingo"),console.log(e);var a=[];e.forEach((function(t){""!=e.code&&a.push(t)})),console.log(a.splice(0,0,{code:"",value:"\u65e0"}))},getGuid:function(){function e(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},isEmpty:function(e){var a=!1;return null!=e&&void 0!=e||(a=!0),"string"!=typeof e||""!=e.replace(/\s+/g,"")&&""!=e||(a=!0),"object"==typeof e&&e instanceof Array&&0===e.length&&(a=!0),a},getByteLength:function(e,a){var t,n;switch(a="UTF-8",a){case"GB2312":t="aa",n=e.replace(/[^\u0000-\u00ff]/g,t).length;break;case"GBK":t="aa",n=e.replace(/[^\u0000-\u00ff]/g,t).length;break;case"GB18030":t="aa",n=e.replace(/[^\u0000-\u00ff]/g,t).length;break;case"ISO-8859-1":t="a",n=e.replace(/[^\u0000-\u00ff]/g,t).length;break;case"UTF-8":t="aaa",n=e.replace(/[^\u0000-\u00ff]/g,t).length;break;case"ASCII":t="aa",n=e.replace(/[^\u0000-\u00ff]/g,t).length;break;case"Unicode":t="a",n=2*e.replace(/[^\u0000-\u00ff]/g,t).length;break;default:break}return n},stripscript:function(e){for(var a=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~\uff01@#\uffe5\u2026\u2026&*\uff08\uff09\u2014\u2014|{}\u3010\u3011\u2018\uff1b\uff1a\u201d\u201c'\u3002\uff0c\u3001\uff1f]"),t="",n=0;n<e.length;n++)t+=e.substr(n,1).replace(a,"");return t},stringToArray:function(e){if(this.isEmpty(e))return[];if("string"!==typeof e)return[];if(e.indexOf(",")<0)return[e];var a=e.split(",");return a},arrayToString:function(e){if("object"==typeof e&&e instanceof Array){if(0==e.length)return"";var a="";return e.forEach((function(e){a+=e+","})),a.substr(0,a.length-1)}return""},formatTime:function(e){var a=new Date(Number(e)),t=a.getFullYear()+"-",n=(a.getMonth()+1<10?"0"+(a.getMonth()+1):a.getMonth()+1)+"-",r=a.getDate()<10?"0"+a.getDate()+" ":a.getDate()+" ",l=a.getHours()<10?"0"+a.getHours()+":":a.getHours()+":",o=a.getMinutes()<10?"0"+a.getMinutes()+":":a.getMinutes()+":",i=a.getSeconds()<10?"0"+a.getSeconds():a.getSeconds();return t+n+r+l+o+i},format:function format(txt,compress){var indentChar="    ";if(!/^\s*$/.test(txt)){try{var data=eval("("+txt+")")}catch(e){return void console.log("\u6570\u636e\u6e90\u8bed\u6cd5\u9519\u8bef,\u683c\u5f0f\u5316\u5931\u8d25! \u9519\u8bef\u4fe1\u606f: "+e.description,"err")}var draw=[],last=!1,This=this,line=compress?"":"\n",nodeCount=0,maxDepth=0,notify=function e(a,t,n,r,l){nodeCount++;for(var o=0,i="";o<r;o++)i+=indentChar;if(i=compress?"":i,maxDepth=++r,t&&t.constructor==Array){draw.push(i+(l?'"'+a+'":':"")+"["+line);for(o=0;o<t.length;o++)e(o,t[o],o==t.length-1,r,!1);draw.push(i+"]"+(n?line:","+line))}else if(t&&"object"==typeof t){draw.push(i+(l?'"'+a+'":':"")+"{"+line);var c=0;o=0;for(var d in t)c++;for(var d in t)e(d,t[d],++o==c,r,!0);draw.push(i+"}"+(n?line:","+line))}else"string"==typeof t&&(t='"'+t+'"'),draw.push(i+(l?'"'+a+'":':"")+t+(n?"":",")+line)},isLast=!0,indent=0;return notify("",data,isLast,indent,!1),draw.join("")}console.log("\u6570\u636e\u4e3a\u7a7a,\u65e0\u6cd5\u683c\u5f0f\u5316! ")}}}}]);