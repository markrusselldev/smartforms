(()=>{"use strict";const e=window.wp.blocks,t=window.wp.i18n,r=window.wp.blockEditor,a=window.ReactJSXRuntime;(0,e.registerBlockType)("smartforms/range",{title:(0,t.__)("Range","smartforms"),icon:"admin-generic",category:"smartforms",attributes:{label:{type:"string",default:(0,t.__)("Range","smartforms")},value:{type:"string",default:""}},edit:function({attributes:e,setAttributes:n}){return(0,a.jsxs)("div",{...(0,r.useBlockProps)(),children:[(0,a.jsx)("label",{htmlFor:"range",children:e.label||(0,t.__)("Range","smartforms")}),(0,a.jsx)("input",{type:"range",id:"range",value:e.value,onChange:e=>n({value:e.target.value})})]})},save:function({attributes:e}){return(0,a.jsxs)("div",{...r.useBlockProps.save(),children:[(0,a.jsx)("label",{htmlFor:"range",children:e.label}),(0,a.jsx)("input",{type:"range",id:"range",value:e.value,readOnly:!0})]})}})})();