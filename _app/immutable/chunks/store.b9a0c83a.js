import{e as d,f as m,g as h,a as o}from"./firebase.bcf0f94d.js";import{w as i}from"./index.b6a128ba.js";function l(a,e){try{const t=typeof localStorage<"u",s=t?localStorage.getItem(a):null,r=t&&s!==null?JSON.parse(s):e,{subscribe:c,set:g,update:u}=i(r);return{subscribe:c,set(n){g(n),t&&localStorage.setItem(a,JSON.stringify(n))},update:u}}catch(t){console.log("error createLocalStorageStore ",t)}}const f=l("auth",{user:null,loading:!0,data:{name:"",email:"",phone:"",country:"",description:"",messages:[]}});l("stat",{id:-1,authorEmailClicks:0,adminDataClicks:0});const w=i({id:"",title:"",images:[],author:"John Berkley",authorEmail:"john.example@gmail.com",description:"Lorem ipsum",price:1,date:new Date}),y={signup:async(a,e)=>{await d(o,a,e),console.log("creating user")},login:async(a,e)=>{console.log("signing in"),await m(o,a,e)},logout:async()=>{console.log("signing out"),await h(o)},deactivate:async()=>{var a;console.log("deactivating account..."),await((a=o.currentUser)==null?void 0:a.delete()),console.log("User successfully deactivated")}};export{y as a,f as b,w as c};
