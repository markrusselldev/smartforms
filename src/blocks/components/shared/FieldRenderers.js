/**
 * FieldRenderers.js
 *
 * Unified React components that replicate your old "input-renderers.js" layout logic.
 * These components use computed classes (via getAlignmentClass) so that both the block editor
 * and frontend share the same markup structure.
 *
 * @package SmartForms
 */

import React from 'react';

/**
 * Returns the appropriate computed class based on fieldAlignment.
 * It returns "sf-input--left", "sf-input--center", or "sf-input--right".
 *
 * @param {string} fieldAlignment - The alignment value.
 * @returns {string} The computed class.
 */
export function getAlignmentClass(fieldAlignment) {
  if (!fieldAlignment) return 'sf-input--left';
  switch (fieldAlignment.toLowerCase()) {
    case 'center':
      return 'sf-input--center';
    case 'right':
      return 'sf-input--right';
    default:
      return 'sf-input--left';
  }
}

/**
 * TextField component
 * Renders a single-line text input.
 */
export function TextField({
  value,
  onChange,
  placeholder = '',
  required = false,
  fieldAlignment = 'left',
}) {
  return (
    <div className={`sf-text-container ${getAlignmentClass(fieldAlignment)}`}>
      <input
        type="text"
        className="form-control sf-text-input"
        placeholder={placeholder}
        required={required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * NumberField component
 * Renders a numeric input with min, max, and step.
 */
export function NumberField({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  required = false,
  fieldAlignment = 'left',
}) {
  return (
    <div className={`sf-number-container ${getAlignmentClass(fieldAlignment)}`}>
      <input
        type="number"
        className="form-control sf-number-input"
        required={required}
        min={min}
        max={max}
        step={step}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * CheckboxGroup component
 * Renders a group of checkboxes using computed alignment classes and Bootstrap 5 flexbox utilities.
 */
export function CheckboxGroup({
  options = [],
  selected = [],
  onChange,
  layout = 'horizontal',
  fieldAlignment = 'left',
  required = false,
}) {
  const handleCheckbox = (val, checked) => {
    let newSelected = [...selected];
    if (checked) {
      newSelected.push(val);
    } else {
      newSelected = newSelected.filter((item) => item !== val);
    }
    onChange(newSelected);
  };
  // Use Bootstrap classes: d-block for vertical, d-flex flex-wrap gap-2 for horizontal.
  const containerClass =
    layout === 'vertical' ? 'd-block' : 'd-flex flex-wrap gap-2';
  return (
    <div
      className={`sf-checkbox-group ${containerClass} ${getAlignmentClass(fieldAlignment)}`}
      data-layout={layout}
    >
      {options.map((opt, index) => {
        const isChecked = selected.includes(opt.value);
        // In horizontal layout, add form-check-inline
        const inlineClass = layout === 'horizontal' ? ' form-check-inline' : '';
        return (
          <div
            key={index}
            className={`sf-checkbox-option form-check${inlineClass}`}
          >
            <input
              type="checkbox"
              className="form-check-input"
              id={`checkbox-${index}`}
              value={opt.value}
              checked={isChecked}
              required={required && index === 0}
              onChange={(e) => handleCheckbox(opt.value, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={`checkbox-${index}`}>
              {opt.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

/**
 * ButtonGroup component
 * Renders a group of buttons for selection.
 */
export function ButtonGroup({
  options = [],
  current,
  onChange,
  multiple = false,
  layout = 'horizontal',
  fieldAlignment = 'left',
  required = false,
}) {
  const handleClick = (val) => {
    if (!multiple) {
      onChange(val === current ? '' : val);
    } else {
      let arr = Array.isArray(current) ? [...current] : [];
      if (arr.includes(val)) {
        arr = arr.filter((item) => item !== val);
      } else {
        arr.push(val);
      }
      onChange(arr);
    }
  };
  const isActive = (val) => {
    if (!multiple) return val === current;
    return Array.isArray(current) && current.includes(val);
  };
  return (
    <div
      className={`sf-buttons-group ${getAlignmentClass(fieldAlignment)}`}
      data-layout={layout}
    >
      {options.map((opt, index) => (
        <button
          key={index}
          type="button"
          className={`btn btn-primary ${isActive(opt.value) ? 'active' : ''}`}
          data-value={opt.value}
          onClick={() => handleClick(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/**
 * SliderField component
 * Renders a slider with min, max, step, and an output showing the current value.
 * Optionally displays a unit before or after the number.
 */
export function SliderField({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  unitPosition = 'after',
  required = false,
  fieldAlignment = 'left',
}) {
  const numericValue =
    typeof value === 'number' ? value : parseFloat(value) || min;
  const handleChange = (val) => {
    onChange(parseFloat(val));
  };
  return (
    <div className={`sf-slider-container ${getAlignmentClass(fieldAlignment)}`}>
      <div
        className="sf-slider-row d-flex align-items-center"
        style={{ gap: '1rem' }}
      >
        <span className="sf-slider-min">{min}</span>
        <input
          type="range"
          className="form-range sf-slider-input"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          required={required}
          onChange={(e) => handleChange(e.target.value)}
        />
        <span className="sf-slider-max">{max}</span>
      </div>
      <div className="sf-slider-output" style={{ marginTop: '4px' }}>
        {unit
          ? unitPosition === 'before'
            ? `${unit} ${numericValue}`
            : `${numericValue} ${unit}`
          : numericValue}
      </div>
    </div>
  );
}

/**
 * DropdownField component
 * Renders a select dropdown. If a placeholder is provided, it is rendered as a disabled option.
 */
export function DropdownField({
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  fieldAlignment = 'left',
}) {
  return (
    <div
      className={`sf-dropdown-container ${getAlignmentClass(fieldAlignment)}`}
    >
      <select
        className="sf-dropdown-input form-select"
        required={required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * RadioGroup component
 * Renders a set of radio buttons.
 */
export function RadioGroup({
  value,
  onChange,
  options = [],
  layout = 'horizontal',
  fieldAlignment = 'left',
  required = false,
}) {
  const isHorizontal = layout === 'horizontal';
  return (
    <div
      className={`sf-radio-group ${getAlignmentClass(fieldAlignment)}`}
      data-layout={layout}
    >
      {options.map((opt, index) => (
        <div
          key={index}
          className={`sf-radio-option form-check${isHorizontal ? ' form-check-inline' : ''}`}
        >
          <input
            type="radio"
            className="form-check-input"
            id={`radio-${index}`}
            required={required && index === 0}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <label className="form-check-label" htmlFor={`radio-${index}`}>
            {opt.label}
          </label>
        </div>
      ))}
    </div>
  );
}

/**
 * TextareaField component
 * Renders a multi-line textarea.
 */
export function TextareaField({
  value,
  onChange,
  placeholder = '',
  required = false,
  fieldAlignment = 'left',
}) {
  return (
    <div
      className={`sf-textarea-container ${getAlignmentClass(fieldAlignment)}`}
    >
      <textarea
        className="form-control sf-textarea"
        rows={4}
        placeholder={placeholder}
        required={required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
