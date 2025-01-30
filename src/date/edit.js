import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    return (
        <div {...useBlockProps()}>
            <label htmlFor="date">{attributes.label || __('Date', 'smartforms')}</label>
            <input
                type="date"
                id="date"
                value={attributes.value}
                onChange={(e) => setAttributes({ value: e.target.value })}
            />
        </div>
    );
}