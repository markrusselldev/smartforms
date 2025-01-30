import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="date">{attributes.label}</label>
            <input
                type="date"
                id="date"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}