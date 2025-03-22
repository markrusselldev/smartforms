/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field group for the editor with InspectorControls for:
 * - Checkbox Group Settings: Containing layout control.
 * - Input Settings: Using CommonFieldSettings for "Required" and "Field Alignment".
 * - Checkbox Options: For adding, editing, and removing individual checkbox options.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';
import OptionRow from '../components/OptionRow';
import CommonFieldSettings from '../components/CommonFieldSettings';

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
      setAttributes({ groupId: `sf-checkbox-${clientId}` });
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
   *
   * @param {number} index - The index of the option.
   * @param {string} newLabel - The new label.
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
   * Adds a new checkbox option.
   *
   * Automatically assigns a sequential label "Option N" based on the current highest option number.
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
   *
   * @param {number} index - The index to remove.
   */
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setAttributes({ options: newOptions });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        {/* Panel for Checkbox Group Settings (layout control) */}
        <PanelBody title={__('Checkbox Group Settings', 'smartforms')}>
          <SelectControl
            label={__('Layout', 'smartforms')}
            value={layout}
            options={[
              { label: __('Horizontal', 'smartforms'), value: 'horizontal' },
              { label: __('Vertical', 'smartforms'), value: 'vertical' },
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
        </PanelBody>
        {/* Panel for Input Settings using CommonFieldSettings */}
        <CommonFieldSettings
          required={required}
          alignment={fieldAlignment}
          onChangeRequired={(value) => setAttributes({ required: value })}
          onChangeAlignment={(value) =>
            setAttributes({ fieldAlignment: value })
          }
        />
        {/* Panel for Checkbox Options using OptionRow */}
        <PanelBody
          title={__('Checkbox Options', 'smartforms')}
          initialOpen={true}
        >
          {options.map((option, index) => (
            <Fragment key={index}>
              <OptionRow
                index={index}
                value={option.label}
                onChange={(value) => updateOption(index, value)}
                onRemove={() => removeOption(index)}
              />
            </Fragment>
          ))}
          <div style={{ textAlign: 'center', paddingTop: '10px' }}>
            <Button variant="primary" onClick={addOption}>
              {__('Add Option', 'smartforms')}
            </Button>
          </div>
        </PanelBody>
      </InspectorControls>
      {/* Render the checkbox field using FieldWrapper */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(val) => setAttributes({ label: val })}
        setHelpText={(val) => setAttributes({ helpText: val })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        alignment={fieldAlignment}
        plainText={true}
      >
        <div
          className={`sf-checkbox-group sf-checkbox-group-${layout || 'horizontal'}`}
          data-layout={layout || 'horizontal'}
        >
          {options.map((option, index) => (
            <Fragment key={index}>
              <div
                className={`sf-checkbox-option form-check${
                  layout === 'horizontal' ? ' form-check-inline' : ''
                }`}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
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
