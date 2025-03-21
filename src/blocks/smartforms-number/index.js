import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

// Define a custom icon as a React element for the Number block.
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="15"
      fill="currentColor"
      style={{ letterSpacing: '-1px' }}
    >
      123
    </text>
  </svg>
);

registerBlockType('smartforms/number', {
  icon: customIcon,
  edit,
  save: () => null,
});
