import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/select', {
  edit,
  save: () => null,
});
