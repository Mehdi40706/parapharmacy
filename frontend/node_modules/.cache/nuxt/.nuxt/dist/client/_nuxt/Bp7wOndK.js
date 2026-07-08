import{u as n}from"./Ct40dybG.js";const m=()=>{const e=n();return{initiatePayment:t=>e(`/payments/checkout/${t}`,{method:"POST"}),getPaymentStatus:t=>e(`/payments/status/${t}`)}};export{m as u};
