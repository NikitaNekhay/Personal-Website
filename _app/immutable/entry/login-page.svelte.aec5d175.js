import{S as Re,i as Te,s as xe,k as c,q as P,a as V,l as d,m as u,r as L,h as n,c as z,n as r,b as B,C as l,P as K,G as q,u as Ae,D as U,R as ue,N as Ne,y as qe,M as Be,z as Ge,A as Me,g as Oe,d as Se,B as Ue}from"../chunks/index.0dc20505.js";import{c as ze}from"../chunks/store.9b258982.js";import{b as je}from"../chunks/paths.560e3548.js";function Pe(h){let e,t,i;return{c(){e=c("div"),t=c("p"),i=P("The info is incorrect!"),this.h()},l(o){e=d(o,"DIV",{class:!0});var s=u(e);t=d(s,"P",{class:!0});var a=u(t);i=L(a,"The info is incorrect!"),a.forEach(n),s.forEach(n),this.h()},h(){r(t,"class","errore svelte-18idz54"),r(e,"class","containterErrore svelte-18idz54")},m(o,s){B(o,e,s),l(e,t),l(t,i)},d(o){o&&n(e)}}}function Le(h){let e,t,i,o,s,a,v,_;return{c(){e=c("div"),t=c("label"),i=P("Repeat Password"),o=V(),s=c("div"),a=c("input"),this.h()},l(m){e=d(m,"DIV",{});var f=u(e);t=d(f,"LABEL",{for:!0,class:!0});var k=u(t);i=L(k,"Repeat Password"),k.forEach(n),o=z(f),s=d(f,"DIV",{class:!0});var g=u(s);a=d(g,"INPUT",{id:!0,placeholder:!0,name:!0,type:!0,autocomplete:!0,class:!0}),g.forEach(n),f.forEach(n),this.h()},h(){r(t,"for","password"),r(t,"class","block text-sm font-medium leading-6 text-gray-900"),r(a,"id","rpassword"),r(a,"placeholder","   Repeat password"),r(a,"name","rpassword"),r(a,"type","rpassword"),r(a,"autocomplete","password"),a.required=!0,r(a,"class","block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-1 sm:text-sm sm:leading-6"),r(s,"class","mt-2")},m(m,f){B(m,e,f),l(e,t),l(t,i),l(e,o),l(e,s),l(s,a),K(a,h[2]),v||(_=q(a,"input",h[10]),v=!0)},p(m,f){f&4&&K(a,m[2])},d(m){m&&n(e),v=!1,_()}}}function Ce(h){let e;return{c(){e=P("submit")},l(t){e=L(t,"submit")},m(t,i){B(t,e,i)},p:U,d(t){t&&n(e)}}}function He(h){let e,t;return{c(){e=c("img"),this.h()},l(i){e=d(i,"IMG",{alt:!0,src:!0,class:!0}),this.h()},h(){r(e,"alt","spinner"),Ne(e.src,t=je+"/media/envelop.svg")||r(e,"src",t),r(e,"class","spinner svelte-18idz54")},m(i,o){B(i,e,o)},p:U,d(i){i&&n(e)}}}function Fe(h){let e,t,i,o,s,a,v,_;return{c(){e=c("div"),t=c("p"),i=P("Don't have an account?"),o=V(),s=c("p"),a=P("Register"),this.h()},l(m){e=d(m,"DIV",{class:!0});var f=u(e);t=d(f,"P",{class:!0});var k=u(t);i=L(k,"Don't have an account?"),k.forEach(n),o=z(f),s=d(f,"P",{class:!0});var g=u(s);a=L(g,"Register"),g.forEach(n),f.forEach(n),this.h()},h(){r(t,"class","svelte-18idz54"),r(s,"class","svelte-18idz54"),r(e,"class","svelte-18idz54")},m(m,f){B(m,e,f),l(e,t),l(t,i),l(e,o),l(e,s),l(s,a),v||(_=[q(s,"click",h[7]),q(s,"keydown",We)],v=!0)},p:U,d(m){m&&n(e),v=!1,ue(_)}}}function Je(h){let e,t,i,o,s,a,v,_;return{c(){e=c("div"),t=c("p"),i=P("Already have an account?"),o=V(),s=c("p"),a=P("Login"),this.h()},l(m){e=d(m,"DIV",{class:!0});var f=u(e);t=d(f,"P",{class:!0});var k=u(t);i=L(k,"Already have an account?"),k.forEach(n),o=z(f),s=d(f,"P",{class:!0});var g=u(s);a=L(g,"Login"),g.forEach(n),f.forEach(n),this.h()},h(){r(t,"class","svelte-18idz54"),r(s,"class","svelte-18idz54"),r(e,"class","svelte-18idz54")},m(m,f){B(m,e,f),l(e,t),l(t,i),l(e,o),l(e,s),l(s,a),v||(_=[q(s,"click",h[7]),q(s,"keydown",Qe)],v=!0)},p:U,d(m){m&&n(e),v=!1,ue(_)}}}function Ke(h){let e,t,i,o,s,a,v,_=h[4]?"REGISTER":"LOGIN",m,f,k,g,E,x,G,te,se,j,I,le,M,O,re,ae,C,D,ie,W,Q,A,ne,H,S,oe,F,ce,de,fe,w=h[3]&&Pe(),y=h[4]&&Le(h);function he(p,b){return p[5]?He:Ce}let X=he(h),R=X(h);function me(p,b){return p[4]?Je:Fe}let Y=me(h),T=Y(h);return{c(){e=c("div"),t=c("div"),i=P("1"),o=V(),s=c("div"),a=c("div"),v=c("h1"),m=P(_),f=V(),w&&w.c(),k=V(),g=c("div"),E=c("form"),x=c("div"),G=c("label"),te=P("Email address"),se=V(),j=c("div"),I=c("input"),le=V(),M=c("div"),O=c("label"),re=P("Password"),ae=V(),C=c("div"),D=c("input"),ie=V(),y&&y.c(),W=V(),Q=c("div"),A=c("button"),R.c(),ne=V(),H=c("div"),S=c("div"),T.c(),oe=V(),F=c("div"),ce=P("3"),this.h()},l(p){e=d(p,"DIV",{class:!0});var b=u(e);t=d(b,"DIV",{class:!0});var pe=u(t);i=L(pe,"1"),pe.forEach(n),o=z(b),s=d(b,"DIV",{class:!0});var J=u(s);a=d(J,"DIV",{class:!0});var Z=u(a);v=d(Z,"H1",{class:!0});var ve=u(v);m=L(ve,_),ve.forEach(n),f=z(Z),w&&w.l(Z),Z.forEach(n),k=z(J),g=d(J,"DIV",{class:!0});var _e=u(g);E=d(_e,"FORM",{class:!0});var N=u(E);x=d(N,"DIV",{});var $=u(x);G=d($,"LABEL",{for:!0,class:!0});var ge=u(G);te=L(ge,"Email address"),ge.forEach(n),se=z($),j=d($,"DIV",{class:!0});var be=u(j);I=d(be,"INPUT",{id:!0,name:!0,type:!0,autocomplete:!0,placeholder:!0,class:!0}),be.forEach(n),$.forEach(n),le=z(N),M=d(N,"DIV",{});var ee=u(M);O=d(ee,"LABEL",{for:!0,class:!0});var ye=u(O);re=L(ye,"Password"),ye.forEach(n),ae=z(ee),C=d(ee,"DIV",{class:!0});var Ee=u(C);D=d(Ee,"INPUT",{id:!0,placeholder:!0,name:!0,type:!0,autocomplete:!0,class:!0}),Ee.forEach(n),ee.forEach(n),ie=z(N),y&&y.l(N),W=z(N),Q=d(N,"DIV",{});var we=u(Q);A=d(we,"BUTTON",{type:!0,class:!0});var ke=u(A);R.l(ke),ke.forEach(n),we.forEach(n),N.forEach(n),_e.forEach(n),ne=z(J),H=d(J,"DIV",{class:!0});var Ie=u(H);S=d(Ie,"DIV",{class:!0});var De=u(S);T.l(De),De.forEach(n),Ie.forEach(n),J.forEach(n),oe=z(b),F=d(b,"DIV",{class:!0});var Ve=u(F);ce=L(Ve,"3"),Ve.forEach(n),b.forEach(n),this.h()},h(){r(t,"class","flex max-h-screen w-2/6"),r(v,"class","svelte-18idz54"),r(a,"class","flex h-2/6 justify-center text-center svelte-18idz54"),r(G,"for","email"),r(G,"class","block text-sm font-medium leading-6 text-gray-900"),r(I,"id","email"),r(I,"name","email"),r(I,"type","email"),r(I,"autocomplete","email"),r(I,"placeholder","email@mail-service.com"),I.required=!0,r(I,"class","block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-1 sm:text-sm sm:leading-6"),r(j,"class","mt-2"),r(O,"for","password"),r(O,"class","block text-sm font-medium leading-6 text-gray-900"),r(D,"id","password"),r(D,"placeholder","Password"),r(D,"name","password"),r(D,"type","password"),r(D,"autocomplete","current-password"),D.required=!0,r(D,"class","block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-1 sm:text-sm sm:leading-6"),r(C,"class","mt-2"),r(A,"type","button"),r(A,"class","submitButton flex w-full justify-center rounded-md bg-navy-1 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition duration-100 hover:bg-navy-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"),r(E,"class","svelte-18idz54"),r(g,"class","flex h-2/6"),r(S,"class","options svelte-18idz54"),r(H,"class","flex h-2/6"),r(s,"class","h-fit w-2/6 table-column svelte-18idz54"),r(F,"class","flex max-h-screen w-2/6"),r(e,"class","containerAuth svelte-18idz54")},m(p,b){B(p,e,b),l(e,t),l(t,i),l(e,o),l(e,s),l(s,a),l(a,v),l(v,m),l(a,f),w&&w.m(a,null),l(s,k),l(s,g),l(g,E),l(E,x),l(x,G),l(G,te),l(x,se),l(x,j),l(j,I),K(I,h[0]),l(E,le),l(E,M),l(M,O),l(O,re),l(M,ae),l(M,C),l(C,D),K(D,h[1]),l(E,ie),y&&y.m(E,null),l(E,W),l(E,Q),l(Q,A),R.m(A,null),l(s,ne),l(s,H),l(H,S),T.m(S,null),l(e,oe),l(e,F),l(F,ce),de||(fe=[q(I,"input",h[8]),q(D,"input",h[9]),q(A,"click",h[6])],de=!0)},p(p,[b]){b&16&&_!==(_=p[4]?"REGISTER":"LOGIN")&&Ae(m,_),p[3]?w||(w=Pe(),w.c(),w.m(a,null)):w&&(w.d(1),w=null),b&1&&I.value!==p[0]&&K(I,p[0]),b&2&&D.value!==p[1]&&K(D,p[1]),p[4]?y?y.p(p,b):(y=Le(p),y.c(),y.m(E,W)):y&&(y.d(1),y=null),X===(X=he(p))&&R?R.p(p,b):(R.d(1),R=X(p),R&&(R.c(),R.m(A,null))),Y===(Y=me(p))&&T?T.p(p,b):(T.d(1),T=Y(p),T&&(T.c(),T.m(S,null)))},i:U,o:U,d(p){p&&n(e),w&&w.d(),y&&y.d(),R.d(),T.d(),de=!1,ue(fe)}}}const Qe=()=>{},We=()=>{};function Xe(h,e,t){let i="",o="",s="",a=!1,v=!1,_=!1;async function m(){if(!_){if(!i||!o||v&&!s){t(3,a=!0);return}t(5,_=!0);try{v?await ze.signup(i,o):await ze.login(i,o)}catch(x){console.log("auth error",x),t(3,a=!0),t(5,_=!1)}}}function f(){t(4,v=!v)}function k(){i=this.value,t(0,i)}function g(){o=this.value,t(1,o)}function E(){s=this.value,t(2,s)}return[i,o,s,a,v,_,m,f,k,g,E]}class Ye extends Re{constructor(e){super(),Te(this,e,Xe,Ke,xe,{})}}function Ze(h){let e,t,i,o;return document.title="Login",i=new Ye({}),{c(){e=c("meta"),t=V(),qe(i.$$.fragment),this.h()},l(s){const a=Be("svelte-dc3wr9",document.head);e=d(a,"META",{name:!0,content:!0}),a.forEach(n),t=z(s),Ge(i.$$.fragment,s),this.h()},h(){r(e,"name","description"),r(e,"content","Login page")},m(s,a){l(document.head,e),B(s,t,a),Me(i,s,a),o=!0},p:U,i(s){o||(Oe(i.$$.fragment,s),o=!0)},o(s){Se(i.$$.fragment,s),o=!1},d(s){n(e),s&&n(t),Ue(i,s)}}}class st extends Re{constructor(e){super(),Te(this,e,null,Ze,xe,{})}}export{st as default};