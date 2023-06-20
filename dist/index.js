!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("intoy-utils")):"function"==typeof define&&define.amd?define(["exports","intoy-utils"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self)["intoy-xhr"]={},e["intoy-utils"])}(this,(function(e,t){"use strict";var r=function(){function e(){this.listenerKeys=[],this.listenters={},this.subscribe=this.subscribe.bind(this),this.unSubscribe=this.unSubscribe.bind(this),this.listen=this.listen.bind(this)}var t=e.prototype;return t.subscribe=function(e){var t=Math.random().toString(36);return this.listenters[t]=e,t},t.unSubscribe=function(e){var t=this.listenerKeys.indexOf(e);t>=0&&(this.listenerKeys.splice(t),delete this.listenters[e])},t.listen=function(e){for(var t in this.listenters){var r=this.listenters[t];if("function"==typeof r)try{r(e)}catch(e){}}},e}(),n=null;function s(){return n||(n=new r),n}function i(e,t,r){var n=t||new FormData;for(var s in e){var o=r?r+"["+s+"]":s;if(e[s]instanceof Date)n.append(o,e[s].toString());else if(Array.isArray(e[s])&&e[s].length>0)for(var a=e[s],l=0;l<a.length;l++)"object"==typeof a[l]?i(a[l],n,o+"["+l+"]"):n.append(o+"[]",a[l]);else if("object"!=typeof e[s]||e[s]instanceof File){var u=e[s];null!=u&&n.append(o,u)}else i(e[s],n,o)}return n}function o(e,t,r){if(r=r||[],"object"==typeof e)for(var n in e){var s=e[n];null!=s&&o(s,t?t+"["+n+"]":n,r)}else"string"==typeof e?e.toString().trim().length>0&&r.push(t+="="+encodeURIComponent(e)):r.push(t+="="+encodeURIComponent(e));return r.join("&")}function a(e){var t=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(n=Object.getOwnPropertySymbols(e);s<n.length;s++)t.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(e,n[s])&&(r[n[s]]=e[n[s]])}return r}(e,[]);return new Promise((function(e,r){var n,s=(t.method?t.method:t.type?t.type:"GET").toString().toUpperCase().trim(),a=t.responseType||"json",l=t.params&&"object"==typeof t.params?t.params:t.data&&"object"==typeof t.data?t.data:null,u=null!=l,f="json"===(a||"").toLowerCase().trim(),p=(t.url||"").toString().trim();if(t.formElement){n=new FormData(t.formElement);var c=t.formElement.querySelectorAll("input[type=file]"),h=[];if(c.length>0)for(var m=0;m<c.length;m++){var d=c[m];(d.files&&d.files.length>0?d.files[0]:null)||h.push(d.name)}for(var g=0;g<h.length;g++)n.delete(h[g])}else t.formData&&(n=t.formData);if(u)if(n)i(l,n);else if("GET"===s){var y=o(l);y.length>0&&(p.indexOf("?")<0&&(p+="?"),p+=y)}else n=i(l);var v=new XMLHttpRequest;if(v.open(s,p),t.headers)for(var b in t.headers)v.setRequestHeader(b,t.headers[b]);f&&v.setRequestHeader("accept","application/json"),e({xhr:v,formData:n,handleToJson:f})}))}function l(e){var t=function(e){s().listen(e)};return new Promise((function(r,n){a(e).then((function(s){var i=s.handleToJson,o=s.xhr,a=s.formData;if(o.addEventListener("loadend",(function(e){var s,a=e.target,l={title:"Throw",status:o.status,code:o.status,statusText:o.statusText,message:o.statusText,description:"",xhr:o},u=200===a.status;if("json"!==a.responseType.toString().toLowerCase()){var f=a.getResponseHeader("content-type");(f=f?f.toString().toLowerCase().trim():"").split(";"),s=f.indexOf("application/json")>0}if(u)if(i||s){if((o.responseText||"").toString().trim().length<1)return l.message="Tidak ada result dari server.",t(a),void n(l);try{var p=JSON.parse(o.responseText);t(a),r(p)}catch(e){l.code=409,l.message="Parse error. "+(e.message?e.message:"Unknown error."),t(a),n(l)}}else t(a),r(o.response);else{l.title="Throw "+o.status;try{var c=JSON.parse(o.responseText);if("object"==typeof c){var h=Array.isArray(c.exception)?c.exception[0]:null;h?(l.message=h.message,l.description=h.description?h.description:h.message):(l.message=c.error&&c.error.message?c.error.message:c.message?c.message:l.message,l.description=c.error&&c.error.description?c.error.description:c.description?c.description:l.description)}t(c),n(l)}catch(e){t(a),n(l)}}})),o.addEventListener("error",(function(e){var r=e.target;t(r),n({title:"Throw",message:"Unknown error.",xhr:r})})),"function"==typeof e.uploadProgress){var l=e.uploadProgress;o.upload.addEventListener("progress",(function(e){var t=e.loaded,r=e.total;l({loaded:t,total:r,percentage:t/r*100})}))}o.send(a)})).catch((function(e){n({title:"Throw",message:e&&e.message?e.message:"Unknown error."})}))}))}var u,f=function(e){var r=this;this.key="",this.method="GET",this.url="",this.params={},this.setUrl=function(e){return r.url=t.toStr(e).toString().trim(),r},this.setMethod=function(e){e=t.toStr(e).toString().toUpperCase().trim();var n=["GET","POST","PUT","DELETE"],s=n.indexOf(e);return r.method=s>=0?n[s]:"GET",r},this.setParams=function(e){return r.params=Object.assign({},e||{}),r},this.setData=function(e){return r.params=Object.assign({},e||{}),r},this.invalidate=function(){var e={url:r.url,method:r.method,params:r.params};r.key=JSON.stringify(e)},this.getKey=function(e){return e&&r.invalidate(),r.key},this.equalUrl=function(e){return r.url===t.toStr(e).toString().trim()},e=e||{},this.setUrl(e.url).setMethod(e.method).setParams(e.params)},p=function(){function e(e){var t=this;this.keys=[],this.limit=1e3,this.expires=[],this.store=[],this.getKeyByUrl=function(e){if(e&&t.store.length>0)for(var r=0;r<t.store.length;r++)if(t.store[r].equalUrl(e))return t.store[r].getKey()},this.removeByUrl=function(e){t.internalRemove(t.getKeyByUrl(e))},this.keys=[],this.data={},e.limit&&(this.limit=e.limit>1?e.limit:1===e.limit||e.limit<1?2:e.limit)}var r=e.prototype;return r.internalRemove=function(e){var t=this.keys.indexOf(e);t>=0&&(this.keys.splice(t,1),this.expires.splice(t,1),this.store.splice(t,1),delete this.data[e])},r.keyFromSe=function(e){var r=new f({url:(e=e||{}).url,method:e.method}),n={};e.params?n=Object.assign({},e.params):e.data&&(n=Object.assign({},e.data));var s=t.toInt(e.params&&e.params.page?e.params.page:1);return n.page=s,r.setParams(n),r.invalidate(),r},r.get=function(e,t){var r=this;return void 0===t&&(t=(new Date).getTime()),new Promise((function(n,s){var i=r.keyFromSe(e),o=i.getKey(),a=!0,u=(new Date).getTime();if(r.data[o]){var f=r.keys.indexOf(o),p=r.expires[f],c=r.data[o].time,h=(new Date).getTime(),m=u;u=c,h-c>p?(a=!0,u=m,r.internalRemove(o)):(a=!1,n(r.data[o].response))}a&&l(e).then((function(e){if(r.keys.length>r.limit)for(var s=Math.floor(r.keys.length/2);r.keys.length>s;)r.internalRemove(r.keys[0]);r.expires.push(t),r.keys.push(o),r.store.push(i);var a={response:e,time:u};r.data[o]=Object.assign({},a),n(e)})).catch((function(e){return s(e)}))}))},e}();function c(){return u||(u=new p({})),u}e.ajax=l,e.ajaxCache=function(e,t){return void 0===t&&(t=3e4),c().get(e,t)},e.ajaxRemoveByUrl=function(e){c().removeByUrl(e)},e.getKeyByUrl=function(e){return c().getKeyByUrl(e)},e.getObserve=s,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=index.js.map
