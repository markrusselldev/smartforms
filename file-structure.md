SmartForms Project Structure
============================

Overview
--------

SmartForms is an **AI-powered questionnaire tool** that dynamically adjusts based on user input. It's built as a Gutenberg-based system featuring multi-step forms with parent, child, and grandchild block relationships. This structure ensures modularity, scalability, and proper adherence to WordPress best practices.

* * * * *

Directory Structure
-------------------
```
smartforms/
├── assets/             # Static assets (CSS, images, icons, etc.)
├── build/              # Compiled JavaScript & CSS assets for production
├── blocks/             # Gutenberg blocks registration and assets
│   ├── form/           # Parent Form block
│   │   ├── block.json  # Block metadata (name, title, category, etc.)
│   │   ├── index.js    # Registers the block; may import edit.js/save.js if needed
│   │   ├── edit.js     # Editor (backend) functionality (optional)
│   │   ├── save.js     # Front-end save/render function (if not dynamic)
│   │   ├── editor.scss # Editor-only styles
│   │   └── style.scss  # Front-end styles
│   ├── step/           # Child Step block (used within the Form block)
│   │   ├── block.json
│   │   ├── index.js
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── editor.scss
│   │   └── style.scss
│   └── fields/         # Grandchild Field blocks (individual form inputs)
│       ├── text-input/
│       │   ├── block.json
│       │   ├── index.js
│       │   ├── edit.js
│       │   ├── save.js
│       │   ├── editor.scss
│       │   ├── style.scss
|       |   └── dynamic.php
│       ├── checkbox/
│       │   ├── block.json
│       │   ├── index.js
│       │   ├── edit.js
│       │   ├── save.js
│       │   ├── editor.scss
│       │   └── style.scss
|       |   └── dynamic.php
│       ├── radio/
│       │   ├── block.json
│       │   ├── index.js
│       │   ├── edit.js
│       │   ├── save.js
│       │   ├── editor.scss
│       │   └── style.scss
|       |   └── dynamic.php
│       ├── dropdown/
│       │   ├── block.json
│       │   ├── index.js
│       │   ├── edit.js
│       │   ├── save.js
│       │   ├── editor.scss
│       │   └── style.scss
|       |   └── dynamic.php
│       └── slider/
│           ├── block.json
│           ├── index.js
│           ├── edit.js
│           ├── save.js
│           ├── editor.scss
│           ├── style.scss
|           └── dynamic.php
├── includes/           # PHP backend logic (custom post types, form processing, AI handlers, API integration, etc.)
├── src/                # Shared JavaScript source files and utilities (non-block–specific)
│   ├── components/     # Shared React components (buttons, chat UI, etc.)
│   └── hooks/          # Custom React hooks for AI logic and form state management
├── templates/          # Optional PHP templates for server-side rendering (if dynamic block rendering is needed)
├── smartforms.php      # Main plugin file (initialization, block registration, enqueue scripts, AI processing logic)
├── package.json        # Node package file (dependencies & build scripts)
└── README.md           # Project documentation
```

Block Architecture
------------------

### 1\. Form Block (Parent Block -- `blocks/form/`)

-   **Purpose:**\
    Serves as the main container for the AI-powered questionnaire.
-   **Responsibilities:**
    -   Stores global settings (form title, submission method, AI configurations, validation rules, etc.)
    -   Manages navigation and AI interactions (progress tracking, API calls, etc.)
    -   Contains an InnerBlocks area for the Step blocks

### 2\. Step Block (Child Block -- `blocks/step/`)

-   **Purpose:**\
    Represents a single "page" of the multi-step questionnaire.
-   **Responsibilities:**
    -   Contains an InnerBlocks area for placing Field blocks
    -   Provides Next and Back navigation with integrated AI logic to adjust flow

### 3\. Field Blocks (Grandchild Blocks -- `blocks/fields/`)

-   **Purpose:**\
    Individual form input components (e.g., text-input, checkbox, radio, dropdown, slider) that capture user data.
-   **Each Field Block Contains:**
    -   **block.json:** Metadata and asset declarations
    -   **index.js (and optionally edit.js/save.js):** Registration and behavior definitions
    -   **Styles:** Both editor (editor.scss) and front-end (style.scss) styles
-   **Usage:**\
    Field blocks are added as InnerBlocks within the Step block, allowing dynamic, AI-driven questionnaire construction.

* * * * *

Development Plan
----------------

1.  **Implement the Form (Parent) block** with its AI integration and InnerBlocks for steps.
2.  **Develop the Step block** to handle individual pages of the form with dynamic navigation.
3.  **Create Field blocks** as independent, reusable components that integrate with AI for conditional logic.
4.  **Incorporate AI-driven conditional logic** to show/hide fields and adjust steps based on responses.
5.  **Refine styling and UI components** to deliver a chat-like, responsive user experience.

* * * * *