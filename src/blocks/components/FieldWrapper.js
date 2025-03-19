/**
 * FieldWrapper component renders the common structure for a form field.
 * It wraps a label, an input container, and a help text element.
 *
 * It supports customization of:
 * - Alignment via the "alignment" prop (applies flexbox justification to the input container).
 * - A custom label class via the "labelClass" prop.
 * - Optional plain text mode via the "plainText" prop, which disables RichText formatting controls.
 *
 * @param {Object} props Component props.
 * @param {string} props.label The field label.
 * @param {string} props.helpText The field help text.
 * @param {Function} props.setLabel Function to update the label.
 * @param {Function} props.setHelpText Function to update the help text.
 * @param {React.Node} props.children The field-specific input element.
 * @param {string} [props.labelPlaceholder] Placeholder for the label.
 * @param {string} [props.helpPlaceholder] Placeholder for the help text.
 * @param {string} [props.alignment="left"] Field alignment: "left", "center", or "right".
 * @param {string} [props.labelClass="sf-field-label"] CSS class for the label element.
 * @param {boolean} [props.plainText=false] When true, disables RichText formatting (ensuring plain text).
 * @returns {React.Element} The FieldWrapper component.
 */
import { RichText } from '@wordpress/block-editor';
import { blockDefaults } from '../../config/blockDefaults';

const FieldWrapper = ({
  label,
  helpText,
  setLabel,
  setHelpText,
  children,
  labelPlaceholder = blockDefaults.placeholders.label,
  helpPlaceholder = blockDefaults.placeholders.helpText,
  alignment = 'left',
  labelClass = 'sf-field-label',
  plainText = false,
}) => {
  // Compute flexbox justification value for the input container.
  const justifyContent =
    alignment === 'center'
      ? 'center'
      : alignment === 'right'
        ? 'flex-end'
        : 'flex-start';

  return (
    <div className="sf-field-wrapper">
      <RichText
        tagName="label"
        className={labelClass}
        value={label}
        onChange={setLabel}
        placeholder={labelPlaceholder}
        formattingControls={plainText ? [] : undefined}
      />
      <div
        className="sf-input-container"
        style={{ display: 'flex', justifyContent }}
      >
        {children}
      </div>
      <RichText
        tagName="p"
        className="sf-field-help"
        value={helpText}
        onChange={setHelpText}
        placeholder={helpPlaceholder}
      />
    </div>
  );
};

export default FieldWrapper;
