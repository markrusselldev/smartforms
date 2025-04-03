/**
 * smartforms-chat.jsx
 *
 * Entry point for the React-based SmartForms chat UI.
 * Reads JSON from <script id="smartforms-config">,
 * then uses createRoot to render <ChatApp>.
 *
 * @package SmartForms
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatApp from './ChatApp.jsx';

// Import the SCSS that styled your old chat so it looks the same
import './smartforms-chat.scss';

document.addEventListener('DOMContentLoaded', () => {
  const configEl = document.getElementById('smartforms-config');
  if (!configEl) {
    return;
  }

  let parsedConfig = {};
  try {
    parsedConfig = JSON.parse(configEl.textContent) || {};
  } catch (error) {
    console.error('Failed to parse JSON from #smartforms-config:', error);
    return;
  }

  const { formData, ajaxUrl, nonce, formId } = parsedConfig;

  // We mount into #smartforms-chat-root (provided by ChatUI::render())
  const rootEl = document.getElementById('smartforms-chat-root');
  if (!rootEl) {
    return;
  }

  const root = createRoot(rootEl);
  root.render(
    <ChatApp
      formData={formData}
      ajaxUrl={ajaxUrl}
      nonce={nonce}
      formId={formId}
    />,
  );
});
