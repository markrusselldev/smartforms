import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

registerBlockType( 'smartforms/buttons', {
	edit,
	// No save function is provided since this is a dynamic block.
} );
