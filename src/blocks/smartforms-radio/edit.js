/**
 * Edit component for the SmartForms Radio block.
 *
 * Renders a radio field for selecting a single option with InspectorControls for:
 * - Main Settings: Contains a SelectControl for Layout.
 * - Input Settings: Uses CommonFieldSettings for Required and Field Alignment.
 * - Radio Options: Uses OptionRow for managing individual radio options.
 *
 * The entire output is wrapped with FieldWrapper for consistent label, input container,
 * and help text styling.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button } from '@wordpress/components';
import { useEffect, Fragment } from '@wordpress/element';
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
   * Removes a radio option by its index.
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
        {/* Main Settings Panel */}
        <PanelBody title={__('Radio Settings', 'smartforms')}>
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
        {/* Input Settings Panel */}
        <CommonFieldSettings
          required={required}
          alignment={fieldAlignment}
          onChangeRequired={(value) => setAttributes({ required: value })}
          onChangeAlignment={(value) =>
            setAttributes({ fieldAlignment: value })
          }
        />
        {/* Radio Options Panel */}
        <PanelBody title={__('Radio Options', 'smartforms')} initialOpen={true}>
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
          <Button
            variant="secondary"
            onClick={addOption}
            className="sf-add-option-btn"
          >
            {__('Add Option', 'smartforms')}
          </Button>
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
        <div
          className={`sf-radio-group sf-radio-group-${layout || 'horizontal'}`}
          data-layout={layout || 'horizontal'}
        >
          {options.map((option, index) => (
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
