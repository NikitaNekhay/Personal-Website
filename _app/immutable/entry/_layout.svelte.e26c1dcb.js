import{S as X,i as Y,s as Z,k as h,l as _,m,h as u,n as i,b as C,C as c,D as J,E as P,F as De,o as Ie,q as k,a as V,r as x,c as S,G as Se,u as Ce,v as Oe,d as q,f as Pe,g as z,y as oe,z as ne,A as ie,B as ce,H as $e,I as Le,J as Ne,K as je}from"../chunks/index.c52da2f4.js";import{b as p}from"../chunks/paths.01076b1d.js";import{a as Ve,r as ke,d as xe,J as He,s as Ke}from"../chunks/firebase.80003ae4.js";import{a as ue,b as Me}from"../chunks/store.206d92aa.js";import{g as Re}from"../chunks/user.91483df6.js";function Te(d){const e=s=>{d&&!d.contains(s.target)&&!s.defaultPrevented&&d.dispatchEvent(new CustomEvent("click_outside",d))},t=window.document;return t.addEventListener("click",e,!0),{destroy(){t.removeEventListener("click",e,!0)}}}function Fe(d){let e,t,s,a,l,n,o,r,f,w,O,y,v=d[1]&&Ae();return{c(){e=h("div"),t=h("a"),s=k("Profile"),a=V(),v&&v.c(),l=V(),n=h("a"),o=k("Logout"),r=V(),f=h("a"),w=k("Deactivate"),this.h()},l(g){e=_(g,"DIV",{class:!0});var b=m(e);t=_(b,"A",{class:!0,target:!0,href:!0});var M=m(t);s=x(M,"Profile"),M.forEach(u),a=S(b),v&&v.l(b),l=S(b),n=_(b,"A",{class:!0,target:!0,href:!0});var I=m(n);o=x(I,"Logout"),I.forEach(u),r=S(b),f=_(b,"A",{class:!0,target:!0,href:!0});var R=m(f);w=x(R,"Deactivate"),R.forEach(u),b.forEach(u),this.h()},h(){i(t,"class","col-span-full grid-row-auto transition duration-100 hover:text-yellow-0"),i(t,"target","_self"),i(t,"href",p+"/profile"),i(n,"class","col-span-full grid-row-auto transition duration-100 hover:text-yellow-0"),i(n,"target","_self"),i(n,"href",p+"/login"),i(f,"class","col-span-full grid-row-auto transition duration-100 hover:text-yellow-0"),i(f,"target","_self"),i(f,"href",p+"/login"),i(e,"class","flex flex-col text-right rounded-lg text-black")},m(g,b){C(g,e,b),c(e,t),c(t,s),c(e,a),v&&v.m(e,null),c(e,l),c(e,n),c(n,o),c(e,r),c(e,f),c(f,w),O||(y=[J(n,"click",ue.logout),J(f,"click",ue.deactivate),Se(Te.call(null,e)),J(e,"click_outside",d[3])],O=!0)},p(g,b){g[1]?v?v.p(g,b):(v=Ae(),v.c(),v.m(e,l)):v&&(v.d(1),v=null)},d(g){g&&u(e),v&&v.d(),O=!1,De(y)}}}function Je(d){let e,t,s,a;return{c(){e=h("p"),t=k(d[2]),s=V(),a=h("div"),this.h()},l(l){e=_(l,"P",{class:!0});var n=m(e);t=x(n,d[2]),n.forEach(u),s=S(l),a=_(l,"DIV",{class:!0});var o=m(a);o.forEach(u),this.h()},h(){i(e,"class","col-span-full grid-row-auto transition duration-100 hover:text-yellow-0"),i(a,"class","w-8 h-8 rounded-full overflow-hidden")},m(l,n){C(l,e,n),c(e,t),C(l,s,n),C(l,a,n)},p(l,n){n&4&&Ce(t,l[2])},d(l){l&&u(e),l&&u(s),l&&u(a)}}}function Ae(d){let e,t;return{c(){e=h("a"),t=k("Dashboard"),this.h()},l(s){e=_(s,"A",{class:!0,target:!0,href:!0});var a=m(e);t=x(a,"Dashboard"),a.forEach(u),this.h()},h(){i(e,"class","col-span-full grid-row-auto transition duration-100 hover:text-yellow-0"),i(e,"target","_self"),i(e,"href",p+"/dashboard")},m(s,a){C(s,e,a),c(e,t)},p:P,d(s){s&&u(e)}}}function qe(d){let e,t,s,a;function l(r,f){return r[0]?Fe:Je}let n=l(d),o=n(d);return{c(){e=h("div"),t=h("div"),o.c(),this.h()},l(r){e=_(r,"DIV",{class:!0});var f=m(e);t=_(f,"DIV",{class:!0});var w=m(t);o.l(w),w.forEach(u),f.forEach(u),this.h()},h(){i(t,"class","grid-column-auto grid-row-auto"),i(e,"class","menu relative cursor-pointer")},m(r,f){C(r,e,f),c(e,t),o.m(t,null),s||(a=[J(t,"click",d[4]),J(t,"keydown",d[4])],s=!0)},p(r,[f]){n===(n=l(r))&&o?o.p(r,f):(o.d(1),o=n(r),o&&(o.c(),o.m(t,null)))},i:P,o:P,d(r){r&&u(e),o.d(),s=!1,De(a)}}}function ze(d,e,t){let{isOpen:s=!1}=e,{isAdmin:a=!1}=e;function l(){t(0,s=!1)}function n(){t(0,s=!s)}let o="Mister";return Ie(()=>(console.log("getting the name of profile..."),Ve.onAuthStateChanged(async f=>{let w=await Re(f);f&&t(2,o=w.name)}))),d.$$set=r=>{"isOpen"in r&&t(0,s=r.isOpen),"isAdmin"in r&&t(1,a=r.isAdmin)},[s,a,o,l,n]}class Ue extends X{constructor(e){super(),Y(this,e,ze,qe,Z,{isOpen:0,isAdmin:1})}}function We(d){let e,t;return e=new Ue({}),{c(){oe(e.$$.fragment)},l(s){ne(e.$$.fragment,s)},m(s,a){ie(e,s,a),t=!0},p:P,i(s){t||(z(e.$$.fragment,s),t=!0)},o(s){q(e.$$.fragment,s),t=!1},d(s){ce(e,s)}}}function Be(d){let e,t,s,a;return{c(){e=h("a"),t=k("Login"),this.h()},l(l){e=_(l,"A",{class:!0,target:!0,href:!0});var n=m(e);t=x(n,"Login"),n.forEach(u),this.h()},h(){i(e,"class","col-span-full grid-row-auto transition duration-100 hover:text-yellow-0"),i(e,"target","_self"),i(e,"href",p+"/login")},m(l,n){C(l,e,n),c(e,t),s||(a=J(e,"click",ue.login),s=!0)},p:P,i:P,o:P,d(l){l&&u(e),s=!1,a()}}}function Ge(d){let e,t,s,a,l,n,o,r,f,w,O,y,v,g,b,M,I,R,ee,$,L,te,re,N,se,ae,U,K,A,D,W;const fe=[Be,We],j=[];function de(E,H){return E[0]==!1?0:1}return A=de(d),D=j[A]=fe[A](d),{c(){e=h("nav"),t=h("div"),s=h("div"),a=h("div"),l=h("div"),n=h("h1"),o=h("p"),r=k("NIKITA"),f=h("p"),w=k("NIAKHAI"),O=V(),y=h("div"),v=h("div"),g=h("a"),b=k("About"),M=V(),I=h("a"),R=k("Contact"),ee=V(),$=h("div"),L=h("a"),te=k("Diary"),re=V(),N=h("a"),se=k("Works"),ae=V(),U=h("div"),K=h("div"),D.c(),this.h()},l(E){e=_(E,"NAV",{class:!0});var H=m(e);t=_(H,"DIV",{class:!0});var T=m(t);s=_(T,"DIV",{class:!0});var he=m(s);a=_(he,"DIV",{class:!0});var F=m(a);l=_(F,"DIV",{class:!0});var _e=m(l);n=_(_e,"H1",{});var le=m(n);o=_(le,"P",{class:!0});var me=m(o);r=x(me,"NIKITA"),me.forEach(u),f=_(le,"P",{});var ve=m(f);w=x(ve,"NIAKHAI"),ve.forEach(u),le.forEach(u),_e.forEach(u),O=S(F),y=_(F,"DIV",{class:!0});var B=m(y);v=_(B,"DIV",{class:!0});var G=m(v);g=_(G,"A",{class:!0,target:!0,href:!0});var ge=m(g);b=x(ge,"About"),ge.forEach(u),M=S(G),I=_(G,"A",{class:!0,target:!0,href:!0});var pe=m(I);R=x(pe,"Contact"),pe.forEach(u),G.forEach(u),ee=S(B),$=_(B,"DIV",{class:!0});var Q=m($);L=_(Q,"A",{class:!0,target:!0,href:!0});var be=m(L);te=x(be,"Diary"),be.forEach(u),re=S(Q),N=_(Q,"A",{class:!0,target:!0,href:!0});var we=m(N);se=x(we,"Works"),we.forEach(u),Q.forEach(u),B.forEach(u),ae=S(F),U=_(F,"DIV",{});var ye=m(U);K=_(ye,"DIV",{class:!0});var Ee=m(K);D.l(Ee),Ee.forEach(u),ye.forEach(u),F.forEach(u),he.forEach(u),T.forEach(u),H.forEach(u),this.h()},h(){i(o,"class","flex justify-center"),i(l,"class","text-2xl "),i(g,"class","text-black no-underline hover:underline underline-offset-4"),i(g,"target","_self"),i(g,"href",p+"/about"),i(I,"class","text-black no-underline mx-20 hover:underline underline-offset-4"),i(I,"target","_self"),i(I,"href",p+"/contact"),i(v,"class","border-r-2 border-navy-2"),i(L,"class","text-black no-underline mx-20 hover:underline underline-offset-4"),i(L,"target","_self"),i(L,"href",p+"/diary"),i(N,"class","text-black no-underline hover:underline underline-offset-4"),i(N,"target","_self"),i(N,"href",p+"/"),i($,"class","border-l-2 border-navy-2"),i(y,"class","flex items-center justify-between drop-shadow mx-20 "),i(K,"class","grid-column-auto grid-row-auto "),i(a,"class","flex items-center justify-between mx-2 w-full gap-16 "),i(s,"class","flex items-center justify-between mx-auto w-11/12 bg-white-1 shadow-white-2 drop-shadow-2xl border-x-4 border-navy-1"),i(t,"class","fixed top-0 z-30 w-full py-"),i(e,"class","flex w-screen font-anonymous")},m(E,H){C(E,e,H),c(e,t),c(t,s),c(s,a),c(a,l),c(l,n),c(n,o),c(o,r),c(n,f),c(f,w),c(a,O),c(a,y),c(y,v),c(v,g),c(g,b),c(v,M),c(v,I),c(I,R),c(y,ee),c(y,$),c($,L),c(L,te),c($,re),c($,N),c(N,se),c(a,ae),c(a,U),c(U,K),j[A].m(K,null),W=!0},p(E,[H]){let T=A;A=de(E),A===T?j[A].p(E,H):(Oe(),q(j[T],1,1,()=>{j[T]=null}),Pe(),D=j[A],D?D.p(E,H):(D=j[A]=fe[A](E),D.c()),z(D,1),D.m(K,null))},i(E){W||(z(D),W=!0)},o(E){q(D),W=!1},d(E){E&&u(e),j[A].d()}}}function Qe(d,e,t){const s=[`${p}/`,`${p}/about/`,`${p}/contact/`,`${p}/diary/`,`${p}/login/`];let{loginState:a=!1}=e,{readyExit:l=!1}=e;return Ie(()=>(console.log("Mounting"),Ve.onAuthStateChanged(async o=>{var y;const r=window.location.pathname;if(console.log("we are hier: ",r),console.log("is appropriate path for (no user): ",s.includes(r)),o?(console.log("there is a user: ",o),o.email.slice(0,(y=o.email)==null?void 0:y.search("@"))):console.log("there is no user: ",o),o===null&&!s.includes(r)){window.location.href=`${p}/`,t(0,a=!1),t(1,l=!1);return}if(o!==null&&r===`${p}/login/`){window.location.href=`${p}/profile`,t(0,a=!0),t(1,l=!1);return}if(o&&r===`${p}/profile/`){t(1,l=!0),t(0,a=!0);return}if(o)t(0,a=!0);else{t(0,a=!1),t(1,l=!1);return}let f={email:o.email,messages:[]};const w=ke(xe,"user",o.uid),O=await He(w);if(O.exists())console.log("Fetching User"),f=O.data(),Me.update(g=>({...g,user:o,data:f,loading:!1}));else{console.log("Creating user");const v=ke(xe,"user",o.uid);f={email:o.email,messages:[]},await Ke(v,f,{merge:!0})}}))),d.$$set=n=>{"loginState"in n&&t(0,a=n.loginState),"readyExit"in n&&t(1,l=n.readyExit)},[a,l]}class Xe extends X{constructor(e){super(),Y(this,e,Qe,Ge,Z,{loginState:0,readyExit:1})}}function Ye(d){let e,t,s,a;return{c(){e=h("nav"),t=h("footer"),s=h("div"),a=k("Dream big, work hard"),this.h()},l(l){e=_(l,"NAV",{class:!0});var n=m(e);t=_(n,"FOOTER",{class:!0});var o=m(t);s=_(o,"DIV",{});var r=m(s);a=x(r,"Dream big, work hard"),r.forEach(u),o.forEach(u),n.forEach(u),this.h()},h(){i(t,"class","h-screen flex justify-center items-center"),i(e,"class","flex w-screen font-anonymous")},m(l,n){C(l,e,n),c(e,t),c(t,s),c(s,a)},p:P,i:P,o:P,d(l){l&&u(e)}}}class Ze extends X{constructor(e){super(),Y(this,e,null,Ye,Z,{})}}function et(d){let e,t,s,a,l;e=new Xe({});const n=d[1].default,o=$e(n,d,d[0],null);return a=new Ze({}),{c(){oe(e.$$.fragment),t=V(),o&&o.c(),s=V(),oe(a.$$.fragment)},l(r){ne(e.$$.fragment,r),t=S(r),o&&o.l(r),s=S(r),ne(a.$$.fragment,r)},m(r,f){ie(e,r,f),C(r,t,f),o&&o.m(r,f),C(r,s,f),ie(a,r,f),l=!0},p(r,[f]){o&&o.p&&(!l||f&1)&&Le(o,n,r,r[0],l?je(n,r[0],f,null):Ne(r[0]),null)},i(r){l||(z(e.$$.fragment,r),z(o,r),z(a.$$.fragment,r),l=!0)},o(r){q(e.$$.fragment,r),q(o,r),q(a.$$.fragment,r),l=!1},d(r){ce(e,r),r&&u(t),o&&o.d(r),r&&u(s),ce(a,r)}}}function tt(d,e,t){let{$$slots:s={},$$scope:a}=e;return d.$$set=l=>{"$$scope"in l&&t(0,a=l.$$scope)},[a,s]}class nt extends X{constructor(e){super(),Y(this,e,tt,et,Z,{})}}export{nt as default};