import{S as Re,i as Te,s as Ae,k as v,a as L,q as A,l as m,m as h,h as u,c as P,r as N,n as s,b as M,C as r,O as J,D as O,u as q,E as re,F as fe,G as Be,N as Ge,y as Se,M as Oe,z as Me,A as Ue,g as je,d as Ce,B as Fe}from"../chunks/index.b9428a69.js";import{a as Ve}from"../chunks/store.bac6cf28.js";import{b as He}from"../chunks/paths.163db7ad.js";import{X as ze,m as Xe,r as Je,x as Ke}from"../chunks/ru.4cb9ce8e.js";function Le(n){let e,t,l=n[6]("The info is incorrect!")+"",i;return{c(){e=v("div"),t=v("p"),i=A(l),this.h()},l(a){e=m(a,"DIV",{class:!0});var o=h(e);t=m(o,"P",{class:!0});var c=h(t);i=N(c,l),c.forEach(u),o.forEach(u),this.h()},h(){s(t,"class","errore svelte-17lderf"),s(e,"class","containterErrore  svelte-17lderf")},m(a,o){M(a,e,o),r(e,t),r(t,i)},p(a,o){o&64&&l!==(l=a[6]("The info is incorrect!")+"")&&q(i,l)},d(a){a&&u(e)}}}function Pe(n){let e,t,l=n[6]("Repeat Password")+"",i,a,o,c,_,E;return{c(){e=v("div"),t=v("label"),i=A(l),a=L(),o=v("div"),c=v("input"),this.h()},l(g){e=m(g,"DIV",{});var f=h(e);t=m(f,"LABEL",{for:!0,class:!0});var d=h(t);i=N(d,l),d.forEach(u),a=P(f),o=m(f,"DIV",{class:!0});var w=h(o);c=m(w,"INPUT",{id:!0,placeholder:!0,name:!0,type:!0,autocomplete:!0,class:!0}),w.forEach(u),f.forEach(u),this.h()},h(){s(t,"for","password"),s(t,"class","block text-sm font-medium leading-6 text-gray-900"),s(c,"id","rpassword"),s(c,"placeholder","   Repeat password"),s(c,"name","rpassword"),s(c,"type","rpassword"),s(c,"autocomplete","password"),c.required=!0,s(c,"class","block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-1 sm:text-sm sm:leading-6"),s(o,"class","mt-2")},m(g,f){M(g,e,f),r(e,t),r(t,i),r(e,a),r(e,o),r(o,c),J(c,n[2]),_||(E=O(c,"input",n[11]),_=!0)},p(g,f){f&64&&l!==(l=g[6]("Repeat Password")+"")&&q(i,l),f&4&&J(c,g[2])},d(g){g&&u(e),_=!1,E()}}}function Qe(n){let e=n[6]("Submit")+"",t;return{c(){t=A(e)},l(l){t=N(l,e)},m(l,i){M(l,t,i)},p(l,i){i&64&&e!==(e=l[6]("Submit")+"")&&q(t,e)},d(l){l&&u(t)}}}function We(n){let e,t;return{c(){e=v("img"),this.h()},l(l){e=m(l,"IMG",{alt:!0,src:!0,class:!0}),this.h()},h(){s(e,"alt","spinner"),Ge(e.src,t=He+"/media/envelop.svg")||s(e,"src",t),s(e,"class","spinner svelte-17lderf")},m(l,i){M(l,e,i)},p:re,d(l){l&&u(e)}}}function Ye(n){let e,t,l=n[6]("Don't have an account?")+"",i,a,o,c=n[6]("Register")+"",_,E,g;return{c(){e=v("div"),t=v("p"),i=A(l),a=L(),o=v("p"),_=A(c),this.h()},l(f){e=m(f,"DIV",{class:!0});var d=h(e);t=m(d,"P",{class:!0});var w=h(t);i=N(w,l),w.forEach(u),a=P(d),o=m(d,"P",{class:!0});var I=h(o);_=N(I,c),I.forEach(u),d.forEach(u),this.h()},h(){s(t,"class","svelte-17lderf"),s(o,"class","svelte-17lderf"),s(e,"class","svelte-17lderf")},m(f,d){M(f,e,d),r(e,t),r(t,i),r(e,a),r(e,o),r(o,_),E||(g=[O(o,"click",n[8]),O(o,"keydown",et)],E=!0)},p(f,d){d&64&&l!==(l=f[6]("Don't have an account?")+"")&&q(i,l),d&64&&c!==(c=f[6]("Register")+"")&&q(_,c)},d(f){f&&u(e),E=!1,fe(g)}}}function Ze(n){let e,t,l=n[6]("Already have an account?")+"",i,a,o,c=n[6]("Login")+"",_,E,g;return{c(){e=v("div"),t=v("p"),i=A(l),a=L(),o=v("p"),_=A(c),this.h()},l(f){e=m(f,"DIV",{class:!0});var d=h(e);t=m(d,"P",{class:!0});var w=h(t);i=N(w,l),w.forEach(u),a=P(d),o=m(d,"P",{class:!0});var I=h(o);_=N(I,c),I.forEach(u),d.forEach(u),this.h()},h(){s(t,"class","svelte-17lderf"),s(o,"class","svelte-17lderf"),s(e,"class","svelte-17lderf")},m(f,d){M(f,e,d),r(e,t),r(t,i),r(e,a),r(e,o),r(o,_),E||(g=[O(o,"click",n[8]),O(o,"keydown",xe)],E=!0)},p(f,d){d&64&&l!==(l=f[6]("Already have an account?")+"")&&q(i,l),d&64&&c!==(c=f[6]("Login")+"")&&q(_,c)},d(f){f&&u(e),E=!1,fe(g)}}}function $e(n){let e,t,l,i,a,o,c=(n[4]?n[6]("REGISTER"):n[6]("LOGIN"))+"",_,E,g,f,d,w,I,B=n[6]("Email address")+"",Y,ae,F,D,oe,U,j,K=n[6]("Password")+"",Z,ie,H,V,ne,$,Q,G,ue,z,C,ce,W,de,ve,y=n[3]&&Le(n),k=n[4]&&Pe(n);function me(p,b){return p[5]?We:Qe}let x=me(n),R=x(n);function pe(p,b){return p[4]?Ze:Ye}let ee=pe(n),T=ee(n);return{c(){e=v("div"),t=v("div"),l=L(),i=v("div"),a=v("div"),o=v("h1"),_=A(c),E=L(),y&&y.c(),g=L(),f=v("div"),d=v("form"),w=v("div"),I=v("label"),Y=A(B),ae=L(),F=v("div"),D=v("input"),oe=L(),U=v("div"),j=v("label"),Z=A(K),ie=L(),H=v("div"),V=v("input"),ne=L(),k&&k.c(),$=L(),Q=v("div"),G=v("button"),R.c(),ue=L(),z=v("div"),C=v("div"),T.c(),ce=L(),W=v("div"),this.h()},l(p){e=m(p,"DIV",{class:!0});var b=h(e);t=m(b,"DIV",{class:!0});var Ne=h(t);Ne.forEach(u),l=P(b),i=m(b,"DIV",{class:!0});var X=h(i);a=m(X,"DIV",{class:!0});var te=h(a);o=m(te,"H1",{class:!0});var he=h(o);_=N(he,c),he.forEach(u),E=P(te),y&&y.l(te),te.forEach(u),g=P(X),f=m(X,"DIV",{class:!0});var _e=h(f);d=m(_e,"FORM",{class:!0});var S=h(d);w=m(S,"DIV",{});var le=h(w);I=m(le,"LABEL",{for:!0,class:!0});var ge=h(I);Y=N(ge,B),ge.forEach(u),ae=P(le),F=m(le,"DIV",{class:!0});var be=h(F);D=m(be,"INPUT",{id:!0,name:!0,type:!0,autocomplete:!0,placeholder:!0,class:!0}),be.forEach(u),le.forEach(u),oe=P(S),U=m(S,"DIV",{});var se=h(U);j=m(se,"LABEL",{for:!0,class:!0});var Ee=h(j);Z=N(Ee,K),Ee.forEach(u),ie=P(se),H=m(se,"DIV",{class:!0});var we=h(H);V=m(we,"INPUT",{id:!0,placeholder:!0,name:!0,type:!0,autocomplete:!0,class:!0}),we.forEach(u),se.forEach(u),ne=P(S),k&&k.l(S),$=P(S),Q=m(S,"DIV",{});var ye=h(Q);G=m(ye,"BUTTON",{type:!0,class:!0});var ke=h(G);R.l(ke),ke.forEach(u),ye.forEach(u),S.forEach(u),_e.forEach(u),ue=P(X),z=m(X,"DIV",{class:!0});var Ie=h(z);C=m(Ie,"DIV",{class:!0});var De=h(C);T.l(De),De.forEach(u),Ie.forEach(u),X.forEach(u),ce=P(b),W=m(b,"DIV",{class:!0});var qe=h(W);qe.forEach(u),b.forEach(u),this.h()},h(){s(t,"class","flex max-h-screen w-2/6"),s(o,"class","svelte-17lderf"),s(a,"class","h-2/6 justify-center text-center svelte-17lderf"),s(I,"for","email"),s(I,"class","block text-sm font-medium leading-6 text-gray-900"),s(D,"id","email"),s(D,"name","email"),s(D,"type","email"),s(D,"autocomplete","email"),s(D,"placeholder","email@mail-service.com"),D.required=!0,s(D,"class","block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-1 sm:text-sm sm:leading-6"),s(F,"class","mt-2"),s(j,"for","password"),s(j,"class","block text-sm font-medium leading-6 text-gray-900"),s(V,"id","password"),s(V,"placeholder","Password"),s(V,"name","password"),s(V,"type","password"),s(V,"autocomplete","current-password"),V.required=!0,s(V,"class","block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-1 sm:text-sm sm:leading-6"),s(H,"class","mt-2"),s(G,"type","button"),s(G,"class","submitButton flex w-full justify-center rounded-md bg-navy-1 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition duration-100 hover:bg-navy-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"),s(d,"class","svelte-17lderf"),s(f,"class","flex h-2/6"),s(C,"class","options svelte-17lderf"),s(z,"class","flex h-2/6"),s(i,"class","h-fit w-2/6 table-column svelte-17lderf"),s(W,"class","flex max-h-screen w-2/6"),s(e,"class","containerAuth svelte-17lderf")},m(p,b){M(p,e,b),r(e,t),r(e,l),r(e,i),r(i,a),r(a,o),r(o,_),r(a,E),y&&y.m(a,null),r(i,g),r(i,f),r(f,d),r(d,w),r(w,I),r(I,Y),r(w,ae),r(w,F),r(F,D),J(D,n[0]),r(d,oe),r(d,U),r(U,j),r(j,Z),r(U,ie),r(U,H),r(H,V),J(V,n[1]),r(d,ne),k&&k.m(d,null),r(d,$),r(d,Q),r(Q,G),R.m(G,null),r(i,ue),r(i,z),r(z,C),T.m(C,null),r(e,ce),r(e,W),de||(ve=[O(D,"input",n[9]),O(V,"input",n[10]),O(G,"click",n[7])],de=!0)},p(p,[b]){b&80&&c!==(c=(p[4]?p[6]("REGISTER"):p[6]("LOGIN"))+"")&&q(_,c),p[3]?y?y.p(p,b):(y=Le(p),y.c(),y.m(a,null)):y&&(y.d(1),y=null),b&64&&B!==(B=p[6]("Email address")+"")&&q(Y,B),b&1&&D.value!==p[0]&&J(D,p[0]),b&64&&K!==(K=p[6]("Password")+"")&&q(Z,K),b&2&&V.value!==p[1]&&J(V,p[1]),p[4]?k?k.p(p,b):(k=Pe(p),k.c(),k.m(d,$)):k&&(k.d(1),k=null),x===(x=me(p))&&R?R.p(p,b):(R.d(1),R=x(p),R&&(R.c(),R.m(G,null))),ee===(ee=pe(p))&&T?T.p(p,b):(T.d(1),T=ee(p),T&&(T.c(),T.m(C,null)))},i:re,o:re,d(p){p&&u(e),y&&y.d(),k&&k.d(),R.d(),T.d(),de=!1,fe(ve)}}}const xe=()=>{},et=()=>{};function tt(n,e,t){let l;Be(n,ze,B=>t(6,l=B)),Xe("ru",Je),Ke.set("ru");let i="",a="",o="",c=!1,_=!1,E=!1;async function g(){if(!E){if(!i||!a||_&&!o){t(3,c=!0);return}t(5,E=!0);try{console.log("before",_),_?(console.log("in else",_),await Ve.signup(i,a)):(console.log("in !",_),await Ve.login(i,a))}catch(B){console.log("auth error",B),t(3,c=!0),t(5,E=!1)}}}function f(){t(4,_=!_)}function d(){i=this.value,t(0,i)}function w(){a=this.value,t(1,a)}function I(){o=this.value,t(2,o)}return[i,a,o,c,_,E,l,g,f,d,w,I]}class lt extends Re{constructor(e){super(),Te(this,e,tt,$e,Ae,{})}}function st(n){let e,t,l,i;return document.title="Login",l=new lt({}),{c(){e=v("meta"),t=L(),Se(l.$$.fragment),this.h()},l(a){const o=Oe("svelte-dc3wr9",document.head);e=m(o,"META",{name:!0,content:!0}),o.forEach(u),t=P(a),Me(l.$$.fragment,a),this.h()},h(){s(e,"name","description"),s(e,"content","Login page")},m(a,o){r(document.head,e),M(a,t,o),Ue(l,a,o),i=!0},p:re,i(a){i||(je(l.$$.fragment,a),i=!0)},o(a){Ce(l.$$.fragment,a),i=!1},d(a){u(e),a&&u(t),Fe(l,a)}}}class nt extends Re{constructor(e){super(),Te(this,e,null,st,Ae,{})}}export{nt as default};