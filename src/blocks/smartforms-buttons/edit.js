/**
 * Edit component for the SmartForms Button Group dynamic block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Toggling required status.
 * - Enabling/disabling multiple selections.
 * - Managing the button options.
 * - Selecting the layout (vertical or horizontal).
 *
 * Now the entire output is wrapped with the FieldWrapper component (imported from ../components/FieldWrapper)
 * so that the label, input container, and help text use the same RichText behavior as the Checkbox block.
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
import {
  updateOption as helperUpdateOption,
  addOption as helperAddOption,
  removeOption as helperRemoveOption,
} from './buttonHelper';
import FieldWrapper from '../components/FieldWrapper';

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
  const blockProps = useBlockProps();

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
    const newOptions = helperUpdateOption(options, index, newLabel);
    setAttributes({ options: newOptions });
  };

  /**
   * Adds a new button option.
   */
  const addOption = () => {
    const newOptions = helperAddOption(options);
    setAttributes({ options: newOptions });
  };

  /**
   * Removes a button option.
   *
   * @param {number} index - The index to remove.
   */
  const removeOption = (index) => {
    const newOptions = helperRemoveOption(options, index);
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
      {/* Wrap the field's label, input container, and help text in FieldWrapper for consistency */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
      >
        <div
          className={`sf-buttons-group sf-buttons-group--${layout}`}
          data-group-id={groupId}
          data-layout={layout}
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-primary ${
                multiple
                  ? Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.value)
                    ? 'active'
                    : ''
                  : currentAnswer === option.value
                    ? 'active'
                    : ''
              }`}
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
      </FieldWrapper>
    </div>
  );
};

export default Edit;
