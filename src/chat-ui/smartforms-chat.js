/**
 * @file smartforms-chat.js
 * @description Manages the overall chat flow for SmartForms.
 * It retrieves configuration data from a JSON script element and uses helper functions
 * to create input controls, validate input, and handle AJAX submission.
 */

import './smartforms-chat.scss';
// Import configuration defaults (to be used if DOM config is missing)
import { smartformsConfig as moduleConfig } from '../config/smartformsConfig.js';
// Import helper functions from inputRenderers.js (no changes made here)
import { createInputControl, replaceInputControl } from './inputRenderers.js';

/**
 * Retrieves configuration from a JSON script element with the ID "smartforms-config".
 * This configuration includes formData, ajaxUrl, nonce, and formId.
 * @returns {Object|null} Parsed configuration object or null if parsing fails.
 */
function getConfigFromDOM() {
  const configEl = document.getElementById('smartforms-config');
  if (configEl) {
    try {
      return JSON.parse(configEl.textContent);
    } catch (e) {
      console.error('Error parsing smartforms configuration:', e);
      return null;
    }
  }
  return null;
}

// Use configuration from the DOM if available; otherwise, fall back to moduleConfig.
const smartformsConfig = getConfigFromDOM() || moduleConfig;

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const { formData, ajaxUrl, nonce, formId } = smartformsConfig;

  // Ensure we have valid form data with at least one field
  if (!formData || !formData.fields || formData.fields.length === 0) {
    console.error('No form data available for SmartForms chat flow.');
    return;
  }

  let currentStep = 0; // Index of the current field being processed
  const formResponses = {}; // Object to store user responses keyed by field ID or index
  let currentAnswer = null; // Holds the current answer (used for button groups)

  // Cache frequently accessed DOM elements
  const chatDialog = document.getElementById('smartforms-chat-dialog');
  const submitButton = document.getElementById('smartforms-chat-submit-button');
  const inputContainer = document.getElementById('smartforms-chat-input-box');
  const helpContainer = document.getElementById(
    'smartforms-chat-help-container',
  );

  /**
   * Appends a message bubble to the chat dialog.
   * @param {string} message - The text to display.
   * @param {string} sender - "bot" or "user" (affects styling).
   */
  function appendMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('smartforms-chat-message', sender);
    const p = document.createElement('p');
    p.textContent = message;
    msgDiv.appendChild(p);
    chatDialog.appendChild(msgDiv);
    // Scroll to the bottom so the latest message is visible.
    chatDialog.scrollTop = chatDialog.scrollHeight;
  }

  /**
   * Updates the submit button's state (enabled/disabled) based on the current field's requirement
   * and the provided answer.
   * For non-required fields, the button is always enabled.
   * For required fields, if the answer is empty, the button is disabled.
   * @param {Object} currentField - The current field configuration.
   * @param {any} answer - The current answer.
   */
  function updateSubmitButtonState(currentField, answer) {
    // For non-required fields, always enable the button.
    if (!currentField.required) {
      submitButton.classList.remove('disabled');
      // For buttons, also update the local variable.
      if (currentField.type === 'buttons') {
        currentAnswer = answer;
      }
      return;
    }
    // For button fields, update the local currentAnswer.
    if (currentField.type === 'buttons') {
      currentAnswer = answer;
    }
    // Disable if answer is null, an empty string, or an empty array.
    if (
      answer === null ||
      (typeof answer === 'string' && answer.trim() === '') ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      submitButton.classList.add('disabled');
    } else {
      submitButton.classList.remove('disabled');
    }
  }

  /**
   * Displays the current question by:
   * - Appending the field label as a bot message.
   * - Creating an input control using createInputControl().
   * - Inserting it into the input container.
   * - Updating the submit button state.
   */
  function showCurrentQuestion() {
    const currentField = formData.fields[currentStep];
    currentAnswer = null; // Reset current answer for the new field
    appendMessage(currentField.label, 'bot');
    const inputControl = createInputControl(
      currentField,
      updateSubmitButtonState,
    );
    replaceInputControl(inputContainer, inputControl);
    updateSubmitButtonState(currentField, currentAnswer);
  }

  /**
   * Processes the user's answer for the current field.
   * If the field is required and the answer is empty, it shows a validation message.
   * Otherwise, it appends the user's answer to the conversation and moves on.
   * If all fields have been answered, it submits the form responses via AJAX.
   * @param {any} answer - The user's answer.
   * @param {string} [displayText=answer] - Optional text for display.
   */
  function processAnswer(answer, displayText = answer) {
    const currentField = formData.fields[currentStep];
    if (
      currentField.required &&
      ((typeof answer === 'string' && answer.trim() === '') ||
        (Array.isArray(answer) && answer.length === 0) ||
        answer === null)
    ) {
      // Show validation error message if required field is empty.
      helpContainer.textContent =
        currentField.requiredMessage || `${currentField.label} is required.`;
      helpContainer.classList.add('smartforms-error-message');
      setTimeout(() => {
        helpContainer.textContent =
          currentField.helpText || 'Enter your help text';
        helpContainer.classList.remove('smartforms-error-message');
      }, 3000);
      return;
    }
    // Append the user's answer as a message bubble.
    appendMessage(displayText, 'user');
    helpContainer.textContent = currentField.helpText || 'Enter your help text';
    helpContainer.classList.remove('smartforms-error-message');
    // Save the answer keyed by the field's id or the current step index.
    formResponses[currentField.id || currentStep] = answer;
    currentAnswer = null;

    // If there are more fields, advance; otherwise, submit responses via AJAX.
    if (currentStep < formData.fields.length - 1) {
      currentStep++;
      showCurrentQuestion();
    } else {
      // Build the POST payload.
      const data = new URLSearchParams();
      data.append('action', 'process_smartform');
      data.append('smartform_nonce', nonce);
      data.append('form_id', formId);
      data.append('form_data', JSON.stringify(formResponses));

      // Submit the form data using fetch.
      fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      })
        .then((response) => response.json())
        .then((result) => {
          chatDialog.innerHTML = ''; // Clear conversation
          const botMessage = document.createElement('div');
          botMessage.classList.add('smartforms-chat-message', 'bot');
          if (result.success) {
            botMessage.innerHTML = `<p>${result.data.message}</p>`;
          } else {
            const errorMsg = Array.isArray(result.data)
              ? result.data.join(' ')
              : result.data;
            botMessage.innerHTML = `<p class="error">${errorMsg}</p>`;
          }
          chatDialog.appendChild(botMessage);
          chatDialog.scrollTop = chatDialog.scrollHeight;

          // Disable further input by replacing the input area with a disabled textarea.
          const textarea = document.createElement('textarea');
          textarea.className = 'form-control smartforms-chat-input';
          textarea.rows = 4;
          textarea.placeholder = 'Type your message here...';
          textarea.disabled = true;
          replaceInputControl(inputContainer, textarea);
          submitButton.classList.add('disabled');
        })
        .catch((error) => {
          console.error('AJAX submission error:', error);
        });
    }
  }

  // Begin by displaying the first question.
  showCurrentQuestion();
  updateSubmitButtonState(formData.fields[currentStep], currentAnswer);

  // Set up the click event handler for the submit button.
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const currentField = formData.fields[currentStep];
    // If the field is required and the button is disabled, show the validation error.
    if (currentField.required && submitButton.classList.contains('disabled')) {
      helpContainer.textContent =
        currentField.requiredMessage || `${currentField.label} is required.`;
      helpContainer.classList.add('smartforms-error-message');
      setTimeout(() => {
        helpContainer.textContent =
          currentField.helpText || 'Enter your help text';
        helpContainer.classList.remove('smartforms-error-message');
      }, 3000);
      return;
    }
    // Retrieve the answer based on the field type.
    let answer;
    if (currentField.type === 'buttons') {
      answer = currentAnswer;
    } else if (currentField.type === 'checkbox') {
      const checkboxes = inputContainer.querySelectorAll(
        "input[type='checkbox']",
      );
      answer = Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value)
        .join(', ');
    } else if (currentField.type === 'radio') {
      const checkedRadio = inputContainer.querySelector(
        "input[type='radio']:checked",
      );
      answer = checkedRadio ? checkedRadio.value : '';
    } else if (currentField.type === 'number') {
      const inputElem = inputContainer.querySelector("input[type='number']");
      if (!inputElem) return;
      answer = inputElem.value;
    } else if (currentField.type === 'text') {
      const inputElem = inputContainer.querySelector('input');
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
