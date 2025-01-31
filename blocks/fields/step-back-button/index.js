import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/step-back-button', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Step Back Button'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Step Back Button'}</button>;
    },
});