document.addEventListener("DOMContentLoaded", () => {
    // Expose form data for debugging (assumed to be set by ChatUI.php).
    const formData = window.formData;
    if (!formData || !formData.fields || !formData.fields.length) {
        return;
    }
    
    let currentStep = 0;
    const formResponses = {};
    
    const chatDialog = document.getElementById("smartforms-chat-dialog");
    const inputBox = document.querySelector(".smartforms-chat-input-box");
    const submitButton = document.querySelector(".smartforms-chat-input-box button");
    const botTextColor = smartformsData.chatDialogTextColor || '#000000';
    
    // Get the computed height of the input container to maintain overall area.
    const containerHeight = window.getComputedStyle(inputBox).height;
    
    /**
     * Creates an input control based on the field type.
     * For a "text" field, creates a container with fixed height (from inputBox)
     * that holds an <input type="text"> centered vertically.
     * For "select", "slider", and "number", creates the respective element.
     * Defaults to a <textarea> for any unrecognized type.
     *
     * @param {Object} field - The field configuration.
     * @returns {HTMLElement} The created input control (or its container).
     */
    const createInputControl = (field) => {
        let control;
        if (field.type === "text") {
            // Create a container for the single-line text input.
            const container = document.createElement("div");
            container.className = "smartforms-input-container";
            container.style.height = containerHeight;
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.justifyContent = "center";
            // Create a wrapper to vertically center the input.
            const inputWrapper = document.createElement("div");
            inputWrapper.style.display = "flex";
            inputWrapper.style.alignItems = "center";
            // Create the text input.
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            input.placeholder = field.placeholder || "Type your answer here...";
            // Let the input keep its natural size.
            input.style.height = "auto";
            input.style.minHeight = "auto";
            inputWrapper.appendChild(input);
            container.appendChild(inputWrapper);
            control = container;
        } else {
            switch (field.type) {
                case "select":
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
                    break;
                case "slider":
                    control = document.createElement("input");
                    control.type = "range";
                    control.className = "form-control";
                    control.min = field.min || 0;
                    control.max = field.max || 100;
                    control.value = field.value || Math.floor(((field.min || 0) + (field.max || 100)) / 2);
                    break;
                case "number":
                    control = document.createElement("input");
                    control.type = "number";
                    control.className = "form-control";
                    control.placeholder = field.placeholder || "";
                    break;
                default:
                    control = document.createElement("textarea");
                    control.className = "form-control";
                    control.rows = 4;
                    control.placeholder = field.placeholder || "Type your answer here...";
            }
            // For non-container-wrapped controls, don't force a height.
            control.style.height = "";
            control.style.minHeight = "";
        }
        
        // Determine the element on which to attach events.
        const targetControl = (field.type === "text") ? control.querySelector("input") : control;
        
        // Attach an input event listener:
        // When the trimmed value is nonempty, validate it with a regex.
        targetControl.addEventListener("input", () => {
            if (targetControl.value.trim().length > 0) {
                // Regex: allows Unicode letters, marks, numbers, punctuation, symbols, and spaces.
                const textRegex = /^[\p{L}\p{M}\p{N}\p{P}\p{S}\p{Zs}]+$/u;
                const buttonRow = submitButton.parentElement;
                if (!textRegex.test(targetControl.value.trim())) {
                    let errorMessageElement = buttonRow.querySelector(".smartforms-error-message");
                    if (!errorMessageElement) {
                        errorMessageElement = document.createElement("span");
                        errorMessageElement.className = "smartforms-error-message";
                        errorMessageElement.style.color = "red";
                        errorMessageElement.style.marginRight = "auto";
                        errorMessageElement.style.alignSelf = "center";
                        buttonRow.insertBefore(errorMessageElement, submitButton);
                    }
                    errorMessageElement.textContent = "Valid input: only letters, numbers, punctuation, symbols & spaces allowed.";
                } else {
                    const errorMessageElement = buttonRow.querySelector(".smartforms-error-message");
                    if (errorMessageElement) {
                        errorMessageElement.remove();
                    }
                }
            }
        });
        
        return control;
    };
    
    /**
     * Replaces the dynamic input control (first child of the input box) without affecting the submit button row.
     *
     * @param {HTMLElement} newControl - The new input control (or its container).
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
     * creates the input control for the current field, and inserts help text directly below the field.
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
        
        // Insert help text directly below the field if helpText is nonempty.
        if (currentField.helpText && currentField.helpText.trim().length > 0) {
            const helpTextElement = document.createElement("p");
            helpTextElement.className = "smartforms-help-text";
            helpTextElement.style.color = "#999";
            helpTextElement.style.fontSize = "12px";
            helpTextElement.style.marginTop = "4px";
            helpTextElement.textContent = currentField.helpText;
            if (currentField.type === "text") {
                // For text fields, append help text inside the container after the input wrapper.
                newControl.appendChild(helpTextElement);
            } else {
                // For other types, insert help text after the control.
                inputBox.insertBefore(helpTextElement, newControl.nextSibling);
            }
        }
    };
    
    // Start with the first question.
    showCurrentQuestion();
    
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const currentField = formData.fields[currentStep];
        const inputControl = currentField.type === "text" 
            ? inputBox.querySelector(".smartforms-input-container input")
            : inputBox.firstElementChild;
        if (!inputControl) return;
        const answer = inputControl.value;
        
        console.log("Current Field:", currentField);
        console.log("Answer:", answer);
        
        if (currentField.required && answer.trim().length === 0) {
            console.log("Validation failed: required field is empty");
            const errorMsg = currentField.validationMessage || `${currentField.label} is required.`;
            const buttonRow = submitButton.parentElement;
            if (!buttonRow.querySelector(".smartforms-error-message")) {
                const errorMessageElement = document.createElement("span");
                errorMessageElement.className = "smartforms-error-message";
                errorMessageElement.style.color = "red";
                errorMessageElement.style.marginRight = "auto";
                errorMessageElement.style.alignSelf = "center";
                errorMessageElement.textContent = errorMsg;
                buttonRow.insertBefore(errorMessageElement, submitButton);
            }
            return false;
        }
        
        const buttonRow = submitButton.parentElement;
        const existingError = buttonRow.querySelector(".smartforms-error-message");
        if (existingError) {
            existingError.remove();
        }
        
        formResponses[currentField.id] = answer;
        
        if (currentStep < formData.fields.length - 1) {
            currentStep++;
            showCurrentQuestion();
        } else {
            const data = new URLSearchParams();
            data.append('action', 'process_smartform');
            data.append('smartform_nonce', smartformsData.nonce);
            data.append('form_id', smartformsData.formId || window.smartformsFormId);
            data.append('form_data', JSON.stringify(formResponses));
            
            fetch(smartformsData.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
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
                    const errorMsg = Array.isArray(result.data) ? result.data.join(" ") : result.data;
                    botMessage.innerHTML = `<p style="color: red;">${errorMsg}</p>`;
                }
                chatDialog.appendChild(botMessage);
                chatDialog.scrollTop = chatDialog.scrollHeight;
                
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
