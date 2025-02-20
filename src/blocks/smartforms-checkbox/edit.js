/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field with multiple options in the editor,
 * along with InspectorControls to add, remove, and modify options.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, clientId }) => {
	// Force the class "wp-block-smartforms-checkbox" to ensure our editor styles are applied.
	const blockProps = useBlockProps({ className: 'wp-block-smartforms-checkbox' });
	
	// Generate a unique groupId for this block instance if not already set.
	useEffect(() => {
		if ( ! attributes.groupId ) {
			setAttributes({ groupId: 'sf-checkbox-' + clientId });
		}
	}, [ attributes.groupId, clientId, setAttributes ]);
	
	// Update an option's label and derived value.
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

	// Add a new option.
	const addOption = () => {
		const newOptions = [ ...attributes.options, { label: 'New Option', value: 'new-option' } ];
		setAttributes({ options: newOptions });
	};

	// Remove an option.
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
						{ attributes.options.map( ( option, index ) => (
							<Fragment key={ index }>
								<TextControl
									label={ `${__( 'Option', 'smartforms' )} ${ index + 1 }` }
									value={ option.label }
									onChange={ ( value ) => updateOption( index, value ) }
								/>
								<Button isSecondary onClick={ () => removeOption( index ) } isSmall>
									{ __( 'Remove Option', 'smartforms' ) }
								</Button>
							</Fragment>
						) ) }
						<Button isPrimary onClick={ addOption }>
							{ __( 'Add Option', 'smartforms' ) }
						</Button>
					</PanelBody>
				</PanelBody>
			</InspectorControls>
			{/* Display the group label */}
			<label>{ attributes.label }</label>
			{/* Render checkbox options in a container for grid layout */}
			<div className="sf-checkbox-group">
				{ attributes.options.map( ( option, index ) => (
					<div key={ index } className="sf-checkbox-option">
						<input
							type="checkbox"
							id={ `${ attributes.groupId }-${ index }` }
							name={ attributes.groupId }
							required={ attributes.required }
						/>
						<label htmlFor={ `${ attributes.groupId }-${ index }` }>{ option.label }</label>
					</div>
				) ) }
			</div>
		</div>
	);
};

export default Edit;
