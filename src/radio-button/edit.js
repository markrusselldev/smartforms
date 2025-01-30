import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    return (
        <div {...useBlockProps()}>
            <label htmlFor="radio-button">{attributes.label || __('Radio Button', 'smartforms')}</label>
            <input
                type="radio"
                id="radio-button"
                value={attributes.value}
                onChange={(e) => setAttributes({ value: e.target.value })}
            />
        </div>
    );
}