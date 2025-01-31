import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="url">{attributes.label}</label>
            <input
                type="url"
                id="url"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}