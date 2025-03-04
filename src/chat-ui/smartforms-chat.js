/**
 * @file smartforms-chat.js
 * @description Manages the overall chat flow for SmartForms.
 * It retrieves configuration data from a JSON script element and uses helper functions
 * to create input controls, validate input, and handle AJAX submission.
 */

import './smartforms-chat.scss';
import { smartformsConfig as moduleConfig } from '../config/smartformsConfig.js';
import { createInputControl, replaceInputControl } from './inputRenderers.js';

/**
 * Retrieves configuration from a JSON script element.
 * @returns {Object|null} Parsed configuration, or null on error.
 */
function getConfigFromDOM() {
  const configEl = document.getElementById('smartforms-config');
  if (configEl) {
    try {
      return JSON.parse(configEl.textContent);
    } catch (e) {
      console.error("Error parsing smartforms configuration:", e);
      return null;
    }
  }
  return null;
}

// Use configuration from DOM if available; otherwise, fall back to the imported module.
const smartformsConfig = getConfigFromDOM() || moduleConfig;

document.addEventListener("DOMContentLoaded", () => {
  const { formData, ajaxUrl, nonce, formId } = smartformsConfig;
  if (!formData || !formData.fields || formData.fields.length === 0) {
    console.error("No form data available for SmartForms chat flow.");
    return;
  }

  let currentStep = 0;
  const formResponses = {};
  let currentAnswer = null;

  const chatDialog = document.getElementById("smartforms-chat-dialog");
  const submitButton = document.getElementById("smartforms-chat-submit-button");
  const inputContainer = document.getElementById("smartforms-chat-input-box");
  const helpContainer = document.getElementById("smartforms-chat-help-container");

  /**
   * Appends a message bubble to the chat dialog.
   * @param {string} message - The message text.
   * @param {string} sender - "bot" or "user".
   */
  function appendMessage(message, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("smartforms-chat-message", sender);
    const p = document.createElement("p");
    p.textContent = message;
    msgDiv.appendChild(p);
    chatDialog.appendChild(msgDiv);
    chatDialog.scrollTop = chatDialog.scrollHeight;
  }

  /**
   * Updates the submit button's state based on the current answer.
   * @param {Object} currentField - The current field's configuration.
   * @param {any} answer - The current answer.
   */
  function updateSubmitButtonState(currentField, answer) {
    if (
      currentField.required &&
      (
        answer === null ||
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0)
      )
    ) {
      submitButton.classList.add("disabled");
    } else {
      submitButton.classList.remove("disabled");
    }
  }

  /**
   * Displays the current question and renders its input control.
   */
  function showCurrentQuestion() {
    const currentField = formData.fields[currentStep];
    currentAnswer = null;
    appendMessage(currentField.label, "bot");
    const inputControl = createInputControl(currentField, updateSubmitButtonState);
    replaceInputControl(inputContainer, inputControl);
    updateSubmitButtonState(currentField, currentAnswer);
  }

  /**
   * Processes the answer for the current question.
   * @param {any} answer - The user-provided answer.
   * @param {string} [displayText=answer] - Optional display text.
   */
  function processAnswer(answer, displayText = answer) {
    const currentField = formData.fields[currentStep];
    if (
      currentField.required &&
      (
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0) ||
        answer === null
      )
    ) {
      helpContainer.textContent =
        currentField.requiredMessage || `${currentField.label} is required.`;
      helpContainer.classList.add("smartforms-error-message");
      setTimeout(() => {
        helpContainer.textContent = currentField.helpText || "Enter your help text";
        helpContainer.classList.remove("smartforms-error-message");
      }, 3000);
      return;
    }

    appendMessage(displayText, "user");
    helpContainer.textContent = currentField.helpText || "Enter your help text";
    helpContainer.classList.remove("smartforms-error-message");
    formResponses[currentField.id || currentStep] = answer;
    currentAnswer = null;

    if (currentStep < formData.fields.length - 1) {
      currentStep++;
      showCurrentQuestion();
    } else {
      // Submit via AJAX.
      const data = new URLSearchParams();
      data.append("action", "process_smartform");
      data.append("smartform_nonce", nonce);
      data.append("form_id", formId);
      data.append("form_data", JSON.stringify(formResponses));

      fetch(ajaxUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

          // Disable further input.
          const textarea = document.createElement("textarea");
          textarea.className = "form-control smartforms-chat-input";
          textarea.rows = 4;
          textarea.placeholder = "Type your message here...";
          textarea.disabled = true;
          replaceInputControl(inputContainer, textarea);
          submitButton.classList.add("disabled");
        })
        .catch(error => {
          console.error("AJAX submission error:", error);
        });
    }
  }

  showCurrentQuestion();
  submitButton.classList.add("disabled");

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitButton.classList.contains("disabled")) {
      const currentField = formData.fields[currentStep];
      helpContainer.textContent =
        currentField.requiredMessage || `${currentField.label} is required.`;
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
      const checkboxes = inputContainer.querySelectorAll("input[type='checkbox']");
      answer = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(", ");
    } else if (currentField.type === "text") {
      const inputElem = inputContainer.querySelector("input");
      if (!inputElem) return;
      answer = inputElem.value;
    } else {
      const inputElem = inputContainer.firstElementChild;
      if (!inputElem) return;
      answer = inputElem.value;
    }
    processAnswer(answer);
  });
});
