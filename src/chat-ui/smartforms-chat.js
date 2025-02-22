// Import the SCSS file so that webpack can process and extract it.
import './smartforms-chat.scss';

document.addEventListener("DOMContentLoaded", () => {
    // Expose form data (set by ChatUI.php).
    const formData = window.formData;
    if (!formData || !formData.fields || !formData.fields.length) {
        return;
    }
    
    let currentStep = 0;
    const formResponses = {};
    
    const chatDialog = document.getElementById("smartforms-chat-dialog");
    const submitButton = document.getElementById("smartforms-chat-submit-button");
    const inputBox = document.getElementById("smartforms-chat-input-box");

    /**
     * Creates an input control based on the field type.
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
        } else if (field.type === "checkbox") {
            // Preserve the outer container with proper class and data attribute for layout JSON mapping.
            control = document.createElement("div");
            control.className = "sf-checkbox-group sf-checkbox-group-" + (field.layout || "horizontal");
            control.setAttribute("data-layout", field.layout || "horizontal");
            if (field.options && Array.isArray(field.options)) {
                field.options.forEach(opt => {
                    const optionWrapper = document.createElement("div");
                    // Apply Bootstrap's form-check class; add form-check-inline if layout is horizontal.
                    let inlineClass = "";
                    if (field.layout === "horizontal") {
                        inlineClass = " form-check-inline";
                    }
                    optionWrapper.className = "sf-checkbox-option form-check" + inlineClass;
                    
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.className = "form-check-input";
                    checkbox.value = opt.value;
                    checkbox.id = field.id ? field.id + '-' + opt.value : opt.value;
                    
                    const label = document.createElement("label");
                    label.className = "form-check-label";
                    label.htmlFor = checkbox.id;
                    label.textContent = opt.label;
                    
                    optionWrapper.appendChild(checkbox);
                    optionWrapper.appendChild(label);
                    control.appendChild(optionWrapper);
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
        } else if (field.type === "slider") {
            control = document.createElement("input");
            control.type = "range";
            control.className = "form-control smartforms-slider";
            control.min = field.min || 0;
            control.max = field.max || 100;
            control.value = field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
        } else if (field.type === "number") {
            control = document.createElement("input");
            control.type = "number";
            control.className = "form-control smartforms-number";
            control.placeholder = field.placeholder || "";
        } else {
            control = document.createElement("textarea");
            control.className = "form-control smartforms-textarea";
            control.rows = 4;
            control.placeholder = field.placeholder || "Type your answer here...";
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
     * Displays the current question in the chat dialog.
     */
    const showCurrentQuestion = () => {
        const currentField = formData.fields[currentStep];
        chatDialog.innerHTML = "";
        
        // Create and append the bot message.
        const botMessage = document.createElement("div");
        botMessage.classList.add("smartforms-chat-message", "bot");
        const p = document.createElement("p");
        p.textContent = currentField.label;
        botMessage.appendChild(p);
        chatDialog.appendChild(botMessage);
        chatDialog.scrollTop = chatDialog.scrollHeight;
        
        // Create the input control for the current field.
        const newControl = createInputControl(currentField);
        replaceInputControl(newControl);
        
        // Append help text if provided.
        if (currentField.helpText && currentField.helpText.trim().length > 0) {
            const helpTextElement = document.createElement("p");
            helpTextElement.className = "smartforms-help-text";
            helpTextElement.textContent = currentField.helpText;
            newControl.parentNode.insertBefore(helpTextElement, newControl.nextSibling);
        }
    };
    
    // Start with the first question.
    showCurrentQuestion();
    
    if (!submitButton) {
        console.error("Submit button not found in the chat form.");
        return;
    }
    
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        const currentField = formData.fields[currentStep];
        let answer;
        if (currentField.type === "checkbox") {
            const checkboxes = inputBox.querySelectorAll("input[type='checkbox']");
            answer = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
        } else if (currentField.type === "text") {
            const inputControl = inputBox.querySelector("input");
            if (!inputControl) return;
            answer = inputControl.value;
        } else {
            const inputControl = inputBox.firstElementChild;
            if (!inputControl) return;
            answer = inputControl.value;
        }
        
        // Validate required fields.
        if (currentField.required) {
            if ((currentField.type === "checkbox" && (!Array.isArray(answer) || answer.length === 0)) ||
                (typeof answer === "string" && answer.trim().length === 0)) {
                const buttonRow = submitButton.parentElement;
                if (!buttonRow.querySelector(".smartforms-error-message")) {
                    const errorMessageElement = document.createElement("span");
                    errorMessageElement.className = "smartforms-error-message";
                    errorMessageElement.textContent = currentField.validationMessage || `${currentField.label} is required.`;
                    buttonRow.insertBefore(errorMessageElement, submitButton);
                }
                return;
            }
        }
        
        // Remove any existing error message.
        const buttonRow = submitButton.parentElement;
        const existingError = buttonRow.querySelector(".smartforms-error-message");
        if (existingError) {
            existingError.remove();
        }
        
        // Save the answer.
        formResponses[currentField.id || currentStep] = answer;
        
        if (currentStep < formData.fields.length - 1) {
            currentStep++;
            showCurrentQuestion();
        } else {
            const data = new URLSearchParams();
            data.append("action", "process_smartform");
            data.append("smartform_nonce", smartformsData.nonce);
            data.append("form_id", smartformsData.formId || window.smartformsFormId);
            data.append("form_data", JSON.stringify(formResponses));
            
            fetch(smartformsData.ajaxUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: data.toString()
            })
            .then(response => response.json())
            .then(result => {
                chatDialog.innerHTML = "";
                const botMessage = document.createElement("div");
                botMessage.classList.add("smartforms-chat-message", "bot");
                if (result.success) {
                    botMessage.innerHTML = `<p>${result.data.message}</p>`;
                } else {
                    const errorMsg = Array.isArray(result.data)
                        ? result.data.join(" ")
                        : result.data;
                    botMessage.innerHTML = `<p class="error">${errorMsg}</p>`;
                }
                chatDialog.appendChild(botMessage);
                chatDialog.scrollTop = chatDialog.scrollHeight;
                
                // Replace the input control with a textarea for chat submission.
                const textarea = document.createElement("textarea");
                textarea.className = "form-control smartforms-chat-input";
                textarea.rows = 4;
                textarea.placeholder = "Type your message here...";
                replaceInputControl(textarea);
            })
            .catch(error => {
                console.error("AJAX submission error:", error);
            });
        }
    });
});
