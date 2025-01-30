import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/quick-text-buttons', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Quick Text Buttons'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Quick Text Buttons'}</button>;
    },
});