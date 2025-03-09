import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

// Define a custom icon as a React element for the Button Group.
// This icon consists of three rounded rectangles in a row.
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect
      x="2.5"
      y="8"
      width="5"
      height="8"
      rx="1"
      ry="1"
      fill="currentColor"
    />
    <rect
      x="9.5"
      y="8"
      width="5"
      height="8"
      rx="1"
      ry="1"
      fill="currentColor"
    />
    <rect
      x="16.5"
      y="8"
      width="5"
      height="8"
      rx="1"
      ry="1"
      fill="currentColor"
    />
  </svg>
);

registerBlockType('smartforms/buttons', {
  icon: customIcon,
  edit,
  // No save function is provided because this is a dynamic block.
});
