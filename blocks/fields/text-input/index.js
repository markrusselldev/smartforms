/**
 * Internal dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

/**
 * Register the block type.
 */
registerBlockType('smartforms/text-input', {
	title: __('Text Input', 'smartforms'),
	icon: 'edit', // Dashicon for the block's icon
	category: 'smartforms', // Ensure this matches your block's category
	attributes: {
		label: {
			type: 'string',
			default: __('Text Input Field', 'smartforms'),
		},
		placeholder: {
			type: 'string',
			default: __('Enter text here...', 'smartforms'),
		},
		required: {
			type: 'boolean',
			default: false,
		},
	},
	edit,
	save,
});
