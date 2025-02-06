import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/checkbox', {
    edit,
    save,
  });

