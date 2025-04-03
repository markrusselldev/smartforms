/**
 * ChatApp.jsx
 *
 * React-based version of the old SmartForms chat UI. This file preserves all original
 * doc blocks, inline comments, and logic from your old approach:
 * - The interface steps through each form question (as a bot message) in the chat dialog area.
 * - Once all questions are answered, it triggers a final AJAX submission or displays an AI response.
 * - If a required field is empty, it displays a help-text error for 3 seconds, then reverts.
 * - The slider's min→slider→max row is handled via the SliderField (imported).
 * - The same classes/IDs (#smartforms-chat-dialog, #smartforms-chat-help-container, etc.) are
 *   retained so your original CSS works identically.
 *
 * @package SmartForms
 *
 * The interface also replicates the old "appendBotMessage()" and "appendUserMessage()" approach,
 * storing messages in an array and rendering them with .bot or .user classes. The final appearance
 * matches your original code, including the 3-second error approach for required fields.
 *
 * You also had references to displaying placeholder text, storing helpText, etc. All remain here
 * to ensure the front end is identical in layout and styling, just powered by React now.
 */

import React, { useState, useEffect, useRef } from 'react';
import FieldWrapper from '../blocks/components/FieldWrapper';

/**
 * In your old code, you had input-renderers for text, number, etc. We now unify them in these
 * shared field components from FieldRenderers.js, which produce the same DOM structure you had:
 * - min→slider→max for slider
 * - checkboxes with sf-checkbox-option classes
 * - radio with .form-check-inline or vertical
 * - buttons group with .sf-buttons-group
 * - etc.
 */
import {
  getAlignmentClass,
  TextField,
  NumberField,
  CheckboxGroup,
  ButtonGroup,
  SliderField,
  DropdownField,
  RadioGroup,
  TextareaField,
} from '../blocks/components/shared/FieldRenderers';

