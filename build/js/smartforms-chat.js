(()=>{"use strict";function e(e,t){e.firstElementChild&&e.firstElementChild.remove(),e.insertBefore(t,e.firstElementChild)}const t=function(){const e=document.getElementById("smartforms-config");if(e)try{return JSON.parse(e.textContent)}catch(e){return console.error("Error parsing smartforms configuration:",e),null}return null}()||{formData:null,ajaxUrl:"",nonce:"",formId:null};document.addEventListener("DOMContentLoaded",(()=>{const{formData:a,ajaxUrl:r,nonce:n,formId:s}=t;if(!a||!a.fields||0===a.fields.length)return void console.error("No form data available for SmartForms chat flow.");let o=0;const l={};let c=null;const i=document.getElementById("smartforms-chat-dialog"),d=document.getElementById("smartforms-chat-submit-button"),m=document.getElementById("smartforms-chat-input-box"),u=document.getElementById("smartforms-chat-help-container");function p(e,t){const a=document.createElement("div");a.classList.add("smartforms-chat-message",t);const r=document.createElement("p");r.textContent=e,a.appendChild(r),i.appendChild(a),i.scrollTop=i.scrollHeight}function f(e,t){if(!e.required)return d.classList.remove("disabled"),void("buttons"===e.type&&(c=t));"buttons"===e.type&&(c=t),null===t||"string"==typeof t&&""===t.trim()||Array.isArray(t)&&0===t.length?d.classList.add("disabled"):d.classList.remove("disabled")}function h(){const t=a.fields[o];c=null,p(t.label,"bot");const r=function(e,t){const a=document.createElement("div");a.className="sf-field-wrapper";const r=document.createElement("div");let n;switch(r.className="sf-input-container",e.type){case"text":{n=document.createElement("div"),n.className="sf-text-container";const a=document.createElement("input");a.type="text",a.className="form-control sf-text-input",a.placeholder=e.placeholder||"Type your answer here...",a.addEventListener("input",(a=>{t(e,a.target.value)})),n.appendChild(a);break}case"number":{const a="center"===e.fieldAlignment?"justify-content-center":"right"===e.fieldAlignment?"justify-content-end":"justify-content-start";r.classList.add("d-flex",a),n=document.createElement("div");const s="small"===e.fieldSize?"form-control-sm":"large"===e.fieldSize?"form-control-lg":"",o=document.createElement("input");o.type="number",o.className=`form-control sf-number-input ${s}`,void 0!==e.min&&(o.min=e.min),void 0!==e.max&&(o.max=e.max),void 0!==e.step&&(o.step=e.step),o.addEventListener("input",(a=>{t(e,a.target.value)})),n.appendChild(o);break}case"checkbox":{const a=e.layout||"horizontal";n=document.createElement("div"),n.className="sf-checkbox-group sf-checkbox-group-"+a,n.setAttribute("data-layout",a),e.options&&Array.isArray(e.options)&&e.options.forEach(((r,s)=>{const o=document.createElement("div"),l="horizontal"===a?" form-check-inline":"";o.className="sf-checkbox-option form-check"+l;const c=document.createElement("input");c.type="checkbox",c.className="form-check-input",c.value=r.value,c.id=`cb-${s}-${(r.value||"").replace(/\s+/g,"-")}`;const i=document.createElement("label");i.className="form-check-label",i.htmlFor=c.id,i.textContent=r.label,c.addEventListener("change",(()=>{const a=Array.from(n.querySelectorAll("input[type='checkbox']")).filter((e=>e.checked)).map((e=>e.value));t(e,a)})),o.appendChild(c),o.appendChild(i),n.appendChild(o)}));break}case"buttons":n=document.createElement("div"),"vertical"===e.layout?(n.className="sf-buttons-group sf-buttons-group--vertical",n.setAttribute("data-layout","vertical")):(n.className="sf-buttons-group sf-buttons-group--horizontal d-flex flex-wrap gap-2",n.setAttribute("data-layout","horizontal")),e.options&&Array.isArray(e.options)&&e.options.forEach((a=>{const r=document.createElement("button");r.type="button",r.className="btn btn-primary",r.setAttribute("data-value",a.value),r.textContent=a.label,r.addEventListener("click",(()=>{if(e.multiple){r.classList.toggle("active");const a=n.querySelectorAll("button.active"),s=Array.from(a).map((e=>e.getAttribute("data-value")));t(e,s)}else Array.from(n.children).forEach((e=>e.classList.remove("active"))),r.classList.contains("active")?(r.classList.remove("active"),t(e,null)):(r.classList.add("active"),t(e,a.value))})),n.appendChild(r)}));break;case"slider":{n=document.createElement("div"),n.className="sf-slider-container";const a=document.createElement("input");a.type="range",a.className="sf-slider-input",void 0!==e.min&&(a.min=e.min),void 0!==e.max&&(a.max=e.max),void 0!==e.step&&(a.step=e.step),a.addEventListener("input",(a=>{t(e,a.target.value)})),n.appendChild(a);break}case"select":{n=document.createElement("div"),n.className="sf-select-container";const a=document.createElement("select");a.className="sf-select-input form-control",e.options&&Array.isArray(e.options)&&e.options.forEach((e=>{const t=document.createElement("option");t.value=e.value||e,t.textContent=e.label||e,a.appendChild(t)})),a.addEventListener("change",(a=>{t(e,a.target.value)})),n.appendChild(a);break}case"radio":n=document.createElement("div"),n.className="sf-radio-group",e.options&&Array.isArray(e.options)&&e.options.forEach(((a,r)=>{const s=document.createElement("div");s.className="sf-radio-option form-check form-check-inline";const o=document.createElement("input");o.type="radio",o.className="form-check-input",o.value=a.value||a,o.id=`radio-${r}-${(a.value||"").replace(/\s+/g,"-")}`,o.name=e.groupName||"sf-radio-group";const l=document.createElement("label");l.className="form-check-label",l.htmlFor=o.id,l.textContent=a.label||a,o.addEventListener("change",(()=>{t(e,o.value)})),s.appendChild(o),s.appendChild(l),n.appendChild(s)}));break;case"textarea":{n=document.createElement("div"),n.className="sf-textarea-container";const a=document.createElement("textarea");a.className="form-control sf-textarea",a.rows=4,a.placeholder=e.placeholder||"Type your answer here...",a.addEventListener("input",(a=>{t(e,a.target.value)})),n.appendChild(a);break}default:{n=document.createElement("div"),n.className="sf-default-container";const a=document.createElement("textarea");a.className="form-control sf-default-textarea",a.rows=4,a.placeholder=e.placeholder||"Type your answer here...",a.addEventListener("input",(a=>{t(e,a.target.value)})),n.appendChild(a);break}}return r.appendChild(n),a.appendChild(r),a}(t,f);e(m,r),f(t,c)}h(),f(a.fields[o],c),d.addEventListener("click",(t=>{t.preventDefault();const f=a.fields[o];if(f.required&&d.classList.contains("disabled"))return u.textContent=f.requiredMessage||`${f.label} is required.`,u.classList.add("smartforms-error-message"),void setTimeout((()=>{u.textContent=f.helpText||"Enter your help text",u.classList.remove("smartforms-error-message")}),3e3);let v;if("buttons"===f.type)v=c;else if("checkbox"===f.type){const e=m.querySelectorAll("input[type='checkbox']");v=Array.from(e).filter((e=>e.checked)).map((e=>e.value)).join(", ")}else if("text"===f.type){const e=m.querySelector("input");if(!e)return;v=e.value}else{const e=m.firstElementChild;if(!e)return;v=e.value}!function(t,f=t){const v=a.fields[o];if(v.required&&("string"==typeof t&&""===t.trim()||Array.isArray(t)&&0===t.length||null===t))return u.textContent=v.requiredMessage||`${v.label} is required.`,u.classList.add("smartforms-error-message"),void setTimeout((()=>{u.textContent=v.helpText||"Enter your help text",u.classList.remove("smartforms-error-message")}),3e3);if(p(f,"user"),u.textContent=v.helpText||"Enter your help text",u.classList.remove("smartforms-error-message"),l[v.id||o]=t,c=null,o<a.fields.length-1)o++,h();else{const t=new URLSearchParams;t.append("action","process_smartform"),t.append("smartform_nonce",n),t.append("form_id",s),t.append("form_data",JSON.stringify(l)),fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t.toString()}).then((e=>e.json())).then((t=>{i.innerHTML="";const a=document.createElement("div");if(a.classList.add("smartforms-chat-message","bot"),t.success)a.innerHTML=`<p>${t.data.message}</p>`;else{const e=Array.isArray(t.data)?t.data.join(" "):t.data;a.innerHTML=`<p class="error">${e}</p>`}i.appendChild(a),i.scrollTop=i.scrollHeight;const r=document.createElement("textarea");r.className="form-control smartforms-chat-input",r.rows=4,r.placeholder="Type your message here...",r.disabled=!0,e(m,r),d.classList.add("disabled")})).catch((e=>{console.error("AJAX submission error:",e)}))}}(v)}))}))})();