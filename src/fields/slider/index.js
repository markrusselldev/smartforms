import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('smartforms/slider', {
    edit: (props) => {
        return <button {...useBlockProps()}>{props.attributes.label || 'Slider'}</button>;
    },
    save: (props) => {
        return <button {...useBlockProps.save()}>{props.attributes.label || 'Slider'}</button>;
    },
});