/**
 * @file smartformsConfig.js
 * @description This module defines the SmartForms configuration object and a helper function
 * to update it. By importing this module, other ES6 modules (such as the chat UI logic)
 * can access and modify SmartForms settings (like form data, AJAX URL, nonce, and form ID)
 * without relying on global variables.
 */

// Export an object that holds configuration data used throughout the plugin.
export const smartformsConfig = {
  formData: null, // Holds the form JSON data (generated via MetaBox.php)
  ajaxUrl: '', // URL endpoint for AJAX submissions (set from PHP)
  nonce: '', // Security nonce for form submissions
  formId: null, // The ID of the current SmartForm being rendered
};

/**
 * Updates the smartformsConfig object by merging in new properties.
 *
 * @param {Object} newConfig - An object containing configuration properties to update.
 */
export function setSmartformsConfig(newConfig) {
  Object.assign(smartformsConfig, newConfig);
}
