import { useBlockProps } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const { label, options, required, helpText, groupId } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<label className="sf-buttons-main-label">{ label }</label>
			<div className="sf-buttons-group d-flex flex-wrap gap-2" role="group" data-group-id={ groupId }>
				{ options.map( ( option, index ) => (
					<button
						key={ index }
						type="button"
						className="btn btn-primary"
						data-value={ option.value }
					>
						{ option.label }
					</button>
				) ) }
			</div>
			<input type="hidden" name={ groupId } required={ required } />
		</div>
	);
};

export default Save;
