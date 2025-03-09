/**
 * Save function for the SmartForms Button Group block.
 *
 * This function outputs a minimal static markup that includes the data attributes for:
 * - required,
 * - multiple, and
 * - helpText.
 *
 * This markup is stored in the post content so that MetaBox::smartforms_generate_json_on_save()
 * can parse these values. (The dynamic render callback will override this on the frontend.)
 *
 * @package SmartForms
 */
import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const { label, required, helpText, options, groupId, multiple } = attributes;
  const blockProps = useBlockProps.save({
    'data-required': required ? 'true' : 'false',
    'data-multiple': multiple ? 'true' : 'false',
    'data-help-text': helpText,
  });
  return (
    <div {...blockProps}>
      <RichText.Content
        tagName="label"
        className="sf-buttons-main-label"
        value={label}
      />
      <div className="sf-buttons-group" data-group-id={groupId}>
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            className="btn btn-primary"
            data-value={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <input type="hidden" name={groupId} required={required} />
    </div>
  );
};

export default Save;
