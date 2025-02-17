/**
 * Save component for the SmartForms Text Input block.
 *
 * Outputs a text input field for the front end. It includes the data attributes needed
 * for validation (native pattern and required attributes, plus data attributes for JustValidate if desired).
 *
 * @package SmartForms
 */

import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			<label>{ attributes.label }</label>
			<input
				id={ attributes.inputId }
				type="text"
				placeholder={ attributes.placeholder }
				required={ attributes.required }
				pattern="^(?=.*[A-Za-z0-9]).+$"
				// Data attributes used by the front-end initializer for JustValidate.
				data-validate="true"
				data-validation-message={ attributes.helpText }
				className="smartforms-text-input"
			/>
			{ attributes.helpText && (
				<p style={ { color: '#999', fontSize: '12px', marginTop: '4px' } }>
					{ attributes.helpText }
				</p>
			) }
		</div>
	);
};

export default Save;
