import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="range">{attributes.label}</label>
            <input
                type="range"
                id="range"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}