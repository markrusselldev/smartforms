/**
 * Edit component for the SmartForms Button Group dynamic block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Toggling required status.
 * - Enabling/disabling multiple selections.
 * - Managing the button options.
 * - Selecting the layout (horizontal or vertical).
 *
 * The field label and help text are editable inline using RichText.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';

const { placeholders, defaultOptions } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    helpText,
    required,
    options,
    groupId,
    multiple,
    currentAnswer,
    layout,
  } = attributes;
  const blockProps = useBlockProps({
    'data-required': required ? 'true' : 'false',
    'data-multiple': multiple ? 'true' : 'false',
    'data-help-text': helpText,
  });

  // Initialize groupId, default options, and layout if not already set.
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
  }, [groupId, options, layout, clientId, setAttributes]);

  /**
   * Update an option’s label and corresponding value.
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
    const newOptions = [...options, { label: newLabel, value: newValue }];
    setAttributes({ options: newOptions });
  };

  /**
   * Removes a button option.
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
        <PanelBody title={__('Button Group Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
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
        <PanelBody
          title={__('Button Options', 'smartforms')}
          initialOpen={true}
        >
          {options.map((option, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
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
            </div>
          ))}
          <Button variant="primary" onClick={addOption}>
            {__('Add Option', 'smartforms')}
          </Button>
        </PanelBody>
      </InspectorControls>
      {/* Editable main field label */}
      <RichText
        tagName="label"
        className="sf-field-label"
        value={label}
        onChange={(value) => setAttributes({ label: value })}
        placeholder={placeholders.label}
      />
      <div
        className={`sf-buttons-group sf-buttons-group-${layout}`}
        data-group-id={groupId}
        data-layout={layout}
      >
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={
              `btn btn-primary ` +
              (multiple
                ? Array.isArray(currentAnswer) &&
                  currentAnswer.includes(option.value)
                  ? 'active'
                  : ''
                : currentAnswer === option.value
                  ? 'active'
                  : '')
            }
            data-value={option.value}
            onClick={() => {
              if (multiple) {
                let newSelection = Array.isArray(currentAnswer)
                  ? [...currentAnswer]
                  : [];
                if (newSelection.includes(option.value)) {
                  newSelection = newSelection.filter(
                    (val) => val !== option.value,
                  );
                } else {
                  newSelection.push(option.value);
                }
                setAttributes({ currentAnswer: newSelection });
              } else {
                setAttributes({ currentAnswer: option.value });
              }
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {/* Editable help text inserted inline */}
      <RichText
        tagName="p"
        className="sf-field-help"
        value={helpText}
        onChange={(value) => setAttributes({ helpText: value })}
        placeholder={placeholders.helpText}
      />
    </div>
  );
};

export default Edit;
