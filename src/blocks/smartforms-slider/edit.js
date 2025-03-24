/**
 * Edit component for the SmartForms Slider block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Slider Settings: placeholder, min, max, step, defaultValue, unit, etc.
 * - Input Settings (CommonFieldSettings): Required + Alignment.
 *
 * It ensures the output element is below and centered, matching the frontend.
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import CommonFieldSettings from '../components/CommonFieldSettings';
import FieldWrapper from '../components/FieldWrapper';
import { blockDefaults } from '../../config/blockDefaults';

const { placeholders } = blockDefaults;

const Edit = ({ attributes, setAttributes }) => {
  const {
    label,
    helpText,
    required,
    placeholder,
    min,
    max,
    step,
    defaultValue,
    fieldAlignment,
    unit,
    unitPosition,
  } = attributes;

  const blockProps = useBlockProps();

  // Ensure fieldAlignment is set if it's missing
  useEffect(() => {
    if (!fieldAlignment) {
      setAttributes({ fieldAlignment: 'left' });
    }
  }, [fieldAlignment, setAttributes]);

  // Keep track of the slider value in editor state for live preview
  const initialValue =
    typeof defaultValue === 'number'
      ? defaultValue
      : (Number(min) + Number(max)) / 2;
  const [sliderValue, setSliderValue] = useState(initialValue);

  useEffect(() => {
    // If defaultValue is null or outside [min, max], reset to the midpoint
    if (defaultValue === null || defaultValue < min || defaultValue > max) {
      const midpoint = (Number(min) + Number(max)) / 2;
      setAttributes({ defaultValue: midpoint });
      setSliderValue(midpoint);
    }
  }, [min, max, defaultValue, setAttributes]);

  const handleSliderChange = (value) => {
    const numericValue = Number(value);
    setSliderValue(numericValue);
    setAttributes({ defaultValue: numericValue });
  };

  const handleToggleUnitPosition = (checked) => {
    setAttributes({ unitPosition: checked ? 'before' : 'after' });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Slider Settings', 'smartforms')}>
          <TextControl
            label={__('Placeholder', 'smartforms')}
            value={placeholder}
            onChange={(val) => setAttributes({ placeholder: val })}
          />
          <TextControl
            type="number"
            label={__('Minimum Value', 'smartforms')}
            value={min}
            onChange={(val) => setAttributes({ min: Number(val) })}
          />
          <TextControl
            type="number"
            label={__('Maximum Value', 'smartforms')}
            value={max}
            onChange={(val) => setAttributes({ max: Number(val) })}
          />
          <TextControl
            type="number"
            label={__('Step', 'smartforms')}
            value={step}
            onChange={(val) => setAttributes({ step: Number(val) })}
          />
          <TextControl
            type="number"
            label={__('Default Value', 'smartforms')}
            value={sliderValue}
            onChange={(val) => handleSliderChange(val)}
          />
          <TextControl
            label={__('Unit (optional)', 'smartforms')}
            value={unit}
            onChange={(val) => setAttributes({ unit: val })}
          />
          <ToggleControl
            label={__('Place Unit Before Number?', 'smartforms')}
            checked={unitPosition === 'before'}
            onChange={handleToggleUnitPosition}
          />
        </PanelBody>

        <CommonFieldSettings
          required={required}
          alignment={fieldAlignment}
          onChangeRequired={(val) => setAttributes({ required: val })}
          onChangeAlignment={(val) => setAttributes({ fieldAlignment: val })}
        />
      </InspectorControls>

      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(val) => setAttributes({ label: val })}
        setHelpText={(val) => setAttributes({ helpText: val })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        alignment={fieldAlignment}
      >
        {/* Row for min -> slider -> max */}
        <div
          className="sf-slider-row d-flex align-items-center"
          style={{ gap: '1rem' }}
        >
          <span className="sf-slider-min">{min}</span>
          <input
            type="range"
            className="form-range sf-slider-input"
            min={min}
            max={max}
            step={step}
            value={sliderValue}
            required={required}
            onChange={(e) => handleSliderChange(e.target.value)}
          />
          <span className="sf-slider-max">{max}</span>
        </div>

        {/* Output below the slider, centered */}
        <div
          className="sf-slider-output"
          style={{ textAlign: 'center', marginTop: '4px' }}
        >
          {unit
            ? unitPosition === 'before'
              ? `${unit} ${sliderValue}`
              : `${sliderValue} ${unit}`
            : sliderValue}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default Edit;
