import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import Edit from './edit';
import './style.scss';

registerBlockType('smartforms/form', {
    title: 'AI Form',
    category: 'smartforms',
    icon: 'forms',
    supports: {
        anchor: true,
    },
    attributes: {
        formTitle: { type: 'string', default: 'Untitled Form' },
        submitButtonText: { type: 'string', default: 'Submit' },
    },
    edit: Edit,
    save: () => (
        <div className="smartforms-form">
            <InnerBlocks.Content />
        </div>
    ),
});
