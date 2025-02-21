/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field with multiple options in the editor,
 * along with InspectorControls to add, remove, and modify options,
 * and a setting to choose horizontal or vertical layout.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';

const DEFAULT_OPTIONS = [
	{ label: 'Option 1', value: 'option-1' },
	{ label: 'Option 2', value: 'option-2' }
];

const Edit = ({ attributes, setAttributes, clientId }) => {
	// Ensure the block's outer container gets the proper class.
	const blockProps = useBlockProps({ className: 'wp-block-smartforms-checkbox' });

	// Ensure a unique groupId is set and a layout is defined.
	useEffect(() => {
		if ( ! attributes.groupId ) {
			setAttributes({ groupId: 'sf-checkbox-' + clientId });
		}
		if ( typeof attributes.layout === 'undefined' || ! attributes.layout ) {
			setAttributes({ layout: 'horizontal' });
		}
	}, [ attributes.groupId, attributes.layout, clientId, setAttributes ]);

	// Set default options if none exist.
	useEffect(() => {
		if ( ! attributes.options || ! Array.isArray( attributes.options ) || attributes.options.length === 0 ) {
			setAttributes({ options: DEFAULT_OPTIONS });
		}
	}, [ attributes.options, setAttributes ]);

	/**
	 * Updates an option's label and derived value.
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
	 * Adds a new checkbox option.
	 */
	const addOption = () => {
		const newOptions = [ ...attributes.options, { label: 'New Option', value: 'new-option' } ];
		setAttributes({ options: newOptions });
	};

	/**
	 * Removes an option by its index.
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
					<SelectControl
						label={ __( 'Layout', 'smartforms' ) }
						value={ attributes.layout }
						options={ [
							{ label: __( 'Horizontal', 'smartforms' ), value: 'horizontal' },
							{ label: __( 'Vertical', 'smartforms' ), value: 'vertical' }
						] }
						onChange={ ( value ) => setAttributes({ layout: value }) }
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
									<Button isSecondary onClick={ () => removeOption( index ) } isSmall>
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
			<label>{ attributes.label }</label>
			{/* The group container gets a modifier class based on layout */}
			<div className={ `sf-checkbox-group sf-checkbox-group-${ attributes.layout }` }>
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
	);
};

export default Edit;
