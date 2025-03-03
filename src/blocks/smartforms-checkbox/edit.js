/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field group for the editor with InspectorControls
 * to add, remove, and modify options, and implements inline editing (via RichText)
 * for the main label.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';

const DEFAULT_OPTIONS = [
	{ label: 'Option 1', value: 'option-1' },
	{ label: 'Option 2', value: 'option-2' }
];

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const { label, helpText, required, options, groupId, layout } = attributes;
	const blockProps = useBlockProps();

	useEffect( () => {
		if ( ! groupId ) {
			setAttributes( { groupId: `sf-checkbox-${ clientId }` } );
		}
		if ( ! layout ) {
			setAttributes( { layout: 'horizontal' } );
		}
		if ( ! options || ! Array.isArray( options ) || options.length === 0 ) {
			setAttributes( { options: DEFAULT_OPTIONS } );
		}
	}, [ groupId, layout, options, clientId, setAttributes ] );

	/**
	 * Updates an option's label and derived value.
	 *
	 * @param { number } index - The index of the option.
	 * @param { string } newLabel - The new label.
	 */
	const updateOption = ( index, newLabel ) => {
		const newOptions = options.map( ( option, i ) => {
			if ( i === index ) {
				return {
					label: newLabel,
					value: newLabel.toLowerCase().replace( /\s+/g, '-' )
				};
			}
			return option;
		} );
		setAttributes( { options: newOptions } );
	};

	/**
	 * Adds a new checkbox option.
	 *
	 * Automatically assigns a sequential label "Option N" based on the current highest option number.
	 */
	const addOption = () => {
		let maxNumber = 0;
		options.forEach( ( option ) => {
			const match = option.label.match( /^Option (\d+)$/ );
			if ( match ) {
				const num = parseInt( match[ 1 ], 10 );
				if ( num > maxNumber ) {
					maxNumber = num;
				}
			}
		} );
		const newLabel = `Option ${ maxNumber + 1 }`;
		const newValue = newLabel.toLowerCase().replace( /\s+/g, '-' );
		const newOptions = [ ...options, { label: newLabel, value: newValue } ];
		setAttributes( { options: newOptions } );
	};

	/**
	 * Removes an option by its index.
	 *
	 * @param { number } index - The index to remove.
	 */
	const removeOption = ( index ) => {
		const newOptions = options.filter( ( _, i ) => i !== index );
		setAttributes( { options: newOptions } );
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( "Checkbox Settings", "smartforms" ) }>
					<SelectControl
						label={ __( "Layout", "smartforms" ) }
						value={ layout }
						options={ [
							{ label: __( "Horizontal", "smartforms" ), value: "horizontal" },
							{ label: __( "Vertical", "smartforms" ), value: "vertical" }
						] }
						onChange={ ( value ) => setAttributes( { layout: value } ) }
					/>
					<ToggleControl
						label={ __( "Required", "smartforms" ) }
						checked={ required }
						onChange={ ( value ) => setAttributes( { required: value } ) }
					/>
					<TextControl
						label={ __( "Help Text", "smartforms" ) }
						value={ helpText }
						onChange={ ( value ) => setAttributes( { helpText: value } ) }
						placeholder={ __( "Enter your help text", "smartforms" ) }
					/>
				</PanelBody>
				<PanelBody title={ __( "Checkbox Options", "smartforms" ) } initialOpen={ true }>
					{ options &&
						options.map( ( option, index ) => (
							<Fragment key={ index }>
								<TextControl
									label={ `${ __( "Option", "smartforms" ) } ${ index + 1 }` }
									value={ option.label }
									onChange={ ( value ) => updateOption( index, value ) }
								/>
								<Button isSecondary onClick={ () => removeOption( index ) } isSmall>
									{ __( "Remove Option", "smartforms" ) }
								</Button>
							</Fragment>
						) )
					}
					<Button isPrimary onClick={ addOption }>
						{ __( "Add Option", "smartforms" ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			{/* Editable question prompt */}
			<RichText
				tagName="label"
				className="sf-checkbox-main-label"
				value={ label }
				onChange={ ( value ) => setAttributes( { label: value } ) }
				placeholder={ __( "Type your question here...", "smartforms" ) }
			/>
			<div
				className={ `sf-checkbox-group sf-checkbox-group-${ layout || "horizontal" }` }
				data-layout={ layout || "horizontal" }
			>
				{ options &&
					options.map( ( option, index ) => (
						<div key={ index } className={ `sf-checkbox-option form-check${ layout === "horizontal" ? " form-check-inline" : "" }` }>
							<input
								className="form-check-input"
								type="checkbox"
								id={ `${ groupId }-${ index }` }
								name={ groupId }
								required={ required }
							/>
							<label className="form-check-label" htmlFor={ `${ groupId }-${ index }` }>
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
