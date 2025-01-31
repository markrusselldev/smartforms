import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <label htmlFor="time">{attributes.label}</label>
            <input
                type="time"
                id="time"
                value={attributes.value}
                readOnly
            />
        </div>
    );
}