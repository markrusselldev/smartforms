/**
 * Returns the appropriate Bootstrap justification class based on the provided alignment.
 *
 * @param {string} alignment - The field alignment (left, center, right).
 * @returns {string} The corresponding Bootstrap class.
 */
const getJustifyClass = (alignment) =>
  alignment === 'center'
    ? 'justify-content-center'
    : alignment === 'right'
      ? 'justify-content-end'
      : 'justify-content-start';

/**
 * Creates an input control element based on the provided field configuration.
 * For each field type, we produce a structure that matches your block classes:
 *
 * <div class="sf-field-wrapper">
 *   <div class="sf-input-container">
 *     <div class="sf-[field-type]-container">...</div>
 *   </div>
 * </div>
 *
 * NOTE: We removed the appended <p class="sf-field-help"> so as not to
 * duplicate the help text that already appears in the submit button row.
 *
 * @param {Object}   field                   - Field configuration (type, placeholder, min, max, layout, etc.).
 * @param {Function} updateSubmitButtonState - Callback to enable/disable the submit button based on input.
 * @returns {HTMLElement} The outer .sf-field-wrapper element containing the actual input(s).
 */
export function createInputControl(field, updateSubmitButtonState) {
  const wrapper = document.createElement('div');
  wrapper.className = 'sf-field-wrapper';

  // The .sf-input-container encloses the core UI for the field.
  const inputContainer = document.createElement('div');
  inputContainer.className = 'sf-input-container';

  let specificContainer; // This will be a .sf-*-container

  switch (field.type) {
    case 'text': {
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-text-container';

      const inputEl = document.createElement('input');
      inputEl.type = 'text';
      inputEl.className = 'form-control sf-text-input';
      inputEl.placeholder = field.placeholder || 'Type your answer here...';

      inputEl.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(inputEl);
      break;
    }

    case 'number': {
      const justifyClass = getJustifyClass(field.fieldAlignment);
      inputContainer.classList.add('d-flex', justifyClass);

      specificContainer = document.createElement('div');

      const inputEl = document.createElement('input');
      inputEl.type = 'number';
      inputEl.className = 'form-control sf-number-input';
      if (typeof field.min !== 'undefined') {
        inputEl.min = field.min;
      }
      if (typeof field.max !== 'undefined') {
        inputEl.max = field.max;
      }
      if (typeof field.step !== 'undefined') {
        inputEl.step = field.step;
      }
      inputEl.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(inputEl);
      break;
    }

    case 'checkbox': {
      const checkboxLayout = field.layout || 'horizontal';
      specificContainer = document.createElement('div');
      specificContainer.className =
        'sf-checkbox-group sf-checkbox-group-' + checkboxLayout;
      specificContainer.setAttribute('data-layout', checkboxLayout);

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt, index) => {
          const optionWrapper = document.createElement('div');
          const inlineClass =
            checkboxLayout === 'horizontal' ? ' form-check-inline' : '';
          optionWrapper.className =
            'sf-checkbox-option form-check' + inlineClass;

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'form-check-input';
          checkbox.value = opt.value;
          checkbox.id = `cb-${index}-${(opt.value || '').replace(/\s+/g, '-')}`;

          const label = document.createElement('label');
          label.className = 'form-check-label';
          label.htmlFor = checkbox.id;
          label.textContent = opt.label;

          checkbox.addEventListener('change', () => {
            const selected = Array.from(
              specificContainer.querySelectorAll("input[type='checkbox']"),
            )
              .filter((cb) => cb.checked)
              .map((cb) => cb.value);
            updateSubmitButtonState(field, selected);
          });

          optionWrapper.appendChild(checkbox);
          optionWrapper.appendChild(label);
          specificContainer.appendChild(optionWrapper);
        });
      }
      const justifyClassCheckbox = getJustifyClass(field.fieldAlignment);
      inputContainer.classList.add('d-flex', justifyClassCheckbox);
      break;
    }

    case 'buttons': {
      specificContainer = document.createElement('div');
      if (field.layout === 'vertical') {
        specificContainer.className =
          'sf-buttons-group sf-buttons-group--vertical';
        specificContainer.setAttribute('data-layout', 'vertical');
      } else {
        specificContainer.className =
          'sf-buttons-group sf-buttons-group--horizontal d-flex flex-wrap gap-2';
        specificContainer.setAttribute('data-layout', 'horizontal');
      }

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn-primary';
          btn.setAttribute('data-value', opt.value);
          btn.textContent = opt.label;

          btn.addEventListener('click', () => {
            if (field.multiple) {
              btn.classList.toggle('active');
              const activeButtons =
                specificContainer.querySelectorAll('button.active');
              const values = Array.from(activeButtons).map((b) =>
                b.getAttribute('data-value'),
              );
              updateSubmitButtonState(field, values);
            } else {
              Array.from(specificContainer.children).forEach((child) =>
                child.classList.remove('active'),
              );
              if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                updateSubmitButtonState(field, null);
              } else {
                btn.classList.add('active');
                updateSubmitButtonState(field, opt.value);
              }
            }
          });

          specificContainer.appendChild(btn);
        });
      }
      const justifyClassButtons = getJustifyClass(field.fieldAlignment);
      inputContainer.classList.add('d-flex', justifyClassButtons);
      break;
    }

    case 'slider': {
      // Create a container for the entire slider UI
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-slider-container';

      // A row for min -> slider -> max
      const row = document.createElement('div');
      row.className = 'sf-slider-row d-flex align-items-center';
      row.style.gap = '1rem';

      const minEl = document.createElement('span');
      minEl.className = 'sf-slider-min';
      minEl.textContent = field.min ?? 0;

      const sliderEl = document.createElement('input');
      sliderEl.type = 'range';
      sliderEl.className = 'form-range sf-slider-input';
      sliderEl.min = field.min ?? 0;
      sliderEl.max = field.max ?? 100;
      sliderEl.step = field.step ?? 1;

      // If defaultValue isn't set, pick midpoint
      if (typeof field.defaultValue === 'number') {
        sliderEl.value = field.defaultValue;
      } else {
        sliderEl.value = (Number(sliderEl.min) + Number(sliderEl.max)) / 2;
      }

      const maxEl = document.createElement('span');
      maxEl.className = 'sf-slider-max';
      maxEl.textContent = field.max ?? 100;

      // Put min, slider, max into that row
      row.appendChild(minEl);
      row.appendChild(sliderEl);
      row.appendChild(maxEl);

      // An output area below the row
      const outputEl = document.createElement('div');
      outputEl.className = 'sf-slider-output';
      outputEl.style.textAlign = 'center';

      // Initialize the output text
      if (field.unit) {
        outputEl.textContent =
          field.unitPosition === 'before'
            ? `${field.unit} ${sliderEl.value}`
            : `${sliderEl.value} ${field.unit}`;
      } else {
        outputEl.textContent = sliderEl.value;
      }

      // On slider input, update the text
      sliderEl.addEventListener('input', (e) => {
        const val = e.target.value;
        if (field.unit) {
          outputEl.textContent =
            field.unitPosition === 'before'
              ? `${field.unit} ${val}`
              : `${val} ${field.unit}`;
        } else {
          outputEl.textContent = val;
        }
        // Let the form logic know the new value
        updateSubmitButtonState(field, val);
      });

      specificContainer.appendChild(row);
      specificContainer.appendChild(outputEl);

      // Field alignment fix at the end
      const justifyClassSlider = getJustifyClass(field.fieldAlignment);
      inputContainer.classList.add('d-flex', justifyClassSlider);

      break;
    }

    case 'dropdown': {
      const justifyClass = getJustifyClass(field.fieldAlignment);
      inputContainer.classList.add('d-flex', justifyClass);
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-dropdown-container';

      const selectEl = document.createElement('select');
      selectEl.className = 'sf-dropdown-input form-select';

      const effectivePlaceholder =
        field.placeholder && field.placeholder.trim() !== ''
          ? field.placeholder
          : 'Select an option';

      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = effectivePlaceholder;
      selectEl.appendChild(placeholderOption);

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value || opt;
          option.textContent = opt.label || opt;
          selectEl.appendChild(option);
        });
      }

      selectEl.value = '';
      selectEl.addEventListener('change', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(selectEl);
      break;
    }

    case 'radio': {
      specificContainer = document.createElement('div');
      const isHorizontal = !field.layout || field.layout === 'horizontal';

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt, index) => {
          const radioWrapper = document.createElement('div');
          radioWrapper.className =
            'sf-radio-option form-check' +
            (isHorizontal ? ' form-check-inline' : '');

          const radioEl = document.createElement('input');
          radioEl.type = 'radio';
          radioEl.className = 'form-check-input';
          radioEl.value = opt.value || opt;
          radioEl.id = `radio-${index}-${(opt.value || '').replace(/\s+/g, '-')}`;
          radioEl.name = field.groupName || 'sf-radio-group';
          radioEl.required = field.required;

          const labelEl = document.createElement('label');
          labelEl.className = 'form-check-label';
          labelEl.htmlFor = radioEl.id;
          labelEl.textContent = opt.label || opt;

          radioEl.addEventListener('change', () => {
            updateSubmitButtonState(field, radioEl.value);
          });

          radioWrapper.appendChild(radioEl);
          radioWrapper.appendChild(labelEl);
          specificContainer.appendChild(radioWrapper);
        });
      }
      const justifyClassRadio = getJustifyClass(field.fieldAlignment);
      inputContainer.classList.add('d-flex', justifyClassRadio);
      break;
    }

    case 'textarea': {
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-textarea-container';

      const textarea = document.createElement('textarea');
      textarea.className = 'form-control sf-textarea';
      textarea.rows = 4;
      textarea.placeholder = field.placeholder || 'Type your answer here...';

      textarea.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(textarea);
      break;
    }

    default: {
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-default-container';

      const fallback = document.createElement('textarea');
      fallback.className = 'form-control sf-default-textarea';
      fallback.rows = 4;
      fallback.placeholder = field.placeholder || 'Type your answer here...';

      fallback.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(fallback);
      break;
    }
  }

  inputContainer.appendChild(specificContainer);
  wrapper.appendChild(inputContainer);
  return wrapper;
}

/**
 * Replaces the current input control within a container with the provided new control.
 * This is used in smartforms-chat.js to swap out the old input for the next field’s wrapper.
 *
 * @param {HTMLElement} container - The container holding the existing input control.
 * @param {HTMLElement} newControl - The new input control element.
 */
export function replaceInputControl(container, newControl) {
  if (container.firstElementChild) {
    container.firstElementChild.remove();
  }
  container.insertBefore(newControl, container.firstElementChild);
}
