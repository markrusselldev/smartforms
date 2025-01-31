import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/date-picker', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Date Picker'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Date Picker'}</button>;
    },
});