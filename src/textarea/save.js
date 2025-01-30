import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="textarea">{attributes.label}</label>
            <input
                type="text"
                id="textarea"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}