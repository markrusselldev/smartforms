/**
 * File: smartforms-chat.js
 *
 * Handles the front-end behavior for the SmartForms Chat UI.
 * It advances the form through questions, validates required fields,
 * toggles the submit button's disabled state, and handles AJAX submission.
 *
 * The submit button is styled to mimic a ChatGPT‑style circular button,
 * and its disabled state is controlled via a CSS class.
 */

import './smartforms-chat.scss';

document.addEventListener("DOMContentLoaded", () => {
    // Expose form data (set by ChatUI.php).
    const formData = window.formData;
    if (!formData || !formData.fields || !formData.fields.length) {
        return;
    }
    
    let currentStep = 0;
    const formResponses = {};
    let currentAnswer = null; // Stores the answer for the current field

    // Retrieve key DOM elements.
    const chatDialog = document.getElementById("smartforms-chat-dialog");
    const submitButton = document.getElementById("smartforms-chat-submit-button");
    const inputBox = document.getElementById("smartforms-chat-input-box");
    const helpContainer = document.getElementById("smartforms-chat-help-container");

    /**
     * Updates the visual disabled state of the submit button.
     * It adds the "disabled" class if the current field is required and no valid answer is provided.
     *
     * @param {Object} currentField - The current field configuration.
     * @param {string|array|null} answer - The current answer value.
     */
    const updateSubmitButtonState = (currentField, answer) => {
        if (
            currentField.required &&
            (
                answer === null ||
                (typeof answer === "string" && answer.trim().length === 0) ||
                (Array.isArray(answer) && answer.length === 0)
            )
        ) {
            submitButton.classList.add("disabled");
        } else {
            submitButton.classList.remove("disabled");
        }
    };

    /**
     * Processes the answer for the current question.
     * If validation fails, shows an error message for 3 seconds.
     * If validation passes, appends the user's message, stores the answer, and advances.
     *
     * @param {string|array} answer - The answer value.
     * @param {string} [displayText] - The text to display for the user's message; defaults to answer.
     */
    const processAnswer = (answer, displayText = answer) => {
        const currentField = formData.fields[currentStep];
        
        // Validate required field.
        if (
            currentField.required &&
            (
                (typeof answer === "string" && answer.trim().length === 0) ||
                (Array.isArray(answer) && answer.length === 0) ||
                answer === null
            )
        ) {
            helpContainer.textContent = currentField.requiredMessage || `${currentField.label} is required.`;
            helpContainer.classList.add("smartforms-error-message");
            setTimeout(() => {
                helpContainer.textContent = currentField.helpText || "Enter your help text";
                helpContainer.classList.remove("smartforms-error-message");
            }, 3000);
            return;
        }
        
        // Append the user's message.
        appendUserMessage(displayText);
        // Reset help container.
        helpContainer.textContent = currentField.helpText || "Enter your help text";
        helpContainer.classList.remove("smartforms-error-message");
        // Store answer.
        formResponses[currentField.id || currentStep] = answer;
        currentAnswer = null;
        
        // Advance to next question or submit form.
        if (currentStep < formData.fields.length - 1) {
            currentStep++;
            showCurrentQuestion();
        } else {
            // All questions answered; submit form via AJAX.
            const data = new URLSearchParams();
            data.append("action", "process_smartform");
            data.append("smartform_nonce", smartformsData.nonce);
            data.append("form_id", smartformsData.formId || window.smartformsFormId);
            data.append("form_data", JSON.stringify(formResponses));
            
            fetch(smartformsData.ajaxUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data.toString()
            })
            .then(response => response.json())
            .then(result => {
                // Clear the chat dialog and display bot response.
                chatDialog.innerHTML = "";
                const botMessage = document.createElement("div");
                botMessage.classList.add("smartforms-chat-message", "bot");
                if (result.success) {
                    botMessage.innerHTML = `<p>${result.data.message}</p>`;
                } else {
                    const errorMsg = Array.isArray(result.data) ? result.data.join(" ") : result.data;
                    botMessage.innerHTML = `<p class="error">${errorMsg}</p>`;
                }
                chatDialog.appendChild(botMessage);
                chatDialog.scrollTop = chatDialog.scrollHeight;
                
                // Replace input control with a disabled textarea after submission.
                const textarea = document.createElement("textarea");
                textarea.className = "form-control smartforms-chat-input";
                textarea.rows = 4;
                textarea.placeholder = "Type your message here...";
                textarea.disabled = true;
                replaceInputControl(textarea);
                submitButton.classList.add("disabled");
            })
            .catch(error => {
                console.error("AJAX submission error:", error);
            });
        }
    };

    /**
     * Creates an input control based on the field type.
     * Handles text, checkbox, select, slider, number, buttons, and textarea fields.
     *
     * @param {Object} field - The field configuration.
     * @returns {HTMLElement} The created input control.
     */
    const createInputControl = (field) => {
        let control;
        if (field.type === "text") {
            control = document.createElement("input");
            control.type = "text";
            control.className = "form-control smartforms-text-input";
            control.placeholder = field.placeholder || "Type your answer here...";
            control.addEventListener("input", (e) => {
                updateSubmitButtonState(field, e.target.value);
            });
        } else if (field.type === "checkbox") {
            control = document.createElement("div");
            control.className = "sf-checkbox-group sf-checkbox-group-" + (field.layout || "horizontal");
            control.setAttribute("data-layout", field.layout || "horizontal");
            if (field.options && Array.isArray(field.options)) {
                field.options.forEach(opt => {
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
                    
                    checkbox.addEventListener("change", () => {
                        const selected = Array.from(control.querySelectorAll("input[type='checkbox']"))
                            .filter(cb => cb.checked)
                            .map(cb => cb.value);
                        updateSubmitButtonState(field, selected);
                    });
                });
            }
        } else if (field.type === "select") {
            control = document.createElement("select");
            control.className = "form-control smartforms-select";
            if (field.options && Array.isArray(field.options)) {
                field.options.forEach(opt => {
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
            control = document.createElement("input");
            control.type = "range";
            control.className = "form-control smartforms-slider";
            control.min = field.min || 0;
            control.max = field.max || 100;
            control.value = field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
            control.addEventListener("input", (e) => {
                updateSubmitButtonState(field, e.target.value);
            });
        } else if (field.type === "number") {
            control = document.createElement("input");
            control.type = "number";
            control.className = "form-control smartforms-number";
            control.placeholder = field.placeholder || "";
            control.addEventListener("input", (e) => {
                updateSubmitButtonState(field, e.target.value);
            });
        } else if (field.type === "buttons") {
            control = document.createElement("div");
            control.className = "sf-buttons-group d-flex flex-wrap gap-2";
            if (field.options && Array.isArray(field.options)) {
                field.options.forEach(opt => {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "btn btn-primary";
                    btn.setAttribute("data-value", opt.value);
                    btn.textContent = opt.label;
                    btn.addEventListener("click", () => {
                        // Toggle active state: if the button is already active, deselect it; otherwise, select it.
                        Array.from(control.children).forEach(child => child.classList.remove("active"));
                        if (btn.classList.contains("active")) {
                            btn.classList.remove("active");
                            currentAnswer = null;
                        } else {
                            btn.classList.add("active");
                            currentAnswer = opt.value;
                        }
                        updateSubmitButtonState(field, currentAnswer);
                    });
                    control.appendChild(btn);
                });
            }
            updateSubmitButtonState(field, currentAnswer);
            return control;
        } else {
            // Default: use a textarea.
            control = document.createElement("textarea");
            control.className = "form-control smartforms-textarea smartforms-chat-input";
            control.rows = 4;
            control.placeholder = field.placeholder || "Type your answer here...";
            control.addEventListener("input", (e) => {
                updateSubmitButtonState(field, e.target.value);
            });
        }
        return control;
    };

    /**
     * Replaces the current input control with a new one.
     *
     * @param {HTMLElement} newControl - The new input control.
     */
    const replaceInputControl = (newControl) => {
        if (inputBox.firstElementChild) {
            inputBox.firstElementChild.remove();
        }
        inputBox.insertBefore(newControl, inputBox.firstElementChild);
    };

    /**
     * Appends a bot message bubble to the chat dialog.
     *
     * @param {string} message - The bot's message text.
     */
    const appendBotMessage = (message) => {
        const botMessage = document.createElement("div");
        botMessage.classList.add("smartforms-chat-message", "bot");
        const p = document.createElement("p");
        p.textContent = message;
        botMessage.appendChild(p);
        chatDialog.appendChild(botMessage);
        chatDialog.scrollTop = chatDialog.scrollHeight;
    };

    /**
     * Appends a user message bubble to the chat dialog.
     *
     * @param {string} message - The user's message text.
     */
    const appendUserMessage = (message) => {
        const userMessage = document.createElement("div");
        userMessage.classList.add("smartforms-chat-message", "user");
        const p = document.createElement("p");
        p.textContent = message;
        userMessage.appendChild(p);
        chatDialog.appendChild(userMessage);
        chatDialog.scrollTop = chatDialog.scrollHeight;
    };

    /**
     * Displays the current question as a bot message and loads its input control.
     */
    const showCurrentQuestion = () => {
        const currentField = formData.fields[currentStep];
        currentAnswer = null;
        appendBotMessage(currentField.label);
        const newControl = createInputControl(currentField);
        replaceInputControl(newControl);
        updateSubmitButtonState(currentField, currentAnswer);
    };

    // Begin the chat UI flow by displaying the first question.
    showCurrentQuestion();
    
    // Initially mark the submit button as disabled.
    submitButton.classList.add("disabled");
    
    // Submit button click handler.
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        // If the submit button is disabled, display the validation error message.
        if (submitButton.classList.contains("disabled")) {
            const currentField = formData.fields[currentStep];
            helpContainer.textContent = currentField.requiredMessage || `${currentField.label} is required.`;
            helpContainer.classList.add("smartforms-error-message");
            setTimeout(() => {
                helpContainer.textContent = currentField.helpText || "Enter your help text";
                helpContainer.classList.remove("smartforms-error-message");
            }, 3000);
            return;
        }
        const currentField = formData.fields[currentStep];
        let answer;
        if (currentField.type === "buttons") {
            answer = currentAnswer;
        } else if (currentField.type === "checkbox") {
            const checkboxes = inputBox.querySelectorAll("input[type='checkbox']");
            answer = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            answer = answer.join(", ");
        } else if (currentField.type === "text") {
            const inputControl = inputBox.querySelector("input");
            if (!inputControl) return;
            answer = inputControl.value;
        } else {
            const inputControl = inputBox.firstElementChild;
            if (!inputControl) return;
            answer = inputControl.value;
        }
        processAnswer(answer);
    });
});
