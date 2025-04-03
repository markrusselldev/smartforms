/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field group in the editor using InspectorControls for:
 * 1. Main Settings Panel: Checkbox-specific settings (layout selection).
 * 2. Input Settings Panel: Using CommonFieldSettings for "Required" and "Field Alignment".
 * 3. Options Panel: For managing checkbox options using OptionRow.
 *
 * The output is wrapped with FieldWrapper to ensure a consistent markup structure.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button } from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';
import OptionRow from '../components/OptionRow';
import CommonFieldSettings from '../components/CommonFieldSettings';
import { CheckboxGroup } from '../components/shared/FieldRenderers';

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

  // Local state for the selected checkboxes in the editor preview.
  const [selected, setSelected] = useState([]);

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

  // Add a new checkbox option.
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

  // Remove an option by its index.
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setAttributes({ options: newOptions });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        {/* Main Settings Panel */}
        <PanelBody title={__('Checkbox Settings', 'smartforms')}>
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
        plainText={true}
      >
        <CheckboxGroup
          options={options}
          selected={selected}
          onChange={setSelected}
          layout={layout}
          fieldAlignment={fieldAlignment}
          required={required}
        />
      </FieldWrapper>
    </div>
  );
};

export default Edit;
