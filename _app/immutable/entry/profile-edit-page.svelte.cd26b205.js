import{S as ht,i as vt,s as mt,k as a,I as Oe,a as b,q as g,l,m as s,J as Te,h as o,c as w,r as _,n as t,b as gt,C as e,u as R,E as ft,G as dt,y as _t,z as bt,a5 as Wt,A as wt,Q as Pe,a6 as Jt,D as Ve,g as Le,v as Zt,d as Me,f as er,B as Et,F as tr,o as rr,a7 as or,P as sr}from"../chunks/index.dda795d4.js";import{g as ar,u as lr}from"../chunks/user.a7d72829.js";import{a as Qt}from"../chunks/firebase.6a10bde4.js";import{b as nr}from"../chunks/store.e8a68a27.js";import{b as ir}from"../chunks/paths.d2d0af95.js";import{P as ur}from"../chunks/ProfileOptions.3d1e82e8.js";import{X as Kt}from"../chunks/runtime.esm.f3187c81.js";function cr(c){let n,i,u,d,p,r,y,T,M=c[0]("Changes saved")+"",J,le,V,P=c[0]("Your product changes have been saved.")+"",A,h,$,D,z,K=c[0]("Preview")+"",pe,W,E,N,B,Z,j,Q=c[0]("Revert")+"",ne,Ae,L,G,ee=c[0]("Dismiss popup")+"",fe,te,I,S;return{c(){n=a("div"),i=a("div"),u=a("span"),d=Oe("svg"),p=Oe("path"),r=b(),y=a("div"),T=a("strong"),J=g(M),le=b(),V=a("p"),A=g(P),h=b(),$=a("div"),D=a("a"),z=a("span"),pe=g(K),W=b(),E=Oe("svg"),N=Oe("path"),B=b(),Z=a("button"),j=a("span"),ne=g(Q),Ae=b(),L=a("button"),G=a("span"),fe=g(ee),te=b(),I=Oe("svg"),S=Oe("path"),this.h()},l(v){n=l(v,"DIV",{role:!0,class:!0});var C=s(n);i=l(C,"DIV",{class:!0});var q=s(i);u=l(q,"SPAN",{class:!0});var de=s(u);d=Te(de,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var ke=s(d);p=Te(ke,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),s(p).forEach(o),ke.forEach(o),de.forEach(o),r=w(q),y=l(q,"DIV",{class:!0});var re=s(y);T=l(re,"STRONG",{class:!0});var X=s(T);J=_(X,M),X.forEach(o),le=w(re),V=l(re,"P",{class:!0});var ie=s(V);A=_(ie,P),ie.forEach(o),h=w(re),$=l(re,"DIV",{class:!0});var U=s($);D=l(U,"A",{href:!0,class:!0});var O=s(D);z=l(O,"SPAN",{class:!0});var Ne=s(z);pe=_(Ne,K),Ne.forEach(o),W=w(O),E=Te(O,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var ue=s(E);N=Te(ue,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),s(N).forEach(o),ue.forEach(o),O.forEach(o),B=w(U),Z=l(U,"BUTTON",{class:!0});var he=s(Z);j=l(he,"SPAN",{class:!0});var Ie=s(j);ne=_(Ie,Q),Ie.forEach(o),he.forEach(o),U.forEach(o),re.forEach(o),Ae=w(q),L=l(q,"BUTTON",{class:!0});var ve=s(L);G=l(ve,"SPAN",{class:!0});var ce=s(G);fe=_(ce,ee),ce.forEach(o),te=w(ve),I=Te(ve,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var H=s(I);S=Te(H,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),s(S).forEach(o),H.forEach(o),ve.forEach(o),q.forEach(o),C.forEach(o),this.h()},h(){t(p,"stroke-linecap","round"),t(p,"stroke-linejoin","round"),t(p,"d","M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),t(d,"xmlns","http://www.w3.org/2000/svg"),t(d,"fill","none"),t(d,"viewBox","0 0 24 24"),t(d,"stroke-width","1.5"),t(d,"stroke","currentColor"),t(d,"class","h-6 w-6"),t(u,"class","text-green-600"),t(T,"class","block font-medium text-gray-900"),t(V,"class","mt-1 text-sm text-gray-700"),t(z,"class","text-sm"),t(N,"stroke-linecap","round"),t(N,"stroke-linejoin","round"),t(N,"d","M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"),t(E,"xmlns","http://www.w3.org/2000/svg"),t(E,"fill","none"),t(E,"viewBox","0 0 24 24"),t(E,"stroke-width","1.5"),t(E,"stroke","currentColor"),t(E,"class","h-4 w-4"),t(D,"href",ir+"/profile"),t(D,"class","inline-flex items-center gap-2 rounded-lg bg-navy-1 px-4 py-2 text-white hover:bg-blue-0"),t(j,"class","text-sm"),t(Z,"class","block rounded-lg px-4 py-2 text-gray-700 transition hover:bg-gray-100"),t($,"class","mt-4 flex gap-2"),t(y,"class","flex-1"),t(G,"class","sr-only"),t(S,"stroke-linecap","round"),t(S,"stroke-linejoin","round"),t(S,"d","M6 18L18 6M6 6l12 12"),t(I,"xmlns","http://www.w3.org/2000/svg"),t(I,"fill","none"),t(I,"viewBox","0 0 24 24"),t(I,"stroke-width","1.5"),t(I,"stroke","currentColor"),t(I,"class","h-6 w-6"),t(L,"class","text-gray-500 transition hover:text-gray-600"),t(i,"class","flex items-start gap-4"),t(n,"role","alert"),t(n,"class","rounded-xl border border-gray-100 bg-white p-4 shadow-xl mt-6 mb-16")},m(v,C){gt(v,n,C),e(n,i),e(i,u),e(u,d),e(d,p),e(i,r),e(i,y),e(y,T),e(T,J),e(y,le),e(y,V),e(V,A),e(y,h),e(y,$),e($,D),e(D,z),e(z,pe),e(D,W),e(D,E),e(E,N),e($,B),e($,Z),e(Z,j),e(j,ne),e(i,Ae),e(i,L),e(L,G),e(G,fe),e(L,te),e(L,I),e(I,S)},p(v,[C]){C&1&&M!==(M=v[0]("Changes saved")+"")&&R(J,M),C&1&&P!==(P=v[0]("Your product changes have been saved.")+"")&&R(A,P),C&1&&K!==(K=v[0]("Preview")+"")&&R(pe,K),C&1&&Q!==(Q=v[0]("Revert")+"")&&R(ne,Q),C&1&&ee!==(ee=v[0]("Dismiss popup")+"")&&R(fe,ee)},i:ft,o:ft,d(v){v&&o(n)}}}function pr(c,n,i){let u;return dt(c,Kt,d=>i(0,u=d)),[u]}class fr extends ht{constructor(n){super(),vt(this,n,pr,cr,mt,{})}}function Xt(c){let n,i;return n=new fr({}),{c(){_t(n.$$.fragment)},l(u){bt(n.$$.fragment,u)},m(u,d){wt(n,u,d),i=!0},i(u){i||(Le(n.$$.fragment,u),i=!0)},o(u){Me(n.$$.fragment,u),i=!1},d(u){Et(n,u)}}}function dr(c){let n,i,u,d,p,r,y,T,M=c[2]("EDIT PROFILE")+"",J,le,V,P,A,h,$,D,z=c[2]("User name")+"",K,pe,W,E,N,B,Z,j,Q=c[2]("Short description about you")+"",ne,Ae,L,G=c[2]("Don't hesitate write as much as you want")+"",ee,fe,te,I,S,v,C,q,de=c[2]("Email")+"",ke,re,X,ie,U,O,Ne,ue,he=c[2]("Phone number")+"",Ie,ve,ce,H,x,oe,We,Be=c[2]("Select Country")+"",je,Ze,me,et,ge,tt,_e,rt,be,ot,we,st,Ee,at,xe,lt,ye,nt,it,Se,Ce=c[2]("Country")+"",qe,ut,se,Ue,ct,De,Re=c[2]("Submit")+"",Fe,F,pt,xt,k=c[0]&&Xt();return u=new ur({}),{c(){n=a("div"),k&&k.c(),i=b(),_t(u.$$.fragment),d=b(),p=a("div"),r=a("form"),y=a("div"),T=a("h1"),J=g(M),le=b(),V=a("div"),P=a("div"),A=a("label"),h=a("input"),$=b(),D=a("span"),K=g(z),pe=b(),W=a("div"),E=a("div"),N=a("label"),B=a("input"),Z=b(),j=a("span"),ne=g(Q),Ae=b(),L=a("p"),ee=g(G),fe=b(),te=a("div"),I=a("div"),S=a("label"),v=a("input"),C=b(),q=a("span"),ke=g(de),re=b(),X=a("div"),ie=a("div"),U=a("label"),O=a("input"),Ne=b(),ue=a("span"),Ie=g(he),ve=b(),ce=a("div"),H=a("label"),x=a("select"),oe=a("option"),We=g("-- "),je=g(Be),Ze=g("  --"),me=a("option"),et=g("Russia"),ge=a("option"),tt=g("Asia"),_e=a("option"),rt=g("Europe"),be=a("option"),ot=g("South America"),we=a("option"),st=g("North America"),Ee=a("option"),at=g("Africa"),xe=a("option"),lt=g("Australia"),ye=a("option"),nt=g("Antarctic"),it=b(),Se=a("span"),qe=g(Ce),ut=b(),se=a("button"),Ue=a("span"),ct=b(),De=a("span"),Fe=g(Re),this.h()},l(f){n=l(f,"DIV",{class:!0});var m=s(n);k&&k.l(m),i=w(m),bt(u.$$.fragment,m),d=w(m),p=l(m,"DIV",{class:!0});var yt=s(p);r=l(yt,"FORM",{class:!0});var Y=s(r);y=l(Y,"DIV",{class:!0});var Pt=s(y);T=l(Pt,"H1",{class:!0});var At=s(T);J=_(At,M),At.forEach(o),Pt.forEach(o),le=w(Y),V=l(Y,"DIV",{class:!0});var kt=s(V);P=l(kt,"DIV",{class:!0});var It=s(P);A=l(It,"LABEL",{class:!0,for:!0});var $e=s(A);h=l($e,"INPUT",{class:!0,type:!0,id:!0,autocomplete:!0}),$=w($e),D=l($e,"SPAN",{class:!0});var Nt=s(D);K=_(Nt,z),Nt.forEach(o),$e.forEach(o),It.forEach(o),kt.forEach(o),pe=w(Y),W=l(Y,"DIV",{class:!0});var St=s(W);E=l(St,"DIV",{class:!0});var ze=s(E);N=l(ze,"LABEL",{class:!0,for:!0});var Ge=s(N);B=l(Ge,"INPUT",{class:!0,id:!0,placeholder:!0}),Z=w(Ge),j=l(Ge,"SPAN",{class:!0});var Dt=s(j);ne=_(Dt,Q),Dt.forEach(o),Ge.forEach(o),Ae=w(ze),L=l(ze,"P",{class:!0});var Ot=s(L);ee=_(Ot,G),Ot.forEach(o),ze.forEach(o),St.forEach(o),fe=w(Y),te=l(Y,"DIV",{class:!0});var Tt=s(te);I=l(Tt,"DIV",{class:!0});var Vt=s(I);S=l(Vt,"LABEL",{class:!0,for:!0});var He=s(S);v=l(He,"INPUT",{class:!0,type:!0,id:!0,autocomplete:!0,placeholder:!0}),C=w(He),q=l(He,"SPAN",{class:!0});var Lt=s(q);ke=_(Lt,de),Lt.forEach(o),He.forEach(o),Vt.forEach(o),Tt.forEach(o),re=w(Y),X=l(Y,"DIV",{class:!0});var Ye=s(X);ie=l(Ye,"DIV",{class:!0});var Bt=s(ie);U=l(Bt,"LABEL",{class:!0,for:!0});var Je=s(U);O=l(Je,"INPUT",{class:!0,type:!0,id:!0,autocomplete:!0}),Ne=w(Je),ue=l(Je,"SPAN",{class:!0});var Ct=s(ue);Ie=_(Ct,he),Ct.forEach(o),Je.forEach(o),Bt.forEach(o),ve=w(Ye),ce=l(Ye,"DIV",{class:!0});var Ut=s(ce);H=l(Ut,"LABEL",{class:!0,for:!0});var Qe=s(H);x=l(Qe,"SELECT",{class:!0,id:!0});var ae=s(x);oe=l(ae,"OPTION",{});var Xe=s(oe);We=_(Xe,"-- "),je=_(Xe,Be),Ze=_(Xe,"  --"),Xe.forEach(o),me=l(ae,"OPTION",{});var Rt=s(me);et=_(Rt,"Russia"),Rt.forEach(o),ge=l(ae,"OPTION",{});var Mt=s(ge);tt=_(Mt,"Asia"),Mt.forEach(o),_e=l(ae,"OPTION",{});var jt=s(_e);rt=_(jt,"Europe"),jt.forEach(o),be=l(ae,"OPTION",{});var qt=s(be);ot=_(qt,"South America"),qt.forEach(o),we=l(ae,"OPTION",{});var Ft=s(we);st=_(Ft,"North America"),Ft.forEach(o),Ee=l(ae,"OPTION",{});var $t=s(Ee);at=_($t,"Africa"),$t.forEach(o),xe=l(ae,"OPTION",{});var zt=s(xe);lt=_(zt,"Australia"),zt.forEach(o),ye=l(ae,"OPTION",{});var Gt=s(ye);nt=_(Gt,"Antarctic"),Gt.forEach(o),ae.forEach(o),it=w(Qe),Se=l(Qe,"SPAN",{class:!0});var Ht=s(Se);qe=_(Ht,Ce),Ht.forEach(o),Qe.forEach(o),Ut.forEach(o),Ye.forEach(o),ut=w(Y),se=l(Y,"BUTTON",{class:!0,type:!0});var Ke=s(se);Ue=l(Ke,"SPAN",{class:!0}),s(Ue).forEach(o),ct=w(Ke),De=l(Ke,"SPAN",{class:!0});var Yt=s(De);Fe=_(Yt,Re),Yt.forEach(o),Ke.forEach(o),Y.forEach(o),yt.forEach(o),m.forEach(o),this.h()},h(){t(T,"class","text-blue-0 text-4xl font-abril"),t(y,"class","flex justify-center mb-6"),t(h,"class","peer bg-white-1 h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(h,"type","text"),h.required=!0,t(h,"id","name"),t(h,"autocomplete","given-name"),t(D,"class","cursor-text absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 bg-white-1 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(A,"class","block relative overflow-hidden bg-white-1 rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(A,"for","first-name"),t(P,"class","w-full px-3"),t(V,"class","flex flex-wrap -mx-3 mb-6"),t(B,"class","peer bg-white-1 h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(B,"id","description"),t(B,"placeholder","Description"),t(j,"class","cursor-text absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 bg-white-1 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(N,"class","block relative overflow-hidden bg-white-1 rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(N,"for","description"),t(L,"class","text-gray-600 text-xs italic mt-3"),t(E,"class","w-full px-3 h-full"),t(W,"class","flex flex-wrap -mx-3 mb-4"),t(v,"class","peer bg-white-1 h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(v,"type","email"),v.required=!0,t(v,"id","email"),t(v,"autocomplete","email"),t(v,"placeholder","email@web.net"),t(q,"class","cursor-text absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 bg-white-1 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(S,"class","block relative overflow-hidden bg-white-1 rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(S,"for","email"),t(I,"class","w-full px-3"),t(te,"class","flex flex-wrap -mx-3 mb-6"),t(O,"class","peer bg-white-1 h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(O,"type","tel"),t(O,"id","phone"),O.required=!0,t(O,"autocomplete","tel"),t(ue,"class","cursor-text absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 bg-white-1 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(U,"class","block relative overflow-hidden bg-white-1 rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(U,"for","phone-number"),t(ie,"class","w-1/2 px-3"),oe.__value="",oe.value=oe.__value,me.__value="Russia",me.value=me.__value,ge.__value="Europe",ge.value=ge.__value,_e.__value="Europe",_e.value=_e.__value,be.__value="South America",be.value=be.__value,we.__value="North America",we.value=we.__value,Ee.__value="Australia",Ee.value=Ee.__value,xe.__value="Australia",xe.value=xe.__value,ye.__value="Antarctic",ye.value=ye.__value,t(x,"class","peer bg-white-1 h-[34px] w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(x,"id","country"),x.required=!0,c[1].country===void 0&&Wt(()=>c[8].call(x)),t(Se,"class","cursor-text absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 bg-white-1 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(H,"class","block relative overflow-hidden bg-white-1 rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(H,"for","first-name"),t(ce,"class","w-1/2 px-3"),t(X,"class","flex flex-wrap -mx-3 mb-6"),t(Ue,"class","absolute inset-x-0 bottom-0 h-[2px] bg-orange-0 transition-all group-hover:h-full group-active:bg-orange-0"),t(De,"class","relative text-sm font-medium text-orange-0 transition-colors group-hover:text-white"),t(se,"class","flex items-center mx-[136px] w-1/2 rounded-md justify-center group relative overflow-hidden border border-orange-0 px-8 py-3 focus:outline-none focus:ring"),t(se,"type","button"),t(r,"class","w-full max-w-lg "),t(p,"class","flex mt-40 place-content-center place"),t(n,"class","isolate bg-white px-6 py-24 sm:py-32 lg:px-8")},m(f,m){gt(f,n,m),k&&k.m(n,null),e(n,i),wt(u,n,null),e(n,d),e(n,p),e(p,r),e(r,y),e(y,T),e(T,J),e(r,le),e(r,V),e(V,P),e(P,A),e(A,h),Pe(h,c[1].name),e(A,$),e(A,D),e(D,K),e(r,pe),e(r,W),e(W,E),e(E,N),e(N,B),Pe(B,c[1].description),e(N,Z),e(N,j),e(j,ne),e(E,Ae),e(E,L),e(L,ee),e(r,fe),e(r,te),e(te,I),e(I,S),e(S,v),Pe(v,c[1].email),e(S,C),e(S,q),e(q,ke),e(r,re),e(r,X),e(X,ie),e(ie,U),e(U,O),Pe(O,c[1].phone),e(U,Ne),e(U,ue),e(ue,Ie),e(X,ve),e(X,ce),e(ce,H),e(H,x),e(x,oe),e(oe,We),e(oe,je),e(oe,Ze),e(x,me),e(me,et),e(x,ge),e(ge,tt),e(x,_e),e(_e,rt),e(x,be),e(be,ot),e(x,we),e(we,st),e(x,Ee),e(Ee,at),e(x,xe),e(xe,lt),e(x,ye),e(ye,nt),Jt(x,c[1].country,!0),e(H,it),e(H,Se),e(Se,qe),e(r,ut),e(r,se),e(se,Ue),e(se,ct),e(se,De),e(De,Fe),F=!0,pt||(xt=[Ve(h,"input",c[4]),Ve(B,"input",c[5]),Ve(v,"input",c[6]),Ve(O,"input",c[7]),Ve(x,"change",c[8]),Ve(se,"click",c[3])],pt=!0)},p(f,[m]){f[0]?k?m&1&&Le(k,1):(k=Xt(),k.c(),Le(k,1),k.m(n,i)):k&&(Zt(),Me(k,1,1,()=>{k=null}),er()),(!F||m&4)&&M!==(M=f[2]("EDIT PROFILE")+"")&&R(J,M),m&2&&h.value!==f[1].name&&Pe(h,f[1].name),(!F||m&4)&&z!==(z=f[2]("User name")+"")&&R(K,z),m&2&&B.value!==f[1].description&&Pe(B,f[1].description),(!F||m&4)&&Q!==(Q=f[2]("Short description about you")+"")&&R(ne,Q),(!F||m&4)&&G!==(G=f[2]("Don't hesitate write as much as you want")+"")&&R(ee,G),m&2&&v.value!==f[1].email&&Pe(v,f[1].email),(!F||m&4)&&de!==(de=f[2]("Email")+"")&&R(ke,de),m&2&&Pe(O,f[1].phone),(!F||m&4)&&he!==(he=f[2]("Phone number")+"")&&R(Ie,he),(!F||m&4)&&Be!==(Be=f[2]("Select Country")+"")&&R(je,Be),m&2&&Jt(x,f[1].country),(!F||m&4)&&Ce!==(Ce=f[2]("Country")+"")&&R(qe,Ce),(!F||m&4)&&Re!==(Re=f[2]("Submit")+"")&&R(Fe,Re)},i(f){F||(Le(k),Le(u.$$.fragment,f),F=!0)},o(f){Me(k),Me(u.$$.fragment,f),F=!1},d(f){f&&o(n),k&&k.d(),Et(u),pt=!1,tr(xt)}}}function hr(c,n,i){let u,d;dt(c,nr,P=>i(9,u=P)),dt(c,Kt,P=>i(2,d=P));let p=!1,r={name:"",email:"",phone:"",country:"",description:"",messages:[]};rr(()=>(console.log("updating profile..."),i(0,p=!1),console.log("authStore in prfile.svelte before everything",u),Qt.onAuthStateChanged(async A=>{let h=await ar(A);A?(console.log("Restoring profileValue from user profile data"),i(1,r.name=h.name??r.name,r),i(1,r.email=h.email??r.email,r),i(1,r.phone=h.phone??r.phone,r),i(1,r.country=h.country??r.country,r),i(1,r.description=h.description??r.description,r),i(1,r.messages=h.messages??r.messages,r),console.log("after onMount",p)):console.log("no user in Profile.svelte")})));async function y(P){P.preventDefault();const A=Qt.currentUser;console.log("authStore in prfile.svelte before handling",u.data);try{await lr(A,r.name,r.email,r.phone,r.country,r.description,r.messages).then(()=>{console.log("Profile updated successfully.")}).catch(h=>{console.error("Error updating profile:",h.message)}),i(0,p=!0),console.log("after submit",p)}catch(h){console.error(h)}console.log("authStore in prfile.svelte after handling",u.data)}function T(){r.name=this.value,i(1,r)}function M(){r.description=this.value,i(1,r)}function J(){r.email=this.value,i(1,r)}function le(){r.phone=this.value,i(1,r)}function V(){r.country=or(this),i(1,r)}return[p,r,d,y,T,M,J,le,V]}class vr extends ht{constructor(n){super(),vt(this,n,hr,dr,mt,{})}}function mr(c){let n,i,u,d;return document.title="Edit profile",u=new vr({}),{c(){n=a("meta"),i=b(),_t(u.$$.fragment),this.h()},l(p){const r=sr("svelte-e8d9gf",document.head);n=l(r,"META",{name:!0,content:!0}),r.forEach(o),i=w(p),bt(u.$$.fragment,p),this.h()},h(){t(n,"name","edit profile"),t(n,"content","forms for editing profile")},m(p,r){e(document.head,n),gt(p,i,r),wt(u,p,r),d=!0},p:ft,i(p){d||(Le(u.$$.fragment,p),d=!0)},o(p){Me(u.$$.fragment,p),d=!1},d(p){o(n),p&&o(i),Et(u,p)}}}class Pr extends ht{constructor(n){super(),vt(this,n,null,mr,mt,{})}}export{Pr as default};