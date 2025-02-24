/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field group for the editor with InspectorControls to add, remove, and modify options,
 * along with a setting to choose horizontal or vertical layout.
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
	const blockProps = useBlockProps();

	// Ensure the block's settings are initialized.
	useEffect(() => {
		if ( ! attributes.groupId ) {
			setAttributes({ groupId: 'sf-checkbox-' + clientId });
		}
		if ( ! attributes.layout ) {
			setAttributes({ layout: 'horizontal' });
		}
		if ( ! attributes.options || !Array.isArray( attributes.options ) || attributes.options.length === 0 ) {
			setAttributes({ options: DEFAULT_OPTIONS });
		}
	}, [ attributes, clientId, setAttributes ]);

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
	 *
	 * Automatically assigns a sequential label "Option N" based on the current highest option number.
	 */
	const addOption = () => {
		let maxNumber = 0;
		attributes.options.forEach( ( option ) => {
			const match = option.label.match( /^Option (\d+)$/ );
			if ( match ) {
				const num = parseInt( match[1], 10 );
				if ( num > maxNumber ) {
					maxNumber = num;
				}
			}
		} );
		const newLabel = `Option ${ maxNumber + 1 }`;
		const newValue = newLabel.toLowerCase().replace( /\s+/g, '-' );
		const newOptions = [ ...attributes.options, { label: newLabel, value: newValue } ];
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
				</PanelBody>
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
			</InspectorControls>
			<label>{ attributes.label }</label>
			{/* Outer container preserved for JSON mapping */}
			<div
				className={ `sf-checkbox-group sf-checkbox-group-${ attributes.layout || 'horizontal' }` }
				data-layout={ attributes.layout || 'horizontal' }
			>
				{ attributes.options &&
					attributes.options.map( ( option, index ) => {
						// Apply Bootstrap classes: always "form-check" and "form-check-inline" if horizontal.
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
	);
};

export default Edit;
