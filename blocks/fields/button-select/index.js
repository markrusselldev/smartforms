import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/button-select', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Button Select'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Button Select'}</button>;
    },
});