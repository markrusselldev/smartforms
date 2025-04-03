import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

// Define a custom icon as a React element for the Checkbox block.
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <polyline
      points="6,12 10,16 18,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

registerBlockType('smartforms/checkbox', {
  icon: customIcon,
  edit,
  save: () => null,
});
