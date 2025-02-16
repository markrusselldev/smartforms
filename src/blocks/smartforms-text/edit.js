/**
 * Edit component for the SmartForms Text Input block.
 *
 * Renders an actual text input field in the editor along with InspectorControls
 * for adjusting the field's settings.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();

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
				type="text"
				placeholder={ attributes.placeholder }
				required={ attributes.required }
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
