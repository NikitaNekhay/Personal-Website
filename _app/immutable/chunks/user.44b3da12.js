import{r as d,e as i,d as c,J as h,h as D,t as m}from"./firebase.11792937.js";async function U(e,s,o,a,r,p,f){try{const n=d(i(c,"user"),e.uid);await D(c,async g=>{const l=await g.get(n);if(console.log("userDoc is existing?",l),!l.exists())throw new Error("User does not exist");const t=l.data();console.log("WHAT WE HAVE FROM DOCUMENTS userData: ",t);const u={name:s??t.name,email:o??t.email,phone:a??t.phone,country:r??t.country,description:p??t.description,messages:f??t.messages};console.log("WHAT WE GOT FROM SUBMIT updatedUserData: ",u),console.log("userDocRef before transaction.update ",n),console.log("updatedUserData before transaction.update ",u),g.update(n,u)})}catch(n){console.error("Error updating user:",n)}}async function w(e){try{console.log("getting user profile his id: ",e.uid);const s=d(i(c,"user"),e.uid),o=await h(s),a=o.data(),r={user:e.uid,email:e.email};return console.log("is user exists? ",o.exists()),o.exists()?o.data():r}catch(s){console.error("Error fetching user:",s)}}async function E(){const e=i(c,"user");let o=(await m(e)).docs.map(r=>({id:r.id,...r.data()})),a=0;for(a=0;a<o.length;a++)try{return o}catch(r){console.log("error while adding additional info for each user",r)}}async function x(e){try{const s=d(i(c,"user"),e);await deleteDoc(s),console.log("Blog post deleted:",e)}catch(s){console.error("Error deleting blog post:",s)}}export{E as a,w as g,x as h,U as u};
