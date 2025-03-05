/**
 * Edit component for the SmartForms Button Group dynamic block.
 *
 * This component renders the block in the editor with InspectorControls for:
 * - Toggling whether the field is required.
 * - Enabling/disabling multiple selections.
 * - Editing the help text.
 * - Managing the button options.
 *
 * On initial mount (and whenever the "multiple" setting changes),
 * if the helpText attribute is empty or matches the previous computed default,
 * it is automatically updated to the computed default based on the "multiple" attribute:
 * - "Select one option" when multiple is false.
 * - "Select one or more options" when multiple is true.
 *
 * If the user edits the helpText field, that value is preserved.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

const DEFAULT_OPTIONS = [
	{ label: 'Option 1', value: 'option-1' },
	{ label: 'Option 2', value: 'option-2' }
];

const Edit = ({ attributes, setAttributes, clientId }) => {
	const { label, required, helpText, options, groupId, multiple, currentAnswer } = attributes;
	const blockProps = useBlockProps({
		"data-required": required ? "true" : "false",
		"data-multiple": multiple ? "true" : "false",
		"data-help-text": helpText
	});

	// Local state to track if the helpText field has been manually edited.
	const [ helpTextEdited, setHelpTextEdited ] = useState(false);
	// Local state to store the previously computed default.
	const [ computedDefaultPrev, setComputedDefaultPrev ] = useState("");

	// Compute the default help text based on the "multiple" attribute.
	const computedDefault = multiple ? "Select one or more options" : "Select one option";

	// Initialize groupId and default options if not already set.
	useEffect(() => {
		if (!groupId) {
			setAttributes({ groupId: `sf-buttons-${clientId}` });
		}
		if (!options || !Array.isArray(options) || options.length === 0) {
			setAttributes({ options: DEFAULT_OPTIONS });
		}
	}, [groupId, options, clientId, setAttributes]);

	// On mount, if helpText is empty, set it to the computed default.
	useEffect(() => {
		if (!helpTextEdited && helpText === "") {
			setAttributes({ helpText: computedDefault });
		}
		setComputedDefaultPrev(computedDefault);
		// We run this only once on mount.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// When "multiple" changes, if the helpText is either empty or still equals the previously computed default,
	// update it to the new computed default.
	useEffect(() => {
		if (!helpTextEdited || helpText === computedDefaultPrev) {
			setAttributes({ helpText: computedDefault });
		}
		setComputedDefaultPrev(computedDefault);
	}, [multiple, computedDefault, helpText, helpTextEdited, setAttributes]);

	/**
	 * Update an option’s label and corresponding value.
	 *
	 * @param {number} index - The option index.
	 * @param {string} newLabel - The new label.
	 */
	const updateOption = (index, newLabel) => {
		const newOptions = options.map((option, i) => {
			if (i === index) {
				return {
					label: newLabel,
					value: newLabel.toLowerCase().replace(/\s+/g, '-')
				};
			}
			return option;
		});
		setAttributes({ options: newOptions });
	};

	/**
	 * Adds a new button option.
	 */
	const addOption = () => {
		let maxNumber = 0;
		options.forEach((option) => {
			const match = option.label.match(/^Option (\d+)$/);
			if (match) {
				const num = parseInt(match[1], 10);
				if (num > maxNumber) {
					maxNumber = num;
				}
			}
		});
		const newLabel = `Option ${maxNumber + 1}`;
		const newValue = newLabel.toLowerCase().replace(/\s+/g, '-');
		const newOptions = [...options, { label: newLabel, value: newValue }];
		setAttributes({ options: newOptions });
	};

	/**
	 * Removes a button option.
	 *
	 * @param {number} index - The index to remove.
	 */
	const removeOption = (index) => {
		const newOptions = options.filter((_, i) => i !== index);
		setAttributes({ options: newOptions });
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__( 'Button Group Settings', 'smartforms' )}>
					<ToggleControl
						label={__( 'Required', 'smartforms' )}
						checked={required}
						onChange={(value) => setAttributes({ required: value })}
					/>
					<ToggleControl
						label={__( 'Allow Multiple Selections', 'smartforms' )}
						checked={multiple}
						onChange={(value) =>
							setAttributes({ multiple: value, currentAnswer: value ? [] : '' })
						}
					/>
					<TextControl
						label={__( 'Help Text', 'smartforms' )}
						value={helpText}
						onChange={(value) => {
							setAttributes({ helpText: value });
							setHelpTextEdited(true);
						}}
						placeholder={__( 'Enter custom help text (leave blank for default)', 'smartforms' )}
					/>
				</PanelBody>
				<PanelBody title={__( 'Button Options', 'smartforms' )} initialOpen={true}>
					{options.map((option, index) => (
						<div key={index} style={{ marginBottom: '8px' }}>
							<TextControl
								label={`${__( 'Option', 'smartforms' )} ${index + 1}`}
								value={option.label}
								onChange={(value) => updateOption(index, value)}
							/>
							<Button isSecondary onClick={() => removeOption(index)} isSmall>
								{__( 'Remove Option', 'smartforms' )}
							</Button>
						</div>
					))}
					<Button isPrimary onClick={addOption}>
						{__( 'Add Option', 'smartforms' )}
					</Button>
				</PanelBody>
			</InspectorControls>
			<RichText
				tagName="label"
				className="sf-buttons-main-label"
				value={label}
				onChange={(value) => setAttributes({ label: value })}
				placeholder={__( 'Type your question here…', 'smartforms' )}
			/>
			<div className="sf-buttons-group" data-group-id={groupId}>
				{options.map((option, index) => (
					<button
						key={index}
						type="button"
						className={
							`btn btn-primary ` +
							(multiple
								? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
									? 'active'
									: ''
								: currentAnswer === option.value
								? 'active'
								: '')
						}
						data-value={option.value}
						onClick={() => {
							if (multiple) {
								let newSelection = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
								if (newSelection.includes(option.value)) {
									newSelection = newSelection.filter((val) => val !== option.value);
								} else {
									newSelection.push(option.value);
								}
								setAttributes({ currentAnswer: newSelection });
							} else {
								setAttributes({ currentAnswer: option.value });
							}
						}}
					>
						{option.label}
					</button>
				))}
			</div>
			<p className="sf-buttons-help-text" style={{ color: '#999' }}>
				{helpText === "" ? (multiple ? "Select one or more options" : "Select one option") : helpText}
			</p>
		</div>
	);
};

export default Edit;
