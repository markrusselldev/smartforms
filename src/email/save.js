import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="email">{attributes.label}</label>
            <input
                type="email"
                id="email"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}