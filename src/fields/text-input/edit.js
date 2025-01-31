import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { label, placeholder, required, value, helpText, cssClass } = attributes;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Field Settings', 'smartforms')}>
                    <TextControl
                        label={__('Question (Label)', 'smartforms')}
                        value={label}
                        onChange={(newLabel) => setAttributes({ label: newLabel })}
                    />
                    <TextControl
                        label={__('Placeholder', 'smartforms')}
                        value={placeholder}
                        onChange={(newPlaceholder) => setAttributes({ placeholder: newPlaceholder })}
                    />
                    <TextControl
                        label={__('Help Text', 'smartforms')}
                        value={helpText}
                        onChange={(newHelpText) => setAttributes({ helpText: newHelpText })}
                    />
                    <TextControl
                        label={__('CSS Class', 'smartforms')}
                        value={cssClass}
                        onChange={(newCssClass) => setAttributes({ cssClass: newCssClass })}
                    />
                    <ToggleControl
                        label={__('Required', 'smartforms')}
                        checked={required}
                        onChange={(newRequired) => setAttributes({ required: newRequired })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${cssClass}`}
                        onChange={(event) => setAttributes({ value: event.target.value })}
                        required={required}
                    />
                </label>
                {helpText && (
                    <p className="mt-2 text-sm text-gray-500">
                        {helpText}
                    </p>
                )}
            </div>
        </>
    );
}
