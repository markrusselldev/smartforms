import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';

registerBlockType('smartforms/number', {
    title: __('Number', 'smartforms'),
    icon: 'admin-generic',
    category: 'smartforms',
    attributes: {
        label: {
            type: 'string',
            default: __('Number', 'smartforms'),
        },
        value: {
            type: 'string',
            default: '',
        },
    },
    edit,
    save,
});