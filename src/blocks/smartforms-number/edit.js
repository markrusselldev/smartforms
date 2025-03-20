/**
 * Edit component for the SmartForms Number block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Toggling required status.
 * - Setting min, max, step, and defaultValue.
 * - Selecting field alignment.
 *
 * The entire output is wrapped with a FieldWrapper for consistent styling.
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
import { useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const { placeholders } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    required,
    min,
    max,
    step,
    defaultValue,
    helpText,
    fieldAlignment,
  } = attributes;
  const blockProps = useBlockProps();

  useEffect(() => {
    if (typeof fieldAlignment === 'undefined' || fieldAlignment === '') {
      setAttributes({ fieldAlignment: 'left' });
    }
  }, [fieldAlignment, setAttributes]);

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
