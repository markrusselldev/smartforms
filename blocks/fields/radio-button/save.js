import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="radio-button">{attributes.label}</label>
            <input
                type="radio"
                id="radio-button"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}