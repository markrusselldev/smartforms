import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { label, placeholder, required } = attributes;

    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Field Settings', 'smartforms')}>
                    <TextControl
                        label={__('Label', 'smartforms')}
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                    />
                    <TextControl
                        label={__('Placeholder', 'smartforms')}
                        value={placeholder}
                        onChange={(value) => setAttributes({ placeholder: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <label>{label}</label>
                <input
                    type="text"
                    placeholder={placeholder}
                    required={required}
                    disabled
                />
            </div>
        </>
    );
}
