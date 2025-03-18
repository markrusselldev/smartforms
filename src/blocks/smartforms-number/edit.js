/**
 * Edit component for SmartForms Number block.
 *
 * 1. Uses the "fieldAlignment" attribute.
 * 2. Applies alignment using Bootstrap’s utility classes (text‑start, text‑center, text‑end).
 * 3. Applies size classes (form-control-sm or form-control-lg) based on the fieldSize attribute.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  ToggleControl,
  SelectControl,
} from '@wordpress/components';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const Edit = ({ attributes, setAttributes }) => {
  const {
    label,
    required,
    min,
    max,
    step,
    defaultValue,
    helpText,
    fieldSize,
    fieldAlignment,
  } = attributes;

  // Determine the Bootstrap size class.
  let sizeClass = '';
  if (fieldSize === 'small') {
    sizeClass = 'form-control-sm';
  } else if (fieldSize === 'large') {
    sizeClass = 'form-control-lg';
  }

  // Compute Bootstrap alignment class using fieldAlignment.
  const bootstrapAlignment =
    fieldAlignment === 'center'
      ? 'text-center'
      : fieldAlignment === 'right'
        ? 'text-end'
        : 'text-start';

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
        <PanelBody title={__('Appearance', 'smartforms')} initialOpen={true}>
          <SelectControl
            label={__('Field Size', 'smartforms')}
            value={fieldSize}
            options={[
              { label: __('Small', 'smartforms'), value: 'small' },
              { label: __('Medium', 'smartforms'), value: 'medium' },
              { label: __('Large', 'smartforms'), value: 'large' },
            ]}
            onChange={(value) => setAttributes({ fieldSize: value })}
          />
          <SelectControl
            label={__('Alignment', 'smartforms')}
            value={fieldAlignment}
            options={[
              { label: __('Left', 'smartforms'), value: 'left' },
              { label: __('Center', 'smartforms'), value: 'center' },
              { label: __('Right', 'smartforms'), value: 'right' },
            ]}
            onChange={(value) => setAttributes({ fieldAlignment: value })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Pass fieldAlignment to the FieldWrapper */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={blockDefaults.placeholders.label}
        helpPlaceholder={blockDefaults.placeholders.helpText}
        alignment={fieldAlignment}
      >
        <input
          type="number"
          className={`form-control sf-number-input ${sizeClass}`}
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
