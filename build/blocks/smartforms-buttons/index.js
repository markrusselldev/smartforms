(()=>{"use strict";var e,t={16:()=>{const e=window.wp.blocks,t=window.wp.i18n,r=window.wp.blockEditor,l=window.wp.components,o=window.wp.element,a=window.ReactJSXRuntime,{placeholders:s,defaultOptions:n}={placeholders:{label:"Enter your question here",helpText:"Enter your help text here"},options:[{label:"Option 1",value:"option-1"},{label:"Option 2",value:"option-2"}]},i=(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,a.jsx)("rect",{x:"2.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,a.jsx)("rect",{x:"9.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,a.jsx)("rect",{x:"16.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"})]});(0,e.registerBlockType)("smartforms/buttons",{icon:i,edit:({attributes:e,setAttributes:i,clientId:u})=>{const{label:c,helpText:p,required:d,options:h,groupId:m,multiple:v,currentAnswer:f,layout:x}=e,b=(0,r.useBlockProps)({"data-required":d?"true":"false","data-multiple":v?"true":"false","data-help-text":p});return(0,o.useEffect)((()=>{m||i({groupId:`sf-buttons-${u}`}),h&&Array.isArray(h)&&0!==h.length||i({options:n}),x||i({layout:"horizontal"})}),[m,h,x,u,i]),(0,a.jsxs)("div",{...b,children:[(0,a.jsxs)(r.InspectorControls,{children:[(0,a.jsxs)(l.PanelBody,{title:(0,t.__)("Button Group Settings","smartforms"),children:[(0,a.jsx)(l.ToggleControl,{label:(0,t.__)("Required","smartforms"),checked:d,onChange:e=>i({required:e})}),(0,a.jsx)(l.ToggleControl,{label:(0,t.__)("Allow Multiple Selections","smartforms"),checked:v,onChange:e=>i({multiple:e,currentAnswer:e?[]:""})}),(0,a.jsx)(l.SelectControl,{label:(0,t.__)("Layout","smartforms"),value:x,options:[{label:(0,t.__)("Horizontal","smartforms"),value:"horizontal"},{label:(0,t.__)("Vertical","smartforms"),value:"vertical"}],onChange:e=>i({layout:e})})]}),(0,a.jsxs)(l.PanelBody,{title:(0,t.__)("Button Options","smartforms"),initialOpen:!0,children:[h.map(((e,r)=>(0,a.jsxs)("div",{style:{marginBottom:"8px"},children:[(0,a.jsx)(l.TextControl,{label:`${(0,t.__)("Option","smartforms")} ${r+1}`,value:e.label,onChange:e=>((e,t)=>{const r=h.map(((r,l)=>l===e?{label:t,value:t.toLowerCase().replace(/\s+/g,"-")}:r));i({options:r})})(r,e)}),(0,a.jsx)(l.Button,{variant:"secondary",onClick:()=>(e=>{const t=h.filter(((t,r)=>r!==e));i({options:t})})(r),size:"small",children:(0,t.__)("Remove Option","smartforms")})]},r))),(0,a.jsx)(l.Button,{variant:"primary",onClick:()=>{let e=0;h.forEach((t=>{const r=t.label.match(/^Option (\d+)$/);if(r){const t=parseInt(r[1],10);t>e&&(e=t)}}));const t=`Option ${e+1}`,r=t.toLowerCase().replace(/\s+/g,"-"),l=[...h,{label:t,value:r}];i({options:l})},children:(0,t.__)("Add Option","smartforms")})]})]}),(0,a.jsx)(r.RichText,{tagName:"label",className:"sf-field-label",value:c,onChange:e=>i({label:e}),placeholder:s.label}),(0,a.jsx)("div",{className:`sf-buttons-group sf-buttons-group-${x}`,"data-group-id":m,"data-layout":x,children:h.map(((e,t)=>(0,a.jsx)("button",{type:"button",className:"btn btn-primary "+(v?Array.isArray(f)&&f.includes(e.value)?"active":"":f===e.value?"active":""),"data-value":e.value,onClick:()=>{if(v){let t=Array.isArray(f)?[...f]:[];t.includes(e.value)?t=t.filter((t=>t!==e.value)):t.push(e.value),i({currentAnswer:t})}else i({currentAnswer:e.value})},children:e.label},t)))}),(0,a.jsx)(r.RichText,{tagName:"p",className:"sf-field-help",value:p,onChange:e=>i({helpText:e}),placeholder:s.helpText})]})}})}},r={};function l(e){var o=r[e];if(void 0!==o)return o.exports;var a=r[e]={exports:{}};return t[e](a,a.exports,l),a.exports}l.m=t,e=[],l.O=(t,r,o,a)=>{if(!r){var s=1/0;for(c=0;c<e.length;c++){for(var[r,o,a]=e[c],n=!0,i=0;i<r.length;i++)(!1&a||s>=a)&&Object.keys(l.O).every((e=>l.O[e](r[i])))?r.splice(i--,1):(n=!1,a<s&&(s=a));if(n){e.splice(c--,1);var u=o();void 0!==u&&(t=u)}}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[r,o,a]},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={521:0,173:0};l.O.j=t=>0===e[t];var t=(t,r)=>{var o,a,[s,n,i]=r,u=0;if(s.some((t=>0!==e[t]))){for(o in n)l.o(n,o)&&(l.m[o]=n[o]);if(i)var c=i(l)}for(t&&t(r);u<s.length;u++)a=s[u],l.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return l.O(c)},r=globalThis.webpackChunksmartforms=globalThis.webpackChunksmartforms||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=l.O(void 0,[173],(()=>l(16)));o=l.O(o)})();