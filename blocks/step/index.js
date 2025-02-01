/**
 * Registers the Step block for SmartForms.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

// Ensure edit & save components exist
import StepEdit from './edit';
import StepSave from './save';

import './editor.scss';
import './style.scss';

registerBlockType( 'smartforms/step', {
    title: __( 'SmartForms Step', 'smartforms' ),
    icon: 'grid-view',
    category: 'smartforms',
    attributes: {
        stepTitle: {
            type: 'string',
            default: __( 'SmartForms Step', 'smartforms' ),
        },
    },
    edit: StepEdit,
    save: StepSave,
} );
