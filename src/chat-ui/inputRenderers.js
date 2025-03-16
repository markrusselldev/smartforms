/**
 * Creates an input control element based on the provided field configuration.
 * For each field type, we produce a structure that matches your block classes:
 *
 * <div class="sf-field-wrapper">
 *   <div class="sf-input-container">
 *     <div class="sf-...-container OR sf-...-group"> <!-- actual input(s) -->
 *       ...
 *     </div>
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
  // We'll build everything into an outer wrapper and return it.
  const wrapper = document.createElement('div');
  wrapper.className = 'sf-field-wrapper';

  // The .sf-input-container encloses the core UI for the field.
  const inputContainer = document.createElement('div');
  inputContainer.className = 'sf-input-container';

  let specificContainer; // This will be a .sf-*-container or .sf-*-group, etc.

  switch (field.type) {
    case 'text': {
      // For text fields, we'll do <div class="sf-text-container"><input type="text" ...></div>
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
      // For number fields, we do <div class="sf-number-container"><input type="number" ...></div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-number-container';

      const inputEl = document.createElement('input');
      inputEl.type = 'number';
      inputEl.className = 'form-control sf-number-input';

      // If the block JSON includes min, max, step, etc.
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
      // <div class="sf-checkbox-group"> multiple <input type="checkbox" ...> </div>
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
      break;
    }

    case 'buttons': {
      // <div class="sf-buttons-group [horizontal or vertical]"> multiple <button ...> </div>
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
      break;
    }

    case 'slider': {
      // <div class="sf-slider-container"><input type="range" ...></div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-slider-container';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'sf-slider-input';

      // If min, max, step are present in your saved block JSON
      if (typeof field.min !== 'undefined') {
        slider.min = field.min;
      }
      if (typeof field.max !== 'undefined') {
        slider.max = field.max;
      }
      if (typeof field.step !== 'undefined') {
        slider.step = field.step;
      }

      slider.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(slider);
      break;
    }

    case 'select': {
      // <div class="sf-select-container"><select ...> <option> ...</div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-select-container';

      const selectEl = document.createElement('select');
      selectEl.className = 'sf-select-input form-control';

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          // In your dynamic block you might have { label, value } objects
          const option = document.createElement('option');
          option.value = opt.value || opt;
          option.textContent = opt.label || opt;
          selectEl.appendChild(option);
        });
      }

      selectEl.addEventListener('change', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(selectEl);
      break;
    }

    case 'radio': {
      // <div class="sf-radio-group"><input type="radio" ...> ...</div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-radio-group';

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt, index) => {
          const radioWrapper = document.createElement('div');
          radioWrapper.className =
            'sf-radio-option form-check form-check-inline';

          const radioEl = document.createElement('input');
          radioEl.type = 'radio';
          radioEl.className = 'form-check-input';
          radioEl.value = opt.value || opt;
          radioEl.id = `radio-${index}-${(opt.value || '').replace(/\s+/g, '-')}`;
          radioEl.name = field.groupName || 'sf-radio-group';

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
      break;
    }

    case 'textarea': {
      // <div class="sf-textarea-container"><textarea ...></div>
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
      // For unrecognized types, fallback to <textarea>.
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

  // Put the specific container inside .sf-input-container
  inputContainer.appendChild(specificContainer);

  // Then add .sf-input-container into the outer .sf-field-wrapper
  wrapper.appendChild(inputContainer);

  return wrapper;
}

/**
 * Replaces the current input control within a container with the provided new control.
 * This is used in smartforms-chat.js to swap out the old input for the new field’s wrapper.
 *
 * @param {HTMLElement} container - The container holding the input control.
 * @param {HTMLElement} newControl - The new input control element.
 */
export function replaceInputControl(container, newControl) {
  if (container.firstElementChild) {
    container.firstElementChild.remove();
  }
  container.insertBefore(newControl, container.firstElementChild);
}
