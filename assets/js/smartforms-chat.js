document.addEventListener("DOMContentLoaded", () => {
    // Expose form data (set by ChatUI.php).
    const formData = window.formData;
    if (!formData || !formData.fields || !formData.fields.length) {
        return;
    }
    
    let currentStep = 0;
    const formResponses = {};
    
    const chatDialog = document.getElementById("smartforms-chat-dialog");
    // Updated: select the submit button from its new container.
    const submitButton = document.querySelector(".smartforms-chat-submit-row button");
    const inputBox = document.querySelector(".smartforms-chat-input-box");
    const botTextColor = smartformsData.chatDialogTextColor || '#000000';
    
    // Get the computed height of the input box (fixed height) if needed.
    const defaultInputHeight = window.getComputedStyle(inputBox).height;
    
    /**
     * Creates an input control based on the field type.
     * For "text", creates a container with a centered <input>.
     * For "select", "slider", "number", and "checkbox", creates the respective element.
     * Defaults to a <textarea> if the field type is unrecognized.
     *
     * @param {Object} field - The field configuration.
     * @returns {HTMLElement} The created input control.
     */
    const createInputControl = (field) => {
        let control;
        if (field.type === "text") {
            const container = document.createElement("div");
            container.className = "smartforms-input-container";
            container.style.height = defaultInputHeight;
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.justifyContent = "center";
            const inputWrapper = document.createElement("div");
            inputWrapper.style.display = "flex";
            inputWrapper.style.alignItems = "center";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            input.placeholder = field.placeholder || "Type your answer here...";
            inputWrapper.appendChild(input);
            container.appendChild(inputWrapper);
            control = container;
        } else if (field.type === "checkbox") {
            control = document.createElement("div");
            // Remove inline styling so that stylesheet rules apply.
            control.className = "sf-checkbox-group sf-checkbox-group-" + (field.layout || "horizontal");
            
            if (field.options && Array.isArray(field.options)) {
                field.options.forEach(opt => {
                    const optionWrapper = document.createElement("div");
                    optionWrapper.className = "sf-checkbox-option";
                    
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
            control.className = "form-control";
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
            control.className = "form-control";
            control.min = field.min || 0;
            control.max = field.max || 100;
            control.value = field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
        } else if (field.type === "number") {
            control = document.createElement("input");
            control.type = "number";
            control.className = "form-control";
            control.placeholder = field.placeholder || "";
        } else {
            control = document.createElement("textarea");
            control.className = "form-control";
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
     * Clears previous content, shows the question label as a bot message,
     * creates the input control for the current field, and inserts help text.
     */
    const showCurrentQuestion = () => {
        const currentField = formData.fields[currentStep];
        chatDialog.innerHTML = "";
        
        // Create and append the bot message (question label).
        const botMessage = document.createElement("div");
        botMessage.classList.add("smartforms-chat-message", "bot");
        botMessage.style.marginBottom = "10px";
        const p = document.createElement("p");
        p.style.color = botTextColor;
        p.textContent = currentField.label;
        botMessage.appendChild(p);
        chatDialog.appendChild(botMessage);
        chatDialog.scrollTop = chatDialog.scrollHeight;
        
        // Create the input control.
        const newControl = createInputControl(currentField);
        replaceInputControl(newControl);
        
        // Insert help text if provided.
        if (currentField.helpText && currentField.helpText.trim().length > 0) {
            const helpTextElement = document.createElement("p");
            helpTextElement.className = "smartforms-help-text";
            helpTextElement.style.color = "#999";
            helpTextElement.style.fontSize = "12px";
            helpTextElement.style.marginTop = "4px";
            helpTextElement.textContent = currentField.helpText;
            // Append help text after the control.
            newControl.parentNode.insertBefore(helpTextElement, newControl.nextSibling);
        }
    };
    
    // Start with the first question.
    showCurrentQuestion();
    
    // Ensure the submit button is found.
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
                    errorMessageElement.style.color = "red";
                    errorMessageElement.style.marginRight = "auto";
                    errorMessageElement.style.alignSelf = "center";
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
                    botMessage.innerHTML = `<p style="color: ${botTextColor};">${result.data.message}</p>`;
                } else {
                    const errorMsg = Array.isArray(result.data)
                        ? result.data.join(" ")
                        : result.data;
                    botMessage.innerHTML = `<p style="color: red;">${errorMsg}</p>`;
                }
                chatDialog.appendChild(botMessage);
                chatDialog.scrollTop = chatDialog.scrollHeight;
                
                // Replace the input control with a textarea for chat submission.
                const textarea = document.createElement("textarea");
                textarea.className = "form-control";
                textarea.rows = 4;
                textarea.style.border = "none";
                textarea.style.width = "100%";
                textarea.style.resize = "none";
                textarea.style.backgroundColor = "transparent";
                textarea.placeholder = "Type your message here...";
                replaceInputControl(textarea);
            })
            .catch(error => {
                console.error("AJAX submission error:", error);
            });
        }
    });
});
