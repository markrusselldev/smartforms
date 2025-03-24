import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

/**
 * A custom icon for the slider block. (Optional; uses a horizontal line and circle.)
 */
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
    <line
      x1="10"
      y1="15"
      x2="90"
      y2="15"
      stroke="currentColor"
      strokeWidth="10"
    />
    <circle cx="50" cy="15" r="14" fill="currentColor" />
  </svg>
);

registerBlockType('smartforms/slider', {
  icon: customIcon,
  edit,
  save: () => null, // dynamic or server-side (no static save)
});
