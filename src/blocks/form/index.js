/**
 * Registers the Form block for SmartForms.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

// Ensure edit & save components exist
import FormEdit from './edit';
import FormSave from './save';

import './editor.scss';
import './style.scss';

registerBlockType( 'smartforms/form', {
    title: __( 'SmartForms Form', 'smartforms' ),
    icon: 'feedback',
    category: 'smartforms',
    attributes: {
        formTitle: {
            type: 'string',
            default: __( 'New Form', 'smartforms' ),
        },
        description: {
            type: 'string',
            default: '',
        },
    },
    edit: FormEdit,
    save: FormSave,
} );
