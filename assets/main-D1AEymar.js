var e=(e,t)=>()=>(e&&(t=e(e=0)),t),t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function n(e,t,n){return Math.max(e,Math.min(t,n))}function r(e,t,n){return(1-n)*e+n*t}function i(e,t,n,i){return r(e,t,1-Math.exp(-n*i))}function a(e,t){return(e%t+t)%t}function o(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{n=void 0,e.apply(this,r)},t)}}function s(e,t){return e===1?f:e===2?t:1}var c,l,u,d,f,p,m,h,g,_=e((()=>{c=`1.3.23`,l=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let r=n(0,this.currentTime/this.duration,1);t=r>=1;let i=t?1:this.easing(r);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=i(this.value,this.to,this.lerp*60,e),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:n,duration:r,easing:i,onStart:a,onUpdate:o}){this.from=this.value=e,this.to=t,this.lerp=n,this.duration=r,this.easing=i,this.currentTime=0,this.isRunning=!0,a?.(),this.onUpdate=o}},u=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:n=!0,debounce:r=250}={}){this.wrapper=e,this.content=t,n&&(this.debouncedResize=o(this.resize,r),this.wrapper instanceof Window?window.addEventListener(`resize`,this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener(`resize`,this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},d=class{events={};emit(e,...t){let n=this.events[e]||[];for(let e=0,r=n.length;e<r;e++)n[e]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(e=>t!==e)}}off(e,t){this.events[e]=this.events[e]?.filter(e=>t!==e)}destroy(){this.events={}}},f=100/6,p={passive:!1},m=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new d;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener(`resize`,this.onWindowResize),this.onWindowResize(),this.element.addEventListener(`wheel`,this.onWheel,p),this.element.addEventListener(`touchstart`,this.onTouchStart,p),this.element.addEventListener(`touchmove`,this.onTouchMove,p),this.element.addEventListener(`touchend`,this.onTouchEnd,p)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener(`resize`,this.onWindowResize),this.element.removeEventListener(`wheel`,this.onWheel,p),this.element.removeEventListener(`touchstart`,this.onTouchStart,p),this.element.removeEventListener(`touchmove`,this.onTouchMove,p),this.element.removeEventListener(`touchend`,this.onTouchEnd,p)}onTouchStart=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit(`scroll`,{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e,r=-(t-this.touchStart.x)*this.options.touchMultiplier,i=-(n-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:r,y:i},this.emitter.emit(`scroll`,{deltaX:r,deltaY:i,event:e})};onTouchEnd=e=>{this.emitter.emit(`scroll`,{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:n,deltaMode:r}=e,i=s(r,this.window.width),a=s(r,this.window.height);t*=i,n*=a,t*=this.options.wheelMultiplier,n*=this.options.wheelMultiplier,this.emitter.emit(`scroll`,{deltaX:t,deltaY:n,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},h=e=>Math.min(1,1.001-2**(-10*e)),g=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new l;emitter=new d;dimensions;virtualScroll;constructor({wrapper:e=window,content:t=document.documentElement,eventsTarget:n=e,smoothWheel:r=!0,syncTouch:i=!1,syncTouchLerp:a=.075,touchInertiaExponent:o=1.7,duration:s,easing:l,lerp:d=.1,infinite:f=!1,orientation:p=`vertical`,gestureOrientation:g=p===`horizontal`?`both`:`vertical`,touchMultiplier:_=1,wheelMultiplier:v=1,autoResize:y=!0,prevent:b,virtualScroll:x,overscroll:S=!0,autoRaf:C=!1,anchors:w=!1,autoToggle:T=!1,allowNestedScroll:E=!1,__experimental__naiveDimensions:D=!1,naiveDimensions:O=D,stopInertiaOnNavigate:k=!1}={}){window.lenisVersion=c,window.lenis||(window.lenis={}),window.lenis.version=c,p===`horizontal`&&(window.lenis.horizontal=!0),i===!0&&(window.lenis.touch=!0),(!e||e===document.documentElement)&&(e=window),typeof s==`number`&&typeof l!=`function`?l=h:typeof l==`function`&&typeof s!=`number`&&(s=1),this.options={wrapper:e,content:t,eventsTarget:n,smoothWheel:r,syncTouch:i,syncTouchLerp:a,touchInertiaExponent:o,duration:s,easing:l,lerp:d,infinite:f,gestureOrientation:g,orientation:p,touchMultiplier:_,wheelMultiplier:v,autoResize:y,prevent:b,virtualScroll:x,overscroll:S,autoRaf:C,anchors:w,autoToggle:T,allowNestedScroll:E,naiveDimensions:O,stopInertiaOnNavigate:k},this.dimensions=new u(e,t,{autoResize:y}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.addEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener(`click`,this.onClick),this.options.wrapper.addEventListener(`pointerdown`,this.onPointerDown),this.virtualScroll=new m(n,{touchMultiplier:_,wheelMultiplier:v}),this.virtualScroll.on(`scroll`,this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener(`transitionend`,this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.removeEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener(`pointerdown`,this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener(`click`,this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||(this.isScrolling===`smooth`||this.isScrolling===!1)&&e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent(`scrollend`,{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?`overflow-x`:`overflow-y`;return getComputedStyle(this.rootElement)[e]}checkOverflow(){[`hidden`,`clip`].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes(`overflow`)&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:`instant`}):this.options.wrapper.scrollTo({top:e,behavior:`instant`})}onClick=e=>{let t=e.composedPath().filter(e=>e instanceof HTMLAnchorElement&&e.href).map(e=>new URL(e.href)),n=new URL(window.location.href);if(this.options.anchors){let e=t.find(e=>n.host===e.host&&n.pathname===e.pathname&&e.hash);if(e){let t=typeof this.options.anchors==`object`&&this.options.anchors?this.options.anchors:void 0,n=`#${e.hash.split(`#`)[1]}`;this.scrollTo(n,t);return}}if(this.options.stopInertiaOnNavigate&&t.some(e=>n.host===e.host&&n.pathname!==e.pathname)){this.reset();return}};onPointerDown=e=>{e.button===1&&this.reset()};onVirtualScroll=e=>{if(typeof this.options.virtualScroll==`function`&&this.options.virtualScroll(e)===!1)return;let{deltaX:t,deltaY:n,event:r}=e;if(this.emitter.emit(`virtual-scroll`,{deltaX:t,deltaY:n,event:r}),r.ctrlKey||r.lenisStopPropagation)return;let i=r.type.includes(`touch`),a=r.type.includes(`wheel`);this.isTouching=r.type===`touchstart`||r.type===`touchmove`;let o=t===0&&n===0;if(this.options.syncTouch&&i&&r.type===`touchstart`&&o&&!this.isStopped&&!this.isLocked){this.reset();return}let s=this.options.gestureOrientation===`vertical`&&n===0||this.options.gestureOrientation===`horizontal`&&t===0;if(o||s)return;let c=r.composedPath();c=c.slice(0,c.indexOf(this.rootElement));let l=this.options.prevent,u=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`;if(c.find(e=>e instanceof HTMLElement&&(typeof l==`function`&&l?.(e)||e.hasAttribute?.(`data-lenis-prevent`)||u===`vertical`&&e.hasAttribute?.(`data-lenis-prevent-vertical`)||u===`horizontal`&&e.hasAttribute?.(`data-lenis-prevent-horizontal`)||i&&e.hasAttribute?.(`data-lenis-prevent-touch`)||a&&e.hasAttribute?.(`data-lenis-prevent-wheel`)||this.options.allowNestedScroll&&this.hasNestedScroll(e,{deltaX:t,deltaY:n}))))return;if(this.isStopped||this.isLocked){r.cancelable&&r.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&a)){this.isScrolling=`native`,this.animate.stop(),r.lenisStopPropagation=!0;return}let d=n;this.options.gestureOrientation===`both`?d=Math.abs(n)>Math.abs(t)?n:t:this.options.gestureOrientation===`horizontal`&&(d=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&n>0||this.animatedScroll===this.limit&&n<0))&&(r.lenisStopPropagation=!0),r.cancelable&&r.preventDefault();let f=i&&this.options.syncTouch,p=i&&r.type===`touchend`;p&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...f?{lerp:p?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit(`scroll`,this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling===`native`){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling=`native`),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty(`overflow`);return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty(`overflow`,`clip`);return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:r=!1,lock:i=!1,programmatic:a=!0,lerp:o=a?this.options.lerp:void 0,duration:s=a?this.options.duration:void 0,easing:c=a?this.options.easing:void 0,onStart:l,onComplete:u,force:d=!1,userData:f}={}){if((this.isStopped||this.isLocked)&&!d)return;let p=e,m=t;if(typeof p==`string`&&[`top`,`left`,`start`,`#`].includes(p))p=0;else if(typeof p==`string`&&[`bottom`,`right`,`end`].includes(p))p=this.limit;else{let e=null;if(typeof p==`string`?(e=document.querySelector(p),e||(p===`#top`?p=0:console.warn(`Lenis: Target not found`,p))):p instanceof HTMLElement&&p?.nodeType&&(e=p),e){if(this.options.wrapper!==window){let e=this.rootElement.getBoundingClientRect();m-=this.isHorizontal?e.left:e.top}let t=e.getBoundingClientRect(),n=getComputedStyle(e),r=this.isHorizontal?Number.parseFloat(n.scrollMarginLeft):Number.parseFloat(n.scrollMarginTop),i=getComputedStyle(this.rootElement),a=this.isHorizontal?Number.parseFloat(i.scrollPaddingLeft):Number.parseFloat(i.scrollPaddingTop);p=(this.isHorizontal?t.left:t.top)+this.animatedScroll-(Number.isNaN(r)?0:r)-(Number.isNaN(a)?0:a)}}if(typeof p==`number`){if(p+=m,this.options.infinite){if(a){this.targetScroll=this.animatedScroll=this.scroll;let e=p-this.animatedScroll;e>this.limit/2?p-=this.limit:e<-this.limit/2&&(p+=this.limit)}}else p=n(0,p,this.limit);if(p===this.targetScroll){l?.(this),u?.(this);return}if(this.userData=f??{},r){this.animatedScroll=this.targetScroll=p,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}a||(this.targetScroll=p),typeof s==`number`&&typeof c!=`function`?c=h:typeof c==`function`&&typeof s!=`number`&&(s=1),this.animate.fromTo(this.animatedScroll,p,{duration:s,easing:c,lerp:o,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling=`smooth`,l?.(this)},onUpdate:(e,t)=>{this.isScrolling=`smooth`,this.lastVelocity=this.velocity,this.velocity=e-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=e,this.setScroll(this.scroll),a&&(this.targetScroll=e),t||this.emit(),t&&(this.reset(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:n}){let r=Date.now();e._lenis||={};let i=e._lenis,a,o,s,c,l,u,d,f,p,m;if(r-(i.time??0)>2e3){i.time=Date.now();let t=window.getComputedStyle(e);if(i.computedStyle=t,a=[`auto`,`overlay`,`scroll`].includes(t.overflowX),o=[`auto`,`overlay`,`scroll`].includes(t.overflowY),l=[`auto`].includes(t.overscrollBehaviorX),u=[`auto`].includes(t.overscrollBehaviorY),i.hasOverflowX=a,i.hasOverflowY=o,!(a||o))return!1;d=e.scrollWidth,f=e.scrollHeight,p=e.clientWidth,m=e.clientHeight,s=d>p,c=f>m,i.isScrollableX=s,i.isScrollableY=c,i.scrollWidth=d,i.scrollHeight=f,i.clientWidth=p,i.clientHeight=m,i.hasOverscrollBehaviorX=l,i.hasOverscrollBehaviorY=u}else s=i.isScrollableX,c=i.isScrollableY,a=i.hasOverflowX,o=i.hasOverflowY,d=i.scrollWidth,f=i.scrollHeight,p=i.clientWidth,m=i.clientHeight,l=i.hasOverscrollBehaviorX,u=i.hasOverscrollBehaviorY;if(!(a&&s||o&&c))return!1;let h=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`,g,_,v,y,b,x;if(h===`horizontal`)g=Math.round(e.scrollLeft),_=d-p,v=t,y=a,b=s,x=l;else if(h===`vertical`)g=Math.round(e.scrollTop),_=f-m,v=n,y=o,b=c,x=u;else return!1;return!x&&(g>=_||g<=0)?!0:(v>0?g<_:g>0)&&y&&b}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?`x`:`y`]}get isHorizontal(){return this.options.orientation===`horizontal`}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?a(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling===`smooth`}get className(){let e=`lenis`;return this.options.autoToggle&&(e+=` lenis-autoToggle`),this.isStopped&&(e+=` lenis-stopped`),this.isLocked&&(e+=` lenis-locked`),this.isScrolling&&(e+=` lenis-scrolling`),this.isScrolling===`smooth`&&(e+=` lenis-smooth`),e}updateClassName(){this.cleanUpClassName(),this.className.split(` `).forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))(e===`lenis`||e.startsWith(`lenis-`))&&this.rootElement.classList.remove(e)}}}));function v(){let e=document.querySelector(`[data-layout-header]`),t=document.querySelector(`[data-layout-footer]`);e&&(e.outerHTML=T),t&&(t.outerHTML=E)}var y,b,x,S,C,w,T,E,D=e((()=>{y=`/eastman/`,b=e=>`${y}${e}`,x=(e=``)=>`${y}${e.replace(/\.html(?=($|[?#]))/,``)}`,S=new URL(`/eastman/assets/footer-logo-new-nKpyO-tI.svg`,``+import.meta.url).href,C=new URL(`/eastman/assets/eastman-logo-new-0kuM3bB_.svg`,``+import.meta.url).href,w={facebook:new URL(`/eastman/assets/facebook-BqE2A-E1.svg`,``+import.meta.url).href,instagram:new URL(`/eastman/assets/instagram-k1mMKbsg.svg`,``+import.meta.url).href,linkedin:new URL(`/eastman/assets/linkedin_icn-Dk5wg_if.svg`,``+import.meta.url).href,twitter:new URL(`/eastman/assets/twitter-D059WXAu.svg`,``+import.meta.url).href,youtube:new URL(`/eastman/assets/youtube_icn-BtngQrcT.svg`,``+import.meta.url).href},T=`
  <header class="site-header" data-header>
    <a class="brand" href="${x()}" aria-label="Eastman home">
      <img src="${S}" alt="Eastman" />
    </a>

    <div class="header-nav-stack">
      <nav class="utility-nav" aria-label="Utility navigation">
        <a href="https://www.eastmanassure.com" target="_blank" rel="noopener noreferrer" aria-label="Eastman Assure Service">Eastman Assure Service</a>
        <a href="https://jrseastman.com" target="_blank" rel="noopener noreferrer" aria-label="About JRS Eastman Group">About JRS Eastman Group</a>
        <a href="${x(`partner-with-us`)}">Partner With Us</a>
        <a href="${x(`contact-us`)}">Contact us</a>
      </nav>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <button type="button" data-desktop-trigger="about" aria-expanded="false">About Us<img src="${b(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="research" data-nav-href="${x(`research-development/?tab=tubular#focus-areas`)}" aria-expanded="false">Research &amp; Development<img src="${b(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="manufacturing" aria-expanded="false">Manufacturing Infrastructure<img src="${b(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="businesses" aria-expanded="false">Our Businesses<img src="${b(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="resources" aria-expanded="false">Resources<img src="${b(`images/nav-chevron.svg`)}" alt="" class="nav-chevron" /></button>
        <a href="${x(`life-at-eastman`)}">Life@Eastman</a>
      </nav>
    </div>

    <div class="header-actions">
      <a class="phone-link" href="tel:18004198610" aria-label="Call Eastman">
        <img src="${b(`images/phone-icon.svg`)}" alt="" class="phone-icon" />
        1800 419 8610
      </a>
      <a class="trade-chip" href="${x(`contact-us`)}">Trade Enquiry</a>
    </div>

    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-toggle>
      <img src="${b(`images/menu-icon.svg`)}" alt="" />
      <span></span><span></span><span></span>
    </button>

    <div class="desktop-mega-menu" data-desktop-menu>
      <section class="mega-panel mega-panel--card" data-desktop-panel="about" aria-label="About Us submenu">
        <!-- <h2>Company</h2> -->
        <!--<a class="is-current" href="${x(`about-us`)}">Overview &amp; Group Companies</a>-->
        <a href="${x(`about-us`)}">Overview &amp; Group Companies</a>
        <a href="${x(`eapl-in-numbers`)}">Eastman Auto &amp; Power in Nos.</a>
        <a href="${x(`corporate-history`)}">Corporate History</a>
        <a href="${x(`corporate-governance`)}">Corporate Governance</a>
        <!--<a href="${x(`leadership-team`)}">Leadership Team</a>
        <a href="${x(`board-committee`)}">Board Committee</a>-->
        <a href="${x(`shareholders-information`)}">Shareholder Information</a>
        <a href="https://jrseastman.com/csr" target="_blank" rel="noopener noreferrer">CSR</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="research" aria-label="Research and Development submenu">
        <a href="${x(`research-development/?tab=tubular#focus-areas`)}">Conventional Tubular Batteries</a>
        <a href="${x(`research-development/?tab=power#focus-areas`)}">Power Electronics</a>
        <a href="${x(`research-development/?tab=lithium#focus-areas`)}">Lithium-ion Batteries</a>
        <a href="${x(`research-development/?tab=solar#focus-areas`)}">Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="manufacturing" aria-label="Manufacturing Infrastructure submenu">
        <!-- <h2>Manufacturing &amp; Infrastructure</h2> -->
        <a href="${x(`manufacturing-infrastructure`)}">Overview</a>
        <a href="${x(`manufacturing-infrastructure/conventional-tubular-batteries`)}">Conventional Tubular Batteries</a>
        <a href="${x(`manufacturing-infrastructure/power-electronics`)}">Power Electronics</a>
        <a href="${x(`manufacturing-infrastructure/lithium-batteries`)}">Lithium-ion Batteries</a>
        <a href="${x(`manufacturing-infrastructure/solar-panels`)}">Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="businesses" aria-label="Our Businesses submenu">
        <!-- <h2>Our Businesses</h2> -->
          <a href="${x(`our-businesses`)}">Overview</a>
        <a href="${x(`our-businesses/last-mile-e-mobility-solutions`)}">Last Mile E-Mobility Solutions</a>
        <a href="${x(`our-businesses/residential-solar-with-storage`)}">Residential Solar With Storage</a>
        <a href="${x(`our-businesses/continued-energy-solutions`)}">Continued Energy Solutions</a>
        <a href="${x(`our-businesses/advanced-electronics-manufacturing`)}">Advanced Electronics Manufacturing</a>
        <!--<a href="${x(`our-businesses#businesses`)}">Global Business</a>-->
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="resources" aria-label="Resources submenu">
        <!-- <h2>Resources</h2> -->
        <a href="${x(`resources`)}">Overview</a>
        <a href="${x(`blog`)}">Blogs</a>
        <a href="${x(`white-papers`)}">White Papers</a>
        <a href="${x(`media-news`)}">Media</a>
        <a href="${x(`social-feed`)}">Social Feed</a>
        <a href="${x(`videos`)}">Videos</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="life" aria-label="Life at Eastman submenu">
        <!-- <h2>Life @ Eastman</h2> -->
        <!-- <a href="${x(`#life`)}">Great Place to Work</a>
        <a href="${x(`#life`)}">Careers</a> -->
      </section>
    </div>
  </header>

  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" data-mobile-menu>
    <div class="mobile-menu-inner" data-lenis-prevent>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">About Us<img src="${b(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${x(`about-us`)}">Explore About Us</a>
          <h3>Company</h3>
          <a href="${x(`about-us`)}">Overview &amp; Group Companies</a>
          <a href="${x(`eapl-in-numbers`)}">Eastman in Numbers</a>
          <a href="${x(`about-us`)}">Our Values</a>
          <h3>Governance</h3>
          <a href="${x(`corporate-history`)}">Corporate History</a>
          <a href="${x(`corporate-governance`)}">Corporate Governance</a>
          <!--<a href="${x(`leadership-team`)}">Leadership Team</a>
          <a href="${x(`board-committee`)}">Board Committee</a>-->
          <a href="${x(`shareholders-information`)}">Shareholders Information</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Research &amp; Development<img src="${b(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${x(`research-development/?tab=tubular#focus-areas`)}">Explore Research &amp; Development</a>
          <a href="${x(`research-development/?tab=tubular#focus-areas`)}">Conventional Tubular Batteries</a>
          <a href="${x(`research-development/?tab=power#focus-areas`)}">Power Electronics</a>
          <a href="${x(`research-development/?tab=lithium#focus-areas`)}">Lithium-Ion Batteries</a>
          <a href="${x(`research-development/?tab=solar#focus-areas`)}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Manufacturing Infrastructure<img src="${b(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${x(`manufacturing-infrastructure`)}">Overview</a>
          <a href="${x(`manufacturing-infrastructure/conventional-tubular-batteries`)}">Conventional Tubular Batteries</a>
          <a href="${x(`manufacturing-infrastructure/lithium-batteries`)}">Lithium-ion Batteries</a>
          <a href="${x(`manufacturing-infrastructure/power-electronics`)}">Power Electronics</a>
          <a href="${x(`manufacturing-infrastructure/solar-panels`)}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Our Businesses<img src="${b(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${x(`our-businesses`)}">Overview</a>
          <a href="${x(`our-businesses/last-mile-e-mobility-solutions`)}">Last Mile E-Mobility Solutions</a>
          <a href="${x(`our-businesses/residential-solar-with-storage`)}">Solar Solutions</a>
          <a href="${x(`our-businesses/continued-energy-solutions`)}">Continued Energy Solutions</a>
          <a href="${x(`our-businesses/advanced-electronics-manufacturing`)}">Advanced Electronics Manufacturing</a>
          <!--<a href="${x(`our-businesses#businesses`)}">Global Businesses</a>-->
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Resources<img src="${b(`images/nav-chevron.svg`)}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${x(`resources`)}">Overview</a>
          <a href="${x(`blog`)}">Blogs</a>
          <a href="${x(`white-papers`)}">White Paper</a>
          <a href="${x(`media-news`)}">Media</a>
          <a href="${x(`videos`)}">Videos</a>
          <a href="${x(`social-feed`)}">Social Feed</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <a class="mobile-direct-link mobile-direct-link--no-arrow" href="${x(`life-at-eastman`)}">Life@Eastman</a>
        <!-- <div class="mobile-submenu">
          <a href="${x(`#life`)}">Great Place to Work</a>
          <a href="${x(`#life`)}">Careers</a>
        </div> -->
      </div>
      <div class="mobile-menu-actions">
        <a class="trade-chip" href="${x(`partner-with-us`)}">Partner With Us</a>
        <a class="phone-link" href="tel:18004198610"><img src="${b(`images/phone-icon.svg`)}" alt="" />1800 419 8610</a>
        <a class="trade-chip" href="${x(`contact-us`)}">Trade Enquiry</a>
      </div>
    </div>
  </nav>
`,E=`
  <footer class="site-footer" id="contact">
    <div class="footer-grid">
      <div class="footer-column footer-brand-column">
        <a class="footer-brand" href="${x()}" aria-label="Eastman home">
          <img src="${C}" alt="Eastman" />
        </a>
        <!-- <p class="footer-about">Eastman Auto &amp; Power Limited (EAPL) is one of India&apos;s leading energy transition companies. For over 3 decades, we have been committed to power, progress and people.</p> -->
        <section class="footer-group">
          <h3>About Us</h3>
          <a href="${x(`about-us`)}">Overview &amp; Group Companies</a>
          <a href="${x(`eapl-in-numbers`)}">Eastman Auto &amp; Power in Nos.</a>
          <a href="${x(`corporate-history`)}">Corporate History</a>
          <a href="${x(`corporate-governance`)}">Corporate Governance</a>
          <!--<a href="${x(`leadership-team`)}">Leadership Team</a>
          <a href="${x(`board-committee`)}">Board Committee</a>-->
          <a href="${x(`shareholders-information`)}">Shareholder Information</a>
          <a href="https://jrseastman.com/csr" target="_blank" rel="noopener noreferrer">CSR</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Research &amp; Development</h3>
          <!--<a href="${x(`#research`)}">Overview</a>-->
          <a href="${x(`research-development/?tab=tubular#focus-areas`)}">Conventional Tubular Batteries</a>
          <a href="${x(`research-development/?tab=power#focus-areas`)}">Power Electronics</a>
          <a href="${x(`research-development/?tab=lithium#focus-areas`)}">Lithium-ion Batteries</a>
          <a href="${x(`research-development/?tab=solar#focus-areas`)}">Solar Panels</a>
        </section>
        <section class="footer-group">
          <h3>Manufacturing Infrastructure</h3>
          <a href="${x(`manufacturing-infrastructure`)}">Overview</a>
          <a href="${x(`manufacturing-infrastructure/conventional-tubular-batteries`)}">Conventional Tubular Batteries</a>
          <a href="${x(`manufacturing-infrastructure/power-electronics`)}">Power Electronics</a>
          <a href="${x(`manufacturing-infrastructure/lithium-batteries`)}">Lithium-ion Batteries</a>
          <a href="${x(`manufacturing-infrastructure/solar-panels`)}">Solar Panels</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Our Businesses</h3>
          <a href="${x(`our-businesses`)}">Overview</a>
          <a href="${x(`our-businesses/last-mile-e-mobility-solutions`)}">Last Mile E-Mobility Solutions</a>
          <a href="${x(`our-businesses/residential-solar-with-storage`)}">Residential Solar with Storage</a>
          <a href="${x(`our-businesses/continued-energy-solutions`)}">Continued Energy Solutions</a>
          <a href="${x(`our-businesses/advanced-electronics-manufacturing`)}">Advanced Electronics Manufacturing</a>
          <!--<a href="${x(`our-businesses#businesses`)}">Global Business</a>-->
        </section>
        <section class="footer-group">
          <h3>Resources</h3>
          <a href="${x(`#resources`)}">Overview</a>
          <a href="${x(`#resources`)}">Blogs</a>
          <a href="${x(`#resources`)}">Whitepaper</a>
          <a href="${x(`#resources`)}">Media</a>
          <a href="${x(`#resources`)}">Social Feed</a>
          <a href="${x(`#resources`)}">Videos</a>
        </section>
      </div>
      <div class="footer-column contact-col">
        <section class="footer-group">
          <h3>Partner With Us</h3>
          <a href="${x(`partner-with-us`)}">Become a Channel Partner</a>
        </section>
        <section class="footer-group">
          <h3>Contact Us</h3>
          <h4>INDIA - Corporate</h4>
          <p class="contact-row"><img src="${b(`images/footer-location.svg`)}" alt="" />4th Floor, Quattro Tower A, Plot No. 249-E, Udyog Vihar Phase IV, Industrial Complex Dundahera, Gurgaon - 122016, Haryana, India</p>
          <a class="contact-row" href="tel:+911244682650"><img src="${b(`images/footer-phone.svg`)}" alt="" />(0124) 4682650</a>
          <a class="contact-row" href="mailto:corporate@eaplworld.com"><img src="${b(`images/footer-email.svg`)}" alt="" />corporate@eaplworld.com</a>
        </section>
        <section class="footer-group social-group">
          <h4>Social</h4>
          <div class="socials">
            <a href="https://www.facebook.com/EastmanIndia/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><img src="${w.facebook}" alt="" /></a>
            <a href="https://www.linkedin.com/company/eastman-auto-power-limited/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><img src="${w.linkedin}" alt="" /></a>
            <a href="https://www.instagram.com/eastman_india/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src="${w.instagram}" alt="" /></a>
            <a href="https://www.youtube.com/@eastmanindia/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><img src="${w.youtube}" alt="" /></a>
            <!--<a href="#" aria-label="X"><img src="${w.twitter}" alt="" /></a>-->
          </div>
        </section>
      </div>
    </div>
    <div class="legal">
      <p>&copy; 2026 Eastman Auto &amp; Power Limited. All rights reserved.</p>
      <span>Privacy Policy</span>
      <a href="${x(`terms-and-conditions`)}">Terms of Conditions</a>
    </div>
  </footer>
`})),O=t((()=>{_(),D(),v(),`scrollRestoration`in window.history&&(window.history.scrollRestoration=`manual`);var e=document.querySelector(`[data-menu-toggle]`),t=document.querySelector(`[data-mobile-menu]`),n=document.querySelector(`[data-header]`),r=document.querySelector(`[data-desktop-menu]`),i=[...document.querySelectorAll(`[data-desktop-trigger]`)],a=[...document.querySelectorAll(`[data-desktop-panel]`)],o=[...document.querySelectorAll(`.mobile-nav-trigger`)],s,c,l,u=``,d,f;function p(){s=new g({duration:1.15,easing:e=>Math.min(1,1.001-2**(-10*e)),smoothWheel:!0});function e(t){s.raf(t),requestAnimationFrame(e)}requestAnimationFrame(e)}function m(){let n=e?.getAttribute(`aria-expanded`)===`true`;e?.setAttribute(`aria-expanded`,`false`),e?.setAttribute(`aria-label`,`Open menu`),t?.classList.remove(`is-open`),document.body.classList.remove(`menu-open`),o.forEach(e=>{e.setAttribute(`aria-expanded`,`false`),e.parentElement?.classList.remove(`is-expanded`)}),n&&s?.start()}function h(){e?.addEventListener(`click`,()=>{let n=e.getAttribute(`aria-expanded`)===`true`;e.setAttribute(`aria-expanded`,String(!n)),e.setAttribute(`aria-label`,n?`Open menu`:`Close menu`),t?.classList.toggle(`is-open`,!n),document.body.classList.toggle(`menu-open`,!n),n?s?.start():s?.stop()}),t?.addEventListener(`click`,e=>{e.target instanceof Element&&e.target.closest(`a`)&&m()}),o.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.parentElement,n=e.getAttribute(`aria-expanded`)!==`true`;o.forEach(t=>{t!==e&&(t.setAttribute(`aria-expanded`,`false`),t.parentElement?.classList.remove(`is-expanded`))}),e.setAttribute(`aria-expanded`,String(n)),t?.classList.toggle(`is-expanded`,n)})})}function y(){window.clearTimeout(c),window.clearTimeout(l),r?.classList.remove(`is-open`),i.forEach(e=>{e.classList.remove(`is-active`),e.setAttribute(`aria-expanded`,`false`)}),a.forEach(e=>e.classList.remove(`is-active`,`is-leaving`)),u=``}function b(e){window.clearTimeout(c),window.clearTimeout(l);let t=a.find(t=>t.dataset.desktopPanel===e);if(!t)return;if(t.classList.contains(`mega-panel--card`)){let n=i.find(t=>t.dataset.desktopTrigger===e)?.getBoundingClientRect(),r=t.getBoundingClientRect().width||306,a=n?.left||0,o=window.innerWidth-r-56;t.style.left=`${Math.round(Math.min(a,o))}px`}r?.classList.add(`is-open`),i.forEach(t=>{let n=t.dataset.desktopTrigger===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-expanded`,String(n))});let n=a.find(e=>e.classList.contains(`is-active`));n&&n!==t&&(n.classList.remove(`is-active`),n.classList.add(`is-leaving`),l=window.setTimeout(()=>n.classList.remove(`is-leaving`),240)),a.forEach(e=>{e!==t&&e!==n&&e.classList.remove(`is-active`,`is-leaving`)}),u!==e&&(t.classList.remove(`is-leaving`),requestAnimationFrame(()=>t.classList.add(`is-active`))),u=e}function x(){window.clearTimeout(c),c=window.setTimeout(y,260)}function S(){i.forEach(e=>{let t=e.dataset.desktopTrigger;e.addEventListener(`mouseenter`,()=>b(t)),e.addEventListener(`focus`,()=>b(t)),e.addEventListener(`click`,()=>{if(e.dataset.navHref){window.location.href=e.dataset.navHref;return}e.getAttribute(`aria-expanded`)===`true`?y():b(t)})}),n?.addEventListener(`mouseenter`,()=>window.clearTimeout(c)),n?.addEventListener(`mouseleave`,x),r?.addEventListener(`mouseenter`,()=>window.clearTimeout(c)),r?.addEventListener(`mouseleave`,x),document.addEventListener(`pointerdown`,e=>{!(e.target instanceof Node)||n?.contains(e.target)||y()}),document.addEventListener(`keydown`,t=>{t.key===`Escape`&&(y(),m(),s?.start(),e?.focus())}),window.addEventListener(`resize`,()=>{u&&b(u)})}function C(){n?.classList.toggle(`is-scrolled`,window.scrollY>12)}function w(){return n?window.matchMedia(`(min-width: 821px)`).matches?-86:-n.offsetHeight:0}function T(){document.addEventListener(`click`,e=>{if(!(e.target instanceof Element))return;let t=e.target.closest(`a[href^="#"]`);if(!(t instanceof HTMLAnchorElement))return;let n=t.getAttribute(`href`);if(!n||n===`#`)return;let r=document.querySelector(n);r&&(e.preventDefault(),m(),s?.scrollTo(r,{offset:w()}))})}function E(e,t,n,r=``,i=0,a=!1){let o=e.toLocaleString(`en-IN`,{maximumFractionDigits:t,minimumFractionDigits:t});return i>0&&t===0&&(o=o.padStart(i,`0`)),n===`GWh`?`${r}${o}<span>GWh</span>`:`${r}${o}${a&&n?` <span>${n}</span>`:n}`}function O(e){if(e.dataset.animated===`true`)return;e.dataset.animated=`true`;let t=Number(e.dataset.value||0),n=Number(e.dataset.decimals||0),r=e.dataset.suffix||``,i=e.dataset.prefix||``,a=Number(e.dataset.pad||0),o=e.hasAttribute(`data-wrap-suffix`),s=performance.now();function c(l){let u=l-s,d=Math.min(u/1400,1);e.innerHTML=E(t*(1-(1-d)**3),n,r,i,a,o),d<1?requestAnimationFrame(c):e.innerHTML=E(t,n,r,i,a,o)}requestAnimationFrame(c)}function k(){let e=document.querySelectorAll(`[data-counter]`),t=new Map;e.forEach(e=>{let n=e.closest(`section`)||e.parentElement;t.has(n)||t.set(n,[]),t.get(n).push(e)});let n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(t.get(e.target)?.forEach(e=>O(e)),n.unobserve(e.target))})},{rootMargin:`0px 0px -12% 0px`,threshold:.2});t.forEach((e,t)=>{e.forEach(e=>{e.dataset.animated=`false`,e.innerHTML=E(0,Number(e.dataset.decimals||0),e.dataset.suffix||``,e.dataset.prefix||``,Number(e.dataset.pad||0),e.hasAttribute(`data-wrap-suffix`))}),n.observe(t)})}function A(){let e=document.querySelectorAll(`main > section, .site-footer`);if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){e.forEach(e=>e.classList.add(`is-visible`));return}let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-visible`),t.unobserve(e.target))})},{rootMargin:`0px 0px -12% 0px`,threshold:.12});e.forEach(e=>{let n=e.getBoundingClientRect(),r=n.top<window.innerHeight&&n.bottom>0;if(e.classList.add(`reveal-section`),r){e.classList.add(`is-visible`);return}t.observe(e)})}function j(){if(!d||!f)return;let e=d.querySelector(`.solution-label`);if(!e)return;let t=d.getBoundingClientRect(),n=d.classList.contains(`wide`);f.textContent=e.textContent||``,f.style.left=`${t.left+t.width/2}px`,f.style.top=`${n?t.bottom+34:t.top-24}px`}function M(){f?.classList.remove(`is-visible`),d=void 0}function N(e){window.matchMedia(`(min-width: 821px)`).matches&&(f||(f=document.createElement(`span`),f.className=`floating-solution-label`,document.body.appendChild(f)),d=e,j(),requestAnimationFrame(()=>f?.classList.add(`is-visible`)))}function P(){[...document.querySelectorAll(`.solution-card`)].forEach(e=>{e.addEventListener(`mouseenter`,()=>N(e)),e.addEventListener(`focusin`,()=>N(e)),e.addEventListener(`mouseleave`,M),e.addEventListener(`focusout`,t=>{t.relatedTarget instanceof Node&&e.contains(t.relatedTarget)||M()})}),window.addEventListener(`resize`,j),window.addEventListener(`scroll`,j,{passive:!0})}function F(){let e=document.querySelector(`[data-partner-video-slider]`),t=e?.querySelector(`[data-partner-video-track]`),n=e?.querySelector(`[data-partner-video-prev]`),r=e?.querySelector(`[data-partner-video-next]`);if(!t||!n||!r)return;let i=e=>{let n=t.querySelector(`.partner-video-card`);if(!n)return;let r=Number.parseFloat(getComputedStyle(t).gap)||0;t.scrollBy({left:e*(n.getBoundingClientRect().width+r),behavior:`smooth`})};n.addEventListener(`click`,()=>i(-1)),r.addEventListener(`click`,()=>i(1))}function I(){document.querySelectorAll(`.manufacturing-snapshots .snapshot-grid`).forEach((e,t)=>{if(e.dataset.sliderReady===`true`)return;e.dataset.sliderReady=`true`;let n=document.createElement(`div`),r=document.createElement(`div`),i=document.createElement(`div`),a=document.createElement(`button`),o=document.createElement(`button`),s=e.closest(`.manufacturing-snapshots`)?.querySelector(`h2`),c=s?.textContent.trim()||`Plant snapshots`;n.className=`snapshot-slider`,r.className=`snapshot-slider__heading`,i.className=`snapshot-slider__controls`,a.className=`snapshot-slider__arrow snapshot-slider__arrow--previous`,o.className=`snapshot-slider__arrow snapshot-slider__arrow--next`,a.type=`button`,o.type=`button`,a.setAttribute(`aria-label`,`Previous ${c}`),o.setAttribute(`aria-label`,`Next ${c}`),a.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7"/></svg>`,o.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7"/></svg>`,e.id=e.id||`snapshot-slider-${t+1}`,e.setAttribute(`role`,`region`),e.setAttribute(`aria-label`,c),e.setAttribute(`tabindex`,`0`),a.setAttribute(`aria-controls`,e.id),o.setAttribute(`aria-controls`,e.id),s&&(s.parentNode.insertBefore(r,s),r.append(s,i)),e.parentNode.insertBefore(n,e),n.append(e),i.append(a,o);let l=t=>{let n=e.querySelector(`img`);if(!n)return;let r=Number.parseFloat(getComputedStyle(e).gap)||0;e.scrollBy({left:t*(n.getBoundingClientRect().width+r),behavior:`smooth`})},u=()=>{let t=Math.max(0,e.scrollWidth-e.clientWidth);i.classList.toggle(`is-hidden`,t<=2),a.disabled=e.scrollLeft<=2,o.disabled=e.scrollLeft>=t-2};a.addEventListener(`click`,()=>l(-1)),o.addEventListener(`click`,()=>l(1)),e.addEventListener(`scroll`,u,{passive:!0}),window.addEventListener(`resize`,u),u();let d=0,f=0,p=!1,m=!1;e.addEventListener(`pointerdown`,t=>{t.pointerType!==`touch`&&(d=t.clientX,f=e.scrollLeft,p=!0,m=!1,e.classList.add(`is-dragging`))}),e.addEventListener(`pointermove`,t=>{if(!p)return;let n=t.clientX-d;Math.abs(n)>5&&(m=!0),e.scrollLeft=f-n});let h=t=>{p&&(p=!1,e.classList.remove(`is-dragging`))};e.addEventListener(`pointerup`,h),e.addEventListener(`pointercancel`,h),e.addEventListener(`dragstart`,e=>e.preventDefault());let g=[...e.querySelectorAll(`img`)],_=document.createElement(`dialog`),v=document.createElement(`img`),y=document.createElement(`button`),b=document.createElement(`button`),x=document.createElement(`button`),S=document.createElement(`div`),C=document.createElement(`button`),w=document.createElement(`button`),T=document.createElement(`button`),E=0,D=1;_.className=`snapshot-lightbox`,_.setAttribute(`aria-label`,`${c} image viewer`),v.className=`snapshot-lightbox__image`,y.className=`snapshot-lightbox__close`,b.className=`snapshot-lightbox__nav snapshot-lightbox__nav--previous`,x.className=`snapshot-lightbox__nav snapshot-lightbox__nav--next`,S.className=`snapshot-lightbox__zoom`,C.className=w.className=T.className=`snapshot-lightbox__zoom-button`,y.type=b.type=x.type=C.type=w.type=T.type=`button`,y.setAttribute(`aria-label`,`Close image viewer`),b.setAttribute(`aria-label`,`Previous image`),x.setAttribute(`aria-label`,`Next image`),C.setAttribute(`aria-label`,`Zoom out`),w.setAttribute(`aria-label`,`Reset zoom`),T.setAttribute(`aria-label`,`Zoom in`),y.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>`,b.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7"/></svg>`,x.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7"/></svg>`,C.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M7.5 10.5h6"/></svg>`,w.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5"/></svg>`,T.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M7.5 10.5h6M10.5 7.5v6"/></svg>`,S.append(C,w,T),_.append(v,y,b,x,S),document.body.append(_);let O=e=>{E=(e+g.length)%g.length,v.src=g[E].currentSrc||g[E].src,v.alt=g[E].alt,k(1)},k=e=>{D=Math.min(4,Math.max(1,e)),v.style.transform=`scale(${D})`,C.disabled=D<=1,T.disabled=D>=4};g.forEach((e,t)=>{e.setAttribute(`tabindex`,`0`),e.setAttribute(`role`,`button`),e.setAttribute(`aria-label`,`${e.alt}. Open larger image`);let n=()=>{if(m){m=!1;return}O(t),_.showModal(),document.body.classList.add(`has-open-dialog`)};e.addEventListener(`click`,n),e.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n())})});let A=()=>{_.close(),document.body.classList.remove(`has-open-dialog`)};y.addEventListener(`click`,A),b.addEventListener(`click`,()=>O(E-1)),x.addEventListener(`click`,()=>O(E+1)),C.addEventListener(`click`,()=>k(D-.5)),w.addEventListener(`click`,()=>k(1)),T.addEventListener(`click`,()=>k(D+.5)),v.addEventListener(`dblclick`,()=>k(D>1?1:2)),v.addEventListener(`wheel`,e=>{e.preventDefault(),k(D+(e.deltaY<0?.25:-.25))},{passive:!1}),_.addEventListener(`cancel`,()=>document.body.classList.remove(`has-open-dialog`)),_.addEventListener(`click`,e=>{e.target===_&&A()}),_.addEventListener(`keydown`,e=>{e.key===`ArrowLeft`&&O(E-1),e.key===`ArrowRight`&&O(E+1)})})}function L(){let e=[...document.querySelectorAll(`[data-director-dialog]`)],t=new Map,n=document.body.dataset.profileBase,r=(e=``)=>{if(!n)return;let t=e?`/eastman/${n}/${e}`:`/eastman/${n}`;window.location.pathname.replace(/\/$/,``)!==t&&window.history.pushState({leadershipProfile:e||null},``,t)};if(e.forEach(i=>{if(!(i instanceof HTMLDialogElement))return;let a=i.dataset.directorDialog,o=document.querySelector(`[data-director-open="${a}"]`),s=i.querySelector(`[data-director-close]`),c=i.querySelector(`.director-positions`),l=c?.querySelector(`summary`),u=i.dataset.profileSlug;if(!o||!s)return;u&&t.set(u,i);let d=({updateUrl:e=!0}={})=>{i.open&&i.close(),document.body.classList.remove(`has-open-dialog`),e&&u&&(window.history.state?.leadershipProfile===u?window.history.back():window.history.replaceState({},``,`/eastman/${n}`))};o.addEventListener(`click`,()=>{e.forEach(e=>{e!==i&&e.open&&e.close()}),i.showModal(),document.body.classList.add(`has-open-dialog`),u&&r(u)}),s.addEventListener(`click`,d),i.addEventListener(`cancel`,e=>{e.preventDefault(),d()}),i.addEventListener(`click`,e=>{e.target===i&&d()}),l?.addEventListener(`click`,e=>{if(e.preventDefault(),c instanceof HTMLDetailsElement){if(c.open){c.classList.remove(`is-open`),window.setTimeout(()=>{c.open=!1},360);return}c.open=!0,requestAnimationFrame(()=>c.classList.add(`is-open`))}})}),t.size){let e=()=>{let e=window.location.pathname.replace(/\/$/,``).split(`/eastman/`),r=e[0]===``&&e[1]===n?e[2]:``,i=r?t.get(r):null;t.forEach(e=>{e!==i&&e.open&&e.close()}),i&&!i.open&&i.showModal(),document.body.classList.toggle(`has-open-dialog`,!!i)};e(),window.addEventListener(`popstate`,e)}}function R(){document.querySelectorAll(`.profile-card--board`).forEach(e=>{let t=e.querySelector(`[data-director-open]`);t&&e.addEventListener(`click`,e=>{e.target instanceof Node&&t.contains(e.target)||t.click()})})}var z=null;function B(){z?.(),z=null;let e=document.querySelector(`.timeline`);if(!e)return;let t=[...e.querySelectorAll(`.timeline-item`)],n=e.querySelector(`.timeline-end`),r=window.matchMedia(`(prefers-reduced-motion: reduce)`);if(e.classList.add(`timeline--enhanced`),r.matches||!(`IntersectionObserver`in window)){t.forEach(e=>e.classList.add(`is-visible`)),n?.classList.add(`is-visible`),e.style.setProperty(`--timeline-progress`,`1`);return}let i=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-visible`),t.unobserve(e.target))})},{rootMargin:`0px 0px -14% 0px`,threshold:.16});t.forEach((e,t)=>{e.style.setProperty(`--reveal-delay`,`${Math.min(t*35,140)}ms`),i.observe(e)}),n&&i.observe(n);let a=!1,o=()=>{let t=e.getBoundingClientRect(),n=window.innerHeight*.72,r=Math.max(t.height-window.innerHeight*.34,1),i=Math.min(Math.max((n-t.top)/r,0),1);e.style.setProperty(`--timeline-progress`,i.toFixed(4)),a=!1},s=()=>{a||(a=!0,window.requestAnimationFrame(o))};o(),window.addEventListener(`scroll`,s,{passive:!0}),window.addEventListener(`resize`,s,{passive:!0}),z=()=>{i.disconnect(),window.removeEventListener(`scroll`,s),window.removeEventListener(`resize`,s)}}function V(){P(),F(),I(),L(),R(),B(),A(),k(),C()}function H(){let e=`eastman-cookie-consent`,t=null;try{t=window.localStorage.getItem(e)}catch{}if(t)return;let n=document.createElement(`section`);n.className=`cookie-drawer`,n.setAttribute(`aria-label`,`Cookie preferences`),n.setAttribute(`aria-live`,`polite`),n.innerHTML=`
    <div class="cookie-drawer__accent" aria-hidden="true"></div>
    <div class="cookie-drawer__icon" aria-hidden="true">
      <span></span><i></i><i></i><i></i>
    </div>
    <div class="cookie-drawer__copy">
      <p class="cookie-drawer__eyebrow">Your privacy matters</p>
      <h2>Choose how we use cookies</h2>
      <p>We use required cookies to keep the website working. With your permission, optional cookies help us understand site usage and improve your experience. <!-- <a href="/eastman/terms-and-conditions">Learn more</a> --></p>
    </div>
    <div class="cookie-drawer__actions">
      <button class="cookie-button cookie-button--quiet" type="button" data-cookie-choice="rejected">Reject optional</button>
      <button class="cookie-button cookie-button--required" type="button" data-cookie-choice="required">Required only</button>
      <button class="cookie-button cookie-button--accept" type="button" data-cookie-choice="accepted">Accept all</button>
    </div>
  `,document.body.appendChild(n);let r=t=>{try{window.localStorage.setItem(e,t)}catch{}window.dispatchEvent(new CustomEvent(`eastman:cookie-consent`,{detail:{choice:t}})),n.classList.add(`is-closing`),window.setTimeout(()=>n.remove(),480)};n.querySelectorAll(`[data-cookie-choice]`).forEach(e=>{e.addEventListener(`click`,()=>r(e.dataset.cookieChoice))}),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>n.classList.add(`is-visible`)))}function U(){p(),h(),S(),T(),H(),V(),window.addEventListener(`scroll`,C,{passive:!0})}U()}));export{t as n,O as t};