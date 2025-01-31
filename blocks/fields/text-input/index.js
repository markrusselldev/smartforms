/**
 * Index file for the Text Input block.
 *
 * Registers the Text Input block and defines its attributes, edit, and save behavior.
 *
 * @package SmartForms
 */

/* global wp */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

// Import the block's edit and save components.
import TextInputEdit from './edit';
import TextInputSave from './save';

// Import block styles.
import './editor.scss';
import './style.scss';

registerBlockType( 'smartforms/text-input', {
	/**
	 * Block title.
	 */
	title: __( 'Text Input Field', 'smartforms' ),
	/**
	 * Block icon.
	 */
	icon: 'editor-textcolor',
	/**
	 * Block category.
	 */
	category: 'widgets',
	/**
	 * Block attributes.
	 */
	attributes: {
		placeholder: {
			type: 'string',
			default: __( 'Enter text...', 'smartforms' ),
		},
		value: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: __( 'Text Input Field', 'smartforms' ),
		},
		required: {
			type: 'boolean',
			default: false,
		},
		customClass: {
			type: 'string',
			default: '',
		},
		// Preserve any additional attributes you originally defined.
	},
	/**
	 * Edit function.
	 *
	 * Passes all properties to the TextInputEdit component.
	 *
	 * @param {Object} props Block properties.
	 * @return {WPElement} Element for the editor.
	 */
	edit: TextInputEdit,
	/**
	 * Save function.
	 *
	 * For dynamic blocks, the front-end output is rendered in PHP.
	 *
	 * @param {Object} props Block properties.
	 * @return {WPElement} Element saved to the post content.
	 */
	save: TextInputSave,
} );
