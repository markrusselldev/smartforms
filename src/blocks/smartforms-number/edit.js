import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { blockDefaults } from '../../config/blockDefaults';

const Edit = ({ attributes, setAttributes }) => {
  const {
    label,
    placeholder,
    required,
    min,
    max,
    step,
    defaultValue,
    helpText,
  } = attributes;
  const blockProps = useBlockProps();

  return (
    <div {...blockProps} className="wp-block-smartforms-number sf-number-block">
      <InspectorControls>
        <PanelBody title={__('Number Input Settings', 'smartforms')}>
          <TextControl
            label={__('Placeholder', 'smartforms')}
            value={placeholder}
            onChange={(value) => setAttributes({ placeholder: value })}
            help={__('Leave blank to use the default value', 'smartforms')}
          />
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
      <div className="smartforms-number-preview">
        <RichText
          tagName="label"
          className="sf-field-label"
          value={label}
          onChange={(value) => setAttributes({ label: value })}
          placeholder={blockDefaults.placeholders.label}
        />
        <div className="sf-number-container">
          <input
            type="number"
            className="form-control sf-number-input"
            placeholder={placeholder || String(defaultValue)}
            required={required}
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            inputMode="numeric"
            pattern="[0-9]+([.,][0-9]+)?"
          />
        </div>
        <RichText
          tagName="p"
          className="sf-field-help"
          value={helpText}
          onChange={(value) => setAttributes({ helpText: value })}
          placeholder={blockDefaults.placeholders.helpText}
        />
      </div>
    </div>
  );
};

export default Edit;
