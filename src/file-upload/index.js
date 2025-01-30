import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/file-upload', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'File Upload'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'File Upload'}</button>;
    },
});