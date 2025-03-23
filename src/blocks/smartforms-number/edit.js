/**
 * Edit component for the SmartForms Number block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Number Input Settings: Minimum, Maximum, Step, and Default Value.
 * - Input Settings: Using CommonFieldSettings for Required and Alignment.
 *
 * The entire output is wrapped with the FieldWrapper for consistent styling.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';
import CommonFieldSettings from '../components/CommonFieldSettings';

const { placeholders } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    min,
    max,
    step,
    defaultValue,
    helpText,
    fieldAlignment,
    required,
  } = attributes;
  const blockProps = useBlockProps();

  // Ensure fieldAlignment is initialized.
  useEffect(() => {
    if (typeof fieldAlignment === 'undefined' || fieldAlignment === '') {
      setAttributes({ fieldAlignment: 'left' });
    }
  }, [fieldAlignment, setAttributes]);

  return (
    <div {...blockProps}>
      <InspectorControls>
        {/* Panel for number-specific parameters */}
        <PanelBody title={__('Main Settings', 'smartforms')}>
          <TextControl
            type="number"
            label={__('Minimum Value', 'smartforms')}
            value={min}
            onChange={(value) => setAttributes({ min: Number(value) })}
          />
          <TextControl
            type="number"
            label={__('Maximum Value', 'smartforms')}
            value={max}
            onChange={(value) => setAttributes({ max: Number(value) })}
          />
          <TextControl
            type="number"
            label={__('Step', 'smartforms')}
            value={step}
            onChange={(value) => setAttributes({ step: Number(value) })}
          />
          <TextControl
            type="number"
            label={__('Default Value', 'smartforms')}
            value={defaultValue}
            onChange={(value) => setAttributes({ defaultValue: Number(value) })}
            help={__(
              'This value appears by default on the frontend',
              'smartforms',
            )}
          />
        </PanelBody>
        {/* Panel for common input settings */}
        <CommonFieldSettings
          required={required}
          alignment={fieldAlignment}
          onChangeRequired={(value) => setAttributes({ required: value })}
          onChangeAlignment={(value) =>
            setAttributes({ fieldAlignment: value })
          }
        />
      </InspectorControls>
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        alignment={fieldAlignment}
      >
        <input
          type="number"
          className="form-control sf-number-input"
          required={required}
          min={min}
          max={max}
          step={step}
          defaultValue={defaultValue}
          inputMode="numeric"
          pattern="[0-9]+([.,][0-9]+)?"
        />
      </FieldWrapper>
    </div>
  );
};

export default Edit;
