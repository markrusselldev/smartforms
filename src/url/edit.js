import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    return (
        <div {...useBlockProps()}>
            <label htmlFor="url">{attributes.label || __('URL', 'smartforms')}</label>
            <input
                type="url"
                id="url"
                value={attributes.value}
                onChange={(e) => setAttributes({ value: e.target.value })}
            />
        </div>
    );
}