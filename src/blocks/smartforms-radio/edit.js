/**
 * Edit component for the SmartForms Radio Buttons block.
 *
 * Renders a radio buttons field for selecting a single option with InspectorControls
 * to manage options and settings such as required, layout, and field alignment.
 * Uses FieldWrapper for consistent label and help text display.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const { placeholders, defaultOptions } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    helpText,
    required,
    options,
    groupId,
    layout,
    fieldAlignment,
  } = attributes;
  const blockProps = useBlockProps();

  // Initialize attributes if not already set.
  useEffect(() => {
    if (!groupId) {
      setAttributes({ groupId: `sf-radio-${clientId}` });
    }
    if (!layout) {
      setAttributes({ layout: 'horizontal' });
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      setAttributes({ options: defaultOptions });
    }
    if (!fieldAlignment) {
      setAttributes({ fieldAlignment: 'left' });
    }
  }, [groupId, layout, options, fieldAlignment, clientId, setAttributes]);

  /**
   * Updates an option's label and corresponding value.
   */
  const updateOption = (index, newLabel) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        return {
          label: newLabel,
          value: newLabel.toLowerCase().replace(/\s+/g, '-'),
        };
      }
      return option;
    });
    setAttributes({ options: newOptions });
  };

  /**
   * Adds a new radio option.
   */
  const addOption = () => {
    let maxNumber = 0;
    options.forEach((option) => {
      const match = option.label.match(/^Option (\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });
    const newLabel = `Option ${maxNumber + 1}`;
    const newValue = newLabel.toLowerCase().replace(/\s+/g, '-');
    setAttributes({
      options: [...options, { label: newLabel, value: newValue }],
    });
  };

  /**
   * Removes an option by its index.
   */
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setAttributes({ options: newOptions });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Radio Buttons Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
          <SelectControl
            label={__('Layout', 'smartforms')}
            value={layout}
            options={[
              { label: __('Horizontal', 'smartforms'), value: 'horizontal' },
              { label: __('Vertical', 'smartforms'), value: 'vertical' },
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
          <SelectControl
            label={__('Field Alignment', 'smartforms')}
            value={fieldAlignment}
            options={[
              { label: __('Left', 'smartforms'), value: 'left' },
              { label: __('Center', 'smartforms'), value: 'center' },
              { label: __('Right', 'smartforms'), value: 'right' },
            ]}
            onChange={(value) => setAttributes({ fieldAlignment: value })}
          />
        </PanelBody>
        <PanelBody title={__('Radio Options', 'smartforms')} initialOpen={true}>
          {options &&
            options.map((option, index) => (
              <Fragment key={index}>
                <TextControl
                  label={`${__('Option', 'smartforms')} ${index + 1}`}
                  value={option.label}
                  onChange={(value) => updateOption(index, value)}
                />
                <Button
                  variant="secondary"
                  onClick={() => removeOption(index)}
                  size="small"
                >
                  {__('Remove Option', 'smartforms')}
                </Button>
              </Fragment>
            ))}
          <div style={{ textAlign: 'center', paddingTop: '10px' }}>
            <Button variant="primary" onClick={addOption}>
              {__('Add Option', 'smartforms')}
            </Button>
          </div>
        </PanelBody>
      </InspectorControls>
      {/* Wrap the field with FieldWrapper for consistent label/help text rendering */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(val) => setAttributes({ label: val })}
        setHelpText={(val) => setAttributes({ helpText: val })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        alignment={fieldAlignment}
      >
        <div
          className={`sf-radio-group sf-radio-group-${layout || 'horizontal'}`}
          data-layout={layout || 'horizontal'}
        >
          {options &&
            options.map((option, index) => (
              <Fragment key={index}>
                <div
                  className={`sf-radio-option form-check${layout === 'horizontal' ? ' form-check-inline' : ''}`}
                >
                  <input
                    type="radio"
                    className="form-check-input"
                    value={option.value}
                    id={`${groupId}-${index}`}
                    name={groupId}
                    required={required}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${groupId}-${index}`}
                  >
                    {option.label}
                  </label>
                </div>
              </Fragment>
            ))}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default Edit;
