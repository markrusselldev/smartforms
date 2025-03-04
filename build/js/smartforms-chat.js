(()=>{"use strict";function e(e,t){e.firstElementChild&&e.firstElementChild.remove(),e.insertBefore(t,e.firstElementChild)}const t=function(){const e=document.getElementById("smartforms-config");if(e)try{return JSON.parse(e.textContent)}catch(e){return console.error("Error parsing smartforms configuration:",e),null}return null}()||{formData:null,ajaxUrl:"",nonce:"",formId:null};document.addEventListener("DOMContentLoaded",(()=>{const{formData:r,ajaxUrl:a,nonce:n,formId:o}=t;if(!r||!r.fields||0===r.fields.length)return void console.error("No form data available for SmartForms chat flow.");let s=0;const l={};let c=null;const i=document.getElementById("smartforms-chat-dialog"),m=document.getElementById("smartforms-chat-submit-button"),d=document.getElementById("smartforms-chat-input-box"),u=document.getElementById("smartforms-chat-help-container");function p(e,t){const r=document.createElement("div");r.classList.add("smartforms-chat-message",t);const a=document.createElement("p");a.textContent=e,r.appendChild(a),i.appendChild(r),i.scrollTop=i.scrollHeight}function f(e,t){e.required&&(null===t||"string"==typeof t&&""===t.trim()||Array.isArray(t)&&0===t.length)?m.classList.add("disabled"):m.classList.remove("disabled")}function h(){const t=r.fields[s];c=null,p(t.label,"bot");const a=function(e,t){let r;return"text"===e.type?(r=document.createElement("input"),r.type="text",r.className="form-control smartforms-text-input",r.placeholder=e.placeholder||"Type your answer here...",r.addEventListener("input",(r=>{t(e,r.target.value)}))):"checkbox"===e.type?(r=document.createElement("div"),r.className="sf-checkbox-group sf-checkbox-group-"+(e.layout||"horizontal"),r.setAttribute("data-layout",e.layout||"horizontal"),e.options&&Array.isArray(e.options)&&e.options.forEach((a=>{const n=document.createElement("div"),o="horizontal"===e.layout?" form-check-inline":"";n.className="sf-checkbox-option form-check"+o;const s=document.createElement("input");s.type="checkbox",s.className="form-check-input",s.value=a.value,s.id=e.id?`${e.id}-${a.value}`:a.value;const l=document.createElement("label");l.className="form-check-label",l.htmlFor=s.id,l.textContent=a.label,n.appendChild(s),n.appendChild(l),r.appendChild(n),s.addEventListener("change",(()=>{const a=Array.from(r.querySelectorAll("input[type='checkbox']")).filter((e=>e.checked)).map((e=>e.value));t(e,a)}))}))):"select"===e.type?(r=document.createElement("select"),r.className="form-control smartforms-select",e.options&&Array.isArray(e.options)&&e.options.forEach((e=>{const t=document.createElement("option");t.value=e.value,t.textContent=e.label,r.appendChild(t)})),r.addEventListener("change",(r=>{t(e,r.target.value)}))):"slider"===e.type?(r=document.createElement("input"),r.type="range",r.className="form-control smartforms-slider",r.min=e.min||0,r.max=e.max||100,r.value=e.value||Math.floor(((e.min||0)+(e.max||100))/2),r.addEventListener("input",(r=>{t(e,r.target.value)}))):"number"===e.type?(r=document.createElement("input"),r.type="number",r.className="form-control smartforms-number",r.placeholder=e.placeholder||"",r.addEventListener("input",(r=>{t(e,r.target.value)}))):"buttons"===e.type?(r=document.createElement("div"),r.className="sf-buttons-group d-flex flex-wrap gap-2",e.options&&Array.isArray(e.options)&&e.options.forEach((a=>{const n=document.createElement("button");n.type="button",n.className="btn btn-primary",n.setAttribute("data-value",a.value),n.textContent=a.label,n.addEventListener("click",(()=>{Array.from(r.children).forEach((e=>e.classList.remove("active"))),n.classList.contains("active")?(n.classList.remove("active"),t(e,null)):(n.classList.add("active"),t(e,a.value))})),r.appendChild(n)}))):(r=document.createElement("textarea"),r.className="form-control smartforms-textarea smartforms-chat-input",r.rows=4,r.placeholder=e.placeholder||"Type your answer here...",r.addEventListener("input",(r=>{t(e,r.target.value)}))),r}(t,f);e(d,a),f(t,c)}h(),m.classList.add("disabled"),m.addEventListener("click",(t=>{if(t.preventDefault(),m.classList.contains("disabled")){const e=r.fields[s];return u.textContent=e.requiredMessage||`${e.label} is required.`,u.classList.add("smartforms-error-message"),void setTimeout((()=>{u.textContent=e.helpText||"Enter your help text",u.classList.remove("smartforms-error-message")}),3e3)}const f=r.fields[s];let y;if("buttons"===f.type)y=c;else if("checkbox"===f.type){const e=d.querySelectorAll("input[type='checkbox']");y=Array.from(e).filter((e=>e.checked)).map((e=>e.value)).join(", ")}else if("text"===f.type){const e=d.querySelector("input");if(!e)return;y=e.value}else{const e=d.firstElementChild;if(!e)return;y=e.value}!function(t,f=t){const y=r.fields[s];if(y.required&&("string"==typeof t&&""===t.trim()||Array.isArray(t)&&0===t.length||null===t))return u.textContent=y.requiredMessage||`${y.label} is required.`,u.classList.add("smartforms-error-message"),void setTimeout((()=>{u.textContent=y.helpText||"Enter your help text",u.classList.remove("smartforms-error-message")}),3e3);if(p(f,"user"),u.textContent=y.helpText||"Enter your help text",u.classList.remove("smartforms-error-message"),l[y.id||s]=t,c=null,s<r.fields.length-1)s++,h();else{const t=new URLSearchParams;t.append("action","process_smartform"),t.append("smartform_nonce",n),t.append("form_id",o),t.append("form_data",JSON.stringify(l)),fetch(a,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t.toString()}).then((e=>e.json())).then((t=>{i.innerHTML="";const r=document.createElement("div");if(r.classList.add("smartforms-chat-message","bot"),t.success)r.innerHTML=`<p>${t.data.message}</p>`;else{const e=Array.isArray(t.data)?t.data.join(" "):t.data;r.innerHTML=`<p class="error">${e}</p>`}i.appendChild(r),i.scrollTop=i.scrollHeight;const a=document.createElement("textarea");a.className="form-control smartforms-chat-input",a.rows=4,a.placeholder="Type your message here...",a.disabled=!0,e(d,a),m.classList.add("disabled")})).catch((e=>{console.error("AJAX submission error:",e)}))}}(y)}))}))})();