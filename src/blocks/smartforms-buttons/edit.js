/**
 * Edit component for the SmartForms Button Group dynamic block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Toggling required status.
 * - Enabling/disabling multiple selections.
 * - Editing the help text.
 * - Managing the button options.
 *
 * The help text field now lets the user leave it blank (i.e. no automatic default value is forced).
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

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

	// Initialize groupId and default options if not already set.
	useEffect(() => {
		if (!groupId) {
			setAttributes({ groupId: `sf-buttons-${clientId}` });
		}
		if (!options || !Array.isArray(options) || options.length === 0) {
			setAttributes({ options: DEFAULT_OPTIONS });
		}
	}, [ groupId, options, clientId, setAttributes ]);

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
						onChange={(value) => setAttributes({ helpText: value })}
						placeholder={__( 'Custom help text (optional)', 'smartforms' )}
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
							<Button variant="secondary" onClick={() => removeOption(index)} isSmall>
								{__( 'Remove Option', 'smartforms' )}
							</Button>
						</div>
					))}
					<Button variant="primary" onClick={addOption}>
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
				{helpText}
			</p>
		</div>
	);
};

export default Edit;
