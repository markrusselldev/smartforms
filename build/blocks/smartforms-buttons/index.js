(()=>{"use strict";var e,t={34:()=>{const e=window.wp.blocks,t=window.wp.i18n,l=window.wp.blockEditor,r=window.wp.components,o=window.wp.element,a={placeholders:{label:"Enter your question here",helpText:"Enter your help text here"},options:[{label:"Option 1",value:"option-1"},{label:"Option 2",value:"option-2"}]},n=window.ReactJSXRuntime,s=({label:e,helpText:t,setLabel:r,setHelpText:o,children:s,labelPlaceholder:i=a.placeholders.label,helpPlaceholder:c=a.placeholders.helpText,alignment:p="left"})=>{const u="center"===p?"text-center":"right"===p?"text-end":"text-start";return(0,n.jsxs)("div",{className:"sf-field-wrapper",children:[(0,n.jsx)(l.RichText,{tagName:"label",className:"sf-field-label",value:e,onChange:r,placeholder:i}),(0,n.jsx)("div",{className:`sf-input-container ${u}`,children:s}),(0,n.jsx)(l.RichText,{tagName:"p",className:"sf-field-help",value:t,onChange:o,placeholder:c})]})},{placeholders:i,defaultOptions:c}=a,p=(0,n.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,n.jsx)("rect",{x:"2.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,n.jsx)("rect",{x:"9.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,n.jsx)("rect",{x:"16.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"})]});(0,e.registerBlockType)("smartforms/buttons",{icon:p,edit:({attributes:e,setAttributes:a,clientId:p})=>{const{label:u,helpText:h,required:d,options:m,groupId:x,multiple:f,currentAnswer:v,layout:b}=e,g=(0,l.useBlockProps)();return(0,o.useEffect)((()=>{x||a({groupId:`sf-buttons-${p}`}),m&&Array.isArray(m)&&0!==m.length||a({options:c}),b||a({layout:"horizontal"})}),[x,m,b,p,a]),(0,n.jsxs)("div",{...g,children:[(0,n.jsxs)(l.InspectorControls,{children:[(0,n.jsxs)(r.PanelBody,{title:(0,t.__)("Button Group Settings","smartforms"),children:[(0,n.jsx)(r.ToggleControl,{label:(0,t.__)("Required","smartforms"),checked:d,onChange:e=>a({required:e})}),(0,n.jsx)(r.ToggleControl,{label:(0,t.__)("Allow Multiple Selections","smartforms"),checked:f,onChange:e=>a({multiple:e,currentAnswer:e?[]:""})}),(0,n.jsx)(r.SelectControl,{label:(0,t.__)("Layout","smartforms"),value:b,options:[{label:(0,t.__)("Horizontal","smartforms"),value:"horizontal"},{label:(0,t.__)("Vertical","smartforms"),value:"vertical"}],onChange:e=>a({layout:e})})]}),(0,n.jsxs)(r.PanelBody,{title:(0,t.__)("Button Options","smartforms"),initialOpen:!0,children:[m.map(((e,l)=>(0,n.jsxs)("div",{style:{marginBottom:"8px"},children:[(0,n.jsx)(r.TextControl,{label:`${(0,t.__)("Option","smartforms")} ${l+1}`,value:e.label,onChange:e=>((e,t)=>{const l=function(e,t,l){return e.map(((e,r)=>r===t?{label:l,value:l.toLowerCase().replace(/\s+/g,"-")}:e))}(m,e,t);a({options:l})})(l,e)}),(0,n.jsx)(r.Button,{variant:"secondary",onClick:()=>(e=>{const t=function(e,t){return e.filter(((e,l)=>l!==t))}(m,e);a({options:t})})(l),size:"small",children:(0,t.__)("Remove Option","smartforms")})]},l))),(0,n.jsx)(r.Button,{variant:"primary",onClick:()=>{const e=function(e){let t=0;e.forEach((e=>{const l=e.label.match(/^Option (\d+)$/);if(l){const e=parseInt(l[1],10);e>t&&(t=e)}}));const l=`Option ${t+1}`,r=l.toLowerCase().replace(/\s+/g,"-");return[...e,{label:l,value:r}]}(m);a({options:e})},children:(0,t.__)("Add Option","smartforms")})]})]}),(0,n.jsx)(s,{label:u,helpText:h,setLabel:e=>a({label:e}),setHelpText:e=>a({helpText:e}),labelPlaceholder:i.label,helpPlaceholder:i.helpText,children:(0,n.jsx)("div",{className:`sf-buttons-group sf-buttons-group--${b}`,"data-group-id":x,"data-layout":b,children:m.map(((e,t)=>(0,n.jsx)("button",{type:"button",className:"btn btn-primary "+(f?Array.isArray(v)&&v.includes(e.value)?"active":"":v===e.value?"active":""),"data-value":e.value,onClick:()=>{if(f){let t=Array.isArray(v)?[...v]:[];t.includes(e.value)?t=t.filter((t=>t!==e.value)):t.push(e.value),a({currentAnswer:t})}else a({currentAnswer:e.value})},children:e.label},t)))})})]})}})}},l={};function r(e){var o=l[e];if(void 0!==o)return o.exports;var a=l[e]={exports:{}};return t[e](a,a.exports,r),a.exports}r.m=t,e=[],r.O=(t,l,o,a)=>{if(!l){var n=1/0;for(p=0;p<e.length;p++){for(var[l,o,a]=e[p],s=!0,i=0;i<l.length;i++)(!1&a||n>=a)&&Object.keys(r.O).every((e=>r.O[e](l[i])))?l.splice(i--,1):(s=!1,a<n&&(n=a));if(s){e.splice(p--,1);var c=o();void 0!==c&&(t=c)}}return t}a=a||0;for(var p=e.length;p>0&&e[p-1][2]>a;p--)e[p]=e[p-1];e[p]=[l,o,a]},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={521:0,173:0};r.O.j=t=>0===e[t];var t=(t,l)=>{var o,a,[n,s,i]=l,c=0;if(n.some((t=>0!==e[t]))){for(o in s)r.o(s,o)&&(r.m[o]=s[o]);if(i)var p=i(r)}for(t&&t(l);c<n.length;c++)a=n[c],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(p)},l=globalThis.webpackChunksmartforms=globalThis.webpackChunksmartforms||[];l.forEach(t.bind(null,0)),l.push=t.bind(null,l.push.bind(l))})();var o=r.O(void 0,[173],(()=>r(34)));o=r.O(o)})();