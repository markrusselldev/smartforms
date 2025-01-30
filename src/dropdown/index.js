import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/dropdown', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Dropdown'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Dropdown'}</button>;
    },
});