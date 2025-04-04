/**
 * Edit component for the SmartForms Button Group block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Toggling required status.
 * - Enabling/disabling multiple selections.
 * - Managing the button options.
 * - Selecting the layout (horizontal or vertical).
 * - Selecting field alignment.
 *
 * The entire output is wrapped with the FieldWrapper component so that the label,
 * input container, and help text use consistent RichText behavior.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  Button,
  SelectControl,
} from '@wordpress/components';
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
    multiple,
    currentAnswer,
    layout,
    fieldAlignment,
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
   * Adds a new button option.
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
          {/* Note: Style options have been removed here to avoid redundancy with our dedicated Styles page. */}
        </PanelBody>
        <CommonFieldSettings
          required={required}
          alignment={fieldAlignment}
          onChangeRequired={(value) => setAttributes({ required: value })}
          onChangeAlignment={(value) =>
            setAttributes({ fieldAlignment: value })
          }
        />
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
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        alignment={fieldAlignment}
      >
        <div
          className={`sf-buttons-group sf-buttons-group--${layout}`}
          data-group-id={groupId}
          data-layout={layout}
          style={{ textAlign: fieldAlignment }}
        >
          {options.map((option, index) => (
            <button
              key={`${index}`}
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
                  const currentSelection = Array.isArray(currentAnswer)
                    ? [...currentAnswer]
                    : [];
                  const updatedSelection = currentSelection.includes(
                    option.value,
                  )
                    ? currentSelection.filter((val) => val !== option.value)
                    : [...currentSelection, option.value];
                  setAttributes({ currentAnswer: updatedSelection });
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
