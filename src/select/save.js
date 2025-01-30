import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="select">{attributes.label}</label>
            <input
                type="text"
                id="select"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}