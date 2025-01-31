SmartForms Project Structure
============================

Overview
--------

SmartForms is an **AI-powered questionnaire tool** that dynamically adjusts based on user input. It is built as a Gutenberg-based system with multi-step forms, allowing users to receive intelligent recommendations powered by AI. This structure ensures flexibility, scalability, and proper integration with WordPress best practices.

* * * * *

Directory Structure
-------------------

```
smartforms/
├── assets/            # Static assets (CSS, images, icons, etc.)
├── build/             # Compiled JavaScript & CSS assets for production
├── includes/          # PHP backend logic (CPTs, form processing, AI handlers, API integration)
├── src/               # JavaScript source files (Gutenberg blocks)
│   ├── form/          # Parent Form block (handles navigation, AI processing, and user interaction)
│   ├── step/          # Step block (contains form fields, next/back buttons, and AI-driven adjustments)
│   ├── fields/        # Individual field blocks (text, checkbox, select, etc.)
│   │   ├── text-input/
│   │   ├── checkbox/
│   │   ├── radio/
│   │   ├── dropdown/
│   │   ├── slider/
│   ├── components/    # Shared React components (button UI, AI-driven responses, chat-like interface)
│   ├── hooks/         # Custom React hooks for handling AI logic and form state
├── templates/         # Optional PHP templates for AI-enhanced server-side rendering (if needed)
├── smartforms.php     # Main plugin file (initialization, enqueue scripts, AI processing logic)
├── package.json       # Dependencies & build scripts
├── README.md          # Project documentation

```

* * * * *

Block Architecture
------------------

### **1\. Form Block (`src/form/` - Parent Block)**

-   **Purpose:** Acts as the **main container** for AI-powered questionnaires.
-   **Stores global settings:** Form title, submission method, AI settings, validation rules.
-   **Handles navigation & AI logic:** Progress tracking, next/back buttons, API calls to AI models.
-   **Uses InnerBlocks** to hold Step blocks.

### **2\. Step Block (`src/step/` - Child Block)**

-   **Purpose:** Represents a single "page" in an AI-driven multi-step questionnaire.
-   **Contains:** Fields inside `InnerBlocks`, dynamically adjusted by AI.
-   **Navigation:** Has Next & Back buttons, with AI logic to determine the next step dynamically.

### **3\. Field Blocks (`src/fields/` - Grandchild Blocks)**

-   **Purpose:** Individual form inputs (Text, Checkbox, Select, etc.) that interact with AI.
-   **Each field has:**
    -   `edit.js`: Defines block settings & UI controls.
    -   `index.js`: Registers the block in Gutenberg.
    -   `style.scss`: Default styling.
    -   AI hooks to process user input dynamically.

* * * * *

Development Plan
----------------

1.  **Implement the Form (Parent) block with AI interaction**
2.  **Implement the Step block with AI-driven adjustments**
3.  **Convert form fields into independent AI-interactive blocks**
4.  **Implement AI-driven conditional logic (show/hide fields & steps dynamically based on AI responses)**
5.  **Style & refine the UI, ensuring a chat-like experience**

This structure ensures a clean, maintainable, and WordPress-native AI-powered questionnaire experience. 🚀