import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<label>{ attributes.label }</label>
			<div className="sf-checkbox-container">
				{/* Outer container with JSON-mapped layout setting */}
				<div
					className={ `sf-checkbox-group sf-checkbox-group-${ attributes.layout || 'horizontal' }` }
					data-layout={ attributes.layout || 'horizontal' }
				>
					{ attributes.options &&
						attributes.options.map( ( option, index ) => {
							const inlineClass = attributes.layout === 'horizontal' ? ' form-check-inline' : '';
							return (
								<div key={ index } className={ `sf-checkbox-option form-check${ inlineClass }` }>
									<input
										className="form-check-input"
										type="checkbox"
										id={ `${ attributes.groupId }-${ index }` }
										name={ attributes.groupId }
										required={ attributes.required }
									/>
									<label className="form-check-label" htmlFor={ `${ attributes.groupId }-${ index }` }>
										{ option.label }
									</label>
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	);
};

export default Save;
