/**
 * Edit component for the SmartForms Number Input block.
 *
 * Renders the number input field in the editor with InspectorControls for adjusting:
 * - Required status, minimum, maximum, step, and default values.
 *
 * The entire field output (label, input container, and help text) is wrapped with the
 * FieldWrapper component so that its RichText behavior is consistent with the Checkbox block.
 *
 * Note: The placeholder is managed by FieldWrapper (via blockDefaults) when the label is empty.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const Edit = ({ attributes, setAttributes }) => {
  const { label, required, min, max, step, defaultValue, helpText } =
    attributes;

  // Use normal blockProps (no extra class) for consistency
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Number Input Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
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
      </InspectorControls>
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={blockDefaults.placeholders.label}
        helpPlaceholder={blockDefaults.placeholders.helpText}
      >
        <div className="sf-number-container">
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
        </div>
      </FieldWrapper>
    </div>
  );
};

export default Edit;
