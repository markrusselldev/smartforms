/* eslint-disable jsx-a11y/label-has-associated-control */
import { useBlockProps } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const { label, required } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<label className="sf-text-main-label">{ label }</label>
			<input type="text" className="smartforms-text-input" required={ required } />
		</div>
	);
};

export default Save;
