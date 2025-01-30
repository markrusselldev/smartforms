import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="number">{attributes.label}</label>
            <input
                type="number"
                id="number"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}