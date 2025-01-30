import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

registerBlockType('smartforms/radio-button', {
    title: __('Radio Button', 'smartforms'),
    icon: 'admin-generic',
    category: 'smartforms',
    attributes: {
        label: {
            type: 'string',
            default: __('Radio Button', 'smartforms'),
        },
        value: {
            type: 'string',
            default: '',
        },
    },
    edit,
    save,
});