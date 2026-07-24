var e=(e,t)=>()=>(e&&(t=e(e=0)),t),t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function n(e,t,n){return Math.max(e,Math.min(t,n))}function r(e,t,n){return(1-n)*e+n*t}function i(e,t,n,i){return r(e,t,1-Math.exp(-n*i))}function a(e,t){return(e%t+t)%t}function o(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{n=void 0,e.apply(this,r)},t)}}function s(e,t){return e===1?f:e===2?t:1}var c,l,u,d,f,p,m,h,g,_=e((()=>{c=`1.3.23`,l=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let r=n(0,this.currentTime/this.duration,1);t=r>=1;let i=t?1:this.easing(r);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=i(this.value,this.to,this.lerp*60,e),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:n,duration:r,easing:i,onStart:a,onUpdate:o}){this.from=this.value=e,this.to=t,this.lerp=n,this.duration=r,this.easing=i,this.currentTime=0,this.isRunning=!0,a?.(),this.onUpdate=o}},u=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:n=!0,debounce:r=250}={}){this.wrapper=e,this.content=t,n&&(this.debouncedResize=o(this.resize,r),this.wrapper instanceof Window?window.addEventListener(`resize`,this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener(`resize`,this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},d=class{events={};emit(e,...t){let n=this.events[e]||[];for(let e=0,r=n.length;e<r;e++)n[e]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(e=>t!==e)}}off(e,t){this.events[e]=this.events[e]?.filter(e=>t!==e)}destroy(){this.events={}}},f=100/6,p={passive:!1},m=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new d;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener(`resize`,this.onWindowResize),this.onWindowResize(),this.element.addEventListener(`wheel`,this.onWheel,p),this.element.addEventListener(`touchstart`,this.onTouchStart,p),this.element.addEventListener(`touchmove`,this.onTouchMove,p),this.element.addEventListener(`touchend`,this.onTouchEnd,p)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener(`resize`,this.onWindowResize),this.element.removeEventListener(`wheel`,this.onWheel,p),this.element.removeEventListener(`touchstart`,this.onTouchStart,p),this.element.removeEventListener(`touchmove`,this.onTouchMove,p),this.element.removeEventListener(`touchend`,this.onTouchEnd,p)}onTouchStart=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit(`scroll`,{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e,r=-(t-this.touchStart.x)*this.options.touchMultiplier,i=-(n-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:r,y:i},this.emitter.emit(`scroll`,{deltaX:r,deltaY:i,event:e})};onTouchEnd=e=>{this.emitter.emit(`scroll`,{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:n,deltaMode:r}=e,i=s(r,this.window.width),a=s(r,this.window.height);t*=i,n*=a,t*=this.options.wheelMultiplier,n*=this.options.wheelMultiplier,this.emitter.emit(`scroll`,{deltaX:t,deltaY:n,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},h=e=>Math.min(1,1.001-2**(-10*e)),g=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new l;emitter=new d;dimensions;virtualScroll;constructor({wrapper:e=window,content:t=document.documentElement,eventsTarget:n=e,smoothWheel:r=!0,syncTouch:i=!1,syncTouchLerp:a=.075,touchInertiaExponent:o=1.7,duration:s,easing:l,lerp:d=.1,infinite:f=!1,orientation:p=`vertical`,gestureOrientation:g=p===`horizontal`?`both`:`vertical`,touchMultiplier:_=1,wheelMultiplier:v=1,autoResize:y=!0,prevent:b,virtualScroll:x,overscroll:S=!0,autoRaf:C=!1,anchors:w=!1,autoToggle:T=!1,allowNestedScroll:E=!1,__experimental__naiveDimensions:D=!1,naiveDimensions:O=D,stopInertiaOnNavigate:k=!1}={}){window.lenisVersion=c,window.lenis||(window.lenis={}),window.lenis.version=c,p===`horizontal`&&(window.lenis.horizontal=!0),i===!0&&(window.lenis.touch=!0),(!e||e===document.documentElement)&&(e=window),typeof s==`number`&&typeof l!=`function`?l=h:typeof l==`function`&&typeof s!=`number`&&(s=1),this.options={wrapper:e,content:t,eventsTarget:n,smoothWheel:r,syncTouch:i,syncTouchLerp:a,touchInertiaExponent:o,duration:s,easing:l,lerp:d,infinite:f,gestureOrientation:g,orientation:p,touchMultiplier:_,wheelMultiplier:v,autoResize:y,prevent:b,virtualScroll:x,overscroll:S,autoRaf:C,anchors:w,autoToggle:T,allowNestedScroll:E,naiveDimensions:O,stopInertiaOnNavigate:k},this.dimensions=new u(e,t,{autoResize:y}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.addEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener(`click`,this.onClick),this.options.wrapper.addEventListener(`pointerdown`,this.onPointerDown),this.virtualScroll=new m(n,{touchMultiplier:_,wheelMultiplier:v}),this.virtualScroll.on(`scroll`,this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener(`transitionend`,this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.removeEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener(`pointerdown`,this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener(`click`,this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||(this.isScrolling===`smooth`||this.isScrolling===!1)&&e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent(`scrollend`,{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?`overflow-x`:`overflow-y`;return getComputedStyle(this.rootElement)[e]}checkOverflow(){[`hidden`,`clip`].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes(`overflow`)&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:`instant`}):this.options.wrapper.scrollTo({top:e,behavior:`instant`})}onClick=e=>{let t=e.composedPath().filter(e=>e instanceof HTMLAnchorElement&&e.href).map(e=>new URL(e.href)),n=new URL(window.location.href);if(this.options.anchors){let e=t.find(e=>n.host===e.host&&n.pathname===e.pathname&&e.hash);if(e){let t=typeof this.options.anchors==`object`&&this.options.anchors?this.options.anchors:void 0,n=`#${e.hash.split(`#`)[1]}`;this.scrollTo(n,t);return}}if(this.options.stopInertiaOnNavigate&&t.some(e=>n.host===e.host&&n.pathname!==e.pathname)){this.reset();return}};onPointerDown=e=>{e.button===1&&this.reset()};onVirtualScroll=e=>{if(typeof this.options.virtualScroll==`function`&&this.options.virtualScroll(e)===!1)return;let{deltaX:t,deltaY:n,event:r}=e;if(this.emitter.emit(`virtual-scroll`,{deltaX:t,deltaY:n,event:r}),r.ctrlKey||r.lenisStopPropagation)return;let i=r.type.includes(`touch`),a=r.type.includes(`wheel`);this.isTouching=r.type===`touchstart`||r.type===`touchmove`;let o=t===0&&n===0;if(this.options.syncTouch&&i&&r.type===`touchstart`&&o&&!this.isStopped&&!this.isLocked){this.reset();return}let s=this.options.gestureOrientation===`vertical`&&n===0||this.options.gestureOrientation===`horizontal`&&t===0;if(o||s)return;let c=r.composedPath();c=c.slice(0,c.indexOf(this.rootElement));let l=this.options.prevent,u=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`;if(c.find(e=>e instanceof HTMLElement&&(typeof l==`function`&&l?.(e)||e.hasAttribute?.(`data-lenis-prevent`)||u===`vertical`&&e.hasAttribute?.(`data-lenis-prevent-vertical`)||u===`horizontal`&&e.hasAttribute?.(`data-lenis-prevent-horizontal`)||i&&e.hasAttribute?.(`data-lenis-prevent-touch`)||a&&e.hasAttribute?.(`data-lenis-prevent-wheel`)||this.options.allowNestedScroll&&this.hasNestedScroll(e,{deltaX:t,deltaY:n}))))return;if(this.isStopped||this.isLocked){r.cancelable&&r.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&a)){this.isScrolling=`native`,this.animate.stop(),r.lenisStopPropagation=!0;return}let d=n;this.options.gestureOrientation===`both`?d=Math.abs(n)>Math.abs(t)?n:t:this.options.gestureOrientation===`horizontal`&&(d=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&n>0||this.animatedScroll===this.limit&&n<0))&&(r.lenisStopPropagation=!0),r.cancelable&&r.preventDefault();let f=i&&this.options.syncTouch,p=i&&r.type===`touchend`;p&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...f?{lerp:p?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit(`scroll`,this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling===`native`){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling=`native`),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty(`overflow`);return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty(`overflow`,`clip`);return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:r=!1,lock:i=!1,programmatic:a=!0,lerp:o=a?this.options.lerp:void 0,duration:s=a?this.options.duration:void 0,easing:c=a?this.options.easing:void 0,onStart:l,onComplete:u,force:d=!1,userData:f}={}){if((this.isStopped||this.isLocked)&&!d)return;let p=e,m=t;if(typeof p==`string`&&[`top`,`left`,`start`,`#`].includes(p))p=0;else if(typeof p==`string`&&[`bottom`,`right`,`end`].includes(p))p=this.limit;else{let e=null;if(typeof p==`string`?(e=document.querySelector(p),e||(p===`#top`?p=0:console.warn(`Lenis: Target not found`,p))):p instanceof HTMLElement&&p?.nodeType&&(e=p),e){if(this.options.wrapper!==window){let e=this.rootElement.getBoundingClientRect();m-=this.isHorizontal?e.left:e.top}let t=e.getBoundingClientRect(),n=getComputedStyle(e),r=this.isHorizontal?Number.parseFloat(n.scrollMarginLeft):Number.parseFloat(n.scrollMarginTop),i=getComputedStyle(this.rootElement),a=this.isHorizontal?Number.parseFloat(i.scrollPaddingLeft):Number.parseFloat(i.scrollPaddingTop);p=(this.isHorizontal?t.left:t.top)+this.animatedScroll-(Number.isNaN(r)?0:r)-(Number.isNaN(a)?0:a)}}if(typeof p==`number`){if(p+=m,this.options.infinite){if(a){this.targetScroll=this.animatedScroll=this.scroll;let e=p-this.animatedScroll;e>this.limit/2?p-=this.limit:e<-this.limit/2&&(p+=this.limit)}}else p=n(0,p,this.limit);if(p===this.targetScroll){l?.(this),u?.(this);return}if(this.userData=f??{},r){this.animatedScroll=this.targetScroll=p,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}a||(this.targetScroll=p),typeof s==`number`&&typeof c!=`function`?c=h:typeof c==`function`&&typeof s!=`number`&&(s=1),this.animate.fromTo(this.animatedScroll,p,{duration:s,easing:c,lerp:o,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling=`smooth`,l?.(this)},onUpdate:(e,t)=>{this.isScrolling=`smooth`,this.lastVelocity=this.velocity,this.velocity=e-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=e,this.setScroll(this.scroll),a&&(this.targetScroll=e),t||this.emit(),t&&(this.reset(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:n}){let r=Date.now();e._lenis||={};let i=e._lenis,a,o,s,c,l,u,d,f,p,m;if(r-(i.time??0)>2e3){i.time=Date.now();let t=window.getComputedStyle(e);if(i.computedStyle=t,a=[`auto`,`overlay`,`scroll`].includes(t.overflowX),o=[`auto`,`overlay`,`scroll`].includes(t.overflowY),l=[`auto`].includes(t.overscrollBehaviorX),u=[`auto`].includes(t.overscrollBehaviorY),i.hasOverflowX=a,i.hasOverflowY=o,!(a||o))return!1;d=e.scrollWidth,f=e.scrollHeight,p=e.clientWidth,m=e.clientHeight,s=d>p,c=f>m,i.isScrollableX=s,i.isScrollableY=c,i.scrollWidth=d,i.scrollHeight=f,i.clientWidth=p,i.clientHeight=m,i.hasOverscrollBehaviorX=l,i.hasOverscrollBehaviorY=u}else s=i.isScrollableX,c=i.isScrollableY,a=i.hasOverflowX,o=i.hasOverflowY,d=i.scrollWidth,f=i.scrollHeight,p=i.clientWidth,m=i.clientHeight,l=i.hasOverscrollBehaviorX,u=i.hasOverscrollBehaviorY;if(!(a&&s||o&&c))return!1;let h=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`,g,_,v,y,b,x;if(h===`horizontal`)g=Math.round(e.scrollLeft),_=d-p,v=t,y=a,b=s,x=l;else if(h===`vertical`)g=Math.round(e.scrollTop),_=f-m,v=n,y=o,b=c,x=u;else return!1;return!x&&(g>=_||g<=0)?!0:(v>0?g<_:g>0)&&y&&b}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?`x`:`y`]}get isHorizontal(){return this.options.orientation===`horizontal`}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?a(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling===`smooth`}get className(){let e=`lenis`;return this.options.autoToggle&&(e+=` lenis-autoToggle`),this.isStopped&&(e+=` lenis-stopped`),this.isLocked&&(e+=` lenis-locked`),this.isScrolling&&(e+=` lenis-scrolling`),this.isScrolling===`smooth`&&(e+=` lenis-smooth`),e}updateClassName(){this.cleanUpClassName(),this.className.split(` `).forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))(e===`lenis`||e.startsWith(`lenis-`))&&this.rootElement.classList.remove(e)}}})),v=e((()=>{})),y=e((()=>{})),b=e((()=>{})),x=e((()=>{})),S=e((()=>{})),C=e((()=>{})),w=e((()=>{})),T=e((()=>{})),E=e((()=>{})),D=e((()=>{})),O=e((()=>{})),k=e((()=>{}));function A(){let e=document.querySelector(`[data-layout-header]`),t=document.querySelector(`[data-layout-footer]`);e&&(e.outerHTML=F),t&&(t.outerHTML=I)}var j,M,N,P,F,I,L=e((()=>{j=`./`,M=e=>`${j}${e}`,N=(e=``)=>`${j}${e}`,P={facebook:new URL(`data:image/svg+xml,%3csvg%20width='6'%20height='11'%20viewBox='0%200%206%2011'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M1.1622%2010.5V2.8C1.1622%201.95067%201.4142%201.274%201.9182%200.769999C2.4222%200.256666%203.14087%20-8.34465e-07%204.0742%20-8.34465e-07C4.39153%20-8.34465e-07%204.69487%200.032666%204.9842%200.0979996C5.28287%200.163333%205.53487%200.265999%205.7402%200.406L5.1662%201.988C5.04487%201.904%204.90953%201.83867%204.7602%201.792C4.61087%201.74533%204.4522%201.722%204.2842%201.722C3.96687%201.722%203.71953%201.81533%203.5422%202.002C3.3742%202.17933%203.2902%202.45%203.2902%202.814V3.514L3.3462%204.452V10.5H1.1622ZM0.000199096%204.816V3.136H5.2222V4.816H0.000199096Z'%20fill='%2318408C'/%3e%3c/svg%3e`,``+import.meta.url).href,instagram:new URL(`data:image/svg+xml,%3csvg%20width='12'%20height='12'%20viewBox='0%200%2012%2012'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5.5438%2011.0881C4.77846%2011.0881%204.0598%2010.9434%203.3878%2010.6541C2.7158%2010.3741%202.12313%209.98206%201.6098%209.47806C1.1058%208.96473%200.70913%208.37206%200.419797%207.70006C0.139797%207.02806%20-0.000202842%206.30939%20-0.000202842%205.54406C-0.000202842%204.76939%200.139797%204.05073%200.419797%203.38806C0.70913%202.71606%201.1058%202.12806%201.6098%201.62406C2.12313%201.11073%202.7158%200.71406%203.3878%200.43406C4.0598%200.144727%204.77846%206.03199e-05%205.5438%206.03199e-05C6.31846%206.03199e-05%207.03713%200.144727%207.6998%200.43406C8.3718%200.71406%208.9598%201.11073%209.4638%201.62406C9.97713%202.12806%2010.3738%202.71606%2010.6538%203.38806C10.9431%204.05073%2011.0878%204.76939%2011.0878%205.54406C11.0878%206.30939%2010.9431%207.02806%2010.6538%207.70006C10.3738%208.37206%209.97713%208.96473%209.4638%209.47806C8.9598%209.98206%208.3718%2010.3741%207.6998%2010.6541C7.03713%2010.9434%206.31846%2011.0881%205.5438%2011.0881Z'%20fill='%2318408C'/%3e%3c/svg%3e`,``+import.meta.url).href,linkedin:new URL(`data:image/svg+xml,%3csvg%20width='13'%20height='12'%20viewBox='0%200%2013%2012'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0.265887%2011.0179V3.48594H2.44989V11.0179H0.265887ZM1.35789%202.43594C0.956554%202.43594%200.629887%202.31928%200.377887%202.08594C0.125887%201.85261%20-0.00011307%201.56328%20-0.00011307%201.21794C-0.00011307%200.87261%200.125887%200.583277%200.377887%200.349944C0.629887%200.11661%200.956554%20-5.65052e-05%201.35789%20-5.65052e-05C1.75922%20-5.65052e-05%202.08589%200.111944%202.33789%200.335944C2.58989%200.550611%202.71589%200.830611%202.71589%201.17594C2.71589%201.53994%202.58989%201.84328%202.33789%202.08594C2.09522%202.31928%201.76855%202.43594%201.35789%202.43594ZM4.47682%2011.0179V3.48594H6.56282V5.57194L6.17082%204.94194C6.44149%204.43794%206.82882%204.05061%207.33282%203.77994C7.83682%203.50928%208.41082%203.37394%209.05482%203.37394C9.65216%203.37394%2010.1842%203.49528%2010.6508%203.73794C11.1268%203.97128%2011.5002%204.33528%2011.7708%204.82994C12.0415%205.31528%2012.1768%205.94061%2012.1768%206.70594V11.0179H9.99282V7.04194C9.99282%206.43528%209.85749%205.98728%209.58682%205.69794C9.32549%205.40861%208.95216%205.26394%208.46682%205.26394C8.12149%205.26394%207.80882%205.33861%207.52882%205.48794C7.25816%205.62794%207.04349%205.84728%206.88482%206.14594C6.73549%206.44461%206.66082%206.82728%206.66082%207.29394V11.0179H4.47682Z'%20fill='%2318408C'/%3e%3c/svg%3e`,``+import.meta.url).href,twitter:new URL(`data:image/svg+xml,%3csvg%20width='10'%20height='10'%20viewBox='0%200%2010%2010'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0.587922%209.99597L3.58392%205.73997L-7.83913e-05%20-2.89679e-05H2.84192L5.09592%203.61197L7.62992%20-2.89679e-05H8.53992L5.51592%204.29797L9.08592%209.99597H6.24392L4.01792%206.43997L1.49792%209.99597H0.587922ZM6.64992%209.25397H7.75592L2.43592%200.741971H1.32992L6.64992%209.25397Z'%20fill='%2318408C'/%3e%3c/svg%3e`,``+import.meta.url).href,youtube:new URL(`data:image/svg+xml,%3csvg%20width='6'%20height='6'%20viewBox='0%200%206%206'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0.0002345%205.96405V5.42402e-05L5.96423%202.98205L0.0002345%205.96405Z'%20fill='%2318408C'/%3e%3c/svg%3e`,``+import.meta.url).href},F=`
  <header class="site-header" data-header>
    <a class="brand" href="${N()}" aria-label="Eastman home">
      <img src="${M(`images/eastman-logo.svg`)}" alt="Eastman" />
    </a>

    <div class="header-nav-stack">
      <nav class="utility-nav" aria-label="Utility navigation">
        <a href="https://www.eastmanassure.com" target="_blank" rel="noopener noreferrer" aria-label="Eastman Assure Service">Eastman Assure Service</a>
        <a href="https://jrseastman.com" target="_blank" rel="noopener noreferrer" aria-label="About JRS Eastman Group">About JRS Eastman Group</a>
        <a href="${N(`partner-with-us.html`)}">Partner With Us</a>
        <a href="${N(`contact-us.html`)}">Contact us</a>
      </nav>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <button type="button" data-desktop-trigger="about" aria-expanded="false">About Us<img src="${M(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="research" aria-expanded="false">Research &amp; Development<img src="${M(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="manufacturing" aria-expanded="false">Manufacturing Infrastructure<img src="${M(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="businesses" aria-expanded="false">Our Businesses<img src="${M(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="resources" aria-expanded="false">Resources<img src="${M(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="life" aria-expanded="false">Life@Eastman<img src="${M(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
      </nav>
    </div>

    <div class="header-actions">
      <a class="phone-link" href="tel:18004198610" aria-label="Call Eastman">
        <img src="${M(`images/phone-icon.svg`)}" alt="" class="phone-icon" />
        1800 419 8610
      </a>
      <a class="trade-chip" href="${N(`contact-us.html`)}">Trade Enquiry</a>
    </div>

    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-toggle>
      <img src="${M(`images/menu-icon.svg`)}" alt="" />
      <span></span><span></span><span></span>
    </button>

    <div class="desktop-mega-menu" data-desktop-menu>
      <section class="mega-panel mega-panel--card" data-desktop-panel="about" aria-label="About Us submenu">
        <!-- <h2>Company</h2> -->
        <!--<a class="is-current" href="${N(`about.html`)}">Overview &amp; Group Companies</a>-->
        <a href="${N(`about.html`)}">Overview &amp; Group Companies</a>
        <a href="${N(`about.html`)}">Eastman Auto &amp; Power in Nos.</a>
        <a href="${N(`corporate-history.html`)}">Corporate History</a>
        <a href="${N(`corporate-governance.html`)}">Corporate Governance</a>
        <a href="${N(`disclosures.html`)}">Shareholder Information</a>
        <a href="${N(`about.html`)}">CSR</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="research" aria-label="Research and Development submenu">
        <a href="${N(`research-conventional-tubular-batteries.html`)}">Conventional Tubular Batteries</a>
        <a href="${N(`research-power-electronics.html`)}">Power Electronics</a>
        <a href="${N(`research-lithium-batteries.html`)}">Lithium-ion Batteries</a>
        <a href="${N(`research-solar-panels.html`)}">Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="manufacturing" aria-label="Manufacturing Infrastructure submenu">
        <!-- <h2>Manufacturing &amp; Infrastructure</h2> -->
        <a href="${N(`manufacturing-infrastructure.html`)}">Overview</a>
        <a href="${N(`conventional-tubular-batteries.html`)}">Conventional Tubular Batteries</a>
        <a href="${N(`power-electronics.html`)}">Power Electronics</a>
        <a href="${N(`lithium-batteries.html`)}">Lithium-ion Batteries</a>
        <a href="${N(`solar-panels.html`)}">Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="businesses" aria-label="Our Businesses submenu">
        <!-- <h2>Our Businesses</h2> -->
          <a href="${N(`business.html`)}">Overview</a>
        <a href="${N(`last-mile-e-mobility-solutions.html`)}">Last Mile E-Mobility Solutions</a>
        <a href="${N(`residential-solar-with-storage.html`)}">Residential Solar With Storage</a>
        <a href="${N(`continued-energy-solutions.html`)}">Continued Energy Solutions</a>
        <a href="${N(`advanced-electronics-manufacturing.html`)}">Advanced Electronics Manufacturing</a>
        <!--<a href="${N(`business.html#businesses`)}">Global Business</a>-->
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="resources" aria-label="Resources submenu">
        <!-- <h2>Resources</h2> -->
        <a href="${N(`#resources`)}">Overview</a>
        <a href="${N(`#resources`)}">Blogs</a>
        <a href="${N(`#resources`)}">Whitepaper</a>
        <a href="${N(`#resources`)}">Media</a>
        <a href="${N(`#resources`)}">Social Feed</a>
        <a href="${N(`#resources`)}">Videos</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="life" aria-label="Life at Eastman submenu">
        <!-- <h2>Life @ Eastman</h2> -->
        <a href="${N(`#life`)}">Great Place to Work</a>
        <a href="${N(`#life`)}">Careers</a>
      </section>
    </div>
  </header>

  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" data-mobile-menu>
    <div class="mobile-menu-inner" data-lenis-prevent>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">About Us<img src="${M(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${N(`about.html`)}">Explore About Us</a>
          <h3>Company</h3>
          <a href="${N(`about.html`)}">Overview &amp; Group Companies</a>
          <a href="${N(`eapl-in-numbers.html`)}">Eastman in Numbers</a>
          <a href="${N(`about.html`)}">Our Values</a>
          <h3>Governance</h3>
          <a href="${N(`corporate-history.html`)}">Corporate History</a>
          <a href="${N(`corporate-governance.html`)}">Corporate Governance</a>
          <a href="${N(`disclosures.html`)}">Shareholders Information</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Research &amp; Development<img src="${M(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${N(`research-conventional-tubular-batteries.html`)}">Conventional Tubular Batteries</a>
          <a href="${N(`research-power-electronics.html`)}">Power Electronics</a>
          <a href="${N(`research-lithium-batteries.html`)}">Lithium-Ion Batteries</a>
          <a href="${N(`research-solar-panels.html`)}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Manufacturing Infrastructure<img src="${M(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${N(`manufacturing-infrastructure.html`)}">Overview</a>
          <a href="${N(`conventional-tubular-batteries.html`)}">Conventional Tubular Batteries</a>
          <a href="${N(`lithium-batteries.html`)}">Lithium-ion Batteries</a>
          <a href="${N(`power-electronics.html`)}">Power Electronics</a>
          <a href="${N(`solar-panels.html`)}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Our Businesses<img src="${M(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${N(`business.html`)}">Overview</a>
          <a href="${N(`last-mile-e-mobility-solutions.html`)}">Last Mile E-Mobility Solutions</a>
          <a href="${N(`residential-solar-with-storage.html`)}">Solar Solutions</a>
          <a href="${N(`continued-energy-solutions.html`)}">Continued Energy Solutions</a>
          <a href="${N(`advanced-electronics-manufacturing.html`)}">Advanced Electronics Manufacturing</a>
          <a href="${N(`business.html#businesses`)}">Global Businesses</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Resources<img src="${M(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${N(`#resources`)}">Overview</a>
          <a href="${N(`#resources`)}">Blogs</a>
          <a href="${N(`#resources`)}">White Paper</a>
          <a href="${N(`#resources`)}">Media</a>
          <a href="${N(`#resources`)}">Videos</a>
          <a href="${N(`#resources`)}">Social Feed</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Life@Eastman<img src="${M(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${N(`#life`)}">Great Place to Work</a>
          <a href="${N(`#life`)}">Careers</a>
        </div>
      </div>
      <div class="mobile-menu-actions">
        <a class="trade-chip" href="${N(`partner-with-us.html`)}">Partner With Us</a>
        <a class="phone-link" href="tel:18004198610"><img src="${M(`images/phone-icon.svg`)}" alt="" />1800 419 8610</a>
        <a class="trade-chip" href="${N(`contact-us.html`)}">Trade Enquiry</a>
      </div>
    </div>
  </nav>
`,I=`
  <footer class="site-footer" id="contact">
    <div class="footer-grid">
      <div class="footer-column footer-brand-column">
        <a class="footer-brand" href="${N()}" aria-label="Eastman home">
          <img src="${M(`images/footer_logo.svg`)}" alt="Eastman" />
        </a>
        <!-- <p class="footer-about">Eastman Auto &amp; Power Limited (EAPL) is one of India&apos;s leading energy transition companies. For over 3 decades, we have been committed to power, progress and people.</p> -->
        <section class="footer-group">
          <h3>About Us</h3>
          <a href="${N(`about.html`)}">Overview &amp; Group Companies</a>
          <a href="${N(`eapl-in-numbers.html`)}">Eastman Auto &amp; Power in Nos.</a>
          <a href="${N(`corporate-history.html`)}">Corporate History</a>
          <a href="${N(`corporate-governance.html`)}">Corporate Governance</a>
          <a href="${N(`disclosures.html`)}">Shareholder Information</a>
          <a href="${N(`about.html`)}">CSR</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Research &amp; Development</h3>
          <a href="${N(`#research`)}">Overview</a>
          <a href="${N(`#research`)}">Conventional Tubular Batteries</a>
          <a href="${N(`#research`)}">Power Electronics</a>
          <a href="${N(`#research`)}">Lithium-ion Batteries</a>
          <a href="${N(`#research`)}">Solar Panels</a>
        </section>
        <section class="footer-group">
          <h3>Manufacturing Infrastructure</h3>
          <a href="${N(`manufacturing-infrastructure.html`)}">Overview</a>
          <a href="${N(`conventional-tubular-batteries.html`)}">Conventional Tubular Batteries</a>
          <a href="${N(`power-electronics.html`)}">Power Electronics</a>
          <a href="${N(`lithium-batteries.html`)}">Lithium-ion Batteries</a>
          <a href="${N(`solar-panels.html`)}">Solar Panels</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Our Businesses</h3>
          <a href="${N(`business.html`)}">Overview</a>
          <a href="${N(`last-mile-e-mobility-solutions.html`)}">Last Mile E-Mobility Solutions</a>
          <a href="${N(`residential-solar-with-storage.html`)}">Residential Solar with Storage</a>
          <a href="${N(`continued-energy-solutions.html`)}">Continued Energy Solutions</a>
          <a href="${N(`advanced-electronics-manufacturing.html`)}">Advanced Electronics Manufacturing</a>
          <a href="${N(`business.html#businesses`)}">Global Business</a>
        </section>
        <section class="footer-group">
          <h3>Resources</h3>
          <a href="${N(`#resources`)}">Overview</a>
          <a href="${N(`#resources`)}">Blogs</a>
          <a href="${N(`#resources`)}">Whitepaper</a>
          <a href="${N(`#resources`)}">Media</a>
          <a href="${N(`#resources`)}">Social Feed</a>
          <a href="${N(`#resources`)}">Videos</a>
        </section>
      </div>
      <div class="footer-column contact-col">
        <section class="footer-group">
          <h3>Partner With Us</h3>
          <a href="${N(`partner-with-us.html`)}">Become a Channel Partner</a>
        </section>
        <section class="footer-group">
          <h3>Contact Us</h3>
          <h4>INDIA - Corporate</h4>
          <p class="contact-row"><img src="${M(`images/footer-location.svg`)}" alt="" />4th Floor, Plot No. 7, Sector 44, Institutional Area, Gurugram, Haryana - 122003, Haryana India</p>
          <a class="contact-row" href="tel:+911244682650"><img src="${M(`images/footer-phone.svg`)}" alt="" />(0124) 4682650</a>
          <a class="contact-row" href="mailto:corporate@eaplworld.com"><img src="${M(`images/footer-email.svg`)}" alt="" />corporate@eaplworld.com</a>
        </section>
        <section class="footer-group social-group">
          <h4>Social</h4>
          <div class="socials">
            <a href="#" aria-label="Facebook"><img src="${P.facebook}" alt="" /></a>
            <a href="#" aria-label="LinkedIn"><img src="${P.linkedin}" alt="" /></a>
            <a href="#" aria-label="Instagram"><img src="${P.instagram}" alt="" /></a>
            <a href="#" aria-label="YouTube"><img src="${P.youtube}" alt="" /></a>
            <!--<a href="#" aria-label="X"><img src="${P.twitter}" alt="" /></a>-->
          </div>
        </section>
      </div>
    </div>
    <div class="legal">
      <p>&copy; 2026 Eastman Auto &amp; Power Limited. All rights reserved.</p>
      <span>Privacy Policy</span>
      <span>Terms of Conditions</span>
    </div>
  </footer>
`})),R=t((()=>{_(),v(),y(),b(),x(),S(),C(),w(),T(),E(),D(),O(),k(),L(),A(),`scrollRestoration`in window.history&&(window.history.scrollRestoration=`manual`);var e=document.querySelector(`[data-menu-toggle]`),t=document.querySelector(`[data-mobile-menu]`),n=document.querySelector(`[data-header]`),r=document.querySelector(`[data-desktop-menu]`),i=[...document.querySelectorAll(`[data-desktop-trigger]`)],a=[...document.querySelectorAll(`[data-desktop-panel]`)],o=[...document.querySelectorAll(`.mobile-nav-trigger`)],s,c,l,u=``,d,f;function p(){s=new g({duration:1.15,easing:e=>Math.min(1,1.001-2**(-10*e)),smoothWheel:!0});function e(t){s.raf(t),requestAnimationFrame(e)}requestAnimationFrame(e)}function m(){let n=e?.getAttribute(`aria-expanded`)===`true`;e?.setAttribute(`aria-expanded`,`false`),e?.setAttribute(`aria-label`,`Open menu`),t?.classList.remove(`is-open`),document.body.classList.remove(`menu-open`),o.forEach(e=>{e.setAttribute(`aria-expanded`,`false`),e.parentElement?.classList.remove(`is-expanded`)}),n&&s?.start()}function h(){e?.addEventListener(`click`,()=>{let n=e.getAttribute(`aria-expanded`)===`true`;e.setAttribute(`aria-expanded`,String(!n)),e.setAttribute(`aria-label`,n?`Open menu`:`Close menu`),t?.classList.toggle(`is-open`,!n),document.body.classList.toggle(`menu-open`,!n),n?s?.start():s?.stop()}),t?.addEventListener(`click`,e=>{e.target instanceof Element&&e.target.closest(`a`)&&m()}),o.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.parentElement,n=e.getAttribute(`aria-expanded`)!==`true`;o.forEach(t=>{t!==e&&(t.setAttribute(`aria-expanded`,`false`),t.parentElement?.classList.remove(`is-expanded`))}),e.setAttribute(`aria-expanded`,String(n)),t?.classList.toggle(`is-expanded`,n)})})}function j(){window.clearTimeout(c),window.clearTimeout(l),r?.classList.remove(`is-open`),i.forEach(e=>{e.classList.remove(`is-active`),e.setAttribute(`aria-expanded`,`false`)}),a.forEach(e=>e.classList.remove(`is-active`,`is-leaving`)),u=``}function M(e){window.clearTimeout(c),window.clearTimeout(l);let t=a.find(t=>t.dataset.desktopPanel===e);if(!t)return;if(t.classList.contains(`mega-panel--card`)){let n=i.find(t=>t.dataset.desktopTrigger===e)?.getBoundingClientRect(),r=t.getBoundingClientRect().width||306,a=n?.left||0,o=window.innerWidth-r-56;t.style.left=`${Math.round(Math.min(a,o))}px`}r?.classList.add(`is-open`),i.forEach(t=>{let n=t.dataset.desktopTrigger===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-expanded`,String(n))});let n=a.find(e=>e.classList.contains(`is-active`));n&&n!==t&&(n.classList.remove(`is-active`),n.classList.add(`is-leaving`),l=window.setTimeout(()=>n.classList.remove(`is-leaving`),240)),a.forEach(e=>{e!==t&&e!==n&&e.classList.remove(`is-active`,`is-leaving`)}),u!==e&&(t.classList.remove(`is-leaving`),requestAnimationFrame(()=>t.classList.add(`is-active`))),u=e}function N(){window.clearTimeout(c),c=window.setTimeout(j,260)}function P(){i.forEach(e=>{let t=e.dataset.desktopTrigger;e.addEventListener(`mouseenter`,()=>M(t)),e.addEventListener(`focus`,()=>M(t)),e.addEventListener(`click`,()=>{e.getAttribute(`aria-expanded`)===`true`?j():M(t)})}),n?.addEventListener(`mouseenter`,()=>window.clearTimeout(c)),n?.addEventListener(`mouseleave`,N),r?.addEventListener(`mouseenter`,()=>window.clearTimeout(c)),r?.addEventListener(`mouseleave`,N),document.addEventListener(`pointerdown`,e=>{!(e.target instanceof Node)||n?.contains(e.target)||j()}),document.addEventListener(`keydown`,t=>{t.key===`Escape`&&(j(),m(),s?.start(),e?.focus())}),window.addEventListener(`resize`,()=>{u&&M(u)})}function F(){n?.classList.toggle(`is-scrolled`,window.scrollY>12)}function I(){return n?window.matchMedia(`(min-width: 821px)`).matches?-86:-n.offsetHeight:0}function R(){document.addEventListener(`click`,e=>{if(!(e.target instanceof Element))return;let t=e.target.closest(`a[href^="#"]`);if(!(t instanceof HTMLAnchorElement))return;let n=t.getAttribute(`href`);if(!n||n===`#`)return;let r=document.querySelector(n);r&&(e.preventDefault(),m(),s?.scrollTo(r,{offset:I()}))})}function z(e){if(!(e instanceof HTMLAnchorElement)||e.target||e.hasAttribute(`download`)||!e.href||e.protocol!==window.location.protocol||e.origin!==window.location.origin||e.pathname===window.location.pathname&&e.hash)return!1;let t=e.pathname.split(`/`).pop()||`index.html`;return[`index.html`,`about.html`,`eapl-in-numbers.html`,`corporate-history.html`,`leadership.html`,`corporate-governance.html`,`board-committees.html`,`policies.html`,`disclosures.html`,`business.html`,`last-mile-e-mobility-solutions.html`,`residential-solar-with-storage.html`,`continued-energy-solutions.html`,`advanced-electronics-manufacturing.html`,`partner-with-us.html`,`contact-us.html`,`manufacturing-infrastructure.html`,`lithium-batteries.html`,`power-electronics.html`,`solar-panels.html`,`conventional-tubular-batteries.html`].includes(t)}async function B(e,{push:t=!0}={}){let n=await fetch(e,{headers:{"X-Requested-With":`fetch`}});if(!n.ok)throw Error(`Unable to load ${e}`);let r=await n.text(),i=new DOMParser().parseFromString(r,`text/html`),a=i.querySelector(`main`),o=document.querySelector(`main`);if(!a||!o){window.location.href=e;return}o.replaceWith(a),document.title=i.title||document.title,document.body.className=i.body.className,m(),j(),t&&window.history.pushState({},document.title,e),$();let c=window.location.hash?document.querySelector(window.location.hash):null;c?s?.scrollTo(c,{offset:I(),immediate:!0}):(window.scrollTo(0,0),s?.scrollTo(0,{immediate:!0}))}function V(){document.addEventListener(`click`,e=>{if(!(e.target instanceof Element))return;let t=e.target.closest(`a`);z(t)&&(e.preventDefault(),B(t.href).catch(()=>{window.location.href=t.href}))}),window.addEventListener(`popstate`,()=>{B(window.location.href,{push:!1}).catch(()=>window.location.reload())})}function H(e,t,n,r=``,i=0,a=!1){let o=e.toLocaleString(`en-IN`,{maximumFractionDigits:t,minimumFractionDigits:t});return i>0&&t===0&&(o=o.padStart(i,`0`)),n===`GWh`?`${r}${o}<span>GWh</span>`:`${r}${o}${a&&n?` <span>${n}</span>`:n}`}function U(e){if(e.dataset.animated===`true`)return;e.dataset.animated=`true`;let t=Number(e.dataset.value||0),n=Number(e.dataset.decimals||0),r=e.dataset.suffix||``,i=e.dataset.prefix||``,a=Number(e.dataset.pad||0),o=e.hasAttribute(`data-wrap-suffix`),s=performance.now();function c(l){let u=l-s,d=Math.min(u/1400,1);e.innerHTML=H(t*(1-(1-d)**3),n,r,i,a,o),d<1?requestAnimationFrame(c):e.innerHTML=H(t,n,r,i,a,o)}requestAnimationFrame(c)}function W(){let e=document.querySelectorAll(`[data-counter]`),t=new Map;e.forEach(e=>{let n=e.closest(`section`)||e.parentElement;t.has(n)||t.set(n,[]),t.get(n).push(e)});let n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(t.get(e.target)?.forEach(e=>U(e)),n.unobserve(e.target))})},{rootMargin:`0px 0px -12% 0px`,threshold:.2});t.forEach((e,t)=>{e.forEach(e=>{e.dataset.animated=`false`,e.innerHTML=H(0,Number(e.dataset.decimals||0),e.dataset.suffix||``,e.dataset.prefix||``,Number(e.dataset.pad||0),e.hasAttribute(`data-wrap-suffix`))});let r=t.getBoundingClientRect();if(r.top<window.innerHeight&&r.bottom>0){requestAnimationFrame(()=>e.forEach(e=>U(e)));return}n.observe(t)})}function G(){let e=document.querySelectorAll(`main > section, .site-footer`);if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){e.forEach(e=>e.classList.add(`is-visible`));return}let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-visible`),t.unobserve(e.target))})},{rootMargin:`0px 0px -12% 0px`,threshold:.12});e.forEach(e=>{let n=e.getBoundingClientRect(),r=n.top<window.innerHeight&&n.bottom>0;if(e.classList.add(`reveal-section`),r){e.classList.add(`is-visible`);return}t.observe(e)})}function K(){if(!d||!f)return;let e=d.querySelector(`.solution-label`);if(!e)return;let t=d.getBoundingClientRect(),n=d.classList.contains(`wide`);f.textContent=e.textContent||``,f.style.left=`${t.left+t.width/2}px`,f.style.top=`${n?t.bottom+34:t.top-24}px`}function q(){f?.classList.remove(`is-visible`),d=void 0}function J(e){window.matchMedia(`(min-width: 821px)`).matches&&(f||(f=document.createElement(`span`),f.className=`floating-solution-label`,document.body.appendChild(f)),d=e,K(),requestAnimationFrame(()=>f?.classList.add(`is-visible`)))}function Y(){[...document.querySelectorAll(`.solution-card`)].forEach(e=>{e.addEventListener(`mouseenter`,()=>J(e)),e.addEventListener(`focusin`,()=>J(e)),e.addEventListener(`mouseleave`,q),e.addEventListener(`focusout`,t=>{t.relatedTarget instanceof Node&&e.contains(t.relatedTarget)||q()})}),window.addEventListener(`resize`,K),window.addEventListener(`scroll`,K,{passive:!0})}function X(){let e=document.querySelector(`[data-partner-video-slider]`),t=e?.querySelector(`[data-partner-video-track]`),n=e?.querySelector(`[data-partner-video-prev]`),r=e?.querySelector(`[data-partner-video-next]`);if(!t||!n||!r)return;let i=e=>{let n=t.querySelector(`.partner-video-card`);if(!n)return;let r=Number.parseFloat(getComputedStyle(t).gap)||0;t.scrollBy({left:e*(n.getBoundingClientRect().width+r),behavior:`smooth`})};n.addEventListener(`click`,()=>i(-1)),r.addEventListener(`click`,()=>i(1))}function Z(){[...document.querySelectorAll(`[data-director-dialog]`)].forEach(e=>{if(!(e instanceof HTMLDialogElement))return;let t=e.dataset.directorDialog,n=document.querySelector(`[data-director-open="${t}"]`),r=e.querySelector(`[data-director-close]`),i=e.querySelector(`.director-positions`),a=i?.querySelector(`summary`);if(!n||!r)return;let o=()=>{e.close(),document.body.classList.remove(`has-open-dialog`)};n.addEventListener(`click`,()=>{e.showModal(),document.body.classList.add(`has-open-dialog`)}),r.addEventListener(`click`,o),e.addEventListener(`cancel`,()=>document.body.classList.remove(`has-open-dialog`)),e.addEventListener(`click`,t=>{t.target===e&&o()}),a?.addEventListener(`click`,e=>{if(e.preventDefault(),i instanceof HTMLDetailsElement){if(i.open){i.classList.remove(`is-open`),window.setTimeout(()=>{i.open=!1},360);return}i.open=!0,requestAnimationFrame(()=>i.classList.add(`is-open`))}})})}function Q(){document.querySelectorAll(`.profile-card--board`).forEach(e=>{let t=e.querySelector(`[data-director-open]`);t&&e.addEventListener(`click`,e=>{e.target instanceof Node&&t.contains(e.target)||t.click()})})}function $(){Y(),X(),Z(),Q(),G(),W(),F()}function ee(){p(),h(),P(),R(),V(),$(),window.addEventListener(`scroll`,F,{passive:!0})}ee()}));export{S as n,t as r,R as t};