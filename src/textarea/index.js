import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

registerBlockType('smartforms/textarea', {
    title: __('Textarea', 'smartforms'),
    icon: 'admin-generic',
    category: 'smartforms',
    attributes: {
        label: {
            type: 'string',
            default: __('Textarea', 'smartforms'),
        },
        value: {
            type: 'string',
            default: '',
        },
    },
    edit,
    save,
});