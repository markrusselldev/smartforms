import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

registerBlockType('smartforms/checkbox', {
    title: __('Checkbox', 'smartforms'),
    icon: 'admin-generic',
    category: 'smartforms',
    attributes: {
        label: {
            type: 'string',
            default: __('Checkbox', 'smartforms'),
        },
        value: {
            type: 'string',
            default: '',
        },
    },
    edit,
    save,
});