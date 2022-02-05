function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}var t=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequire1a81;t.register("fLkya",(function(r,n){e(r.exports,"ResizeObserver",(function(){return t("5clzz").ResizeObserver})),e(r.exports,"ResizeObserverEntry",(function(){return t("kPP9O").ResizeObserverEntry})),e(r.exports,"ResizeObserverSize",(function(){return t("3r93i").ResizeObserverSize}));t("5clzz"),t("kPP9O"),t("3r93i")})),t.register("5clzz",(function(r,n){e(r.exports,"ResizeObserver",(function(){return s}));var i=t("dFQ5Q"),o=t("k1SAf"),s=function(){function e(e){if(0===arguments.length)throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");if("function"!=typeof e)throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");i.ResizeObserverController.connect(this,e)}return e.prototype.observe=function(e,t){if(0===arguments.length)throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!o.isElement(e))throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");i.ResizeObserverController.observe(this,e,t)},e.prototype.unobserve=function(e){if(0===arguments.length)throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!o.isElement(e))throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");i.ResizeObserverController.unobserve(this,e)},e.prototype.disconnect=function(){i.ResizeObserverController.disconnect(this)},e.toString=function(){return"function ResizeObserver () { [polyfill code] }"},e}()})),t.register("dFQ5Q",(function(r,n){e(r.exports,"ResizeObserverController",(function(){return f}));var i=t("ahXl5"),o=t("hIq9n"),s=t("7BIQb"),u=t("8QU8W"),c=new WeakMap,a=function(e,t){for(var r=0;r<e.length;r+=1)if(e[r].target===t)return r;return-1},f=function(){function e(){}return e.connect=function(e,t){var r=new s.ResizeObserverDetail(e,t);c.set(e,r)},e.observe=function(e,t,r){var n=c.get(e),s=0===n.observationTargets.length;a(n.observationTargets,t)<0&&(s&&u.resizeObservers.push(n),n.observationTargets.push(new o.ResizeObservation(t,r&&r.box)),i.updateCount(1),i.scheduler.schedule())},e.unobserve=function(e,t){var r=c.get(e),n=a(r.observationTargets,t),o=1===r.observationTargets.length;n>=0&&(o&&u.resizeObservers.splice(u.resizeObservers.indexOf(r),1),r.observationTargets.splice(n,1),i.updateCount(-1))},e.disconnect=function(e){var t=this,r=c.get(e);r.observationTargets.slice().forEach((function(r){return t.unobserve(e,r.target)})),r.activeTargets.splice(0,r.activeTargets.length)},e}()})),t.register("ahXl5",(function(r,n){e(r.exports,"scheduler",(function(){return l})),e(r.exports,"updateCount",(function(){return h}));var i=t("grsqh"),o=t("gHbj0"),s=t("57sXt"),u=0,c={attributes:!0,characterData:!0,childList:!0,subtree:!0},a=["resize","load","transitionend","animationend","animationstart","animationiteration","keyup","keydown","mouseup","mousedown","mouseover","mouseout","blur","focus"],f=function(e){return void 0===e&&(e=0),Date.now()+e},v=!1,l=new(function(){function e(){var e=this;this.stopped=!0,this.listener=function(){return e.schedule()}}return e.prototype.run=function(e){var t=this;if(void 0===e&&(e=250),!v){v=!0;var r=f(e);s.queueResizeObserver((function(){var n=!1;try{n=i.process()}finally{if(v=!1,e=r-f(),!u)return;n?t.run(1e3):e>0?t.run(e):t.start()}}))}},e.prototype.schedule=function(){this.stop(),this.run()},e.prototype.observe=function(){var e=this,t=function(){return e.observer&&e.observer.observe(document.body,c)};document.body?t():o.global.addEventListener("DOMContentLoaded",t)},e.prototype.start=function(){var e=this;this.stopped&&(this.stopped=!1,this.observer=new MutationObserver(this.listener),this.observe(),a.forEach((function(t){return o.global.addEventListener(t,e.listener,!0)})))},e.prototype.stop=function(){var e=this;this.stopped||(this.observer&&this.observer.disconnect(),a.forEach((function(t){return o.global.removeEventListener(t,e.listener,!0)})),this.stopped=!0)},e}()),h=function(e){!u&&e>0&&l.start(),!(u+=e)&&l.stop()}})),t.register("grsqh",(function(r,n){e(r.exports,"process",(function(){return a}));var i=t("h5NNT"),o=t("6DMP8"),s=t("fixyH"),u=t("3YPhy"),c=t("9Ppnc"),a=function(){var e=0;for(c.gatherActiveObservationsAtDepth(e);i.hasActiveObservations();)e=u.broadcastActiveObservations(),c.gatherActiveObservationsAtDepth(e);return o.hasSkippedObservations()&&s.deliverResizeLoopError(),e>0}})),t.register("h5NNT",(function(r,n){e(r.exports,"hasActiveObservations",(function(){return o}));var i=t("8QU8W"),o=function(){return i.resizeObservers.some((function(e){return e.activeTargets.length>0}))}})),t.register("8QU8W",(function(t,r){e(t.exports,"resizeObservers",(function(){return n}));var n=[]})),t.register("6DMP8",(function(r,n){e(r.exports,"hasSkippedObservations",(function(){return o}));var i=t("8QU8W"),o=function(){return i.resizeObservers.some((function(e){return e.skippedTargets.length>0}))}})),t.register("fixyH",(function(t,r){e(t.exports,"deliverResizeLoopError",(function(){return i}));var n="ResizeObserver loop completed with undelivered notifications.",i=function(){var e;"function"==typeof ErrorEvent?e=new ErrorEvent("error",{message:n}):((e=document.createEvent("Event")).initEvent("error",!1,!1),e.message=n),window.dispatchEvent(e)}})),t.register("3YPhy",(function(r,n){e(r.exports,"broadcastActiveObservations",(function(){return c}));var i=t("8QU8W"),o=t("kPP9O"),s=t("cEuEj"),u=t("g3Knn"),c=function(){var e=1/0,t=[];i.resizeObservers.forEach((function(r){if(0!==r.activeTargets.length){var n=[];r.activeTargets.forEach((function(t){var r=new o.ResizeObserverEntry(t.target),i=s.calculateDepthForNode(t.target);n.push(r),t.lastReportedSize=u.calculateBoxSize(t.target,t.observedBox),i<e&&(e=i)})),t.push((function(){r.callback.call(r.observer,n,r.observer)})),r.activeTargets.splice(0,r.activeTargets.length)}}));for(var r=0,n=t;r<n.length;r++){(0,n[r])()}return e}})),t.register("kPP9O",(function(r,n){e(r.exports,"ResizeObserverEntry",(function(){return s}));var i=t("g3Knn"),o=t("1uOVl"),s=function(e){var t=i.calculateBoxSizes(e);this.target=e,this.contentRect=t.contentRect,this.borderBoxSize=o.freeze([t.borderBoxSize]),this.contentBoxSize=o.freeze([t.contentBoxSize]),this.devicePixelContentBoxSize=o.freeze([t.devicePixelContentBoxSize])}})),t.register("g3Knn",(function(r,n){e(r.exports,"calculateBoxSizes",(function(){return g})),e(r.exports,"calculateBoxSize",(function(){return z}));var i=t("9aAt7"),o=t("3r93i"),s=t("avvf5"),u=t("k1SAf"),c=t("1uOVl"),a=t("gHbj0"),f=new WeakMap,v=/auto|scroll/,l=/^tb|vertical/,h=/msie|trident/i.test(a.global.navigator&&a.global.navigator.userAgent),p=function(e){return parseFloat(e||"0")},d=function(e,t,r){return void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=!1),new o.ResizeObserverSize((r?t:e)||0,(r?e:t)||0)},b=c.freeze({devicePixelContentBoxSize:d(),borderBoxSize:d(),contentBoxSize:d(),contentRect:new s.DOMRectReadOnly(0,0,0,0)}),g=function(e,t){if(void 0===t&&(t=!1),f.has(e)&&!t)return f.get(e);if(u.isHidden(e))return f.set(e,b),b;var r=getComputedStyle(e),n=u.isSVG(e)&&e.ownerSVGElement&&e.getBBox(),i=!h&&"border-box"===r.boxSizing,o=l.test(r.writingMode||""),a=!n&&v.test(r.overflowY||""),g=!n&&v.test(r.overflowX||""),z=n?0:p(r.paddingTop),O=n?0:p(r.paddingRight),x=n?0:p(r.paddingBottom),E=n?0:p(r.paddingLeft),R=n?0:p(r.borderTopWidth),y=n?0:p(r.borderRightWidth),w=n?0:p(r.borderBottomWidth),S=E+O,T=z+x,m=(n?0:p(r.borderLeftWidth))+y,B=R+w,k=g?e.offsetHeight-B-e.clientHeight:0,A=a?e.offsetWidth-m-e.clientWidth:0,C=i?S+m:0,D=i?T+B:0,P=n?n.width:p(r.width)-C-A,N=n?n.height:p(r.height)-D-k,M=P+S+A+m,W=N+T+k+B,V=c.freeze({devicePixelContentBoxSize:d(Math.round(P*devicePixelRatio),Math.round(N*devicePixelRatio),o),borderBoxSize:d(M,W,o),contentBoxSize:d(P,N,o),contentRect:new s.DOMRectReadOnly(E,z,P,N)});return f.set(e,V),V},z=function(e,t,r){var n=g(e,r),o=n.borderBoxSize,s=n.contentBoxSize,u=n.devicePixelContentBoxSize;switch(t){case i.ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:return u;case i.ResizeObserverBoxOptions.BORDER_BOX:return o;default:return s}}})),t.register("9aAt7",(function(t,r){var n;e(t.exports,"ResizeObserverBoxOptions",(function(){return n})),function(e){e.BORDER_BOX="border-box",e.CONTENT_BOX="content-box",e.DEVICE_PIXEL_CONTENT_BOX="device-pixel-content-box"}(n||(n={}))})),t.register("3r93i",(function(r,n){e(r.exports,"ResizeObserverSize",(function(){return o}));var i=t("1uOVl"),o=function(e,t){this.inlineSize=e,this.blockSize=t,i.freeze(this)}})),t.register("1uOVl",(function(t,r){e(t.exports,"freeze",(function(){return n}));var n=function(e){return Object.freeze(e)}})),t.register("avvf5",(function(r,n){e(r.exports,"DOMRectReadOnly",(function(){return o}));var i=t("1uOVl"),o=function(){function e(e,t,r,n){return this.x=e,this.y=t,this.width=r,this.height=n,this.top=this.y,this.left=this.x,this.bottom=this.top+this.height,this.right=this.left+this.width,i.freeze(this)}return e.prototype.toJSON=function(){var e=this;return{x:e.x,y:e.y,top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height}},e.fromRect=function(t){return new e(t.x,t.y,t.width,t.height)},e}()})),t.register("k1SAf",(function(t,r){e(t.exports,"isSVG",(function(){return n})),e(t.exports,"isHidden",(function(){return i})),e(t.exports,"isElement",(function(){return o})),e(t.exports,"isReplacedElement",(function(){return s}));var n=function(e){return e instanceof SVGElement&&"getBBox"in e},i=function(e){if(n(e)){var t=e.getBBox(),r=t.width,i=t.height;return!r&&!i}var o=e,s=o.offsetWidth,u=o.offsetHeight;return!(s||u||e.getClientRects().length)},o=function(e){var t,r;if(e instanceof Element)return!0;var n=null===(r=null===(t=e)||void 0===t?void 0:t.ownerDocument)||void 0===r?void 0:r.defaultView;return!!(n&&e instanceof n.Element)},s=function(e){switch(e.tagName){case"INPUT":if("image"!==e.type)break;case"VIDEO":case"AUDIO":case"EMBED":case"OBJECT":case"CANVAS":case"IFRAME":case"IMG":return!0}return!1}})),t.register("gHbj0",(function(t,r){e(t.exports,"global",(function(){return n}));var n="undefined"!=typeof window?window:{}})),t.register("cEuEj",(function(r,n){e(r.exports,"calculateDepthForNode",(function(){return o}));var i=t("k1SAf"),o=function(e){if(i.isHidden(e))return 1/0;for(var t=0,r=e.parentNode;r;)t+=1,r=r.parentNode;return t}})),t.register("9Ppnc",(function(r,n){e(r.exports,"gatherActiveObservationsAtDepth",(function(){return s}));var i=t("8QU8W"),o=t("cEuEj"),s=function(e){i.resizeObservers.forEach((function(t){t.activeTargets.splice(0,t.activeTargets.length),t.skippedTargets.splice(0,t.skippedTargets.length),t.observationTargets.forEach((function(r){r.isActive()&&(o.calculateDepthForNode(r.target)>e?t.activeTargets.push(r):t.skippedTargets.push(r))}))}))}})),t.register("57sXt",(function(r,n){e(r.exports,"queueResizeObserver",(function(){return o}));var i=t("cW8AQ"),o=function(e){i.queueMicroTask((function(){requestAnimationFrame(e)}))}})),t.register("cW8AQ",(function(t,r){var n;e(t.exports,"queueMicroTask",(function(){return o}));var i=[],o=function(e){if(!n){var t=0,r=document.createTextNode("");new MutationObserver((function(){return i.splice(0).forEach((function(e){return e()}))})).observe(r,{characterData:!0}),n=function(){r.textContent=""+(t?t--:t++)}}i.push(e),n()}})),t.register("hIq9n",(function(r,n){e(r.exports,"ResizeObservation",(function(){return u}));var i=t("9aAt7"),o=t("g3Knn"),s=t("k1SAf"),u=function(){function e(e,t){this.target=e,this.observedBox=t||i.ResizeObserverBoxOptions.CONTENT_BOX,this.lastReportedSize={inlineSize:0,blockSize:0}}return e.prototype.isActive=function(){var e,t=o.calculateBoxSize(this.target,this.observedBox,!0);return e=this.target,s.isSVG(e)||s.isReplacedElement(e)||"inline"!==getComputedStyle(e).display||(this.lastReportedSize=t),this.lastReportedSize.inlineSize!==t.inlineSize||this.lastReportedSize.blockSize!==t.blockSize},e}()})),t.register("7BIQb",(function(t,r){e(t.exports,"ResizeObserverDetail",(function(){return n}));var n=function(e,t){this.activeTargets=[],this.skippedTargets=[],this.observationTargets=[],this.observer=e,this.callback=t}}));