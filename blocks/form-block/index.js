import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

// Register the "Form Field" block.
registerBlockType('smartforms/form-field', {
    title: __('Form Field', 'smartforms'),
    description: __('Add a customizable field to your SmartForm.', 'smartforms'),
    category: 'widgets',
    icon: 'forms',
    supports: {
        html: false, // Prevents raw HTML editing for this block.
    },
    attributes: {
        label: {
            type: 'string',
            default: '',
        },
        placeholder: {
            type: 'string',
            default: '',
        },
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Field Settings', 'smartforms')}>
                        <TextControl
                            label={__('Label', 'smartforms')}
                            value={attributes.label}
                            onChange={(value) => setAttributes({ label: value })}
                        />
                        <TextControl
                            label={__('Placeholder', 'smartforms')}
                            value={attributes.placeholder}
                            onChange={(value) => setAttributes({ placeholder: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                <label>{attributes.label}</label>
                <input type="text" placeholder={attributes.placeholder} />
            </div>
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <label>{attributes.label}</label>
                <input type="text" placeholder={attributes.placeholder} />
            </div>
        );
    },
});
