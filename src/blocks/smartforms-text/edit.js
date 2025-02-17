/**
 * Edit component for the SmartForms Text Input block.
 *
 * Renders a preview of the text input field in the editor along with InspectorControls
 * for adjusting the field's settings.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, clientId }) => {
	const blockProps = useBlockProps();

	// Generate a unique input ID for this block instance if not already set.
	useEffect(() => {
		if ( ! attributes.inputId ) {
			setAttributes({ inputId: 'smartforms-text-' + clientId });
		}
	}, []);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={ __( 'Text Input Settings', 'smartforms' ) }>
					<TextControl
						label={ __( 'Label', 'smartforms' ) }
						value={ attributes.label }
						onChange={ ( value ) => setAttributes({ label: value }) }
					/>
					<TextControl
						label={ __( 'Placeholder', 'smartforms' ) }
						value={ attributes.placeholder }
						onChange={ ( value ) => setAttributes({ placeholder: value }) }
					/>
					<ToggleControl
						label={ __( 'Required', 'smartforms' ) }
						checked={ attributes.required }
						onChange={ ( value ) => setAttributes({ required: value }) }
					/>
					<TextControl
						label={ __( 'Help Text', 'smartforms' ) }
						value={ attributes.helpText }
						onChange={ ( value ) => setAttributes({ helpText: value }) }
						help={ __( 'This hint appears below the field.', 'smartforms' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<label>{ attributes.label }</label>
			<input
				id={ attributes.inputId }
				type="text"
				placeholder={ attributes.placeholder }
				required={ attributes.required }
				// This pattern requires at least one letter or digit.
				pattern="^(?=.*[A-Za-z0-9]).+$"
				// Data attributes for potential front-end initialization.
				data-validate="true"
				data-validation-message={ attributes.helpText }
				className="smartforms-text-input"
			/>
			{ attributes.helpText && (
				<p style={ { color: '#999', fontSize: '12px', marginTop: '4px' } }>
					{ attributes.helpText }
				</p>
			) }
		</div>
	);
};

export default Edit;
