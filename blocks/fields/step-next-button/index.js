import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/step-next-button', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Step Next Button'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Step Next Button'}</button>;
    },
});