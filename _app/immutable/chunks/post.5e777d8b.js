import{e as i,d as e,r as d,J as b,f as w,h as m,t as y,o as D}from"./firebase.11792937.js";import{c as E}from"./store.057b7dc0.js";const B=i(e,"blogs");async function R(o){try{console.log("Temp post:",o);const t=await w(B,o);console.log("New blog added with ID: ",t.id),x(t.id,o.title,o.images,o.author,o.authorEmail,o.description,o.price,o.date)}catch(t){console.log("error while adding blog post",t)}}async function x(o,t,r,s,c,h,u,f){try{const l=d(i(e,"blogs"),o);await m(e,async g=>{const n=await g.get(l);if(!n.exists())throw new Error("Post does not exist");const a=n.data();console.log("this is postData var:",a);const p={id:o??a.id,title:t??a.title,images:r??a.images,author:s??a.author,authorEmail:c??a.authorEmail,description:h??a.description,price:u??a.price,date:f??a.date};g.update(l,p),console.log("this is updatedPostData var:",p),console.log("this is what happens with post data after transaction: ",n.data())})}catch(l){console.error("Error updating post:",l)}}async function S(o){try{console.log("this is id for db call: ",o);const t=d(i(e,"blogs"),o),r=await b(t);if(r.exists()){const s=r.data(),c={id:s.id??0,title:s.title??"",images:s.images??[],author:s.author??"John Berkley",authorEmail:s.authorEmail??"john.example@gmail.com",description:s.description??"Lorem ipsum",price:s.price??1,date:s.date??new Date};return E.set(c),r.exists()?r.data():null}else return null}catch(t){console.error("Error fetching post:",t)}}async function v(){try{const o=i(e,"blogs");return(await y(o)).docs.map(s=>({id:s.id,...s.data()}))}catch(o){return console.error("Error fetching blog posts:",o),[]}}async function C(o){try{const t=d(i(e,"blogs"),o);await D(t),console.log("Blog post deleted:",o)}catch(t){console.error("Error deleting blog post:",t)}}export{R as a,S as b,C as d,v as g,x as u};
