import{r as d,e as l,d as c,h,J as E}from"./firebase.11792937.js";import{b as f}from"./store.bac6cf28.js";async function k(e,a,o,r,i,y,g){try{const u=d(l(c,"user"),e.uid);await h(c,async m=>{const p=await m.get(u);if(!p.exists())if(e){D(e);return}else throw new Error("User does not exist");const s=p.data();console.log("WHAT WE HAVE FROM DOCUMENTS userData: ",s);const t={name:a??s.name,email:o??s.email,phone:r??s.phone,country:i??s.country,description:y??s.description,messages:g??s.messages};console.log("WHAT WE GOT FROM SUBMIT updatedUserData: ",t),f.update(n=>(n.user=e,n.loading=!0,n.data.email=t.email,n.data.country=t.country,n.data.name=t.name,n.data.email=t.email,n.data.phone=t.phone,n.data.country=t.country,n.data.description=t.description,console.log("this is the store:",n),{user:e,loading:!0,data:{...n.data,name:t.name,email:t.email,phone:t.phone,country:t.country,description:t.description}})),m.update(u,t)})}catch(u){console.error("Error updating user:",u)}}async function D(e){try{console.log("refreshing");const a=d(l(c,"user"),e.uid);await h(c,async o=>{let r;e.email===null?r="null":r=e.email;const i={name:"",email:r,phone:"",country:"",description:"",messages:[""]};f.set({user:e,loading:!0,data:{name:i.name,email:r,phone:i.phone,country:i.country,description:i.description}})})}catch(a){console.error("Error updating user:",a)}}async function v(e){try{console.log(e.uid);const a=d(l(c,"user"),e.uid),o=await E(a);return o.exists()?o.data():null}catch(a){console.error("Error fetching user:",a)}}function O(e){const a=r=>{e&&!e.contains(r.target)&&!r.defaultPrevented&&e.dispatchEvent(new CustomEvent("click_outside"))},o=window.document;return o.addEventListener("click",a,!0),{destroy(){o.removeEventListener("click",a,!0)}}}export{O as c,v as g,k as u};