import{S as tt,i as et,s as nt,W as ot,X as st,Y as at,Z as ct,E as R,F as T,_ as E,$ as U,l as y,I as ft,p as C,h as M,L as D,M as G,f as w,a0 as _t,a1 as Y,a2 as H,a3 as W,a4 as mt,n as h,T as q,B as z,C as pt,D as F,a5 as ht,a6 as X,G as Z}from"./index.372ec54d.js";import{w as A,d as dt}from"./index.ec719676.js";import{g as bt}from"./history.686f2e10.js";const J={},j={},kt={},lt=/^:(.+)/,K=4,gt=3,Rt=2,St=1,Tt=1,B=o=>o.replace(/(^\/+|\/+$)/g,"").split("/"),L=o=>o.replace(/(^\/+|\/+$)/g,""),Nt=(o,t)=>{const s=o.default?0:B(o.path).reduce((e,n)=>(e+=K,n===""?e+=Tt:lt.test(n)?e+=Rt:n[0]==="*"?e-=K+St:e+=gt,e),0);return{route:o,score:s,index:t}},Ct=o=>o.map(Nt).sort((t,s)=>t.score<s.score?1:t.score>s.score?-1:t.index-s.index),Q=(o,t)=>{let s,e;const[n]=t.split("?"),a=B(n),r=a[0]==="",_=Ct(o);for(let c=0,i=_.length;c<i;c++){const f=_[c].route;let m=!1;if(f.default){e={route:f,params:{},uri:t};continue}const d=B(f.path),b={},u=Math.max(a.length,d.length);let p=0;for(;p<u;p++){const k=d[p],N=a[p];if(k&&k[0]==="*"){const O=k==="*"?"*":k.slice(1);b[O]=a.slice(p).map(decodeURIComponent).join("/");break}if(typeof N>"u"){m=!0;break}const I=lt.exec(k);if(I&&!r){const O=decodeURIComponent(N);b[I[1]]=O}else if(k!==N){m=!0;break}}if(!m){s={route:f,params:b,uri:"/"+a.slice(0,p).join("/")};break}}return s||e||null},V=(o,t)=>`${L(t==="/"?o:`${L(o)}/${L(t)}`)}/`,It=o=>({route:o&2,location:o&1}),v=o=>({route:o[1]&&o[1].uri,location:o[0]});function Pt(o){let t;const s=o[12].default,e=ot(s,o,o[11],v);return{c(){e&&e.c()},l(n){e&&e.l(n)},m(n,a){e&&e.m(n,a),t=!0},p(n,[a]){e&&e.p&&(!t||a&2051)&&st(e,s,n,n[11],t?ct(s,n[11],a,It):at(n[11]),v)},i(n){t||(R(e,n),t=!0)},o(n){T(e,n),t=!1},d(n){e&&e.d(n)}}}function Ot(o,t,s){let e,n,a,r,{$$slots:_={},$$scope:c}=t,{basepath:i="/"}=t,{url:f=null}=t,{history:m=bt}=t;E(kt,m);const d=U(J),b=U(j),u=A([]);y(o,u,l=>s(9,n=l));const p=A(null);y(o,p,l=>s(1,r=l));let k=!1;const N=d||A(f?{pathname:f}:m.location);y(o,N,l=>s(0,e=l));const I=b?b.routerBase:A({path:i,uri:i});y(o,I,l=>s(10,a=l));const O=dt([I,p],([l,g])=>{if(!g)return l;const{path:S}=l,{route:P,uri:ut}=g;return{path:P.default?S:P.path.replace(/\*.*$/,""),uri:ut}}),rt=l=>{const{path:g}=a;let{path:S}=l;if(l._path=S,l.path=V(g,S),typeof window>"u"){if(k)return;const P=Q([l],e.pathname);P&&(p.set(P),k=!0)}else u.update(P=>[...P,l])},it=l=>{u.update(g=>g.filter(S=>S!==l))};return d||(ft(()=>m.listen(g=>{N.set(g.location)})),E(J,N)),E(j,{activeRoute:p,base:I,routerBase:O,registerRoute:rt,unregisterRoute:it}),o.$$set=l=>{"basepath"in l&&s(6,i=l.basepath),"url"in l&&s(7,f=l.url),"history"in l&&s(8,m=l.history),"$$scope"in l&&s(11,c=l.$$scope)},o.$$.update=()=>{if(o.$$.dirty&1024){const{path:l}=a;u.update(g=>g.map(S=>({...S,path:V(l,S._path)})))}if(o.$$.dirty&513){const l=Q(n,e.pathname);p.set(l)}},[e,r,u,p,N,I,i,f,m,n,a,c,_]}class Ht extends tt{constructor(t){super(),et(this,t,Ot,Pt,nt,{basepath:6,url:7,history:8})}}const yt=o=>({params:o&4}),x=o=>({params:o[2]});function $(o){let t,s,e,n;const a=[Mt,At],r=[];function _(c,i){return c[0]?0:1}return t=_(o),s=r[t]=a[t](o),{c(){s.c(),e=C()},l(c){s.l(c),e=C()},m(c,i){r[t].m(c,i),M(c,e,i),n=!0},p(c,i){let f=t;t=_(c),t===f?r[t].p(c,i):(D(),T(r[f],1,1,()=>{r[f]=null}),G(),s=r[t],s?s.p(c,i):(s=r[t]=a[t](c),s.c()),R(s,1),s.m(e.parentNode,e))},i(c){n||(R(s),n=!0)},o(c){T(s),n=!1},d(c){r[t].d(c),c&&w(e)}}}function At(o){let t;const s=o[8].default,e=ot(s,o,o[7],x);return{c(){e&&e.c()},l(n){e&&e.l(n)},m(n,a){e&&e.m(n,a),t=!0},p(n,a){e&&e.p&&(!t||a&132)&&st(e,s,n,n[7],t?ct(s,n[7],a,yt):at(n[7]),x)},i(n){t||(R(e,n),t=!0)},o(n){T(e,n),t=!1},d(n){e&&e.d(n)}}}function Mt(o){let t,s,e,n={ctx:o,current:null,token:null,hasCatch:!1,pending:Lt,then:Et,catch:wt,value:12,blocks:[,,,]};return W(s=o[0],n),{c(){t=C(),n.block.c()},l(a){t=C(),n.block.l(a)},m(a,r){M(a,t,r),n.block.m(a,n.anchor=r),n.mount=()=>t.parentNode,n.anchor=t,e=!0},p(a,r){o=a,n.ctx=o,r&1&&s!==(s=o[0])&&W(s,n)||mt(n,o,r)},i(a){e||(R(n.block),e=!0)},o(a){for(let r=0;r<3;r+=1){const _=n.blocks[r];T(_)}e=!1},d(a){a&&w(t),n.block.d(a),n.token=null,n=null}}}function wt(o){return{c:h,l:h,m:h,p:h,i:h,o:h,d:h}}function Et(o){var _;let t,s,e;const n=[o[2],o[3]];var a=((_=o[12])==null?void 0:_.default)||o[12];function r(c){let i={};for(let f=0;f<n.length;f+=1)i=Y(i,n[f]);return{props:i}}return a&&(t=q(a,r())),{c(){t&&z(t.$$.fragment),s=C()},l(c){t&&pt(t.$$.fragment,c),s=C()},m(c,i){t&&F(t,c,i),M(c,s,i),e=!0},p(c,i){var m;const f=i&12?ht(n,[i&4&&X(c[2]),i&8&&X(c[3])]):{};if(i&1&&a!==(a=((m=c[12])==null?void 0:m.default)||c[12])){if(t){D();const d=t;T(d.$$.fragment,1,0,()=>{Z(d,1)}),G()}a?(t=q(a,r()),z(t.$$.fragment),R(t.$$.fragment,1),F(t,s.parentNode,s)):t=null}else a&&t.$set(f)},i(c){e||(t&&R(t.$$.fragment,c),e=!0)},o(c){t&&T(t.$$.fragment,c),e=!1},d(c){c&&w(s),t&&Z(t,c)}}}function Lt(o){return{c:h,l:h,m:h,p:h,i:h,o:h,d:h}}function Ut(o){let t,s,e=o[1]&&o[1].route===o[5]&&$(o);return{c(){e&&e.c(),t=C()},l(n){e&&e.l(n),t=C()},m(n,a){e&&e.m(n,a),M(n,t,a),s=!0},p(n,[a]){n[1]&&n[1].route===n[5]?e?(e.p(n,a),a&2&&R(e,1)):(e=$(n),e.c(),R(e,1),e.m(t.parentNode,t)):e&&(D(),T(e,1,1,()=>{e=null}),G())},i(n){s||(R(e),s=!0)},o(n){T(e),s=!1},d(n){e&&e.d(n),n&&w(t)}}}function Yt(o,t,s){let e,{$$slots:n={},$$scope:a}=t,{path:r=""}=t,{component:_=null}=t,c={},i={};const{registerRoute:f,unregisterRoute:m,activeRoute:d}=U(j);y(o,d,u=>s(1,e=u));const b={path:r,default:r===""};return f(b),_t(()=>{m(b)}),o.$$set=u=>{s(11,t=Y(Y({},t),H(u))),"path"in u&&s(6,r=u.path),"component"in u&&s(0,_=u.component),"$$scope"in u&&s(7,a=u.$$scope)},o.$$.update=()=>{{e&&e.route===b&&s(2,c=e.params);const{component:u,path:p,...k}=t;s(3,i=k),u&&(u.toString().startsWith("class ")?s(0,_=u):s(0,_=u()))}},t=H(t),[_,e,c,i,d,b,r,a,n]}class Wt extends tt{constructor(t){super(),et(this,t,Yt,Ut,nt,{path:6,component:0})}}export{Ht as R,Wt as a};