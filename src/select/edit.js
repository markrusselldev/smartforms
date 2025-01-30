import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    return (
        <div {...useBlockProps()}>
            <label htmlFor="select">{attributes.label || __('Select', 'smartforms')}</label>
            <input
                type="text"
                id="select"
                value={attributes.value}
                onChange={(e) => setAttributes({ value: e.target.value })}
            />
        </div>
    );
}