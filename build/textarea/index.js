(()=>{"use strict";const e=window.wp.blocks,t=window.wp.i18n,a=window.wp.blockEditor,r=window.ReactJSXRuntime;(0,e.registerBlockType)("smartforms/textarea",{title:(0,t.__)("Textarea","smartforms"),icon:"admin-generic",category:"smartforms",attributes:{label:{type:"string",default:(0,t.__)("Textarea","smartforms")},value:{type:"string",default:""}},edit:function({attributes:e,setAttributes:s}){return(0,r.jsxs)("div",{...(0,a.useBlockProps)(),children:[(0,r.jsx)("label",{htmlFor:"textarea",children:e.label||(0,t.__)("Textarea","smartforms")}),(0,r.jsx)("input",{type:"text",id:"textarea",value:e.value,onChange:e=>s({value:e.target.value})})]})},save:function({attributes:e}){return(0,r.jsxs)("div",{...a.useBlockProps.save(),children:[(0,r.jsx)("label",{htmlFor:"textarea",children:e.label}),(0,r.jsx)("input",{type:"text",id:"textarea",value:e.value,readOnly:!0})]})}})})();