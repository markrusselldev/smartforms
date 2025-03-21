import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  Button,
  TextControl,
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import FieldWrapper from '../components/FieldWrapper';

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    helpText,
    placeholder,
    required,
    options,
    groupId,
    fieldAlignment,
  } = attributes;
  const blockProps = useBlockProps();

  // Initialize groupId if not set.
  useEffect(() => {
    if (!groupId) {
      setAttributes({ groupId: `sf-select-${clientId}` });
    }
  }, [groupId, clientId, setAttributes]);

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

  // Add a new option.
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

  // Remove an option.
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setAttributes({ options: newOptions });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Dropdown Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
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
          <TextControl
            label={__('Placeholder', 'smartforms')}
            value={placeholder}
            onChange={(value) =>
              setAttributes({
                placeholder: value.trim() === '' ? 'Select an option' : value,
              })
            }
          />
        </PanelBody>
        <PanelBody
          title={__('Dropdown Options', 'smartforms')}
          initialOpen={true}
        >
          {options.map((option, index) => (
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
          <Button variant="primary" onClick={addOption}>
            {__('Add Option', 'smartforms')}
          </Button>
        </PanelBody>
      </InspectorControls>
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder="Enter your question here"
        helpPlaceholder="Enter help text here"
        alignment={fieldAlignment}
      >
        <select className="sf-select-input form-control" required={required}>
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
