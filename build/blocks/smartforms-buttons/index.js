(()=>{var e,t={366:(e,t,r)=>{"use strict";const n=window.wp.blocks,l=window.wp.i18n,o=window.wp.blockEditor,a=window.wp.components,s=window.wp.element,i={placeholders:{label:"Enter your question here",helpText:"Enter your help text here"},options:[{label:"Option 1",value:"option-1"},{label:"Option 2",value:"option-2"}]},c=window.ReactJSXRuntime,u=({label:e,helpText:t,setLabel:r,setHelpText:n,children:l,labelPlaceholder:a=i.placeholders.label,helpPlaceholder:s=i.placeholders.helpText,alignment:u="left",labelClass:p="sf-field-label",plainText:d=!1,forceUpdate:h})=>{const f="center"===u?"center":"right"===u?"flex-end":"flex-start";return(0,c.jsxs)("div",{className:"sf-field-wrapper",children:[(0,c.jsx)(o.RichText,{tagName:"label",className:p,value:e,onChange:r,placeholder:a,formattingControls:d?[]:void 0}),(0,c.jsx)("div",{className:"sf-input-container",style:{display:"flex",justifyContent:f},children:l},h),(0,c.jsx)(o.RichText,{tagName:"p",className:"sf-field-help",value:t,onChange:n,placeholder:s})]})};var p=r(556),d=r.n(p);const h=({index:e,value:t,onChange:r,onRemove:n})=>(0,c.jsxs)("div",{className:"option-row",children:[(0,c.jsx)(a.TextControl,{label:`${(0,l.__)("Option","smartforms")} ${e+1}`,value:t,onChange:r}),(0,c.jsx)(a.Button,{variant:"secondary",onClick:n,size:"small",title:(0,l.__)("Remove Option","smartforms"),children:(0,c.jsx)("span",{className:"dashicons dashicons-trash","aria-hidden":"true"})})]});h.propTypes={index:d().number.isRequired,value:d().string.isRequired,onChange:d().func.isRequired,onRemove:d().func.isRequired};const f=h,m=({required:e,alignment:t,onChangeRequired:r,onChangeAlignment:n})=>(0,c.jsxs)(a.PanelBody,{title:(0,l.__)("Input Settings","smartforms"),initialOpen:!0,children:[(0,c.jsx)(a.ToggleControl,{label:(0,l.__)("Required","smartforms"),checked:e,onChange:r}),(0,c.jsx)(a.SelectControl,{label:(0,l.__)("Alignment","smartforms"),value:t,options:[{label:(0,l.__)("Left","smartforms"),value:"left"},{label:(0,l.__)("Center","smartforms"),value:"center"},{label:(0,l.__)("Right","smartforms"),value:"right"}],onChange:n})]});m.propTypes={required:d().bool,alignment:d().string,onChangeRequired:d().func.isRequired,onChangeAlignment:d().func.isRequired};const g=m;function v(e,t){let r="sf-buttons-group";return r+="vertical"===e?"--vertical":"--horizontal",`${r} ${function(e){if(!e)return"sf-input--left";switch(e.toLowerCase()){case"center":return"sf-input--center";case"right":return"sf-input--right";default:return"sf-input--left"}}(t)}`}function x({options:e=[],current:t,onChange:r,multiple:n=!1,layout:l="horizontal",fieldAlignment:o="left",required:a=!1}){return(0,c.jsx)("div",{className:v(l,o),"data-layout":l,children:e.map(((e,l)=>{return(0,c.jsx)("button",{type:"button",className:"btn btn-primary "+(o=e.value,(n?Array.isArray(t)&&t.includes(o):o===t)?"active":""),"data-value":e.value,onClick:()=>(e=>{if(n){let n=Array.isArray(t)?[...t]:[];n.includes(e)?n=n.filter((t=>t!==e)):n.push(e),r(n)}else r(e===t?"":e)})(e.value),children:e.label},l);var o}))})}window.React;const{placeholders:b,defaultOptions:y}=i,C=(0,c.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:[(0,c.jsx)("rect",{x:"2.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,c.jsx)("rect",{x:"9.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"}),(0,c.jsx)("rect",{x:"16.5",y:"8",width:"5",height:"8",rx:"1",ry:"1",fill:"currentColor"})]});(0,n.registerBlockType)("smartforms/buttons",{icon:C,edit:({attributes:e,setAttributes:t,clientId:r})=>{const{label:n,helpText:i,required:p,options:d,groupId:h,multiple:m,layout:v,fieldAlignment:C,currentAnswer:w}=e,_=(0,o.useBlockProps)();return(0,s.useEffect)((()=>{h||t({groupId:`sf-buttons-${r}`}),d&&Array.isArray(d)&&0!==d.length||t({options:y}),v||t({layout:"horizontal"}),C||t({fieldAlignment:"left"})}),[h,d,v,C,r,t]),(0,c.jsxs)("div",{..._,children:[(0,c.jsxs)(o.InspectorControls,{children:[(0,c.jsxs)(a.PanelBody,{title:(0,l.__)("Button Settings","smartforms"),children:[(0,c.jsx)(a.ToggleControl,{label:(0,l.__)("Allow Multiple Selections","smartforms"),checked:m,onChange:e=>t({multiple:e,currentAnswer:e?[]:""})}),(0,c.jsx)(a.SelectControl,{label:(0,l.__)("Layout","smartforms"),value:v,options:[{label:(0,l.__)("Horizontal","smartforms"),value:"horizontal"},{label:(0,l.__)("Vertical","smartforms"),value:"vertical"}],onChange:e=>t({layout:e})})]}),(0,c.jsx)(g,{required:p,alignment:C,onChangeRequired:e=>t({required:e}),onChangeAlignment:e=>t({fieldAlignment:e})}),(0,c.jsxs)(a.PanelBody,{title:(0,l.__)("Button Options","smartforms"),initialOpen:!0,children:[d.map(((e,r)=>(0,c.jsx)(s.Fragment,{children:(0,c.jsx)(f,{index:r,value:e.label,onChange:e=>((e,r)=>{const n=d.map(((t,n)=>n===e?{label:r,value:r.toLowerCase().replace(/\s+/g,"-")}:t));t({options:n})})(r,e),onRemove:()=>(e=>{const r=d.filter(((t,r)=>r!==e));t({options:r})})(r)})},r))),(0,c.jsx)(a.Button,{variant:"secondary",onClick:()=>{let e=0;d.forEach((t=>{const r=t.label.match(/^Option (\d+)$/);if(r){const t=parseInt(r[1],10);t>e&&(e=t)}}));const r=`Option ${e+1}`,n=r.toLowerCase().replace(/\s+/g,"-");t({options:[...d,{label:r,value:n}]})},className:"sf-add-option-btn",children:(0,l.__)("Add Option","smartforms")})]})]}),(0,c.jsx)(u,{label:n,helpText:i,setLabel:e=>t({label:e}),setHelpText:e=>t({helpText:e}),labelPlaceholder:b.label,helpPlaceholder:b.helpText,alignment:C,children:(0,c.jsx)(x,{options:d,current:w,onChange:e=>t({currentAnswer:e}),multiple:m,layout:v,fieldAlignment:C,required:p})})]})},save:()=>null})},556:(e,t,r)=>{e.exports=r(694)()},694:(e,t,r)=>{"use strict";var n=r(925);function l(){}function o(){}o.resetWarningCache=l,e.exports=function(){function e(e,t,r,l,o,a){if(a!==n){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function t(){return e}e.isRequired=e;var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:l};return r.PropTypes=r,r}},925:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}},r={};function n(e){var l=r[e];if(void 0!==l)return l.exports;var o=r[e]={exports:{}};return t[e](o,o.exports,n),o.exports}n.m=t,e=[],n.O=(t,r,l,o)=>{if(!r){var a=1/0;for(u=0;u<e.length;u++){for(var[r,l,o]=e[u],s=!0,i=0;i<r.length;i++)(!1&o||a>=o)&&Object.keys(n.O).every((e=>n.O[e](r[i])))?r.splice(i--,1):(s=!1,o<a&&(a=o));if(s){e.splice(u--,1);var c=l();void 0!==c&&(t=c)}}return t}o=o||0;for(var u=e.length;u>0&&e[u-1][2]>o;u--)e[u]=e[u-1];e[u]=[r,l,o]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={521:0,173:0};n.O.j=t=>0===e[t];var t=(t,r)=>{var l,o,[a,s,i]=r,c=0;if(a.some((t=>0!==e[t]))){for(l in s)n.o(s,l)&&(n.m[l]=s[l]);if(i)var u=i(n)}for(t&&t(r);c<a.length;c++)o=a[c],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(u)},r=globalThis.webpackChunksmartforms=globalThis.webpackChunksmartforms||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var l=n.O(void 0,[173],(()=>n(366)));l=n.O(l)})();