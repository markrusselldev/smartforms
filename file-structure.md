# Site Structure Overview for SmartForms Plugin
=============================================

=============================================

The SmartForms plugin project is organized into a modular structure to maintain clarity, scalability, and adherence to WordPress development best practices. Below is the detailed breakdown of the file structure and plugin design.

* * * * *

## File Structure
--------------

* * * * *

### Current File Structure

```
smartforms/
├── includes/
│   ├── class-smartforms.php         # Core plugin functionality.
│   ├── class-smartforms-handler.php # Handles form processing.
│   ├── class-admin-menu.php         # Admin menu and page rendering.
│   ├── class-block-editor-loader.php # Registers and handles Gutenberg blocks.
│
├── blocks/
│   ├── text-input.php               # PHP registration for the Text Input block.
│
├── src/
│   ├── text-input/                  # Source files for Text Input block.
│   │   ├── index.js
│   │   ├── edit.js
│   │   ├── save.js
|   |   ├── view.js
│   │   ├── block.json
|   |   ├── editor.scss
|   |   ├── style.scss
│
├── build/
│   ├── text-input/                  # Compiled assets for Text Input block.
│
├── templates/
│   ├── index.php                    # Placeholder for future templates.
│
├── assets/
│   ├── index.php                    # Placeholder for directory.
│
├── README.md                        # Documentation.
├── package.json                     # NPM dependencies for block building.
├── composer.json
├── phpcs.xml.dist
├── file-structure.md
└── smartforms.php                   # Main plugin bootstrap file.

```

### Proposed Final File Structure

```
smartforms/
├── includes/
│   ├── class-smartforms.php         # Core plugin functionality (activation, deactivation, singleton pattern).
│   ├── class-smartforms-handler.php # Handles form processing.
│   ├── class-admin-menu.php         # Admin menu and page rendering.
│   ├── class-rest-api-handler.php   # REST API endpoint handlers for forms and submissions.
│   ├── class-block-editor-loader.php # Embeds Gutenberg into the admin page.
│
├── blocks/
│   ├── form-block/
│   │   ├── index.js                 # Gutenberg block registration and logic.
│   │   ├── editor.css               # Editor-specific styles for the block.
│   │   ├── style.css                # Frontend styles for the block.
│
├── assets/
│   ├── css/                         # Stylesheets for admin and frontend.
│   │   ├── admin.css                # Admin-specific styles.
│   │   ├── frontend.css             # Frontend-specific styles.
│   ├── js/                          # JavaScript files for dynamic interactions.
│   │   ├── admin/
│   │   │   ├── smartforms-admin.js  # Scripts for admin interface.
│   │   ├── frontend/
│   │   │   ├── smartforms-frontend.js # Scripts for frontend interaction and AJAX.
│
├── templates/
│   ├── admin/                       # Templates for admin page rendering.
│   │   ├── dashboard.php            # Admin dashboard template.
│   │   ├── create-form.php          # Form creation template with embedded Gutenberg.
│   ├── frontend/                    # Templates for frontend output.
│   │   ├── chatbox.php              # Template for chatbox HTML container.
│   │   ├── form-render.php          # Template for rendering form fields dynamically.
│
├── languages/                       # Localization files (.mo, .po, .pot).
│   ├── smartforms.pot               # Translation template.
├── smartforms.php                   # Main plugin file, initializes the plugin.
└── README.md                        # Documentation for the plugin.

```

* * * * *

## Key Features
------------

* * * * *

1.  **Custom Post Type (`smart_form`)**:

    -   Stores form configurations and settings in post meta as structured JSON.
    -   Hidden from the default admin menu to consolidate plugin-related functionality.
2.  **Block Editor Integration**:

    -   The Gutenberg block editor is embedded directly into the plugin's custom "Create Form" admin page.
    -   Custom blocks allow site owners to build forms step-by-step, defining fields like buttons, dropdowns, and text inputs.
3.  **Dynamic Frontend Display**:

    -   Forms are rendered dynamically on the frontend using AJAX for seamless user interactions.
    -   Tailwind CSS provides professional, modern styling without requiring extensive custom CSS.
4.  **GPT-Powered Responses**:

    -   User inputs are processed by OpenAI's GPT API to generate intelligent, chatbot-style recommendations or responses.
5.  **Unified Admin Interface**:

    -   All plugin functionality (form creation, settings, etc.) is accessible via a single "SmartForms" menu in the admin area.
    -   This ensures a cohesive user experience and avoids conflicts with other plugins.

* * * * *

## Development Notes
-----------------

* * * * *

1.  **Modularity**:

    -   The plugin is designed with a modular structure, separating backend logic, assets, blocks, and templates for maintainability.
2.  **Scalability**:

    -   The architecture supports future extensions, such as new block types or integrations.
3.  **Adherence to Standards**:

    -   Uses WordPress best practices, including the REST API, block editor, and action/filter hooks.

### Block Building Structure

```
smartforms/
├── build/               # Compiled output for all blocks
├── src/                 # Source files for all blocks
│   ├── text-input/
│   │   ├── index.js     # Block registration and settings
│   │   ├── edit.js      # Block editor logic
│   │   ├── save.js      # Block frontend rendering
│   │   ├── block.json   # Gutenberg block metadata
│   └── checkbox/
│       ├── index.js
│       ├── edit.js
│       ├── save.js
│       ├── block.json
├── package.json         # Centralized dependencies
├── webpack.config.js    # Single Webpack config for all blocks
└── smartforms.php       # WordPress plugin bootstrap

```