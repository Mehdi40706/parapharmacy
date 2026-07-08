import{u as o}from"./Ct40dybG.js";const p=()=>{const e=o();return{fetchUsers:s=>e("/users",{params:s}),updateUserRole:(s,r)=>e(`/users/${s}/role`,{method:"PATCH",body:{role:r}})}};export{p as u};
