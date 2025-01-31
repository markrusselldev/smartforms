/**
 * Index file for the Form block.
 *
 * Registers the parent Form block and handles state management for the editor.
 *
 * @package SmartForms
 */

/* global wp */
import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

// Import the shared hook from src/hooks (update the relative path if needed)
import { useFormState } from '../../src/hooks/useFormState';

// Import the block’s edit and save components.
import FormEdit from './edit';
import FormSave from './save';

import './editor.scss';
import './style.scss';

registerBlockType( 'smartforms/form', {
	/**
	 * Block title.
	 */
	title: __( 'SmartForms Form', 'smartforms' ),
	/**
	 * Block icon.
	 */
	icon: 'feedback',
	/**
	 * Block category.
	 */
	category: 'widgets',
	/**
	 * Block attributes.
	 */
	attributes: {
		formTitle: {
			type: 'string',
			default: __( 'SmartForms Form', 'smartforms' ),
		},
		// ... preserve any additional attributes as originally defined ...
	},
	/**
	 * Edit function.
	 *
	 * Uses React state management to maintain local form state.
	 *
	 * @param {Object} props Block properties.
	 * @return {WPElement} Element to render in the editor.
	 */
	edit: ( props ) => {
		const { attributes, setAttributes } = props;
		// Initialize local state with the formTitle attribute.
		const [ formState, setFormState ] = useState( {
			title: attributes.formTitle,
			// ... any additional state properties ...
		} );

		// Synchronize state when attributes change.
		useEffect( () => {
			setFormState( {
				...formState,
				title: attributes.formTitle,
			} );
		}, [ attributes.formTitle ] );

		// Optionally enhance state via the shared hook.
		const enhancedState = useFormState( formState );

		// Pass all props along with state and state setter to the edit component.
		return <FormEdit { ...props } formState={ enhancedState } setFormState={ setFormState } />;
	},
	/**
	 * Save function.
	 *
	 * For dynamic blocks, the front-end output is rendered via PHP.
	 *
	 * @param {Object} props Block properties.
	 * @return {WPElement} Element saved to the post content.
	 */
	save: FormSave,
} );
