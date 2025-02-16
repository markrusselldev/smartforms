/**
 * Save component for the SmartForms Text Input block.
 *
 * Outputs a text input field for the front end.
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
				type="text"
				placeholder={ attributes.placeholder }
				required={ attributes.required }
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
