/**
 * Edit component for the SmartForms Button Group block.
 *
 * Renders a button group for rapid selection, including InspectorControls
 * for adjusting options, help text, required state, an editable question prompt,
 * and a toggle for allowing multiple selections.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';

const DEFAULT_OPTIONS = [
	{ label: 'Option 1', value: 'option-1' },
	{ label: 'Option 2', value: 'option-2' }
];

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const { label, helpText, required, options, groupId, multiple } = attributes;
	const blockProps = useBlockProps();

	// Initialize groupId and default options if missing.
	useEffect( () => {
		if ( ! groupId ) {
			setAttributes( { groupId: `sf-buttons-${ clientId }` } );
		}
		if ( ! options || ! Array.isArray( options ) || options.length === 0 ) {
			setAttributes( { options: DEFAULT_OPTIONS } );
		}
	}, [ groupId, options, clientId, setAttributes ] );

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
	 * Adds a new button option.
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

	/**
	 * Renders the button group.
	 * In single-select mode (multiple false), only one button is active at a time.
	 * In multi-select mode, multiple buttons can be active.
	 * The current selection is stored in a temporary attribute "currentAnswer"
	 * (for single-select, a string; for multi-select, an array).
	 */
	const renderButtons = () => {
		return (
			<div className="sf-buttons-group d-flex flex-wrap gap-2" role="group" data-group-id={ groupId }>
				{ options.map( ( option, index ) => {
					let isActive = false;
					if ( multiple ) {
						isActive = Array.isArray( attributes.currentAnswer ) && attributes.currentAnswer.includes( option.value );
					} else {
						isActive = attributes.currentAnswer === option.value;
					}
					return (
						<button
							key={ index }
							type="button"
							className={ `btn btn-primary ${ isActive ? "active" : "" }` }
							data-value={ option.value }
							onClick={ () => {
								if ( multiple ) {
									let newSelection = Array.isArray( attributes.currentAnswer )
										? [ ...attributes.currentAnswer ]
										: [];
									if ( newSelection.includes( option.value ) ) {
										newSelection = newSelection.filter( val => val !== option.value );
									} else {
										newSelection.push( option.value );
									}
									setAttributes( { currentAnswer: newSelection } );
								} else {
									setAttributes( { currentAnswer: option.value } );
								}
							} }
						>
							{ option.label }
						</button>
					);
				} ) }
			</div>
		);
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( "Button Group Settings", "smartforms" ) }>
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
					<ToggleControl
						label={ __( "Allow multiple selections", "smartforms" ) }
						checked={ multiple }
						onChange={ ( value ) =>
							setAttributes( { multiple: value, currentAnswer: value ? [] : null } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( "Button Options", "smartforms" ) } initialOpen={ true }>
					{ options.map( ( option, index ) => (
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
					) ) }
					<Button isPrimary onClick={ addOption }>
						{ __( "Add Option", "smartforms" ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			{/* Editable question prompt */}
			<RichText
				tagName="label"
				className="sf-buttons-main-label"
				value={ label }
				onChange={ ( value ) => setAttributes( { label: value } ) }
				placeholder={ __( "Type your question here...", "smartforms" ) }
			/>
			{ renderButtons() }
		</div>
	);
};

export default Edit;
