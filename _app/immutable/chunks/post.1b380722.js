import{b as a,d as e,r as l,J as c,t as i,o as g}from"./firebase.bcf0f94d.js";import{c as p}from"./store.b9a0c83a.js";a(e,"blogs");async function b(t){try{console.log("this is id for db call: ",t);const s=l(a(e,"blogs"),t),r=await c(s);if(r.exists()){const o=r.data(),n={id:o.id??0,title:o.title??"",images:o.images??[],author:o.author??"John Berkley",authorEmail:o.authorEmail??"john.example@gmail.com",description:o.description??"Lorem ipsum",price:o.price??1,date:o.date??new Date};return p.set(n),r.data()}else return null}catch(s){console.error("Error fetching post:",s)}}async function m(){try{const t=a(e,"blogs");return(await i(t)).docs.map(o=>({id:o.id,...o.data()}))}catch(t){return console.error("Error fetching blog posts:",t),[]}}async function u(t){try{const s=l(a(e,"blogs"),t);await g(s),console.log("Blog post deleted:",t)}catch(s){console.error("Error deleting blog post:",s)}}export{b as a,u as d,m as g};