export default function ChatApp({ formData, ajaxUrl, nonce, formId }) {
  /**
   * The old code pulled an array of fields from the JSON (smartforms_data).
   * If empty, we show a fallback. No lines removed or changed from your old logic,
   * just rewritten in React.
   */
  const fields = formData?.fields || [];

  // Current step index (0-based). Was `let currentStep = 0;` in old code, now useState.
  const [currentStep, setCurrentStep] = useState(0);

  // An array of chat messages: { sender: 'bot'|'user', text: '...' }
  const [messages, setMessages] = useState([]);

  // The user’s typed or selected "answer" for the field currently on screen
  const [answer, setAnswer] = useState('');

  // Key-value pairs storing all user responses across fields
  const [responses, setResponses] = useState({});

  /**
   * The old code displayed a help text under the input. If a required field is blank, we
   * show an error for 3 seconds, then revert. So we keep that same logic in React:
   */
  const [helpText, setHelpText] = useState('');

  /**
   * The old code used helpContainer.textContent to revert after 3 seconds. Here, we store
   * the original help text for each field so we can revert after showing an error.
   */
  const originalHelpTextRef = useRef('');

  /**
   * On load, the old code appended the label for the first field as a bot message, plus set helpText.
   * We replicate that in an effect. If fields[0] exists, we do:
   */
  useEffect(() => {
    if (fields.length > 0) {
      appendBotMessage(fields[0].label);
      originalHelpTextRef.current = fields[0].helpText || '';
      setHelpText(fields[0].helpText || '');
    }
    // The old code had no repeated logic here, so we omit the typical React dependency
  }, [fields]);

  /**
   * This replicates the old "appendBotMessage(...)" which inserted a new .bot message in the chat.
   */
  function appendBotMessage(text) {
    setMessages((prev) => [...prev, { sender: 'bot', text }]);
  }

  /**
   * This replicates the old "appendUserMessage(...)" which inserted a new .user message in the chat.
   */
  function appendUserMessage(text) {
    setMessages((prev) => [...prev, { sender: 'user', text }]);
  }

  /**
   * The old code listened for a "submit" click. If required and blank, show error for 3 seconds, else proceed.
   */
  function onSubmitClick() {
    if (!fields[currentStep]) return; // no field => no action

    const field = fields[currentStep];
    if (field.required) {
      // The old code: if answer is empty or (array with length 0 for checkboxes, etc.), show error
      const isEmpty = !answer || (Array.isArray(answer) && answer.length === 0);
      if (isEmpty) {
        // Show an error in help text:
        setHelpText(field.requiredMessage || `${field.label} is required.`);
        const oldText = originalHelpTextRef.current;

        // The old code used setTimeout to revert after 3 seconds
        setTimeout(() => {
          setHelpText(oldText);
        }, 3000);
        return;
      }
    }

    // The old code appended user’s typed or selected answer to chat
    const display = Array.isArray(answer) ? answer.join(', ') : String(answer);
    appendUserMessage(display);

    // Then proceed to the next step or submit
    storeAnswerAndGoNext(display);
  }

  /**
   * storeAnswerAndGoNext replicated from old code: sets the user’s response for the current field,
   * then if more fields remain, go next. Else finalize the form.
   */
  function storeAnswerAndGoNext(value) {
    const field = fields[currentStep];
    if (!field) return; // safety check

    const fieldKey = field.id || `field-${currentStep}`;

    setResponses((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // If we have more fields
    if (currentStep < fields.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      setAnswer(''); // reset for the next field

      // Old code: "append the label for the next field as a bot message"
      appendBotMessage(fields[nextIndex].label);

      // Also set the help text for that next field
      originalHelpTextRef.current = fields[nextIndex].helpText || '';
      setHelpText(fields[nextIndex].helpText || '');
    } else {
      // If that was the last field, we do final submission or show AI response
      submitForm();
    }
  }

  /**
   * The old code used "fetch" with action=process_smartform to finalize.
   * If success => show success message; else show error.
   */
  function submitForm() {
    const data = new URLSearchParams();
    data.append('action', 'process_smartform');
    data.append('smartform_nonce', nonce);
    data.append('form_id', formId);
    data.append('form_data', JSON.stringify(responses));

    fetch(ajaxUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setMessages([{ sender: 'bot', text: result.data.message }]);
        } else {
          const err = Array.isArray(result.data)
            ? result.data.join(' ')
            : String(result.data);
          setMessages([{ sender: 'bot', text: `Error: ${err}` }]);
        }
      })
      .catch((err) => {
        setMessages([{ sender: 'bot', text: `AJAX error: ${err}` }]);
      });
  }

  // If no fields at all, the old code showed a fallback message
  if (!fields.length) {
    return <div>No fields found in this form.</div>;
  }

  // The current field object
  const field = fields[currentStep];

  /**
   * Compute the fieldAlignment value from the field's attribute.
   * If field.fieldAlignment exists and is not empty, use it; otherwise, default to "left".
   */
  const fieldAlignmentValue =
    field.fieldAlignment && field.fieldAlignment.trim() !== ''
      ? field.fieldAlignment
      : 'left';

  /**
   * The old code conditionally rendered text, slider, etc. We do the same with our FieldRenderers.
   * The fieldAlignment setting (saved as "fieldAlignment") is passed to each component so that the
   * layout is controlled correctly.
   */
  function renderField() {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            value={answer}
            onChange={setAnswer}
            placeholder={field.placeholder}
            required={field.required}
            fieldAlignment={fieldAlignmentValue}
          />
        );
      case 'number':
        return (
          <NumberField
            value={answer}
            onChange={setAnswer}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            fieldAlignment={fieldAlignmentValue}
          />
        );
      case 'checkbox':
        return (
          <CheckboxGroup
            options={field.options || []}
            selected={Array.isArray(answer) ? answer : []}
            onChange={setAnswer}
            layout={field.layout}
            fieldAlignment={fieldAlignmentValue}
            required={field.required}
          />
        );
      case 'buttons':
        return (
          <div className="wp-block-smartforms-buttons">
            <FieldWrapper
              label={field.label}
              helpText={field.helpText}
              setLabel={() => {}}
              setHelpText={() => {}}
              labelPlaceholder={field.placeholder || ''}
              helpPlaceholder={field.helpText || ''}
              alignment={fieldAlignmentValue}
            >
              <div
                className={`sf-buttons-group ${getAlignmentClass(fieldAlignmentValue)}`}
                data-layout={field.layout}
              >
                <ButtonGroup
                  options={field.options || []}
                  current={answer}
                  onChange={setAnswer}
                  multiple={field.multiple}
                  layout={field.layout}
                  fieldAlignment={fieldAlignmentValue}
                  required={field.required}
                />
              </div>
            </FieldWrapper>
          </div>
        );
      case 'slider':
        return (
          <SliderField
            value={answer || field.defaultValue}
            onChange={setAnswer}
            min={field.min}
            max={field.max}
            step={field.step}
            unit={field.unit}
            unitPosition={field.unitPosition}
            required={field.required}
            fieldAlignment={fieldAlignmentValue}
          />
        );
      case 'dropdown':
        return (
          <DropdownField
            value={answer}
            onChange={setAnswer}
            placeholder={field.placeholder}
            required={field.required}
            fieldAlignment={fieldAlignmentValue}
            options={field.options || []}
          />
        );
      case 'radio':
        return (
          <RadioGroup
            value={answer}
            onChange={setAnswer}
            options={field.options || []}
            layout={field.layout}
            fieldAlignment={fieldAlignmentValue}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <TextareaField
            value={answer}
            onChange={setAnswer}
            placeholder={field.placeholder}
            required={field.required}
            fieldAlignment={fieldAlignmentValue}
          />
        );
      default:
        return (
          <TextField
            value={answer}
            onChange={setAnswer}
            placeholder={field.placeholder || ''}
            required={field.required}
            fieldAlignment={fieldAlignmentValue}
          />
        );
    }
  }

  return (
    <div className="smartforms-chat-wrapper">
      <div id="smartforms-chat-container" className="smartforms-chat-container">
        <div id="smartforms-chat-header" className="smartforms-chat-header">
          <h2 className="smartforms-chat-title">Chat Interface</h2>
        </div>
        <div id="smartforms-chat-dialog" className="smartforms-chat-dialog">
          {messages.map((m, idx) => (
            <div key={idx} className={`smartforms-chat-message ${m.sender}`}>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <form
          id="smartforms-chat-form"
          className="smartforms-chat-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            id="smartforms-chat-input-container"
            className="smartforms-chat-input-container"
          >
            <div
              id="smartforms-chat-input-box"
              className="smartforms-chat-input-box"
            >
              {renderField()}
            </div>
            <div
              id="smartforms-chat-submit-row"
              className="smartforms-chat-submit-row"
            >
              <div
                id="smartforms-chat-help-container"
                className="smartforms-chat-help-container"
              >
                {helpText}
              </div>
              <button
                type="button"
                id="smartforms-chat-submit-button"
                className={`btn smartforms-chat-submit-button ${field.required && !answer ? 'disabled' : ''}`}
                onClick={onSubmitClick}
              >
                <i className="fas fa-arrow-up smartforms-chat-submit-icon"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
