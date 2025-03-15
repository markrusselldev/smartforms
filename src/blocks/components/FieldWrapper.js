import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { blockDefaults } from '../../config/blockDefaults';

/**
 * FieldWrapper component renders the common structure for a form field.
 *
 * @param {Object} props Component props.
 * @param {string} props.label The field label.
 * @param {string} props.helpText The field help text.
 * @param {Function} props.setLabel Function to update the label.
 * @param {Function} props.setHelpText Function to update the help text.
 * @param {React.Node} props.children The field-specific input element.
 * @param {string} [props.labelPlaceholder] Placeholder for the label.
 * @param {string} [props.helpPlaceholder] Placeholder for the help text.
 * @returns {React.Element} The FieldWrapper component.
 */
const FieldWrapper = ({
  label,
  helpText,
  setLabel,
  setHelpText,
  children,
  labelPlaceholder = blockDefaults.placeholders.label,
  helpPlaceholder = blockDefaults.placeholders.helpText,
}) => {
  return (
    <div className="sf-field-wrapper">
      <RichText
        tagName="label"
        className="sf-field-label"
        value={label}
        onChange={setLabel}
        placeholder={labelPlaceholder}
      />
      <div className="sf-input-container">{children}</div>
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
