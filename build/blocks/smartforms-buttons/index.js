(()=>{"use strict";var e,t={136:()=>{const e=window.wp.blocks,t=window.wp.i18n,r=window.wp.blockEditor,l=window.wp.components,o=window.wp.element,s=window.ReactJSXRuntime,a=[{label:"Option 1",value:"option-1"},{label:"Option 2",value:"option-2"}],n=(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,s.jsx)("rect",{x:"2.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,s.jsx)("rect",{x:"9.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,s.jsx)("rect",{x:"16.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"})]});(0,e.registerBlockType)("smartforms/buttons",{icon:n,edit:({attributes:e,setAttributes:n,clientId:i})=>{const{label:c,helpText:u,required:p,options:d,groupId:h,multiple:m,currentAnswer:f}=e,v=(0,r.useBlockProps)({"data-required":p?"true":"false","data-multiple":m?"true":"false","data-help-text":u});return(0,o.useEffect)((()=>{h||n({groupId:`sf-buttons-${i}`}),d&&Array.isArray(d)&&0!==d.length||n({options:a})}),[h,d,i,n]),(0,s.jsxs)("div",{...v,children:[(0,s.jsxs)(r.InspectorControls,{children:[(0,s.jsxs)(l.PanelBody,{title:(0,t.__)("Button Group Settings","smartforms"),children:[(0,s.jsx)(l.ToggleControl,{label:(0,t.__)("Required","smartforms"),checked:p,onChange:e=>n({required:e})}),(0,s.jsx)(l.ToggleControl,{label:(0,t.__)("Allow Multiple Selections","smartforms"),checked:m,onChange:e=>n({multiple:e,currentAnswer:e?[]:""})})]}),(0,s.jsxs)(l.PanelBody,{title:(0,t.__)("Button Options","smartforms"),initialOpen:!0,children:[d.map(((e,r)=>(0,s.jsxs)("div",{style:{marginBottom:"8px"},children:[(0,s.jsx)(l.TextControl,{label:`${(0,t.__)("Option","smartforms")} ${r+1}`,value:e.label,onChange:e=>((e,t)=>{const r=d.map(((r,l)=>l===e?{label:t,value:t.toLowerCase().replace(/\s+/g,"-")}:r));n({options:r})})(r,e)}),(0,s.jsx)(l.Button,{variant:"secondary",onClick:()=>(e=>{const t=d.filter(((t,r)=>r!==e));n({options:t})})(r),size:"small",children:(0,t.__)("Remove Option","smartforms")})]},r))),(0,s.jsx)(l.Button,{variant:"primary",onClick:()=>{let e=0;d.forEach((t=>{const r=t.label.match(/^Option (\d+)$/);if(r){const t=parseInt(r[1],10);t>e&&(e=t)}}));const t=`Option ${e+1}`,r=t.toLowerCase().replace(/\s+/g,"-"),l=[...d,{label:t,value:r}];n({options:l})},children:(0,t.__)("Add Option","smartforms")})]})]}),(0,s.jsx)(r.RichText,{tagName:"label",className:"sf-field-label",value:c,onChange:e=>n({label:e}),placeholder:(0,t.__)("Type your question here…","smartforms")}),(0,s.jsx)("div",{className:"sf-buttons-group","data-group-id":h,children:d.map(((e,t)=>(0,s.jsx)("button",{type:"button",className:"btn btn-primary "+(m?Array.isArray(f)&&f.includes(e.value)?"active":"":f===e.value?"active":""),"data-value":e.value,onClick:()=>{if(m){let t=Array.isArray(f)?[...f]:[];t.includes(e.value)?t=t.filter((t=>t!==e.value)):t.push(e.value),n({currentAnswer:t})}else n({currentAnswer:e.value})},children:e.label},t)))}),(0,s.jsx)(r.RichText,{tagName:"p",className:"sf-field-help",value:u,onChange:e=>n({helpText:e}),placeholder:(0,t.__)("Enter your help text","smartforms")})]})}})}},r={};function l(e){var o=r[e];if(void 0!==o)return o.exports;var s=r[e]={exports:{}};return t[e](s,s.exports,l),s.exports}l.m=t,e=[],l.O=(t,r,o,s)=>{if(!r){var a=1/0;for(u=0;u<e.length;u++){for(var[r,o,s]=e[u],n=!0,i=0;i<r.length;i++)(!1&s||a>=s)&&Object.keys(l.O).every((e=>l.O[e](r[i])))?r.splice(i--,1):(n=!1,s<a&&(a=s));if(n){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}s=s||0;for(var u=e.length;u>0&&e[u-1][2]>s;u--)e[u]=e[u-1];e[u]=[r,o,s]},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={521:0,173:0};l.O.j=t=>0===e[t];var t=(t,r)=>{var o,s,[a,n,i]=r,c=0;if(a.some((t=>0!==e[t]))){for(o in n)l.o(n,o)&&(l.m[o]=n[o]);if(i)var u=i(l)}for(t&&t(r);c<a.length;c++)s=a[c],l.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return l.O(u)},r=globalThis.webpackChunksmartforms=globalThis.webpackChunksmartforms||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=l.O(void 0,[173],(()=>l(136)));o=l.O(o)})();