/**
 * Edit component for the SmartForms Dropdown block.
 *
 * Renders a dropdown field for selecting a single option with InspectorControls for:
 * 1. Main Settings Panel – Contains unique parameters (the placeholder).
 * 2. Input Settings Panel – Uses CommonFieldSettings for Required and Field Alignment.
 * 3. Options Panel – For managing the dropdown options using OptionRow for consistency.
 *
 * The output is wrapped with FieldWrapper for consistent label, input container, and help text styling.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { useEffect, Fragment } from '@wordpress/element';
import FieldWrapper from '../components/FieldWrapper';
import CommonFieldSettings from '../components/CommonFieldSettings';
import OptionRow from '../components/OptionRow';
import { blockDefaults } from '../../config/blockDefaults';

const { placeholders, options: defaultOptions } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    helpText,
    required,
    placeholder,
    options,
    groupId,
    fieldAlignment,
    layout,
  } = attributes;
  const blockProps = useBlockProps();

  // Initialize groupId and default attributes.
  useEffect(() => {
    if (!groupId) {
      setAttributes({ groupId: `sf-dropdown-${clientId}` });
    }
    if (!layout) {
      setAttributes({ layout: 'horizontal' });
    }
    if (!fieldAlignment) {
      setAttributes({ fieldAlignment: 'left' });
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      setAttributes({ options: defaultOptions });
    }
  }, [groupId, layout, fieldAlignment, options, clientId, setAttributes]);

  /**
   * Updates an option's label and corresponding value.
   *
   * @param {number} index - The option index.
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
   * Adds a new dropdown option.
   */
  const addOption = () => {
    const maxNumber = options.reduce((acc, option) => {
      const match = option.label.match(/^Option (\d+)$/);
      return match ? Math.max(acc, parseInt(match[1], 10)) : acc;
    }, 0);
    const newLabel = `Option ${maxNumber + 1}`;
    const newValue = newLabel.toLowerCase().replace(/\s+/g, '-');
    setAttributes({
      options: [...options, { label: newLabel, value: newValue }],
    });
  };

  /**
   * Removes a dropdown option by its index.
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
        {/* Main Settings Panel: Unique settings */}
        <PanelBody title={__('Dropdown Settings', 'smartforms')}>
          <TextControl
            label={__('Placeholder', 'smartforms')}
            value={placeholder}
            onChange={(value) => setAttributes({ placeholder: value })}
          />
        </PanelBody>
        {/* Input Settings Panel: Common controls */}
        <CommonFieldSettings
          required={required}
          alignment={fieldAlignment}
          onChangeRequired={(value) => setAttributes({ required: value })}
          onChangeAlignment={(value) =>
            setAttributes({ fieldAlignment: value })
          }
        />
        {/* Options Panel: Manage dropdown options using OptionRow */}
        <PanelBody
          title={__('Dropdown Options', 'smartforms')}
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
        <select className="sf-dropdown-input form-select" required={required}>
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    </div>
  );
};

export default Edit;
