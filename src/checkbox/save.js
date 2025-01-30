import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="checkbox">{attributes.label}</label>
            <input
                type="checkbox"
                id="checkbox"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}