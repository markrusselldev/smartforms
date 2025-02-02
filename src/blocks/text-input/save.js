import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { label, placeholder = "Enter text here...", required } = attributes;

    return (
        <div {...useBlockProps.save()}>
            <label>{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}
