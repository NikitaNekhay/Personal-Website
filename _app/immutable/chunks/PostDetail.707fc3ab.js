import{S as Ge,i as Re,s as We,e as pe,b as X,E as ve,h as u,G as ye,o as qe,W as Fe,k as p,q as f,l as v,m,r as _,C as r,a as N,c as P,n as E,p as Ue,D as we,u as g,F as Je,T as Qe,K as He}from"./index.476e330c.js";import"./post.1331917e.js";import"./paths.0244664b.js";import{X as Ye}from"./runtime.esm.6ee43cdf.js";import"./store_.7c36786d.js";import"./firebase.11792937.js";function Ke(o,t,n){const l=o.slice();return l[10]=t[n],l}function Ze(o){let t,n;return{c(){t=p("p"),n=f("Loading...")},l(l){t=v(l,"P",{});var e=m(t);n=_(e,"Loading..."),e.forEach(u)},m(l,e){X(l,t,e),r(t,n)},p:ve,d(l){l&&u(t)}}}function $e(o){let t,n,l,e,s,a,T,A=o[2]("BACK")+"",O,V,k,I=o[2]("NEXT")+"",d,B,Y,h,q,U=o[0].title+"",Z,me,w,H=o[0].description+"",$,Ee,S,K=o[2]("Author")+"",x,be,j=o[0].author+"",ee,ge,C,G=o[2]("Author Email")+"",te,ke,R=o[0].authorEmail+"",le,De,z,W=o[2]("Price")+"",se,Te,y=o[0].price+"",ae,Ne,M,F=o[2]("Date")+"",re,Pe,J=o[0].date+"",ne,Ae,L,Q=o[2]("SEND EMAIL TO AUTHOR")+"",oe,ie,Ie,Oe;function Se(i,c){return i[0].images?et:xe}let ce=Se(o),D=ce(o);return{c(){t=p("div"),n=p("div"),l=p("div"),D.c(),e=N(),s=p("div"),a=p("button"),T=f("← "),O=f(A),V=N(),k=p("button"),d=f(I),B=f(" →"),Y=N(),h=p("div"),q=p("h1"),Z=f(U),me=N(),w=p("p"),$=f(H),Ee=N(),S=p("p"),x=f(K),be=f(" : "),ee=f(j),ge=N(),C=p("p"),te=f(G),ke=f(" : "),le=f(R),De=N(),z=p("p"),se=f(W),Te=f(" : "),ae=f(y),Ne=N(),M=p("p"),re=f(F),Pe=f(" : "),ne=f(J),Ae=N(),L=p("a"),oe=f(Q),this.h()},l(i){t=v(i,"DIV",{class:!0});var c=m(t);n=v(c,"DIV",{class:!0});var Ce=m(n);l=v(Ce,"DIV",{class:!0,style:!0});var ze=m(l);D.l(ze),ze.forEach(u),Ce.forEach(u),e=P(c),s=v(c,"DIV",{class:!0});var ue=m(s);a=v(ue,"BUTTON",{class:!0});var Le=m(a);T=_(Le,"← "),O=_(Le,A),Le.forEach(u),V=P(ue),k=v(ue,"BUTTON",{class:!0});var Xe=m(k);d=_(Xe,I),B=_(Xe," →"),Xe.forEach(u),ue.forEach(u),c.forEach(u),Y=P(i),h=v(i,"DIV",{class:!0});var b=m(h);q=v(b,"H1",{});var Me=m(q);Z=_(Me,U),Me.forEach(u),me=P(b),w=v(b,"P",{});var Ve=m(w);$=_(Ve,H),Ve.forEach(u),Ee=P(b),S=v(b,"P",{});var fe=m(S);x=_(fe,K),be=_(fe," : "),ee=_(fe,j),fe.forEach(u),ge=P(b),C=v(b,"P",{});var _e=m(C);te=_(_e,G),ke=_(_e," : "),le=_(_e,R),_e.forEach(u),De=P(b),z=v(b,"P",{});var he=m(z);se=_(he,W),Te=_(he," : "),ae=_(he,y),he.forEach(u),Ne=P(b),M=v(b,"P",{});var de=m(M);re=_(de,F),Pe=_(de," : "),ne=_(de,J),de.forEach(u),Ae=P(b),L=v(b,"A",{href:!0,class:!0});var Be=m(L);oe=_(Be,Q),Be.forEach(u),b.forEach(u),this.h()},h(){E(l,"class","slider-line svelte-uzc2z6"),Ue(l,"transform","translateX("+o[1]+"px)"),E(n,"class","slider svelte-uzc2z6"),E(a,"class","slider-back transition duration-100 hover:text-orange-0"),E(k,"class","slider-next transition duration-100 hover:text-orange-0"),E(s,"class","buttons items-center justify-center text-center content-center"),E(t,"class","container_slider"),E(L,"href",ie="mailto:"+o[0].authorEmail),E(L,"class","transition duration-100 hover:text-blue-0"),E(h,"class","items-center justify-center text-center content-center mt-4 bore")},m(i,c){X(i,t,c),r(t,n),r(n,l),D.m(l,null),r(t,e),r(t,s),r(s,a),r(a,T),r(a,O),r(s,V),r(s,k),r(k,d),r(k,B),X(i,Y,c),X(i,h,c),r(h,q),r(q,Z),r(h,me),r(h,w),r(w,$),r(h,Ee),r(h,S),r(S,x),r(S,be),r(S,ee),r(h,ge),r(h,C),r(C,te),r(C,ke),r(C,le),r(h,De),r(h,z),r(z,se),r(z,Te),r(z,ae),r(h,Ne),r(h,M),r(M,re),r(M,Pe),r(M,ne),r(h,Ae),r(h,L),r(L,oe),Ie||(Oe=[we(a,"click",o[3]),we(k,"click",o[4])],Ie=!0)},p(i,c){ce===(ce=Se(i))&&D?D.p(i,c):(D.d(1),D=ce(i),D&&(D.c(),D.m(l,null))),c&2&&Ue(l,"transform","translateX("+i[1]+"px)"),c&4&&A!==(A=i[2]("BACK")+"")&&g(O,A),c&4&&I!==(I=i[2]("NEXT")+"")&&g(d,I),c&1&&U!==(U=i[0].title+"")&&g(Z,U),c&1&&H!==(H=i[0].description+"")&&g($,H),c&4&&K!==(K=i[2]("Author")+"")&&g(x,K),c&1&&j!==(j=i[0].author+"")&&g(ee,j),c&4&&G!==(G=i[2]("Author Email")+"")&&g(te,G),c&1&&R!==(R=i[0].authorEmail+"")&&g(le,R),c&4&&W!==(W=i[2]("Price")+"")&&g(se,W),c&1&&y!==(y=i[0].price+"")&&g(ae,y),c&4&&F!==(F=i[2]("Date")+"")&&g(re,F),c&1&&J!==(J=i[0].date+"")&&g(ne,J),c&4&&Q!==(Q=i[2]("SEND EMAIL TO AUTHOR")+"")&&g(oe,Q),c&1&&ie!==(ie="mailto:"+i[0].authorEmail)&&E(L,"href",ie)},d(i){i&&u(t),D.d(),i&&u(Y),i&&u(h),Ie=!1,Je(Oe)}}}function xe(o){let t,n,l;return{c(){t=p("div"),n=p("p"),l=f("NO images")},l(e){t=v(e,"DIV",{});var s=m(t);n=v(s,"P",{});var a=m(n);l=_(a,"NO images"),a.forEach(u),s.forEach(u)},m(e,s){X(e,t,s),r(t,n),r(n,l)},p:ve,d(e){e&&u(t)}}}function et(o){let t,n=o[0].images,l=[];for(let e=0;e<n.length;e+=1)l[e]=je(Ke(o,n,e));return{c(){for(let e=0;e<l.length;e+=1)l[e].c();t=pe()},l(e){for(let s=0;s<l.length;s+=1)l[s].l(e);t=pe()},m(e,s){for(let a=0;a<l.length;a+=1)l[a]&&l[a].m(e,s);X(e,t,s)},p(e,s){if(s&1){n=e[0].images;let a;for(a=0;a<n.length;a+=1){const T=Ke(e,n,a);l[a]?l[a].p(T,s):(l[a]=je(T),l[a].c(),l[a].m(t.parentNode,t))}for(;a<l.length;a+=1)l[a].d(1);l.length=n.length}},d(e){Qe(l,e),e&&u(t)}}}function je(o){let t,n,l;return{c(){t=p("img"),this.h()},l(e){t=v(e,"IMG",{src:!0,alt:!0,class:!0}),this.h()},h(){He(t.src,n=o[10])||E(t,"src",n),E(t,"alt",l=o[0].title),E(t,"class","w-100 h-100 svelte-uzc2z6")},m(e,s){X(e,t,s)},p(e,s){s&1&&!He(t.src,n=e[10])&&E(t,"src",n),s&1&&l!==(l=e[0].title)&&E(t,"alt",l)},d(e){e&&u(t)}}}function tt(o){let t;function n(s,a){return s[0]?$e:Ze}let l=n(o),e=l(o);return{c(){e.c(),t=pe()},l(s){e.l(s),t=pe()},m(s,a){e.m(s,a),X(s,t,a)},p(s,[a]){l===(l=n(s))&&e?e.p(s,a):(e.d(1),e=l(s),e&&(e.c(),e.m(t.parentNode,t)))},i:ve,o:ve,d(s){e.d(s),s&&u(t)}}}const lt=50;function st(o,t,n){let l;ye(o,Ye,d=>n(2,l=d));let{post:e}=t;console.log(e),qe(async()=>{});const s=Fe();let a=0;function T(){n(1,a+=400),a>(e.images.length-1)*100&&n(1,a=0),s("swipe",{direction:"next",offset:a})}function A(){n(1,a-=400),a<0&&n(1,a=(e.images.length-1)*100),s("swipe",{direction:"back",offset:a})}let O,V;function k(d){O=d.touches[0].clientX}function I(d){V=d.changedTouches[0].clientX;const B=O-V;Math.abs(B)>lt&&(B>0?T():A())}return qe(()=>{const d=document.querySelector(".slider-line");return d.addEventListener("touchstart",k),d.addEventListener("touchend",I),()=>{d.removeEventListener("touchstart",k),d.removeEventListener("touchend",I)}}),o.$$set=d=>{"post"in d&&n(0,e=d.post)},[e,a,l,T,A]}class ut extends Ge{constructor(t){super(),Re(this,t,st,tt,We,{post:0})}}export{ut as P};
