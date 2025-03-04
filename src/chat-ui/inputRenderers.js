/**
 * @file inputRenderers.js
 * @description This module provides functions to create and manage input controls for SmartForms.
 * It handles various field types (text, checkbox, select, slider, number, buttons, etc.)
 * by creating corresponding DOM elements and attaching the necessary event listeners.
 */

/**
 * Creates an input control based on the provided field configuration.
 * 
 * @param {Object} field - The configuration for the field (e.g., type, placeholder, options, layout).
 * @param {Function} updateSubmitButtonState - A callback function that updates the submit button's state based on the current answer.
 * @returns {HTMLElement} The created input control element.
 */
export function createInputControl(field, updateSubmitButtonState) {
	let control;
	
	if (field.type === "text") {
	  // Create a text input field.
	  control = document.createElement("input");
	  control.type = "text";
	  control.className = "form-control smartforms-text-input";
	  control.placeholder = field.placeholder || "Type your answer here...";
	  control.addEventListener("input", (e) => {
		updateSubmitButtonState(field, e.target.value);
	  });
	} else if (field.type === "checkbox") {
	  // Create a group of checkboxes.
	  control = document.createElement("div");
	  control.className = "sf-checkbox-group sf-checkbox-group-" + (field.layout || "horizontal");
	  control.setAttribute("data-layout", field.layout || "horizontal");
	  
	  if (field.options && Array.isArray(field.options)) {
		field.options.forEach((opt) => {
		  const optionWrapper = document.createElement("div");
		  const inlineClass = field.layout === "horizontal" ? " form-check-inline" : "";
		  optionWrapper.className = "sf-checkbox-option form-check" + inlineClass;
		  
		  const checkbox = document.createElement("input");
		  checkbox.type = "checkbox";
		  checkbox.className = "form-check-input";
		  checkbox.value = opt.value;
		  checkbox.id = field.id ? `${field.id}-${opt.value}` : opt.value;
		  
		  const label = document.createElement("label");
		  label.className = "form-check-label";
		  label.htmlFor = checkbox.id;
		  label.textContent = opt.label;
		  
		  optionWrapper.appendChild(checkbox);
		  optionWrapper.appendChild(label);
		  control.appendChild(optionWrapper);
		  
		  // Listen for changes to update the selection.
		  checkbox.addEventListener("change", () => {
			const selected = Array.from(control.querySelectorAll("input[type='checkbox']"))
			  .filter((cb) => cb.checked)
			  .map((cb) => cb.value);
			updateSubmitButtonState(field, selected);
		  });
		});
	  }
	} else if (field.type === "select") {
	  // Create a dropdown select element.
	  control = document.createElement("select");
	  control.className = "form-control smartforms-select";
	  
	  if (field.options && Array.isArray(field.options)) {
		field.options.forEach((opt) => {
		  const option = document.createElement("option");
		  option.value = opt.value;
		  option.textContent = opt.label;
		  control.appendChild(option);
		});
	  }
	  
	  control.addEventListener("change", (e) => {
		updateSubmitButtonState(field, e.target.value);
	  });
	} else if (field.type === "slider") {
	  // Create a slider (range) input.
	  control = document.createElement("input");
	  control.type = "range";
	  control.className = "form-control smartforms-slider";
	  control.min = field.min || 0;
	  control.max = field.max || 100;
	  // Default value is set to the midpoint.
	  control.value = field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
	  control.addEventListener("input", (e) => {
		updateSubmitButtonState(field, e.target.value);
	  });
	} else if (field.type === "number") {
	  // Create a number input field.
	  control = document.createElement("input");
	  control.type = "number";
	  control.className = "form-control smartforms-number";
	  control.placeholder = field.placeholder || "";
	  control.addEventListener("input", (e) => {
		updateSubmitButtonState(field, e.target.value);
	  });
	} else if (field.type === "buttons") {
	  // Create a group of buttons for selection.
	  control = document.createElement("div");
	  control.className = "sf-buttons-group d-flex flex-wrap gap-2";
	  
	  if (field.options && Array.isArray(field.options)) {
		field.options.forEach((opt) => {
		  const btn = document.createElement("button");
		  btn.type = "button";
		  btn.className = "btn btn-primary";
		  btn.setAttribute("data-value", opt.value);
		  btn.textContent = opt.label;
		  btn.addEventListener("click", () => {
			// Toggle active state on button click.
			Array.from(control.children).forEach(child => child.classList.remove("active"));
			if (btn.classList.contains("active")) {
			  btn.classList.remove("active");
			  updateSubmitButtonState(field, null);
			} else {
			  btn.classList.add("active");
			  updateSubmitButtonState(field, opt.value);
			}
		  });
		  control.appendChild(btn);
		});
	  }
	} else {
	  // Default to a textarea if the field type is unrecognized.
	  control = document.createElement("textarea");
	  control.className = "form-control smartforms-textarea smartforms-chat-input";
	  control.rows = 4;
	  control.placeholder = field.placeholder || "Type your answer here...";
	  control.addEventListener("input", (e) => {
		updateSubmitButtonState(field, e.target.value);
	  });
	}
	
	return control;
  }
  
  /**
   * Replaces the current input control within a container with a new control.
   * 
   * @param {HTMLElement} container - The DOM element that holds the input control.
   * @param {HTMLElement} newControl - The new input control element to insert.
   */
  export function replaceInputControl(container, newControl) {
	if (container.firstElementChild) {
	  container.firstElementChild.remove();
	}
	container.insertBefore(newControl, container.firstElementChild);
  }
  