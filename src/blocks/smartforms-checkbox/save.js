/**
 * Save component for the SmartForms Checkbox block.
 *
 * Outputs a checkbox field group for the front end.
 *
 * @package SmartForms
 */

import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	// Include the layout value as a data attribute on the group container.
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<label>{ attributes.label }</label>
			<div className="sf-checkbox-container">
				{/* The group container now includes a data-layout attribute to store the layout value */}
				<div
					className={ `sf-checkbox-group sf-checkbox-group-${ attributes.layout || 'horizontal' }` }
					data-layout={ attributes.layout || 'horizontal' }
				>
					{ attributes.options &&
						attributes.options.map( ( option, index ) => (
							<div key={ index } className="sf-checkbox-option">
								<input
									type="checkbox"
									id={ `${ attributes.groupId }-${ index }` }
									name={ attributes.groupId }
									required={ attributes.required }
								/>
								<label htmlFor={ `${ attributes.groupId }-${ index }` }>{ option.label }</label>
							</div>
						) )
					}
				</div>
			</div>
		</div>
	);
};

export default Save;
