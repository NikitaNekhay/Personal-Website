import{S as Ie,i as Ae,s as Le,k as r,q as U,a as _,l as o,m as d,r as w,h as n,c as v,n as i,b as De,C as e,O as L,D as R,P as Ue,Q as Pe,E as ce,F as we,y as Be,M as Te,z as Ne,A as Ve,g as qe,d as Re,B as Ce}from"../chunks/index.123fa864.js";import"../chunks/store.729a47b7.js";import{a as Se,b as Fe,c as Me,u as Oe,g as $e}from"../chunks/firebase.7a7c2902.js";import{a as je}from"../chunks/post.af228107.js";function ke(p){let l,u,a,g,t,c,D,$,j,E,k,m,s,z,W,P,Y,B,C,Z,x,y,ee,T,S,te,ae,I,re,N,F,oe,le,A,ie,V,M,ne,se,q,ue,O,de,pe,he;return{c(){l=r("div"),u=r("h2"),a=U("Create a New Blog"),g=_(),t=r("form"),c=r("div"),D=r("label"),$=U("Title:"),j=_(),E=r("input"),k=_(),m=r("div"),s=r("label"),z=U("Description:"),W=_(),P=r("textarea"),Y=_(),B=r("div"),C=r("label"),Z=U("Author:"),x=_(),y=r("input"),ee=_(),T=r("div"),S=r("label"),te=U("Author Email:"),ae=_(),I=r("input"),re=_(),N=r("div"),F=r("label"),oe=U("Price:"),le=_(),A=r("input"),ie=_(),V=r("div"),M=r("label"),ne=U("Images:"),se=_(),q=r("input"),ue=_(),O=r("button"),de=U("Submit"),this.h()},l(h){l=o(h,"DIV",{class:!0});var b=d(l);u=o(b,"H2",{});var me=d(u);a=w(me,"Create a New Blog"),me.forEach(n),g=v(b),t=o(b,"FORM",{});var f=d(t);c=o(f,"DIV",{});var H=d(c);D=o(H,"LABEL",{for:!0});var fe=d(D);$=w(fe,"Title:"),fe.forEach(n),j=v(H),E=o(H,"INPUT",{type:!0,id:!0}),H.forEach(n),k=v(f),m=o(f,"DIV",{});var Q=d(m);s=o(Q,"LABEL",{for:!0});var _e=d(s);z=w(_e,"Description:"),_e.forEach(n),W=v(Q),P=o(Q,"TEXTAREA",{id:!0}),d(P).forEach(n),Q.forEach(n),Y=v(f),B=o(f,"DIV",{});var X=d(B);C=o(X,"LABEL",{for:!0});var ve=d(C);Z=w(ve,"Author:"),ve.forEach(n),x=v(X),y=o(X,"INPUT",{type:!0,id:!0}),X.forEach(n),ee=v(f),T=o(f,"DIV",{});var G=d(T);S=o(G,"LABEL",{for:!0});var Ee=d(S);te=w(Ee,"Author Email:"),Ee.forEach(n),ae=v(G),I=o(G,"INPUT",{type:!0,id:!0}),G.forEach(n),re=v(f),N=o(f,"DIV",{});var J=d(N);F=o(J,"LABEL",{for:!0});var be=d(F);oe=w(be,"Price:"),be.forEach(n),le=v(J),A=o(J,"INPUT",{type:!0,id:!0}),J.forEach(n),ie=v(f),V=o(f,"DIV",{});var K=d(V);M=o(K,"LABEL",{for:!0});var ge=d(M);ne=w(ge,"Images:"),ge.forEach(n),se=v(K),q=o(K,"INPUT",{type:!0,id:!0}),K.forEach(n),ue=v(f),O=o(f,"BUTTON",{type:!0});var ye=d(O);de=w(ye,"Submit"),ye.forEach(n),f.forEach(n),b.forEach(n),this.h()},h(){i(D,"for","title"),i(E,"type","text"),i(E,"id","title"),E.required=!0,i(s,"for","description"),i(P,"id","description"),i(C,"for","author"),i(y,"type","text"),i(y,"id","author"),y.required=!0,i(S,"for","authorEmail"),i(I,"type","email"),i(I,"id","authorEmail"),I.required=!0,i(F,"for","price"),i(A,"type","number"),i(A,"id","price"),A.required=!0,i(M,"for","images"),i(q,"type","file"),i(q,"id","images"),q.multiple=!0,i(O,"type","submit"),i(l,"class","pt-20 flex text-center justify-center")},m(h,b){De(h,l,b),e(l,u),e(u,a),e(l,g),e(l,t),e(t,c),e(c,D),e(D,$),e(c,j),e(c,E),L(E,p[0].title),e(t,k),e(t,m),e(m,s),e(s,z),e(m,W),e(m,P),L(P,p[0].description),e(t,Y),e(t,B),e(B,C),e(C,Z),e(B,x),e(B,y),L(y,p[0].author),e(t,ee),e(t,T),e(T,S),e(S,te),e(T,ae),e(T,I),L(I,p[0].authorEmail),e(t,re),e(t,N),e(N,F),e(F,oe),e(N,le),e(N,A),L(A,p[0].price),e(t,ie),e(t,V),e(V,M),e(M,ne),e(V,se),e(V,q),e(t,ue),e(t,O),e(O,de),pe||(he=[R(E,"input",p[3]),R(P,"input",p[4]),R(y,"input",p[5]),R(I,"input",p[6]),R(A,"input",p[7]),R(q,"change",p[2]),R(t,"submit",Ue(p[1]))],pe=!0)},p(h,[b]){b&1&&E.value!==h[0].title&&L(E,h[0].title),b&1&&L(P,h[0].description),b&1&&y.value!==h[0].author&&L(y,h[0].author),b&1&&I.value!==h[0].authorEmail&&L(I,h[0].authorEmail),b&1&&Pe(A.value)!==h[0].price&&L(A,h[0].price)},i:ce,o:ce,d(h){h&&n(l),pe=!1,we(he)}}}function ze(p,l,u){let a={id:-1,title:"",description:"",author:"",authorEmail:"",price:"",images:[],date:new Date};async function g(m){m.preventDefault(),Se.currentUser;try{const s=await Promise.all(a.images.map(t));u(0,a.images=s,a),je(a),console.log("Form submitted")}catch(s){console.log("auth error",s)}}async function t(m){try{const s=Fe(Me,`images/${m.name}`);return await Oe(s,m),await $e(s)}catch(s){console.log("error while uploading the image",s)}}function c(m){try{const s=m.target.files;u(0,a.images=Array.from(s),a)}catch(s){console.log("error while handleImageUpload",s)}}function D(){a.title=this.value,u(0,a)}function $(){a.description=this.value,u(0,a)}function j(){a.author=this.value,u(0,a)}function E(){a.authorEmail=this.value,u(0,a)}function k(){a.price=Pe(this.value),u(0,a)}return[a,g,c,D,$,j,E,k]}class He extends Ie{constructor(l){super(),Ae(this,l,ze,ke,Le,{})}}function Qe(p){let l,u,a,g;return document.title="Dashboard",a=new He({}),{c(){l=r("meta"),u=_(),Be(a.$$.fragment),this.h()},l(t){const c=Te("svelte-1r5sch0",document.head);l=o(c,"META",{name:!0,content:!0}),c.forEach(n),u=v(t),Ne(a.$$.fragment,t),this.h()},h(){i(l,"name","dashboard"),i(l,"content","Admin dashboard, manage users and posts")},m(t,c){e(document.head,l),De(t,u,c),Ve(a,t,c),g=!0},p:ce,i(t){g||(qe(a.$$.fragment,t),g=!0)},o(t){Re(a.$$.fragment,t),g=!1},d(t){n(l),t&&n(u),Ce(a,t)}}}class We extends Ie{constructor(l){super(),Ae(this,l,null,Qe,Le,{})}}export{We as default};
