import{s as Tt,f as o,a as b,l as T,g as s,h as p,c as g,m as D,d as i,z as te,j as t,F as v,V as Vt,i as Ze,r as e,W as kt,u as he,n as K,w as Ut,x as qt,o as Bt,X as Rt,v as Re,E as jt}from"../chunks/scheduler.b3080bb7.js";import{S as Dt,i as Lt,b as et,d as tt,m as rt,g as Ft,t as Ee,c as Mt,a as ye,e as ot}from"../chunks/index.46c9a90c.js";import{a as $t,u as zt}from"../chunks/user.b857cfce.js";import{a as St}from"../chunks/firebase.ac311c24.js";import{b as Ht}from"../chunks/paths.5a8ec747.js";import{P as Wt}from"../chunks/ProfileOptions.780a3502.js";import{$ as Xt}from"../chunks/runtime.68e8ff19.js";import{L as Gt}from"../chunks/LoadingButton.261727ad.js";function Jt(c){let a,n,f,d,l=c[3]("Submit")+"",r,C,L;return{c(){a=o("button"),n=o("span"),f=b(),d=o("span"),r=T(l),this.h()},l(w){a=s(w,"BUTTON",{class:!0,type:!0});var x=p(a);n=s(x,"SPAN",{class:!0}),p(n).forEach(i),f=g(x),d=s(x,"SPAN",{class:!0});var k=p(d);r=D(k,l),k.forEach(i),x.forEach(i),this.h()},h(){t(n,"class","absolute inset-x-0 bottom-0 h-[2px] bg-orange-0 transition-all group-hover:h-full group-active:bg-orange-0"),t(d,"class","relative text-sm font-medium text-orange-0 transition-colors group-hover:text-white"),t(a,"class","group relative mx-[136px] flex w-1/2 items-center justify-center overflow-hidden rounded-md border border-orange-0 px-8 py-3 focus:outline-none"),t(a,"type","button")},m(w,x){Ze(w,a,x),e(a,n),e(a,f),e(a,d),e(d,r),C||(L=he(a,"click",c[4]),C=!0)},p(w,x){x&8&&l!==(l=w[3]("Submit")+"")&&K(r,l)},i:Re,o:Re,d(w){w&&i(a),C=!1,L()}}}function Kt(c){let a,n;return a=new Gt({}),{c(){et(a.$$.fragment)},l(f){tt(a.$$.fragment,f)},m(f,d){rt(a,f,d),n=!0},p:Re,i(f){n||(ye(a.$$.fragment,f),n=!0)},o(f){Ee(a.$$.fragment,f),n=!1},d(f){ot(a,f)}}}function Qt(c){let a,n,f,d,l,r,C,L=c[3]("EDIT PROFILE")+"",w,x,k,Q,E,_,y,re,me=c[3]("User name")+"",Pe,je,oe,Y,B,V,Fe,se,_e=c[3]("Short description about you")+"",Ce,Me,ae,ve=c[3]("Don't hesitate write as much as you want")+"",Ie,$e,le,ne,R,P,ze,ie,be=c[3]("Email")+"",Ae,He,Z,ue,j,S,We,ce,ge=c[3]("Phone number")+"",Ne,Xe,pe,F,m,U,Ge,we=c[3]("Select Country")+"",Oe,Je,M,st="Russia",$,at="Asia",z,lt="Europe",H,nt="South America",W,it="North America",X,ut="Africa",G,ct="Australia",J,pt="Antarctic",Ke,fe,xe=c[3]("Country")+"",ke,Qe,I,A,N,Ye,ft;n=new Wt({});const dt=[Kt,Jt],ee=[];function ht(u,h){return u[0]&&!u[1]?0:1}return I=ht(c),A=ee[I]=dt[I](c),{c(){a=o("div"),et(n.$$.fragment),f=b(),d=o("div"),l=o("form"),r=o("div"),C=o("h1"),w=T(L),x=b(),k=o("div"),Q=o("div"),E=o("label"),_=o("input"),y=b(),re=o("span"),Pe=T(me),je=b(),oe=o("div"),Y=o("div"),B=o("label"),V=o("input"),Fe=b(),se=o("span"),Ce=T(_e),Me=b(),ae=o("p"),Ie=T(ve),$e=b(),le=o("div"),ne=o("div"),R=o("label"),P=o("input"),ze=b(),ie=o("span"),Ae=T(be),He=b(),Z=o("div"),ue=o("div"),j=o("label"),S=o("input"),We=b(),ce=o("span"),Ne=T(ge),Xe=b(),pe=o("div"),F=o("label"),m=o("select"),U=o("option"),Ge=T("-- "),Oe=T(we),Je=T(" --"),M=o("option"),M.textContent=st,$=o("option"),$.textContent=at,z=o("option"),z.textContent=lt,H=o("option"),H.textContent=nt,W=o("option"),W.textContent=it,X=o("option"),X.textContent=ut,G=o("option"),G.textContent=ct,J=o("option"),J.textContent=pt,Ke=b(),fe=o("span"),ke=T(xe),Qe=b(),A.c(),this.h()},l(u){a=s(u,"DIV",{class:!0});var h=p(a);tt(n.$$.fragment,h),f=g(h),d=s(h,"DIV",{class:!0});var de=p(d);l=s(de,"FORM",{class:!0});var O=p(l);r=s(O,"DIV",{class:!0});var mt=p(r);C=s(mt,"H1",{class:!0});var _t=p(C);w=D(_t,L),_t.forEach(i),mt.forEach(i),x=g(O),k=s(O,"DIV",{class:!0});var vt=p(k);Q=s(vt,"DIV",{class:!0});var bt=p(Q);E=s(bt,"LABEL",{class:!0,for:!0});var Se=p(E);_=s(Se,"INPUT",{class:!0,type:!0,id:!0,autocomplete:!0}),y=g(Se),re=s(Se,"SPAN",{class:!0});var gt=p(re);Pe=D(gt,me),gt.forEach(i),Se.forEach(i),bt.forEach(i),vt.forEach(i),je=g(O),oe=s(O,"DIV",{class:!0});var wt=p(oe);Y=s(wt,"DIV",{class:!0});var Te=p(Y);B=s(Te,"LABEL",{class:!0,for:!0});var De=p(B);V=s(De,"INPUT",{class:!0,id:!0,placeholder:!0}),Fe=g(De),se=s(De,"SPAN",{class:!0});var xt=p(se);Ce=D(xt,_e),xt.forEach(i),De.forEach(i),Me=g(Te),ae=s(Te,"P",{class:!0});var Et=p(ae);Ie=D(Et,ve),Et.forEach(i),Te.forEach(i),wt.forEach(i),$e=g(O),le=s(O,"DIV",{class:!0});var yt=p(le);ne=s(yt,"DIV",{class:!0});var Pt=p(ne);R=s(Pt,"LABEL",{class:!0,for:!0});var Le=p(R);P=s(Le,"INPUT",{class:!0,type:!0,id:!0,autocomplete:!0,placeholder:!0}),ze=g(Le),ie=s(Le,"SPAN",{class:!0});var Ct=p(ie);Ae=D(Ct,be),Ct.forEach(i),Le.forEach(i),Pt.forEach(i),yt.forEach(i),He=g(O),Z=s(O,"DIV",{class:!0});var Ve=p(Z);ue=s(Ve,"DIV",{class:!0});var It=p(ue);j=s(It,"LABEL",{class:!0,for:!0});var Ue=p(j);S=s(Ue,"INPUT",{class:!0,type:!0,id:!0,autocomplete:!0}),We=g(Ue),ce=s(Ue,"SPAN",{class:!0});var At=p(ce);Ne=D(At,ge),At.forEach(i),Ue.forEach(i),It.forEach(i),Xe=g(Ve),pe=s(Ve,"DIV",{class:!0});var Nt=p(pe);F=s(Nt,"LABEL",{class:!0,for:!0});var qe=p(F);m=s(qe,"SELECT",{class:!0,id:!0});var q=p(m);U=s(q,"OPTION",{});var Be=p(U);Ge=D(Be,"-- "),Oe=D(Be,we),Je=D(Be," --"),Be.forEach(i),M=s(q,"OPTION",{["data-svelte-h"]:!0}),te(M)!=="svelte-1xtzex6"&&(M.textContent=st),$=s(q,"OPTION",{["data-svelte-h"]:!0}),te($)!=="svelte-1melms2"&&($.textContent=at),z=s(q,"OPTION",{["data-svelte-h"]:!0}),te(z)!=="svelte-1hvi7le"&&(z.textContent=lt),H=s(q,"OPTION",{["data-svelte-h"]:!0}),te(H)!=="svelte-1jkvoqk"&&(H.textContent=nt),W=s(q,"OPTION",{["data-svelte-h"]:!0}),te(W)!=="svelte-psc5yc"&&(W.textContent=it),X=s(q,"OPTION",{["data-svelte-h"]:!0}),te(X)!=="svelte-aq2ukg"&&(X.textContent=ut),G=s(q,"OPTION",{["data-svelte-h"]:!0}),te(G)!=="svelte-koxd7y"&&(G.textContent=ct),J=s(q,"OPTION",{["data-svelte-h"]:!0}),te(J)!=="svelte-c76cns"&&(J.textContent=pt),q.forEach(i),Ke=g(qe),fe=s(qe,"SPAN",{class:!0});var Ot=p(fe);ke=D(Ot,xe),Ot.forEach(i),qe.forEach(i),Nt.forEach(i),Ve.forEach(i),Qe=g(O),A.l(O),O.forEach(i),de.forEach(i),h.forEach(i),this.h()},h(){t(C,"class","font-abril text-4xl text-blue-0"),t(r,"class","mb-6 flex justify-center"),t(_,"class","peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(_,"type","text"),_.required=!0,t(_,"id","name"),t(_,"autocomplete","given-name"),t(re,"class","absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(E,"class","relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(E,"for","first-name"),t(Q,"class","w-full px-3"),t(k,"class","-mx-3 mb-6 flex flex-wrap"),t(V,"class","peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(V,"id","description"),t(V,"placeholder","Description"),t(se,"class","absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(B,"class","relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(B,"for","description"),t(ae,"class","mt-3 text-xs italic text-gray-600"),t(Y,"class","h-full w-full px-3"),t(oe,"class","-mx-3 mb-4 flex flex-wrap"),t(P,"class","peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(P,"type","email"),P.required=!0,t(P,"id","email"),t(P,"autocomplete","email"),t(P,"placeholder","email@web.net"),t(ie,"class","absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(R,"class","relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(R,"for","email"),t(ne,"class","w-full px-3"),t(le,"class","-mx-3 mb-6 flex flex-wrap"),t(S,"class","peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(S,"type","tel"),t(S,"id","phone"),S.required=!0,t(S,"autocomplete","tel"),t(ce,"class","absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(j,"class","relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(j,"for","phone-number"),t(ue,"class","w-1/2 px-3"),U.__value="",v(U,U.__value),M.__value="Russia",v(M,M.__value),$.__value="Europe",v($,$.__value),z.__value="Europe",v(z,z.__value),H.__value="South America",v(H,H.__value),W.__value="North America",v(W,W.__value),X.__value="Australia",v(X,X.__value),G.__value="Australia",v(G,G.__value),J.__value="Antarctic",v(J,J.__value),t(m,"class","peer h-[34px] w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"),t(m,"id","country"),m.required=!0,c[2].country===void 0&&Vt(()=>c[9].call(m)),t(fe,"class","absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"),t(F,"class","relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2"),t(F,"for","first-name"),t(pe,"class","w-1/2 px-3"),t(Z,"class","-mx-3 mb-6 flex flex-wrap"),t(l,"class","w-full max-w-lg"),t(d,"class","place mt-40 flex place-content-center"),t(a,"class","isolate bg-white px-6 py-24 sm:py-32 lg:px-8")},m(u,h){Ze(u,a,h),rt(n,a,null),e(a,f),e(a,d),e(d,l),e(l,r),e(r,C),e(C,w),e(l,x),e(l,k),e(k,Q),e(Q,E),e(E,_),v(_,c[2].name),e(E,y),e(E,re),e(re,Pe),e(l,je),e(l,oe),e(oe,Y),e(Y,B),e(B,V),v(V,c[2].description),e(B,Fe),e(B,se),e(se,Ce),e(Y,Me),e(Y,ae),e(ae,Ie),e(l,$e),e(l,le),e(le,ne),e(ne,R),e(R,P),v(P,c[2].email),e(R,ze),e(R,ie),e(ie,Ae),e(l,He),e(l,Z),e(Z,ue),e(ue,j),e(j,S),v(S,c[2].phone),e(j,We),e(j,ce),e(ce,Ne),e(Z,Xe),e(Z,pe),e(pe,F),e(F,m),e(m,U),e(U,Ge),e(U,Oe),e(U,Je),e(m,M),e(m,$),e(m,z),e(m,H),e(m,W),e(m,X),e(m,G),e(m,J),kt(m,c[2].country,!0),e(F,Ke),e(F,fe),e(fe,ke),e(l,Qe),ee[I].m(l,null),N=!0,Ye||(ft=[he(_,"input",c[5]),he(V,"input",c[6]),he(P,"input",c[7]),he(S,"input",c[8]),he(m,"change",c[9])],Ye=!0)},p(u,[h]){(!N||h&8)&&L!==(L=u[3]("EDIT PROFILE")+"")&&K(w,L),h&4&&_.value!==u[2].name&&v(_,u[2].name),(!N||h&8)&&me!==(me=u[3]("User name")+"")&&K(Pe,me),h&4&&V.value!==u[2].description&&v(V,u[2].description),(!N||h&8)&&_e!==(_e=u[3]("Short description about you")+"")&&K(Ce,_e),(!N||h&8)&&ve!==(ve=u[3]("Don't hesitate write as much as you want")+"")&&K(Ie,ve),h&4&&P.value!==u[2].email&&v(P,u[2].email),(!N||h&8)&&be!==(be=u[3]("Email")+"")&&K(Ae,be),h&4&&v(S,u[2].phone),(!N||h&8)&&ge!==(ge=u[3]("Phone number")+"")&&K(Ne,ge),(!N||h&8)&&we!==(we=u[3]("Select Country")+"")&&K(Oe,we),h&4&&kt(m,u[2].country),(!N||h&8)&&xe!==(xe=u[3]("Country")+"")&&K(ke,xe);let de=I;I=ht(u),I===de?ee[I].p(u,h):(Ft(),Ee(ee[de],1,1,()=>{ee[de]=null}),Mt(),A=ee[I],A?A.p(u,h):(A=ee[I]=dt[I](u),A.c()),ye(A,1),A.m(l,null))},i(u){N||(ye(n.$$.fragment,u),ye(A),N=!0)},o(u){Ee(n.$$.fragment,u),Ee(A),N=!1},d(u){u&&i(a),ot(n),ee[I].d(),Ye=!1,Ut(ft)}}}function Yt(c,a,n){let f;qt(c,Xt,E=>n(3,f=E));let d=!1,l=!1,r={name:"",email:"",phone:"",country:"",description:"",messages:[]};Bt(()=>(n(1,l=!1),St.onAuthStateChanged(async _=>{let y=await $t(_);_?(n(2,r.name=y.name??r.name,r),n(2,r.email=y.email??r.email,r),n(2,r.phone=y.phone??r.phone,r),n(2,r.country=y.country??r.country,r),n(2,r.description=y.description??r.description,r),n(2,r.messages=y.messages??r.messages,r)):console.log("no user in Profile.svelte")})));async function C(E){E.preventDefault();const _=St.currentUser;n(0,d=!0);try{await zt(_,r.name,r.email,r.phone,r.country,r.description,r.messages).then(()=>{console.log("Profile updated successfully.")}).catch(y=>{console.error("Error updating profile:",y.message)}),n(1,l=!0),window.location.href=`${Ht}/profile/#`}catch(y){console.error(y)}}function L(){r.name=this.value,n(2,r)}function w(){r.description=this.value,n(2,r)}function x(){r.email=this.value,n(2,r)}function k(){r.phone=this.value,n(2,r)}function Q(){r.country=Rt(this),n(2,r)}return[d,l,r,f,C,L,w,x,k,Q]}class Zt extends Dt{constructor(a){super(),Lt(this,a,Yt,Qt,Tt,{})}}function er(c){let a,n,f,d;return document.title="Edit profile",f=new Zt({}),{c(){a=o("meta"),n=b(),et(f.$$.fragment),this.h()},l(l){const r=jt("svelte-e8d9gf",document.head);a=s(r,"META",{name:!0,content:!0}),r.forEach(i),n=g(l),tt(f.$$.fragment,l),this.h()},h(){t(a,"name","edit profile"),t(a,"content","forms for editing profile")},m(l,r){e(document.head,a),Ze(l,n,r),rt(f,l,r),d=!0},p:Re,i(l){d||(ye(f.$$.fragment,l),d=!0)},o(l){Ee(f.$$.fragment,l),d=!1},d(l){l&&i(n),i(a),ot(f,l)}}}class ur extends Dt{constructor(a){super(),Lt(this,a,null,er,Tt,{})}}export{ur as component};
