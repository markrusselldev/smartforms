import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

// Define a custom React icon for the Radio Buttons block.
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

registerBlockType('smartforms/radio', {
  icon: customIcon,
  edit,
  save: () => null,
});
