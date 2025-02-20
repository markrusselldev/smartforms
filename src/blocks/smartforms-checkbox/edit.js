/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field with multiple options in the editor,
 * along with InspectorControls for adding, removing, and modifying options.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';

const DEFAULT_OPTIONS = [
	{ label: 'Option 1', value: 'option-1' },
	{ label: 'Option 2', value: 'option-2' }
];

const Edit = ({ attributes, setAttributes, clientId }) => {
	// Ensure the block's outer container has the proper class.
	const blockProps = useBlockProps({ className: 'wp-block-smartforms-checkbox' });

	// Ensure a unique groupId is set.
	useEffect(() => {
		if ( ! attributes.groupId ) {
			setAttributes({ groupId: 'sf-checkbox-' + clientId });
		}
	}, [ attributes.groupId, clientId, setAttributes ]);

	// If no options are provided, use the default options.
	useEffect(() => {
		if ( ! attributes.options || !Array.isArray( attributes.options ) || attributes.options.length === 0 ) {
			setAttributes({ options: DEFAULT_OPTIONS });
		}
	}, [ attributes.options, setAttributes ]);

	/**
	 * Update an option's label and derived value.
	 *
	 * @param {number} index The index of the option.
	 * @param {string} newLabel The new label.
	 */
	const updateOption = ( index, newLabel ) => {
		const newOptions = attributes.options.map( ( option, i ) => {
			if ( i === index ) {
				return {
					label: newLabel,
					value: newLabel.toLowerCase().replace( /\s+/g, '-' )
				};
			}
			return option;
		} );
		setAttributes({ options: newOptions });
	};

	/**
	 * Add a new checkbox option.
	 */
	const addOption = () => {
		const newOptions = [ ...attributes.options, { label: 'New Option', value: 'new-option' } ];
		setAttributes({ options: newOptions });
	};

	/**
	 * Remove an option by index.
	 *
	 * @param {number} index The index to remove.
	 */
	const removeOption = ( index ) => {
		const newOptions = attributes.options.filter( ( _, i ) => i !== index );
		setAttributes({ options: newOptions });
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Checkbox Settings', 'smartforms' ) }>
					<TextControl
						label={ __( 'Group Label', 'smartforms' ) }
						value={ attributes.label }
						onChange={ ( value ) => setAttributes({ label: value }) }
					/>
					<ToggleControl
						label={ __( 'Required', 'smartforms' ) }
						checked={ attributes.required }
						onChange={ ( value ) => setAttributes({ required: value }) }
					/>
					<PanelBody title={ __( 'Checkbox Options', 'smartforms' ) } initialOpen={ true }>
						{ attributes.options &&
							attributes.options.map( ( option, index ) => (
								<Fragment key={ index }>
									<TextControl
										label={ `${ __( 'Option', 'smartforms' ) } ${ index + 1 }` }
										value={ option.label }
										onChange={ ( value ) => updateOption( index, value ) }
									/>
									<Button
										isSecondary
										onClick={ () => removeOption( index ) }
										isSmall
									>
										{ __( 'Remove Option', 'smartforms' ) }
									</Button>
								</Fragment>
							) )
						}
						<Button isPrimary onClick={ addOption }>
							{ __( 'Add Option', 'smartforms' ) }
						</Button>
					</PanelBody>
				</PanelBody>
			</InspectorControls>
			{/* Display the group label */}
			<label>{ attributes.label }</label>
			{/* Render checkbox options in a container */}
			<div className="sf-checkbox-group">
				{ attributes.options &&
					attributes.options.map( ( option, index ) => (
						<div key={ index } className="sf-checkbox-option">
							<input
								type="checkbox"
								id={ `${ attributes.groupId }-${ index }` }
								name={ attributes.groupId }
								required={ attributes.required }
							/>
							<label htmlFor={ `${ attributes.groupId }-${ index }` }>
								{ option.label }
							</label>
						</div>
					) )
				}
			</div>
		</div>
	);
};

export default Edit;
