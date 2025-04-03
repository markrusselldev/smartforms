/**
 * Edit component for the SmartForms Button Group block.
 *
 * Renders the block in the editor with InspectorControls for:
 * 1. Main Settings Panel: Button-specific settings (toggle for multiple selections and layout selection).
 * 2. Input Settings Panel: Using CommonFieldSettings for "Required" and "Field Alignment."
 * 3. Options Panel: For managing button options using OptionRow.
 *
 * The output is wrapped with FieldWrapper so that the main label, field area, and help text are rendered consistently.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  Button,
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';
import OptionRow from '../components/OptionRow';
import CommonFieldSettings from '../components/CommonFieldSettings';
import { ButtonGroup } from '../components/shared/FieldRenderers';

const { placeholders, defaultOptions } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    helpText,
    required,
    options,
    groupId,
    multiple,
    layout,
    fieldAlignment,
    currentAnswer,
  } = attributes;
  const blockProps = useBlockProps();

  // Initialize attributes if not already set.
  useEffect(() => {
    if (!groupId) {
      setAttributes({ groupId: `sf-buttons-${clientId}` });
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      setAttributes({ options: defaultOptions });
    }
    if (!layout) {
      setAttributes({ layout: 'horizontal' });
    }
    if (!fieldAlignment) {
      setAttributes({ fieldAlignment: 'left' });
    }
  }, [groupId, options, layout, fieldAlignment, clientId, setAttributes]);

  // Update an option's label and corresponding value.
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
   * Adds a new button option.
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
   * Removes a button option by index.
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
        <PanelBody title={__('Button Settings', 'smartforms')}>
          <ToggleControl
            label={__('Allow Multiple Selections', 'smartforms')}
            checked={multiple}
            onChange={(value) =>
              setAttributes({ multiple: value, currentAnswer: value ? [] : '' })
            }
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
        {/* Options Panel */}
        <PanelBody
          title={__('Button Options', 'smartforms')}
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
        setLabel={(val) => setAttributes({ label: val })}
        setHelpText={(val) => setAttributes({ helpText: val })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        alignment={fieldAlignment}
      >
        <ButtonGroup
          options={options}
          current={currentAnswer}
          onChange={(value) => setAttributes({ currentAnswer: value })}
          multiple={multiple}
          layout={layout}
          fieldAlignment={fieldAlignment}
          required={required}
        />
      </FieldWrapper>
    </div>
  );
};

export default Edit;
