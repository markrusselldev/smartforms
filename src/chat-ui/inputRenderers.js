// src/blocks/smartforms-buttons/inputRenderers.js

/**
 * Creates an input control element based on the provided field configuration.
 * For all fields except "buttons", it assigns an ID (if not already provided) so that
 * JustValidate can target the element. The function uses a switch statement to handle each type.
 *
 * @param {Object} field - The configuration object for the field (includes type, placeholder, options, layout, etc.).
 * @param {Function} updateSubmitButtonState - Callback function to update the state of the submit button.
 * @returns {HTMLElement} The created input control element.
 */
export function createInputControl(field, updateSubmitButtonState) {
  let control;

  switch (field.type) {
    case 'text':
      // Create a text input element.
      control = document.createElement('input');
      control.type = 'text';
      control.className = 'form-control smartforms-text-input';
      control.placeholder = field.placeholder || 'Type your answer here...';
      if (!field.id) {
        // Assign a default ID so JustValidate can reference it.
        control.id = 'smartforms-current-input';
      }
      control.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });
      break;

    case 'number':
      // Create a number input element.
      control = document.createElement('input');
      control.type = 'number';
      control.className = 'form-control smartforms-number';
      control.placeholder = field.placeholder || '';
      if (!field.id) {
        control.id = 'smartforms-current-input';
      }
      control.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });
      break;

    case 'slider':
      // Create a slider (range input) element.
      control = document.createElement('input');
      control.type = 'range';
      control.className = 'form-control smartforms-slider';
      control.min = field.min || 0;
      control.max = field.max || 100;
      // Set default value to the midpoint if no value provided.
      control.value =
        field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
      if (!field.id) {
        control.id = 'smartforms-current-input';
      }
      control.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });
      break;

    case 'textarea':
      // Create a textarea element.
      control = document.createElement('textarea');
      control.className =
        'form-control smartforms-textarea smartforms-chat-input';
      control.rows = 4;
      control.placeholder = field.placeholder || 'Type your answer here...';
      if (!field.id) {
        control.id = 'smartforms-current-input';
      }
      control.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });
      break;

    case 'select':
      // Create a dropdown select element.
      control = document.createElement('select');
      control.className = 'form-control smartforms-select';
      if (!field.id) {
        control.id = 'smartforms-current-input';
      }
      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          control.appendChild(option);
        });
      }
      control.addEventListener('change', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });
      break;

    case 'checkbox':
      // Create a container for checkbox inputs.
      control = document.createElement('div');
      // Use layout value if available
      const checkboxLayout = field.layout || 'horizontal';
      control.className =
        'sf-checkbox-group sf-checkbox-group-' + checkboxLayout;
      control.setAttribute('data-layout', checkboxLayout);
      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          const optionWrapper = document.createElement('div');
          const inlineClass =
            checkboxLayout === 'horizontal' ? ' form-check-inline' : '';
          optionWrapper.className =
            'sf-checkbox-option form-check' + inlineClass;
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'form-check-input';
          checkbox.value = opt.value;
          checkbox.id = field.id ? `${field.id}-${opt.value}` : opt.value;
          const label = document.createElement('label');
          label.className = 'form-check-label';
          label.htmlFor = checkbox.id;
          label.textContent = opt.label;
          optionWrapper.appendChild(checkbox);
          optionWrapper.appendChild(label);
          control.appendChild(optionWrapper);
          checkbox.addEventListener('change', () => {
            // Update the selected options when any checkbox changes.
            const selected = Array.from(
              control.querySelectorAll("input[type='checkbox']"),
            )
              .filter((cb) => cb.checked)
              .map((cb) => cb.value);
            updateSubmitButtonState(field, selected);
          });
        });
      }
      break;

    case 'buttons':
      // Create a container for a group of buttons.
      control = document.createElement('div');
      // Check the layout attribute: if vertical, don't use flex classes.
      if (field.layout && field.layout === 'vertical') {
        control.className = 'sf-buttons-group';
        control.setAttribute('data-layout', 'vertical');
      } else {
        control.className = 'sf-buttons-group d-flex flex-wrap gap-2';
        control.setAttribute('data-layout', 'horizontal');
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
              // In multiple mode, toggle the "active" class.
              btn.classList.toggle('active');
              // Gather all active button values.
              const activeButtons = Array.from(
                control.querySelectorAll('button.active'),
              );
              const values = activeButtons.map((b) =>
                b.getAttribute('data-value'),
              );
              updateSubmitButtonState(field, values);
            } else {
              // In single mode, remove "active" from all buttons and toggle clicked one.
              Array.from(control.children).forEach((child) =>
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
          control.appendChild(btn);
        });
      }
      break;

    default:
      // For unrecognized types, default to a textarea.
      control = document.createElement('textarea');
      control.className =
        'form-control smartforms-textarea smartforms-chat-input';
      control.rows = 4;
      control.placeholder = field.placeholder || 'Type your answer here...';
      if (!field.id) {
        control.id = 'smartforms-current-input';
      }
      control.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });
  }
  return control;
}

/**
 * Replaces the current input control within a container with the provided new control.
 * @param {HTMLElement} container - The container holding the input control.
 * @param {HTMLElement} newControl - The new input control element.
 */
export function replaceInputControl(container, newControl) {
  if (container.firstElementChild) {
    container.firstElementChild.remove();
  }
  container.insertBefore(newControl, container.firstElementChild);
}
