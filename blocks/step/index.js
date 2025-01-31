/**
 * Index file for the Step block.
 *
 * @package SmartForms
 */

/* global wp */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

// Example: import a shared hook (if used) – adjust the relative path accordingly.
import { useStepLogic } from '../../src/hooks/useStepLogic';

import StepEdit from './edit';
import StepSave from './save';

import './editor.scss';
import './style.scss';

registerBlockType( 'smartforms/step', {
	/**
	 * Block title.
	 */
	title: __( 'SmartForms Step', 'smartforms' ),
	/**
	 * Block icon.
	 */
	icon: 'grid-view',
	/**
	 * Block category.
	 */
	category: 'widgets',
	/**
	 * Block attributes.
	 */
	attributes: {
		stepTitle: {
			type: 'string',
			default: '',
		},
		// ... any other attributes remain unchanged ...
	},
	/**
	 * Edit function.
	 *
	 * @param {Object} props Block properties.
	 * @return {WPElement} Editor output.
	 */
	edit: StepEdit,
	/**
	 * Save function.
	 *
	 * @param {Object} props Block properties.
	 * @return {WPElement} Saved output.
	 */
	save: StepSave,
} );
