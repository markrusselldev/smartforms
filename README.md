# SmartForms - AI-Powered Questionnaire

SmartForms is a WordPress plugin that enables users to create chatbot-style questionnaires with GPT-powered recommendations. This plugin leverages modern WordPress standards and AI technology to provide an intuitive and powerful tool for form creation.

## Features
- Create chatbot-style questionnaires.
- Integrates with GPT for intelligent recommendations.
- WordPress Coding Standards compliant.
- Clean and modular structure for easy customization.

---

## Installation

### Prerequisites
1. A WordPress installation (local or production).
2. Composer installed locally for dependency management.
3. Node.js (optional, for asset building if applicable).

### Steps to Install
1. **Clone the Repository:**
   ```bash
   git clone <repository-url> smartforms
   ```
2. **Navigate to the Plugin Folder:**
   ```bash
   cd smartforms
   ```
3. **Install Dependencies:**
   Run Composer to install PHP dependencies:
   ```bash
   composer install
   ```

4. **Verify Code Quality (Optional):**
   If you wish to check or enforce coding standards:
   ```bash
   ./vendor/bin/phpcs . --report=summary
   ```
   Fix any auto-fixable issues:
   ```bash
   ./vendor/bin/phpcbf .
   ```

5. **Activate the Plugin in WordPress:**
   - Copy the plugin folder into your WordPress installation's `wp-content/plugins/` directory, or keep it symlinked for development.
   - Log in to the WordPress admin dashboard, navigate to the Plugins section, and activate **SmartForms**.

---

## Development

### Coding Standards
This project adheres to WordPress Coding Standards (WPCS). Use PHP_CodeSniffer (PHPCS) to validate code quality.

#### Run PHPCS Locally
```bash
./vendor/bin/phpcs . --standard=phpcs.xml.dist --report=summary
```

#### Fix Auto-Fixable Issues
```bash
./vendor/bin/phpcbf .
```

### Directory Structure
- **`includes/`**: Core plugin files and logic.
- **`assets/`**: Frontend and backend assets (e.g., JavaScript, CSS).
- **`tests/`**: Files for testing and development purposes (excluded in production builds).
- **`smartforms.php`**: Main plugin file.

---

## License
This plugin is licensed under the GPLv2 (or later) License. You are free to modify and redistribute it under GPL-compatible terms. For more details, refer to the LICENSE file.

---

## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request with your enhancements or bug fixes.
