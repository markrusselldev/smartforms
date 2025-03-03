(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{const e=window.formData;if(!e||!e.fields||!e.fields.length)return;let t=0;const r={};let s=null;const a=document.getElementById("smartforms-chat-dialog"),o=document.getElementById("smartforms-chat-submit-button"),n=document.getElementById("smartforms-chat-input-box"),l=document.getElementById("smartforms-chat-help-container"),c=(e,t)=>{e.required&&(null===t||"string"==typeof t&&0===t.trim().length||Array.isArray(t)&&0===t.length)?o.classList.add("disabled"):o.classList.remove("disabled")},i=e=>{n.firstElementChild&&n.firstElementChild.remove(),n.insertBefore(e,n.firstElementChild)},m=()=>{const r=e.fields[t];s=null,(e=>{const t=document.createElement("div");t.classList.add("smartforms-chat-message","bot");const r=document.createElement("p");r.textContent=e,t.appendChild(r),a.appendChild(t),a.scrollTop=a.scrollHeight})(r.label);const o=(e=>{let t;if("text"===e.type)t=document.createElement("input"),t.type="text",t.className="form-control smartforms-text-input",t.placeholder=e.placeholder||"Type your answer here...",t.addEventListener("input",(t=>{c(e,t.target.value)}));else if("checkbox"===e.type)t=document.createElement("div"),t.className="sf-checkbox-group sf-checkbox-group-"+(e.layout||"horizontal"),t.setAttribute("data-layout",e.layout||"horizontal"),e.options&&Array.isArray(e.options)&&e.options.forEach((r=>{const s=document.createElement("div"),a="horizontal"===e.layout?" form-check-inline":"";s.className="sf-checkbox-option form-check"+a;const o=document.createElement("input");o.type="checkbox",o.className="form-check-input",o.value=r.value,o.id=e.id?`${e.id}-${r.value}`:r.value;const n=document.createElement("label");n.className="form-check-label",n.htmlFor=o.id,n.textContent=r.label,s.appendChild(o),s.appendChild(n),t.appendChild(s),o.addEventListener("change",(()=>{const r=Array.from(t.querySelectorAll("input[type='checkbox']")).filter((e=>e.checked)).map((e=>e.value));c(e,r)}))}));else if("select"===e.type)t=document.createElement("select"),t.className="form-control smartforms-select",e.options&&Array.isArray(e.options)&&e.options.forEach((e=>{const r=document.createElement("option");r.value=e.value,r.textContent=e.label,t.appendChild(r)})),t.addEventListener("change",(t=>{c(e,t.target.value)}));else if("slider"===e.type)t=document.createElement("input"),t.type="range",t.className="form-control smartforms-slider",t.min=e.min||0,t.max=e.max||100,t.value=e.value||Math.floor(((e.min||0)+(e.max||100))/2),t.addEventListener("input",(t=>{c(e,t.target.value)}));else if("number"===e.type)t=document.createElement("input"),t.type="number",t.className="form-control smartforms-number",t.placeholder=e.placeholder||"",t.addEventListener("input",(t=>{c(e,t.target.value)}));else{if("buttons"===e.type)return t=document.createElement("div"),t.className="sf-buttons-group d-flex flex-wrap gap-2",e.options&&Array.isArray(e.options)&&e.options.forEach((r=>{const a=document.createElement("button");a.type="button",a.className="btn btn-primary",a.setAttribute("data-value",r.value),a.textContent=r.label,a.addEventListener("click",(()=>{Array.from(t.children).forEach((e=>e.classList.remove("active"))),a.classList.contains("active")?(a.classList.remove("active"),s=null):(a.classList.add("active"),s=r.value),c(e,s)})),t.appendChild(a)})),c(e,s),t;t=document.createElement("textarea"),t.className="form-control smartforms-textarea smartforms-chat-input",t.rows=4,t.placeholder=e.placeholder||"Type your answer here...",t.addEventListener("input",(t=>{c(e,t.target.value)}))}return t})(r);i(o),c(r,s)};m(),o.classList.add("disabled"),o.addEventListener("click",(c=>{if(c.preventDefault(),o.classList.contains("disabled")){const r=e.fields[t];return l.textContent=r.requiredMessage||`${r.label} is required.`,l.classList.add("smartforms-error-message"),void setTimeout((()=>{l.textContent=r.helpText||"Enter your help text",l.classList.remove("smartforms-error-message")}),3e3)}const d=e.fields[t];let u;if("buttons"===d.type)u=s;else if("checkbox"===d.type){const e=n.querySelectorAll("input[type='checkbox']");u=Array.from(e).filter((e=>e.checked)).map((e=>e.value)),u=u.join(", ")}else if("text"===d.type){const e=n.querySelector("input");if(!e)return;u=e.value}else{const e=n.firstElementChild;if(!e)return;u=e.value}((n,c=n)=>{const d=e.fields[t];if(d.required&&("string"==typeof n&&0===n.trim().length||Array.isArray(n)&&0===n.length||null===n))return l.textContent=d.requiredMessage||`${d.label} is required.`,l.classList.add("smartforms-error-message"),void setTimeout((()=>{l.textContent=d.helpText||"Enter your help text",l.classList.remove("smartforms-error-message")}),3e3);if((e=>{const t=document.createElement("div");t.classList.add("smartforms-chat-message","user");const r=document.createElement("p");r.textContent=e,t.appendChild(r),a.appendChild(t),a.scrollTop=a.scrollHeight})(c),l.textContent=d.helpText||"Enter your help text",l.classList.remove("smartforms-error-message"),r[d.id||t]=n,s=null,t<e.fields.length-1)t++,m();else{const e=new URLSearchParams;e.append("action","process_smartform"),e.append("smartform_nonce",smartformsData.nonce),e.append("form_id",smartformsData.formId||window.smartformsFormId),e.append("form_data",JSON.stringify(r)),fetch(smartformsData.ajaxUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e.toString()}).then((e=>e.json())).then((e=>{a.innerHTML="";const t=document.createElement("div");if(t.classList.add("smartforms-chat-message","bot"),e.success)t.innerHTML=`<p>${e.data.message}</p>`;else{const r=Array.isArray(e.data)?e.data.join(" "):e.data;t.innerHTML=`<p class="error">${r}</p>`}a.appendChild(t),a.scrollTop=a.scrollHeight;const r=document.createElement("textarea");r.className="form-control smartforms-chat-input",r.rows=4,r.placeholder="Type your message here...",r.disabled=!0,i(r),o.classList.add("disabled")})).catch((e=>{console.error("AJAX submission error:",e)}))}})(u)}))}))})();