import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/number', {
  edit,
  save: () => null,
});
