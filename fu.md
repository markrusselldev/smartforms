# .eslintrc.js

```js
module.exports = {
	env: {
	  browser: true,
	  es2021: true,
	  node: true,
	},
	extends: [
	  'eslint:recommended',
	  'plugin:@wordpress/eslint-plugin/recommended',
	  'plugin:prettier/recommended' // Disables conflicting rules and integrates Prettier
	],
	parserOptions: {
	  ecmaVersion: 12,
	  sourceType: 'module'
	},
	rules: {
	  // Customize any additional rules here.
	}
  };
  
```

# .prettierrc

```
{
	"singleQuote": true,
	"trailingComma": "all",
	"printWidth": 80,
	"tabWidth": 2,
	"endOfLine": "lf"
  }
  
```

# .vscode/settings.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "phpcs.executablePath": "/var/www/html/wp-content/plugins/smartforms/vendor/bin/phpcs",
  "phpcbf.executablePath": "/var/www/html/wp-content/plugins/smartforms/vendor/bin/phpcbf",
  "phpcs.standard": "WordPress-Core",
  "prettier.requireConfig": true,
  "[php]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": null
  }
}

```

# .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Fix PHP File",
      "type": "shell",
      "command": "/var/www/html/wp-content/plugins/smartforms/vendor/bin/phpcbf",
      "args": ["${file}", "--standard=WordPress-Core"],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      },
      "group": {
        "kind": "build",
        "isDefault": false
      },
      "problemMatcher": []
    }
  ]
}

```

# assets/index.php

```php

```

# composer.json

```json
{
  "name": "your-vendor/smartforms",
  "description": "SmartForms WordPress plugin that creates chatbot-style questionnaires.",
  "type": "wordpress-plugin",
  "license": "GPL-2.0-or-later",
  "require-dev": {
    "squizlabs/php_codesniffer": "^3.11",
    "wp-coding-standards/wpcs": "^2.3.0",
    "phpcsstandards/phpcsextra": "^1.2.1",
    "phpcsstandards/phpcsutils": "^1.0",
    "dealerdirect/phpcodesniffer-composer-installer": "^1.0",
    "friendsofphp/php-cs-fixer": "^3.68"
  },
  "autoload": {
    "psr-4": {
      "SmartForms\\": "includes/",
		  "Universal\\": "includes/Universal/"
    }
  },
  "scripts": {
    "phpcs": "phpcs --standard=WordPress ."
  },
  "config": {
    "allow-plugins": {
      "dealerdirect/phpcodesniffer-composer-installer": true
    }
  }
}

```

# file-structure.md

```md
SmartForms Project Structure
============================

Overview
--------

SmartForms is an **AI-powered questionnaire tool** that dynamically adjusts based on user input. It's built as a Gutenberg-based system featuring multi-step forms with parent, child, and grandchild block relationships. This structure ensures modularity, scalability, and proper adherence to WordPress best practices.

* * * * *

Directory Structure
-------------------
\`\`\`
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
\`\`\`

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
```

# includes/Admin/AdminMenu.php

```php
<?php
/**
 * Handles admin menu and related functionality, including custom columns and bulk actions.
 *
 * @package SmartForms
 */

namespace SmartForms\Admin;

use WP_Error;
use SmartForms\Core\SmartForms; // Import the core SmartForms class for logging.

/**
 * Admin menu class for SmartForms plugin.
 */
class AdminMenu {

	/**
	 * Constructor to hook into WordPress actions.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_smartforms_menu' ) );
		add_filter( 'parent_file', array( $this, 'set_active_menu' ) );
		add_filter( 'submenu_file', array( $this, 'set_active_submenu' ) );
		add_filter( 'manage_smart_form_posts_columns', array( $this, 'add_custom_columns' ) );
		add_action( 'manage_smart_form_posts_custom_column', array( $this, 'render_custom_columns' ), 10, 2 );
		add_filter( 'bulk_actions-edit-smart_form', array( $this, 'register_bulk_action' ) );
		add_action( 'handle_bulk_actions-edit-smart_form', array( $this, 'handle_bulk_duplicate_action' ), 10, 3 );
	}

	/**
	 * Add SmartForms menu and submenu items.
	 *
	 * @return void
	 */
	public function add_smartforms_menu() {
		add_menu_page(
			esc_html__( 'SmartForms', 'smartforms' ),
			esc_html__( 'SmartForms', 'smartforms' ),
			'manage_options',
			'smartforms',
			array( $this, 'render_forms_list' ),
			'dashicons-feedback',
			20
		);
	}

	/**
	 * Redirects to the Forms list page.
	 *
	 * @return void
	 */
	public function render_forms_list() {
		wp_safe_redirect( admin_url( 'edit.php?post_type=smart_form' ) );
		exit;
	}

	/**
	 * Set the active parent menu item.
	 *
	 * @param string $parent_file The current parent file.
	 * @return string The modified parent file.
	 */
	public function set_active_menu( $parent_file ) {
		$screen = get_current_screen();

		if ( $screen && 'smart_form' === $screen->post_type ) {
			return 'smartforms';
		}

		return $parent_file;
	}

	/**
	 * Set the active submenu item.
	 *
	 * @param string $submenu_file The current submenu file.
	 * @return string The modified submenu file.
	 */
	public function set_active_submenu( $submenu_file ) {
		$screen = get_current_screen();

		if ( $screen && 'smart_form' === $screen->post_type ) {
			return 'edit.php?post_type=smart_form';
		}

		return $submenu_file;
	}

	/**
	 * Add custom columns to the Forms list page.
	 *
	 * @param array $columns The current columns.
	 * @return array The modified columns.
	 */
	public function add_custom_columns( $columns ) {
		$columns['number_of_fields'] = esc_html__( 'Number of Fields', 'smartforms' );
		$columns['last_modified']    = esc_html__( 'Last Modified', 'smartforms' );
		return $columns;
	}

	/**
	 * Render custom column content.
	 *
	 * @param string $column The name of the column.
	 * @param int    $post_id The post ID.
	 * @return void
	 */
	public function render_custom_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'number_of_fields':
				$field_count = get_post_meta( $post_id, '_smart_form_field_count', true );
				// Replace short ternary with explicit ternary operator.
				echo esc_html( intval( $field_count ) ? intval( $field_count ) : '0' );
				break;

			case 'last_modified':
				$last_modified = get_post_modified_time( 'Y/m/d H:i', false, $post_id );
				echo esc_html( $last_modified );
				break;
		}
	}

	/**
	 * Register the "Duplicate" bulk action.
	 *
	 * @param array $bulk_actions The current bulk actions.
	 * @return array The modified bulk actions.
	 */
	public function register_bulk_action( $bulk_actions ) {
		$bulk_actions['duplicate'] = esc_html__( 'Duplicate', 'smartforms' );
		return $bulk_actions;
	}

	/**
	 * Handle the "Duplicate" bulk action.
	 *
	 * @param string $redirect_url The redirect URL.
	 * @param string $action The action name.
	 * @param array  $post_ids The selected post IDs.
	 * @return string The modified redirect URL.
	 */
	public function handle_bulk_duplicate_action( $redirect_url, $action, $post_ids ) {
		if ( 'duplicate' !== $action ) {
			return $redirect_url;
		}

		foreach ( $post_ids as $post_id ) {
			$post = get_post( $post_id );

			if ( ! $post ) {
				SmartForms::log_error( 'Failed to duplicate: Post not found. ID: ' . esc_html( $post_id ) );
				continue;
			}

			$new_post_id = wp_insert_post(
				array(
					'post_title'   => sanitize_text_field( $post->post_title ) . ' (Copy)',
					'post_content' => wp_kses_post( $post->post_content ),
					'post_status'  => sanitize_text_field( $post->post_status ),
					'post_type'    => sanitize_text_field( $post->post_type ),
				),
				true
			);

			if ( is_wp_error( $new_post_id ) ) {
				SmartForms::log_error(
					'Post duplication failed for ID: ' . esc_html( $post_id ),
					$new_post_id
				);
				continue;
			}

			$meta = get_post_meta( $post_id );
			foreach ( $meta as $key => $values ) {
				foreach ( $values as $value ) {
					add_post_meta( $new_post_id, sanitize_key( $key ), maybe_unserialize( $value ) );
				}
			}

			SmartForms::log_error(
				'Form duplicated successfully: Original ID ' . esc_html( $post_id ) . ' -> New ID ' . esc_html( $new_post_id )
			);
		}

		$redirect_url = add_query_arg( 'bulk_duplicate', count( $post_ids ), $redirect_url );
		return esc_url_raw( $redirect_url );
	}
}

```

# includes/Admin/MetaBox.php

```php
<?php
/**
 * Automatically generate JSON data from Gutenberg blocks when a SmartForm is saved.
 *
 * @package SmartForms
 */

namespace SmartForms\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

use WP_Error;
use SmartForms\Core\SmartForms; // Import the core SmartForms class for logging;

/**
 * MetaBox class for handling form JSON generation.
 */
class MetaBox {

	/**
	 * The singleton instance.
	 *
	 * @var MetaBox|null
	 */
	private static $instance = null;

	/**
	 * Retrieves the singleton instance.
	 *
	 * @return MetaBox The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Private constructor to prevent direct instantiation.
	 */
	private function __construct() {
		SmartForms::log_error( 'MetaBox::__construct() called.' );
		// Only add the hook if it hasn't already been added.
		if ( ! has_action( 'save_post', array( $this, 'smartforms_generate_json_on_save' ) ) ) {
			add_action( 'save_post', array( $this, 'smartforms_generate_json_on_save' ) );
		}
	}

	/**
	 * Prevent cloning.
	 */
	private function __clone() {}

	/**
	 * Prevent unserialization.
	 */
	public function __wakeup() {}

	/**
	 * Extracts block data and saves JSON into post meta.
	 *
	 * @param int $post_id The post ID.
	 * @return void|WP_Error Returns WP_Error on failure.
	 */
	public function smartforms_generate_json_on_save( $post_id ) {
		// Verify post type.
		if ( 'smart_form' !== get_post_type( $post_id ) ) {
			return;
		}
		// Prevent autosave interference.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Check for a valid post status.
		$post_status = get_post_status( $post_id );
		if ( 'auto-draft' === $post_status || 'trash' === $post_status ) {
			return;
		}
		// Get post content (Gutenberg block structure).
		$post_content = get_post_field( 'post_content', $post_id );
		$blocks       = parse_blocks( $post_content );
		// Convert blocks to structured JSON format.
		$form_fields = array();
		foreach ( $blocks as $block ) {
			if ( isset( $block['blockName'] ) && false !== strpos( $block['blockName'], 'smartforms/' ) ) {
				// Determine the block type (e.g., "text", "number", etc.).
				$type = str_replace( 'smartforms/', '', sanitize_text_field( $block['blockName'] ) );
				// Common field data.
				$form_field = array(
					'type'        => $type,
					'label'       => ( isset( $block['attrs']['label'] ) && '' !== $block['attrs']['label'] )
						? sanitize_text_field( $block['attrs']['label'] )
						: self::get_default_label( $block['blockName'] ),
					'placeholder' => isset( $block['attrs']['placeholder'] ) ? sanitize_text_field( $block['attrs']['placeholder'] ) : '',
					'required'    => isset( $block['attrs']['required'] ) ? (bool) $block['attrs']['required'] : false,
					'helpText'    => isset( $block['attrs']['helpText'] ) ? sanitize_text_field( $block['attrs']['helpText'] ) : '',
				);

				// Process block-type–specific attributes.
				switch ( $type ) {
					case 'number':
						// Merge number field–specific settings, plus fieldAlignment & fieldSize.
						$field_alignment = isset( $block['attrs']['fieldAlignment'] ) ? sanitize_text_field( $block['attrs']['fieldAlignment'] ) : 'left';
						$field_size      = isset( $block['attrs']['fieldSize'] ) ? sanitize_text_field( $block['attrs']['fieldSize'] ) : 'medium';

						$form_field = array_merge(
							$form_field,
							array(
								'min'            => isset( $block['attrs']['min'] ) ? floatval( $block['attrs']['min'] ) : 0,
								'max'            => isset( $block['attrs']['max'] ) ? floatval( $block['attrs']['max'] ) : 100,
								'step'           => isset( $block['attrs']['step'] ) ? floatval( $block['attrs']['step'] ) : 1,
								'defaultValue'   => isset( $block['attrs']['defaultValue'] ) ? floatval( $block['attrs']['defaultValue'] ) : 0,
								'fieldAlignment' => $field_alignment,
								'fieldSize'      => $field_size,
							)
						);
						break;

					case 'checkbox':
						// Process checkbox-specific settings.
						if ( isset( $block['attrs']['options'] ) && is_array( $block['attrs']['options'] ) && ! empty( $block['attrs']['options'] ) ) {
							$options = array();
							foreach ( $block['attrs']['options'] as $option ) {
								if ( isset( $option['label'], $option['value'] ) ) {
									$options[] = array(
										'label' => sanitize_text_field( $option['label'] ),
										'value' => sanitize_text_field( $option['value'] ),
									);
								} else {
									SmartForms::log_error( "Checkbox option missing label or value for post $post_id." );
								}
							}
						} else {
							SmartForms::log_error( "Checkbox block missing options for post $post_id." );
							$options = array(
								array(
									'label' => 'Option 1',
									'value' => 'option-1',
								),
								array(
									'label' => 'Option 2',
									'value' => 'option-2',
								),
							);
						}
						$layout = array_key_exists( 'layout', $block['attrs'] ) ? sanitize_text_field( $block['attrs']['layout'] ) : 'horizontal';
						// Append options last.
						$form_field = array_merge(
							$form_field,
							array(
								'layout'  => $layout,
								'options' => $options,
							)
						);
						break;

					case 'buttons':
						// Process buttons-specific settings.
						if ( isset( $block['attrs']['options'] ) && is_array( $block['attrs']['options'] ) && ! empty( $block['attrs']['options'] ) ) {
							$options = array();
							foreach ( $block['attrs']['options'] as $option ) {
								if ( isset( $option['label'], $option['value'] ) ) {
									$options[] = array(
										'label' => sanitize_text_field( $option['label'] ),
										'value' => sanitize_text_field( $option['value'] ),
									);
								} else {
									SmartForms::log_error( "Buttons option missing label or value for post $post_id." );
								}
							}
						} else {
							SmartForms::log_error( "Buttons block missing options for post $post_id." );
							$options = array(
								array(
									'label' => 'Option 1',
									'value' => 'option-1',
								),
								array(
									'label' => 'Option 2',
									'value' => 'option-2',
								),
							);
						}
						$multiple = isset( $block['attrs']['multiple'] ) ? (bool) $block['attrs']['multiple'] : false;
						$layout   = array_key_exists( 'layout', $block['attrs'] ) ? sanitize_text_field( $block['attrs']['layout'] ) : 'horizontal';
						// Append options last.
						$form_field = array_merge(
							$form_field,
							array(
								'multiple' => $multiple,
								'layout'   => $layout,
								'options'  => $options,
							)
						);
						break;

					case 'text':
						// Text field: no additional processing required.
						break;

					case 'radio':
						// Radio buttons: no additional processing required.
						break;

					case 'select':
						// Dropdown select: no additional processing required.
						break;

					case 'slider':
						// Slider field: no additional processing required.
						break;

					case 'textarea':
						// Textarea field: no additional processing required.
						break;

					case 'progress':
						// Progress indicator: no additional processing required.
						break;

					default:
						// For any other block types, no additional processing is done.
						break;
				}
				$form_fields[] = $form_field;
			}
		}
		$json_data = wp_json_encode( array( 'fields' => $form_fields ) );
		if ( false === $json_data ) {
			SmartForms::log_error( '[ERROR] Failed to encode form data JSON for Form ID: ' . esc_html( $post_id ) );
			return new WP_Error(
				'json_encoding_failed',
				esc_html__( 'Failed to encode form data JSON.', 'smartforms' )
			);
		}
		update_post_meta( $post_id, 'smartforms_data', $json_data );
		SmartForms::log_error( "[DEBUG] Form data JSON saved for Form ID: $post_id" );
	}

	/**
	 * Returns a default label for a given block if none is set.
	 *
	 * @param string $block_name The block name (e.g. "smartforms/text").
	 * @return string Default label based on the block type.
	 */
	private static function get_default_label( $block_name ) {
		// For consistent UX, all default labels are now set to the same prompt.
		return 'Type your question here...';
	}
}

// Note: Do not call MetaBox::get_instance() here.
// It is now initialized via SmartForms::initialize_classes().

```

# includes/Core/API.php

```php
<?php
/**
 * API Endpoint to Fetch SmartForms Data.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use SmartForms\Core\SmartForms; // For logging.

/**
 * Class API
 *
 * Registers and handles the REST API endpoints for SmartForms.
 */
class API {

	/**
	 * Constructor.
	 *
	 * Hooks the register_routes method to rest_api_init.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Registers the REST API routes for SmartForms.
	 *
	 * @return void
	 */
	public function register_routes() {
		// Route for form data.
		register_rest_route(
			'smartforms/v1',
			'/form/(?P<id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_form_data' ),
				'permission_callback' => '__return_true',
			)
		);

		// Route for global chat UI styling.
		register_rest_route(
			'smartforms/v1',
			'/global-styles',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_global_styles' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Fetches form data for preview mode.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error JSON response with form content or WP_Error.
	 */
	public function get_form_data( WP_REST_Request $request ) {
		$form_id = $request->get_param( 'id' );

		// Validate form ID.
		if ( empty( $form_id ) || ! is_numeric( $form_id ) ) {
			$error = new WP_Error(
				'invalid_form_id',
				esc_html__( 'Invalid form ID.', 'smartforms' ),
				array( 'status' => 400 )
			);
			SmartForms::log_error( 'Invalid form ID provided: ' . esc_html( $form_id ), $error );
			return $error;
		}

		$form = get_post( (int) $form_id );

		// Check if the form exists and has the correct post type.
		if ( ! $form || 'smart_form' !== get_post_type( (int) $form_id ) ) {
			$error = new WP_Error(
				'form_not_found',
				esc_html__( 'Form not found.', 'smartforms' ),
				array( 'status' => 404 )
			);
			SmartForms::log_error( 'Form not found for ID: ' . esc_html( $form_id ), $error );
			return $error;
		}

		// Fetch form JSON config.
		$form_data = get_post_meta( (int) $form_id, 'smartforms_data', true );

		// Decode JSON data safely.
		$form_json = json_decode( $form_data, true );
		if ( empty( $form_json ) ) {
			$error = new WP_Error(
				'form_data_missing',
				esc_html__( 'Form data missing.', 'smartforms' ),
				array( 'status' => 404 )
			);
			SmartForms::log_error( 'No JSON data found for form ID: ' . esc_html( $form_id ), $error );
			return $error;
		}

		SmartForms::log_error( '[DEBUG] Returning form data for ID: ' . esc_html( $form_id ) );
		return new WP_REST_Response( $form_json, 200 );
	}

	/**
	 * Returns the global chat UI styling options.
	 *
	 * @return WP_REST_Response The global styling settings.
	 */
	public function get_global_styles() {
		// Define default styles matching the ChatUISettings configuration.
		$default = array(
			'background_color' => '#ffffff',
			'border_color'     => '#cccccc',
			'border_style'     => 'solid',
			'border_width'     => 1,
			'border_radius'    => 10,
			'box_shadow'       => 'none',
		);
		// Retrieve styles using the correct option key as registered in ChatUISettings.php.
		$styles = get_option( 'smartforms_chat_ui_styles', $default );
		return new WP_REST_Response( $styles, 200 );
	}
}

```

# includes/Core/BlockEditorLoader.php

```php
<?php
/**
 * Handles Gutenberg block loading for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use WP_Error;

/**
 * Block Editor Loader Class.
 *
 * Dynamically registers Gutenberg blocks inside the SmartForms editor
 * and enqueues editor assets.
 */
class BlockEditorLoader {

	/**
	 * Singleton instance.
	 *
	 * @var BlockEditorLoader|null
	 */
	private static $instance = null;

	/**
	 * Flag to ensure blocks are registered only once.
	 *
	 * @var bool
	 */
	private static $registered = false;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return BlockEditorLoader The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress actions and filters to load blocks and editor assets.
	 */
	private function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_assets' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_filter( 'block_categories_all', array( $this, 'add_smartforms_block_category' ), 10, 1 );
	}

	/**
	 * Register all SmartForms blocks dynamically.
	 *
	 * Scans the `build/blocks/` directory for `block.json` files and registers them.
	 *
	 * @return void
	 */
	public function register_blocks() {
		// Prevent duplicate registration.
		if ( did_action( 'init' ) > 1 || self::$registered ) {
			return;
		}
		self::$registered = true;

		$blocks = array(
			'smartforms-text',
			'smartforms-number',
			'smartforms-radio',
			'smartforms-checkbox',
			'smartforms-buttons',
			'smartforms-select',
			'smartforms-slider',
			'smartforms-textarea',
			'smartforms-group',
			'smartforms-progress',
		);

		// Use __DIR__ to build the path (current __DIR__ is "smartforms/includes/Core").
		$build_dir = __DIR__ . '/../../build/blocks/';

		foreach ( $blocks as $block ) {
			$block_path = $build_dir . $block;
			// Ensure block.json exists before registration.
			if ( file_exists( $block_path . '/block.json' ) ) {
				$args = array();
				$result = register_block_type_from_metadata( $block_path, $args );
				/**
				 * Handles block registration errors.
				 *
				 * @var WP_Error $result
				 */
				if ( is_wp_error( $result ) ) {
					\SmartForms\Core\SmartForms::log_error(
						sprintf(
							'Failed to register block: %s - %s',
							esc_url( $block_path ),
							$result->get_error_message()
						),
						$result
					);
				} else {
					\SmartForms\Core\SmartForms::log_error( '[DEBUG] Block successfully registered: ' . esc_url( $block_path ) );
				}
			} else {
				\SmartForms\Core\SmartForms::log_error( '[ERROR] block.json not found in: ' . esc_url( $block_path ) );
			}
		}
	}

	/**
	 * Enqueue block editor scripts and styles for SmartForms blocks.
	 *
	 * @return void
	 */
	public function enqueue_block_assets() {
		$build_dir = __DIR__ . '/../../build/blocks/';

		if ( ! is_dir( $build_dir ) ) {
			\SmartForms\Core\SmartForms::log_error( '[ERROR] SmartForms build directory not found for assets: ' . esc_url( $build_dir ) );
			return;
		}

		$block_folders = scandir( $build_dir );
		if ( false === $block_folders || empty( $block_folders ) ) {
			\SmartForms\Core\SmartForms::log_error( '[ERROR] No compiled blocks found inside build/blocks/ directory.' );
			return;
		}

		// Enqueue editor assets.
		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			$block_path  = $build_dir . $folder;
			$script_path = $block_path . '/index.js';
			$style_path  = $block_path . '/index.css';

			if ( file_exists( $script_path ) ) {
				wp_enqueue_script(
					'smartforms-' . $folder . '-editor-script',
					plugins_url( 'build/blocks/' . $folder . '/index.js', \SMARTFORMS_PLUGIN_FILE ),
					array( 'wp-blocks', 'wp-element', 'wp-editor' ),
					filemtime( $script_path ),
					true
				);
				wp_script_add_data( 'smartforms-' . $folder . '-editor-script', 'type', 'module' );
			}

			if ( file_exists( $style_path ) ) {
				wp_enqueue_style(
					'smartforms-' . $folder . '-editor-style',
					plugins_url( 'build/blocks/' . $folder . '/index.css', \SMARTFORMS_PLUGIN_FILE ),
					array(),
					filemtime( $style_path )
				);
			}
		}
	}

	/**
	 * Add the SmartForms block category for the SmartForms post type.
	 *
	 * @param array $categories Existing block categories.
	 * @return array Modified block categories.
	 */
	public function add_smartforms_block_category( $categories ) {
		\SmartForms\Core\SmartForms::log_error( '[DEBUG] Adding SmartForms block category.' );

		$smartforms_category = array(
			'slug'  => 'smartforms',
			'title' => __( 'SmartForms Blocks', 'smartforms' ),
		);

		array_unshift( $categories, $smartforms_category );
		\SmartForms\Core\SmartForms::log_error( '[DEBUG] SmartForms block category moved to the top.' );

		return $categories;
	}
}

```

# includes/Core/BlockFrontendAssets.php

```php
<?php
/**
 * Handles frontend asset enqueuing for SmartForms blocks.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use SmartForms\Core\SmartForms;

class BlockFrontendAssets {

	/**
	 * Singleton instance.
	 *
	 * @var BlockFrontendAssets|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return BlockFrontendAssets The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Hooks into the frontend assets enqueue action.
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ), 999 );
	}

	/**
	 * Enqueues frontend styles and scripts for SmartForms blocks.
	 *
	 * It scans the build/blocks/ directory for each block’s CSS and a frontend JS file,
	 * enqueuing them as necessary.
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		// Build the filesystem path to the blocks directory.
		$build_dir = plugin_dir_path( SMARTFORMS_PLUGIN_FILE ) . 'build/blocks/';

		// Get the plugin root URL.
		$plugin_root_url = plugin_dir_url( SMARTFORMS_PLUGIN_FILE );

		if ( ! is_dir( $build_dir ) ) {
			SmartForms::log_error( '[ERROR] SmartForms build directory not found for frontend assets: ' . esc_url( $build_dir ) );
			return;
		}

		$block_folders = scandir( $build_dir );
		if ( false === $block_folders || empty( $block_folders ) ) {
			SmartForms::log_error( '[ERROR] No compiled blocks found inside build/blocks/ directory for frontend assets.' );
			return;
		}

		// Enqueue each block's frontend stylesheet and script if available.
		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			// Enqueue frontend stylesheet if it exists.
			$frontend_style_path = $build_dir . $folder . '/style-index.css';
			if ( file_exists( $frontend_style_path ) ) {
				wp_enqueue_style(
					'smartforms-' . $folder . '-frontend-style',
					plugins_url( 'build/blocks/' . $folder . '/style-index.css', SMARTFORMS_PLUGIN_FILE ),
					array( 'bootstrap-css' ), // Ensuring Bootstrap loads first.
					filemtime( $frontend_style_path )
				);
			}

			// Enqueue frontend JavaScript if it exists.
			$frontend_js_path = $build_dir . $folder . '/frontend.js';
			if ( file_exists( $frontend_js_path ) ) {
				wp_enqueue_script(
					'smartforms-' . $folder . '-frontend-script',
					plugins_url( 'build/blocks/' . $folder . '/frontend.js', SMARTFORMS_PLUGIN_FILE ),
					array(), // Add dependencies here if needed.
					filemtime( $frontend_js_path ),
					true
				);
			}
		}
	}
}

BlockFrontendAssets::get_instance();

```

# includes/Core/ChatUI.php

```php
<?php
/**
 * Handles the rendering of the SmartForms Chat UI.
 *
 * Retrieves form JSON data (saved as post meta) and the selected theme preset styles,
 * then outputs the chat interface. The interface steps through each form question –
 * displaying only the current question (as a bot message) in the chat dialog area.
 * Once all questions are answered, a dummy AI response is appended and the input area
 * reverts to a standard chat textarea.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use SmartForms\CPT\ChatUISettings;

class ChatUI {

	/**
	 * Renders the chat UI for a given form ID.
	 *
	 * @param int $form_id The ID of the form to render.
	 * @return string HTML output for the chat UI.
	 */
	public static function render( $form_id ) {
		return self::render_chat_ui( $form_id );
	}

	/**
	 * Renders the production-ready chat interface.
	 *
	 * If a valid form ID is provided and saved JSON exists, that JSON (decoded as an
	 * associative array) is used for the multi-step questions. Otherwise, dummy data is used.
	 *
	 * @param int $form_id Optional form ID to load saved questions.
	 * @return string HTML output for the chat UI.
	 */
	public static function render_chat_ui( $form_id = 0 ) {
		// Retrieve theme preset styles.
		$theme_styles = ChatUISettings::get_instance()->get_selected_theme_styles();

		// Load saved form data from post meta.
		$form_data = array();
		if ( $form_id ) {
			$saved_json = get_post_meta( $form_id, 'smartforms_data', true );
			$form_data  = $saved_json ? json_decode( $saved_json, true ) : array();
		}

		// Fallback dummy data if no saved data exists.
		if ( empty( $form_data ) || ! isset( $form_data['fields'] ) ) {
			$form_data = array(
				'fields' => array(
					array(
						'type'              => 'text',
						'label'             => 'Text Input',
						'placeholder'       => '',
						'required'          => true,
						'helpText'          => '',
						'validationMessage' => '',
					),
				),
			);
		}

		// Assume the current field is the first one for help text.
		$current_field = isset( $form_data['fields'][0] ) ? $form_data['fields'][0] : array();

		// Build dynamic CSS.
		$chat_bg_color   = esc_attr( $theme_styles['smartforms_chat_container_background_color'] ?? '#ffffff' );
		$border_color    = esc_attr( $theme_styles['smartforms_chat_container_border_color'] ?? '#cccccc' );
		$border_style    = esc_attr( $theme_styles['smartforms_chat_container_border_style'] ?? 'solid' );
		$border_width    = absint( $theme_styles['smartforms_chat_container_border_width'] ?? 1 );
		$border_radius   = absint( $theme_styles['smartforms_chat_container_border_radius'] ?? 10 );
		$box_shadow      = esc_attr( $theme_styles['smartforms_chat_container_box_shadow'] ?? 'none' );
		$padding         = esc_attr( $theme_styles['smartforms_chat_container_padding'] ?? '10px' );
		$max_width       = esc_attr( $theme_styles['smartforms_chat_container_max_width'] ?? '800px' );
		$flex_direction  = esc_attr( $theme_styles['smartforms_chat_container_flex_direction'] ?? 'column' );
		$justify_content = esc_attr( $theme_styles['smartforms_chat_container_justify_content'] ?? 'center' );
		$align_items     = esc_attr( $theme_styles['smartforms_chat_container_align_items'] ?? 'center' );

		$css = <<<CSS
<style>
#smartforms-chat-container {
	--chat-bg-color: {$chat_bg_color};
	--chat-border-color: {$border_color};
	--chat-border-style: {$border_style};
	--chat-border-width: {$border_width}px;
	--chat-border-radius: {$border_radius}px;
	--chat-box-shadow: {$box_shadow};
	--chat-padding: {$padding};
	--chat-max-width: {$max_width};
	--chat-flex-direction: {$flex_direction};
	--chat-justify-content: {$justify_content};
	--chat-align-items: {$align_items};
}
</style>
CSS;

		// Determine wrapper classes.
		$wrapper_class = 'smartforms-chat-wrapper';
		if ( is_admin() ) {
			$wrapper_class .= ' admin-display';
		} elseif ( is_admin_bar_showing() ) {
			$wrapper_class .= ' admin-bar-present';
		}

		ob_start();
		?>
		<?php echo $css; ?>
		<div class="<?php echo esc_attr( $wrapper_class ); ?>">
			<div id="smartforms-chat-container" class="smartforms-chat-container">
				<div id="smartforms-chat-header" class="smartforms-chat-header">
					<h2 class="smartforms-chat-title"><?php esc_html_e( 'Chat Interface', 'smartforms' ); ?></h2>
				</div>
				<div id="smartforms-chat-dialog" class="smartforms-chat-dialog"></div>
				<form id="smartforms-chat-form" class="smartforms-chat-form">
					<div id="smartforms-chat-input-container" class="smartforms-chat-input-container">
						<div id="smartforms-chat-input-box" class="smartforms-chat-input-box">
							<textarea id="smartforms-current-input" class="form-control smartforms-chat-input" rows="4" placeholder="<?php esc_attr_e( 'Type your answer here...', 'smartforms' ); ?>"></textarea>
						</div>
						<div id="smartforms-chat-submit-row" class="smartforms-chat-submit-row">
							<div id="smartforms-chat-help-container" class="smartforms-chat-help-container">
								<?php
								// For non-buttons fields, output their saved helpText.
								echo isset( $current_field['helpText'] ) ? esc_html( $current_field['helpText'] ) : '';
								?>
							</div>
							<button type="button" id="smartforms-chat-submit-button" class="btn smartforms-chat-submit-button">
								<i class="<?php echo esc_attr( $theme_styles['smartforms_chat_submit_button_icon'] ?? 'fas fa-arrow-up' ); ?> smartforms-chat-submit-icon"></i>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<script type="application/json" id="smartforms-config">
			<?php echo wp_json_encode( array( 'formData' => $form_data, 'formId' => get_the_ID() ) ); ?>
		</script>
		<?php
		return ob_get_clean();
	}
}

```

# includes/Core/SmartForms.php

```php
<?php
/**
 * Core plugin functionality for SmartForms.
 *
 * Initializes components, enqueues assets, and handles activation/deactivation.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

class SmartForms {

	/**
	 * Singleton instance of the SmartForms plugin.
	 *
	 * @var SmartForms|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return SmartForms
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Activation hook.
	 *
	 * Adds default options and flushes rewrite rules.
	 *
	 * @return void
	 */
	public static function activate() {
		add_option( 'smartforms_version', '1.0.0' );
		flush_rewrite_rules();
	}

	/**
	 * Deactivation hook.
	 *
	 * Removes options and flushes rewrite rules.
	 *
	 * @return void
	 */
	public static function deactivate() {
		delete_option( 'smartforms_version' );
		flush_rewrite_rules();
	}

	/**
	 * Constructor.
	 *
	 * Hooks into WP actions to enqueue assets, initialize components,
	 * and register page templates.
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		$this->initialize_classes();
		add_filter( 'theme_page_templates', array( $this, 'register_template' ) );
		add_filter( 'template_include', array( $this, 'load_template' ) );
	}

	/**
	 * Initializes other plugin classes.
	 *
	 * Instantiates classes for block editor, AJAX handler, custom post types, etc.
	 *
	 * @return void
	 */
	private function initialize_classes() {
		// Only load block registration and editor assets in the admin.
		if ( is_admin() && class_exists( 'SmartForms\\Core\\BlockEditorLoader' ) ) {
			\SmartForms\Core\BlockEditorLoader::get_instance();
		}
		if ( class_exists( 'SmartForms\\Core\\BlockFrontendAssets' ) ) {
			\SmartForms\Core\BlockFrontendAssets::get_instance();
		}
		if ( class_exists( 'SmartForms\\Core\\SmartFormsHandler' ) ) {
			\SmartForms\Core\SmartFormsHandler::get_instance();
		}
		if ( class_exists( 'SmartForms\\Admin\\AdminMenu' ) ) {
			new \SmartForms\Admin\AdminMenu();
		}
		if ( class_exists( 'SmartForms\\CPT\\FormCPT' ) ) {
			new \SmartForms\CPT\FormCPT();
		}
		if ( class_exists( 'SmartForms\\Admin\\MetaBox' ) ) {
			\SmartForms\Admin\MetaBox::get_instance();
		}
		if ( class_exists( 'SmartForms\\Core\\API' ) ) {
			new \SmartForms\Core\API();
		}
		if ( class_exists( 'SmartForms\\CPT\\ChatUISettings' ) ) {
			\SmartForms\CPT\ChatUISettings::get_instance();
		}
	}

	/**
	 * Enqueues CSS and JS assets.
	 *
	 * Now enqueues JustValidate (a vanilla JS validation library) and our custom chat UI script.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Enqueue Bootstrap CSS.
		wp_enqueue_style(
			'bootstrap-css',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
			array(),
			'5.3.3'
		);
		// Enqueue Bootstrap JavaScript.
		wp_enqueue_script(
			'bootstrap-js',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
			array(),
			'5.3.3',
			true
		);
		// Enqueue Font Awesome.
		wp_enqueue_style(
			'fontawesome',
			'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
			array(),
			'6.4.0'
		);
		// Enqueue JustValidate for form validation (vanilla JS, no jQuery).
		wp_enqueue_script(
			'just-validate',
			'https://cdn.jsdelivr.net/npm/just-validate@2.2.0/dist/just-validate.production.min.js',
			array(),
			'2.2.0',
			true
		);
		// Enqueue our Chat UI script.
		wp_enqueue_script(
			'smartforms-chatui',
			plugins_url( 'build/js/smartforms-chat.js', SMARTFORMS_PLUGIN_FILE ),
			array( 'wp-element', 'just-validate' ),
			'1.0.0',
			true
		);
		// Enqueue the generated Chat UI CSS file.
		wp_enqueue_style(
			'smartforms-chat',
			plugins_url( 'build/css/smartforms-chat.css', SMARTFORMS_PLUGIN_FILE ),
			array( 'bootstrap-css', 'fontawesome' ),
			'1.0.0'
		);
		// Localize the Chat UI script.
		wp_localize_script(
			'smartforms-chatui',
			'smartformsData',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'smartform_submit' ),
			)
		);
	}

	/**
	 * Registers a custom page template for SmartForms.
	 *
	 * @param array $templates Existing page templates.
	 * @return array Modified page templates.
	 */
	public function register_template( $templates ) {
		$templates['templates/single-smart_form.php'] = __( 'SmartForms Chat UI', 'smartforms' );
		return $templates;
	}

	/**
	 * Loads the custom template for SmartForms single posts.
	 *
	 * @param string $template The current template path.
	 * @return string New template path if applicable.
	 */
	public function load_template( $template ) {
		if ( is_singular( 'smart_form' ) ) {
			$custom_template = dirname( __DIR__, 2 ) . '/templates/single-smart_form.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}
		return $template;
	}

	/**
	 * Logs messages and errors for debugging purposes.
	 *
	 * Only logs if WP_DEBUG is enabled.
	 *
	 * @param string         $message  The log message.
	 * @param \WP_Error|null $wp_error Optional WP_Error object.
	 * @return void
	 */
	public static function log_error( $message, $wp_error = null ) {
		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			return;
		}
		$message = is_string( $message )
			? sanitize_text_field( $message )
			: wp_json_encode( $message );
		if ( is_wp_error( $wp_error ) ) {
			$error_messages = implode( ' | ', $wp_error->get_error_messages() );
			$message       .= ' | WP_Error: ' . sanitize_text_field( $error_messages );
		}
		$log_entry = sprintf(
			'[%s] SmartForms: %s',
			wp_date( 'Y-m-d H:i:s' ),
			$message
		);
		error_log( $log_entry );
	}
}

// Initialize the plugin.
SmartForms::get_instance();

// Register activation and deactivation hooks.
register_activation_hook(
	dirname( __DIR__, 2 ) . '/smartforms.php',
	array( '\SmartForms\Core\SmartForms', 'activate' )
);
register_deactivation_hook(
	dirname( __DIR__, 2 ) . '/smartforms.php',
	array( '\SmartForms\Core\SmartForms', 'deactivate' )
);

```

# includes/Core/SmartFormsHandler.php

```php
<?php
/**
 * Handles SmartForms processing and submissions.
 *
 * @package SmartForms
 */

namespace SmartForms\Core;

use WP_Error;
use SmartForms\Core\SmartForms;

/**
 * Class SmartFormsHandler
 *
 * Processes SmartForms submissions via AJAX.
 */
class SmartFormsHandler {

	/**
	 * Singleton instance.
	 *
	 * @var SmartFormsHandler|null
	 */
	private static $instance = null;

	/**
	 * Get or create the singleton instance.
	 *
	 * @return SmartFormsHandler The singleton instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress actions and filters.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register_ajax_handlers' ) );
	}

	/**
	 * Register AJAX handlers for processing SmartForms submissions.
	 *
	 * Hooks into both public (non-logged-in) and authenticated AJAX requests.
	 *
	 * @return void
	 */
	public function register_ajax_handlers() {
		add_action( 'wp_ajax_nopriv_process_smartform', array( $this, 'process_form_submission' ) );
		add_action( 'wp_ajax_process_smartform', array( $this, 'process_form_submission' ) );
	}

	/**
	 * Processes SmartForm submissions with field validation.
	 *
	 * @return void
	 */
	public function process_form_submission() {
		// Verify nonce security.
		if ( ! isset( $_POST['smartform_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['smartform_nonce'] ) ), 'smartform_submit' ) ) {
			$error = new WP_Error( 'invalid_nonce', __( 'Security check failed.', 'smartforms' ), array( 'status' => 403 ) );
			SmartForms::log_error( 'Invalid nonce detected during form submission.', $error );
			wp_send_json_error( $error->get_error_message(), 403 );
		}

		// Validate and sanitize inputs.
		$form_id = isset( $_POST['form_id'] ) ? intval( $_POST['form_id'] ) : 0;

		// Since form_data is JSON-encoded, decode it first.
		$form_data_raw = isset( $_POST['form_data'] ) ? wp_unslash( $_POST['form_data'] ) : '';
		$user_input    = json_decode( $form_data_raw, true );
		if ( ! is_array( $user_input ) ) {
			$user_input = array();
		} else {
			$user_input = array_map( 'sanitize_text_field', $user_input );
		}

		if ( empty( $form_id ) || empty( $user_input ) ) {
			$error = new WP_Error( 'invalid_submission', __( 'Invalid form submission.', 'smartforms' ), array( 'status' => 400 ) );
			SmartForms::log_error( 'Invalid form submission detected.', $error );
			wp_send_json_error( $error->get_error_message(), 400 );
		}

		// Retrieve the saved form configuration.
		$saved_json      = get_post_meta( $form_id, 'smartforms_data', true );
		$form_definition = $saved_json ? json_decode( $saved_json, true ) : array();
		$fields          = isset( $form_definition['fields'] ) ? $form_definition['fields'] : array();

		$errors = array();

		// Validate each field.
		foreach ( $fields as $field ) {
			$field_id = isset( $field['id'] ) ? $field['id'] : '';
			// Check required fields.
			if ( isset( $field['required'] ) && $field['required'] ) {
				// If the field value is missing or empty, record an error.
				if ( ! isset( $user_input[ $field_id ] ) || trim( $user_input[ $field_id ] ) === '' ) {
					$message = ! empty( $field['validationMessage'] )
						? $field['validationMessage']
						: sprintf( __( '%s is required.', 'smartforms' ), $field['label'] );
					$errors[] = $message;
				}
			}
			// Additional validation (e.g. regex patterns) per field type can be added here.
		}

		// If validation errors exist, return an error response.
		if ( ! empty( $errors ) ) {
			$error = new WP_Error( 'validation_failed', implode( ' ', $errors ), array( 'status' => 400 ) );
			SmartForms::log_error( 'Form submission validation failed for Form ID: ' . esc_html( $form_id ), $error );
			wp_send_json_error( $errors, 400 );
		}

		// Process form submission (e.g. saving to the database or sending an email).
		$submission_data = array(
			'form_id'   => $form_id,
			'user_data' => $user_input,
		);

		SmartForms::log_error( 'Form submitted successfully. Form ID: ' . $form_id );

		wp_send_json_success(
			array(
				'message' => __( 'Form submitted successfully.', 'smartforms' ),
				'data'    => $submission_data,
			)
		);
	}
}

```

# includes/CPT/ChatUISettings.php

```php
<?php
/**
 * ChatUISettings: Chat theme preset settings for SmartForms.
 *
 * This file registers a submenu under the SmartForms menu where users can select a chat theme preset.
 * The presets are defined in JSON files (e.g., light.json, dark.json) located in the /themes/ folder.
 *
 * A live preview of the chat interface is displayed on the right-hand side.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

use SmartForms\Themes\ThemeLoader;
use SmartForms\Core\ChatUI;

class ChatUISettings {

	/**
	 * Option name for storing the selected chat theme preset.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'smartforms_chat_theme';

	/**
	 * Singleton instance.
	 *
	 * @var ChatUISettings|null
	 */
	private static $instance = null;

	/**
	 * Instance of ThemeLoader.
	 *
	 * @var ThemeLoader
	 */
	private $theme_loader;

	/**
	 * Gets the singleton instance.
	 *
	 * @return ChatUISettings
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Private constructor to enforce singleton usage.
	 */
	private function __construct() {
		\SmartForms\Core\SmartForms::log_error( '[DEBUG] ChatUISettings (theme preset) constructor called.' );
		$this->theme_loader = new ThemeLoader();
		add_action( 'admin_menu', array( $this, 'add_submenu_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Adds a submenu page under the SmartForms menu.
	 *
	 * @return void
	 */
	public function add_submenu_page() {
		add_submenu_page(
			'smartforms',
			__( 'Chat Themes', 'smartforms' ),
			__( 'Themes', 'smartforms' ),
			'manage_options',
			'smartforms-chat-themes',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Registers the theme preset setting.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'smartforms_chat_theme_settings_group',
			self::OPTION_NAME,
			array( 'sanitize_callback' => array( $this, 'sanitize_settings' ) )
		);

		add_settings_section(
			'smartforms_chat_theme_section',
			__( 'Chat Theme Presets', 'smartforms' ),
			null,
			'smartforms-chat-themes'
		);

		add_settings_field(
			'theme_preset',
			__( 'Select Chat Theme', 'smartforms' ),
			array( $this, 'render_theme_field' ),
			'smartforms-chat-themes',
			'smartforms_chat_theme_section'
		);
	}

	/**
	 * Sanitizes the theme preset selection.
	 *
	 * @param string $input The selected theme key.
	 * @return string Sanitized theme key.
	 */
	public function sanitize_settings( $input ) {
		$themes = $this->theme_loader->get_themes();
		if ( isset( $themes[ $input ] ) ) {
			return sanitize_text_field( $input );
		}
		return 'light'; // Fallback default.
	}

	/**
	 * Renders the theme preset selection field.
	 *
	 * @return void
	 */
	public function render_theme_field() {
		$themes  = $this->theme_loader->get_themes();
		$current = get_option( self::OPTION_NAME, 'light' );
		?>
		<select name="<?php echo esc_attr( self::OPTION_NAME ); ?>">
			<?php foreach ( $themes as $key => $preset ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $current, $key ); ?>>
					<?php echo esc_html( $preset['label'] ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	/**
	 * Retrieves the selected theme preset styles.
	 *
	 * @return array Selected theme styles.
	 */
	public function get_selected_theme_styles() {
		$theme_key = get_option( self::OPTION_NAME, 'light' );
		$preset    = $this->theme_loader->get_theme( $theme_key );
		if ( $preset && isset( $preset['styles'] ) ) {
			return $preset['styles'];
		}
		// Fallback: load 'light' preset if available.
		$preset = $this->theme_loader->get_theme( 'light' );
		return isset( $preset['styles'] ) ? $preset['styles'] : array();
	}

	/**
	 * Renders the settings page with a live preview.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		?>
		<div class="wrap" style="display: flex; gap: 20px;">
			<div class="smartforms-settings-left" style="flex: 1;">
				<h1><?php esc_html_e( 'SmartForms Chat Themes', 'smartforms' ); ?></h1>
				<form method="post" action="options.php">
					<?php
					settings_fields( 'smartforms_chat_theme_settings_group' );
					do_settings_sections( 'smartforms-chat-themes' );
					submit_button();
					?>
				</form>
			</div>
			<div class="smartforms-settings-right" style="flex: 1;">
				<h2><?php esc_html_e( 'Live Preview', 'smartforms' ); ?></h2>
				<div class="smartforms-preview">
					<?php
					// Display the fallback chat UI with no form ID
					echo ChatUI::render( 0 );
					?>
				</div>
			</div>
		</div>
		<?php
	}
}

ChatUISettings::get_instance();

```

# includes/CPT/FormCPT.php

```php
<?php
/**
 * Registers the Custom Post Type (CPT) for SmartForms.
 *
 * @package SmartForms
 */

namespace SmartForms\CPT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Class FormCPT
 *
 * Handles the registration of the SmartForms custom post type.
 */
class FormCPT {

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress to register the custom post type on 'init'.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_cpt' ), 5 );
	}

	/**
	 * Registers the SmartForms custom post type.
	 *
	 * @return void
	 */
	public function register_cpt() {
		$labels = array(
			'name'               => _x( 'SmartForms Entries', 'post type general name', 'smartforms' ),
			'singular_name'      => _x( 'SmartForm Entry', 'post type singular name', 'smartforms' ),
			'menu_name'          => _x( 'SmartForms', 'admin menu', 'smartforms' ),
			'name_admin_bar'     => _x( 'SmartForm', 'add new on admin bar', 'smartforms' ),
			'add_new'            => esc_html_x( 'Add New', 'form', 'smartforms' ),
			'add_new_item'       => esc_html__( 'Add New SmartForm', 'smartforms' ),
			'new_item'           => esc_html__( 'New Form', 'smartforms' ),
			'edit_item'          => esc_html__( 'Edit Form', 'smartforms' ),
			'view_item'          => esc_html__( 'View Form', 'smartforms' ),
			'all_items'          => esc_html__( 'Forms', 'smartforms' ),
			'search_items'       => esc_html__( 'Search Forms', 'smartforms' ),
			'parent_item_colon'  => esc_html__( 'Parent Forms:', 'smartforms' ),
			'not_found'          => esc_html__( 'No SmartForms found.', 'smartforms' ),
			'not_found_in_trash' => esc_html__( 'No SmartForms found in Trash.', 'smartforms' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => 'smartforms',
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'smart_form', 'with_front' => false ),
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => null,
			'show_in_admin_bar'  => true,
			'supports'           => array( 'title', 'editor', 'revisions' ),
			'show_in_rest'       => true,
		);

		$registered = register_post_type( 'smart_form', $args );

		if ( is_wp_error( $registered ) ) {
			\SmartForms\Core\SmartForms::log_error( 'Failed to register custom post type: smart_form', $registered );
		}
	}
}

```

# includes/Themes/ThemeLoader.php

```php
<?php
/**
 * ThemeLoader: Loads chat theme presets from JSON files.
 *
 * This class scans the themes folder (located in the plugin root)
 * for JSON files (e.g., light.json and dark.json) and returns an associative array of presets.
 *
 * @package SmartForms
 */

namespace SmartForms\Themes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

class ThemeLoader {

	/**
	 * The folder path where theme JSON files are stored.
	 *
	 * @var string
	 */
	private $themes_dir;

	/**
	 * Cached themes array.
	 *
	 * @var array
	 */
	private $themes = array();

	/**
	 * Constructor.
	 *
	 * @param string $themes_dir Optional path to the themes folder.
	 */
	public function __construct( $themes_dir = '' ) {
		if ( empty( $themes_dir ) ) {
			// Assume the themes folder is in the plugin root.
			$themes_dir = dirname( __FILE__, 3 ) . '/themes/';
		}
		$this->themes_dir = trailingslashit( $themes_dir );
		$this->load_themes();
	}

	/**
	 * Loads theme presets from JSON files.
	 *
	 * @return void
	 */
	private function load_themes() {
		if ( ! is_dir( $this->themes_dir ) ) {
			return;
		}
		$files = scandir( $this->themes_dir );
		if ( ! $files ) {
			return;
		}
		foreach ( $files as $file ) {
			if ( pathinfo( $file, PATHINFO_EXTENSION ) === 'json' ) {
				$file_path = $this->themes_dir . $file;
				$content   = file_get_contents( $file_path );
				$data      = json_decode( $content, true );
				// Expect each JSON file to have at least a 'label' and 'styles' key.
				if ( is_array( $data ) && isset( $data['label'] ) && isset( $data['styles'] ) ) {
					$key = basename( $file, '.json' );
					$this->themes[ $key ] = $data;
				}
			}
		}
	}

	/**
	 * Returns an array of available theme presets.
	 *
	 * @return array Array of theme presets.
	 */
	public function get_themes() {
		return $this->themes;
	}

	/**
	 * Returns the theme preset by key.
	 *
	 * @param string $key Theme key.
	 * @return array|null Preset data or null if not found.
	 */
	public function get_theme( $key ) {
		if ( isset( $this->themes[ $key ] ) ) {
			return $this->themes[ $key ];
		}
		return null;
	}
}

```

# includes/Universal/RenderFieldWrapper.php

```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Prevent direct access.
}

/**
 * Renders a field wrapper for a form field on the frontend.
 *
 * @param string $label      The field label.
 * @param string $input_html The field-specific input HTML.
 * @param string $help_text  The field help text.
 * @param string $alignment  Optional. Field alignment: "left", "center", or "right". Default "left".
 *
 * @return string The complete HTML for the field.
 */
function render_field_wrapper( $label, $input_html, $help_text, $alignment = 'left' ) {
	$alignment_class = 'text-start';
	if ( 'center' === $alignment ) {
		$alignment_class = 'text-center';
	} elseif ( 'right' === $alignment ) {
		$alignment_class = 'text-end';
	}

	$html = '<div class="sf-field-wrapper">';
	if ( '' !== $label ) {
		$html .= '<label class="sf-field-label">' . esc_html( $label ) . '</label>';
	}
	$html .= '<div class="sf-input-container ' . esc_attr( $alignment_class ) . '">' . $input_html . '</div>';
	if ( '' !== $help_text ) {
		$html .= '<p class="sf-field-help">' . esc_html( $help_text ) . '</p>';
	}
	$html .= '</div>';
	return $html;
}

```

# package.json

```json
{
	"name": "smartforms",
	"version": "1.0.0",
	"description": "SmartForms is a WordPress plugin that enables users to create chatbot-style questionnaires with GPT-powered recommendations. This plugin leverages modern WordPress standards and AI technology to provide an intuitive and powerful tool for form creation.",
	"main": "index.js",
	"scripts": {
		"build:blocks": "wp-scripts build",
		"build:chatui": "wp-scripts build --config wp-scripts.chatui.config.js",
		"build": "npm run build:blocks && npm run build:chatui",
		"start": "concurrently \"wp-scripts start\" \"wp-scripts start --config wp-scripts.chatui.config.js\""
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/markrusselldev/smartforms.git"
	},
	"keywords": [
		"wordpress",
		"plugin",
		"gutenberg",
		"blocks",
		"forms",
		"AI"
	],
	"author": "Mark Russell <mark@markrussell.io>",
	"license": "GPL-2.0-or-later",
	"bugs": {
		"url": "https://github.com/markrusselldev/smartforms/issues"
	},
	"homepage": "https://github.com/markrusselldev/smartforms#readme",
	"devDependencies": {
		"@wordpress/eslint-plugin": "^22.5.0",
		"@wordpress/scripts": "^30.10.0",
		"ajv": "^8.17.1",
		"ajv-keywords": "^5.1.0",
		"concurrently": "^9.1.2",
		"copy-webpack-plugin": "^13.0.0",
		"eslint": "^8.57.1",
		"eslint-config-prettier": "^10.0.2",
		"eslint-plugin-prettier": "^5.2.3",
		"prettier": "^3.5.3"
	},
	"dependencies": {
		"@wordpress/block-editor": "^14.12.0",
		"@wordpress/components": "^29.3.0",
		"bootstrap": "^5.3.3",
		"react": "^18.3.1",
		"react-dom": "^18.3.1",
		"sass": "^1.83.4"
	},
	"overrides": {
		"react-autosize-textarea": {
			"react": "^18.3.1",
			"react-dom": "^18.3.1"
		}
	}
}

```

# phpcs.xml.dist

```dist
<?xml version="1.0"?>
<ruleset name="SmartForms Coding Standards">
	<description>PHP_CodeSniffer rules for the SmartForms plugin.</description>

	<!-- Use default WordPress standards -->
	<rule ref="WordPress-Core" />

	<!-- Disable the file naming sniff -->
	<rule ref="WordPress.Files.FileName">
		<severity>0</severity>
	</rule>

	<!-- Exclude irrelevant folders/files -->
	<exclude-pattern>*/vendor/*</exclude-pattern>
	<exclude-pattern>*/node_modules/*</exclude-pattern>
	<exclude-pattern>*/assets/*</exclude-pattern>
	<exclude-pattern>*/templates/*</exclude-pattern>
	<exclude-pattern>*/tests/*</exclude-pattern>

	<!-- Include only PHP files -->
	<file>*.php</file>
</ruleset>

```

# README.md

```md
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
   \`\`\`bash
   git clone <repository-url> smartforms
   \`\`\`
2. **Navigate to the Plugin Folder:**
   \`\`\`bash
   cd smartforms
   \`\`\`
3. **Install Dependencies:**
   Run Composer to install PHP dependencies:
   \`\`\`bash
   composer install
   \`\`\`

4. **Verify Code Quality (Optional):**
   If you wish to check or enforce coding standards:
   \`\`\`bash
   ./vendor/bin/phpcs . --report=summary
   \`\`\`
   Fix any auto-fixable issues:
   \`\`\`bash
   ./vendor/bin/phpcbf .
   \`\`\`

5. **Activate the Plugin in WordPress:**
   - Copy the plugin folder into your WordPress installation's `wp-content/plugins/` directory, or keep it symlinked for development.
   - Log in to the WordPress admin dashboard, navigate to the Plugins section, and activate **SmartForms**.

---

## Development

### Coding Standards
This project adheres to WordPress Coding Standards (WPCS). Use PHP_CodeSniffer (PHPCS) to validate code quality.

#### Run PHPCS Locally
\`\`\`bash
./vendor/bin/phpcs . --standard=phpcs.xml.dist --report=summary
\`\`\`

#### Fix Auto-Fixable Issues
\`\`\`bash
./vendor/bin/phpcbf .
\`\`\`

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

```

# smartforms.php

```php
<?php
/**
 * Plugin Name: SmartForms - AI-Powered Questionnaire
 * Description: A WordPress plugin that enables users to create chatbot-style questionnaires with GPT-powered recommendations.
 * Version: 1.0.0
 * Author: Mark Russell
 * Author URI: https://markrussell.io
 * License: GPL2
 * Text Domain: smartforms
 *
 * @package SmartForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Set the url of our plugin.
if ( ! defined( 'SMARTFORMS_PLUGIN_URL' ) ) {
	define( 'SMARTFORMS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Set the file path of our plugin.
if ( ! defined( 'SMARTFORMS_PLUGIN_FILE' ) ) {
	define( 'SMARTFORMS_PLUGIN_FILE', __FILE__ );
}

// Include Composer autoloader.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

// Initialize the SmartForms plugin using the core namespace.
\SmartForms\Core\SmartForms::get_instance();

// Register activation and deactivation hooks.
register_activation_hook( __FILE__, array( '\SmartForms\Core\SmartForms', 'activate' ) );
register_deactivation_hook( __FILE__, array( '\SmartForms\Core\SmartForms', 'deactivate' ) );

```

# src/blocks/_theme.scss

```scss
/**
 * _theme.scss
 *
 * Shared design tokens for SmartForms.
 * Defines common variables for colors, spacing, typography, etc.
 * Both editor and front-end styles import this file.
 *
 * @package SmartForms
 */

// Sass variables
$primary-color: #007bff;
$border-color: #ddd;
$background-color: #fff;
$padding-base: 12px;
$border-radius-base: 4px;
$gap-size: 10px;
$font-family-base: 'Manrope', sans-serif;
$font-size-base: 16px;

// CSS custom properties (for runtime flexibility)
:root {
  --smartforms-primary-color: #007bff;
  --smartforms-border-color: #ddd;
  --smartforms-background-color: #fff;
  --smartforms-padding-base: 12px;
  --smartforms-border-radius-base: 4px;
  --smartforms-gap-size: 10px;
  --smartforms-font-family: 'Manrope', sans-serif;
  --smartforms-font-size: 16px;
}

/* Unified field label styling (used by all field blocks in both editor and frontend) */
.sf-field-label {
  display: block;
  margin-bottom: 10px;
  color: #333;
}

/* Unified help text styling (used by all field blocks in both editor and frontend) */
.sf-field-help {
  margin: 10px 0 0 0 !important;
  color: #666;
  font-size: 0.75rem;
}

.sf-checkbox-option .form-check-label {
  color: #333;
}

```

# src/blocks/components/FieldWrapper.js

```js
/**
 * FieldWrapper component renders the common structure for a form field.
 * It wraps a label, an input container, and a help text element.
 *
 * It supports customization of:
 * - Alignment via the "alignment" prop (applies flexbox justification to the input container).
 * - A custom label class via the "labelClass" prop.
 * - Optional plain text mode via the "plainText" prop, which disables RichText formatting controls.
 *
 * @param {Object} props Component props.
 * @param {string} props.label The field label.
 * @param {string} props.helpText The field help text.
 * @param {Function} props.setLabel Function to update the label.
 * @param {Function} props.setHelpText Function to update the help text.
 * @param {React.Node} props.children The field-specific input element.
 * @param {string} [props.labelPlaceholder] Placeholder for the label.
 * @param {string} [props.helpPlaceholder] Placeholder for the help text.
 * @param {string} [props.alignment="left"] Field alignment: "left", "center", or "right".
 * @param {string} [props.labelClass="sf-field-label"] CSS class for the label element.
 * @param {boolean} [props.plainText=false] When true, disables RichText formatting (ensuring plain text).
 * @returns {React.Element} The FieldWrapper component.
 */
import { RichText } from '@wordpress/block-editor';
import { blockDefaults } from '../../config/blockDefaults';

const FieldWrapper = ({
  label,
  helpText,
  setLabel,
  setHelpText,
  children,
  labelPlaceholder = blockDefaults.placeholders.label,
  helpPlaceholder = blockDefaults.placeholders.helpText,
  alignment = 'left',
  labelClass = 'sf-field-label',
  plainText = false,
}) => {
  // Compute flexbox justification value for the input container.
  const justifyContent =
    alignment === 'center'
      ? 'center'
      : alignment === 'right'
        ? 'flex-end'
        : 'flex-start';

  return (
    <div className="sf-field-wrapper">
      <RichText
        tagName="label"
        className={labelClass}
        value={label}
        onChange={setLabel}
        placeholder={labelPlaceholder}
        formattingControls={plainText ? [] : undefined}
      />
      <div
        className="sf-input-container"
        style={{ display: 'flex', justifyContent }}
      >
        {children}
      </div>
      <RichText
        tagName="p"
        className="sf-field-help"
        value={helpText}
        onChange={setHelpText}
        placeholder={helpPlaceholder}
      />
    </div>
  );
};

export default FieldWrapper;

```

# src/blocks/smartforms-buttons/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/buttons",
  "title": "Button Group",
  "category": "smartforms",
  "icon": null,
  "description": "A button group for rapid selection among options.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": ""
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "helpText": {
      "type": "string",
      "default": ""
    },
    "options": {
      "type": "array",
      "default": [
        { "label": "Option 1", "value": "option-1" },
        { "label": "Option 2", "value": "option-2" }
      ]
    },
    "groupId": {
      "type": "string",
      "default": ""
    },
    "multiple": {
      "type": "boolean",
      "default": false
    },
    "layout": {
      "type": "string",
      "default": "horizontal"
    },
    "currentAnswer": {
      "type": "string",
      "default": ""
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "save": null
}

```

# src/blocks/smartforms-buttons/edit.js

```js
/**
 * Edit component for the SmartForms Button Group block.
 *
 * Renders the block in the editor with InspectorControls for:
 * - Toggling required status.
 * - Enabling/disabling multiple selections.
 * - Managing the button options.
 * - Selecting the layout (vertical or horizontal).
 *
 * The entire output is wrapped with the FieldWrapper component so that the label,
 * input container, and help text use consistent RichText behavior.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const { placeholders, defaultOptions } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    label,
    helpText,
    required,
    options,
    groupId,
    multiple,
    currentAnswer,
    layout,
  } = attributes;
  const blockProps = useBlockProps();

  // Initialize groupId, default options, and layout if not already set.
  useEffect(() => {
    if (!groupId) {
      setAttributes({ groupId: `sf-buttons-${clientId}` });
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      setAttributes({ options: defaultOptions });
    }
    if (!layout) {
      setAttributes({ layout: 'horizontal' });
    }
  }, [groupId, options, layout, clientId, setAttributes]);

  /**
   * Updates an option's label and corresponding value.
   *
   * @param {number} index - The option index.
   * @param {string} newLabel - The new label.
   */
  const updateOption = (index, newLabel) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        return {
          label: newLabel,
          value: newLabel.toLowerCase().replace(/\s+/g, '-'),
        };
      }
      return option;
    });
    setAttributes({ options: newOptions });
  };

  /**
   * Adds a new button option.
   * Uses Array.reduce to determine the current maximum option number.
   */
  const addOption = () => {
    const maxNumber = options.reduce((acc, option) => {
      const match = option.label.match(/^Option (\d+)$/);
      return match ? Math.max(acc, parseInt(match[1], 10)) : acc;
    }, 0);
    const newLabel = `Option ${maxNumber + 1}`;
    const newValue = newLabel.toLowerCase().replace(/\s+/g, '-');
    setAttributes({
      options: [...options, { label: newLabel, value: newValue }],
    });
  };

  /**
   * Removes a button option by index.
   *
   * @param {number} index - The index to remove.
   */
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setAttributes({ options: newOptions });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Button Group Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
          <ToggleControl
            label={__('Allow Multiple Selections', 'smartforms')}
            checked={multiple}
            onChange={(value) =>
              setAttributes({ multiple: value, currentAnswer: value ? [] : '' })
            }
          />
          <SelectControl
            label={__('Layout', 'smartforms')}
            value={layout}
            options={[
              { label: __('Horizontal', 'smartforms'), value: 'horizontal' },
              { label: __('Vertical', 'smartforms'), value: 'vertical' },
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
        </PanelBody>
        <PanelBody
          title={__('Button Options', 'smartforms')}
          initialOpen={true}
        >
          {options.map((option, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <TextControl
                label={`${__('Option', 'smartforms')} ${index + 1}`}
                value={option.label}
                onChange={(value) => updateOption(index, value)}
              />
              <Button
                variant="secondary"
                onClick={() => removeOption(index)}
                size="small"
              >
                {__('Remove Option', 'smartforms')}
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={addOption}>
            {__('Add Option', 'smartforms')}
          </Button>
        </PanelBody>
      </InspectorControls>
      {/* Wrap the field's label, input container, and help text in FieldWrapper */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
      >
        <div
          className={`sf-buttons-group sf-buttons-group--${layout}`}
          data-group-id={groupId}
          data-layout={layout}
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-primary ${
                multiple
                  ? Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.value)
                    ? 'active'
                    : ''
                  : currentAnswer === option.value
                    ? 'active'
                    : ''
              }`}
              data-value={option.value}
              onClick={() => {
                if (multiple) {
                  const currentSelection = Array.isArray(currentAnswer)
                    ? [...currentAnswer]
                    : [];
                  const updatedSelection = currentSelection.includes(
                    option.value,
                  )
                    ? currentSelection.filter((val) => val !== option.value)
                    : [...currentSelection, option.value];
                  setAttributes({ currentAnswer: updatedSelection });
                } else {
                  setAttributes({ currentAnswer: option.value });
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-buttons/editor.scss

```scss
/**
 * Editor styles for the SmartForms Button Group block.
 *
 * These styles are applied only in the block editor.
 *
 * The container is given a border and padding to match other blocks.
 * For horizontal layout, the buttons are arranged in a flex container with a 10px gap.
 * For vertical layout, the buttons stack with auto width, a minimum width of 80px,
 * and a 10px bottom margin.
 *
 * This file targets both our intended BEM classes (with double dashes)
 * and a fallback in case the class is rendered with a single dash.
 *
 * @package SmartForms
 */

.wp-block-smartforms-buttons {
  border: 1px solid #ddd;
  padding: 10px;

  /* Vertical layout: target both BEM formats */
  .sf-buttons-group--vertical,
  .sf-buttons-group-vertical {
    display: block !important;

    .btn {
      display: block !important;
      width: auto !important;
      min-width: 80px;
      margin-bottom: 10px !important;
    }
  }

  /* Horizontal layout: target both BEM formats */
  .sf-buttons-group--horizontal,
  .sf-buttons-group-horizontal {
    display: flex !important;
    gap: 10px;
    flex-wrap: wrap !important;

    .btn {
      min-width: 80px;
    }
  }
}

```

# src/blocks/smartforms-buttons/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

// Define a custom icon as a React element for the Button Group.
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect
      x="2.5"
      y="8"
      width="5"
      height="8"
      rx="1"
      ry="1"
      fill="currentColor"
    />
    <rect
      x="9.5"
      y="8"
      width="5"
      height="8"
      rx="1"
      ry="1"
      fill="currentColor"
    />
    <rect
      x="16.5"
      y="8"
      width="5"
      height="8"
      rx="1"
      ry="1"
      fill="currentColor"
    />
  </svg>
);

registerBlockType('smartforms/buttons', {
  icon: customIcon,
  edit,
  save: () => null,
});

```

# src/blocks/smartforms-buttons/style.scss

```scss
/**
 * Frontend and shared styles for the SmartForms Button Group block.
 *
 * For vertical layout, the buttons stack vertically.
 * For horizontal layout, a 10px gap is applied.
 * A min-width is added so that buttons with very short content don’t shrink too much.
 *
 * @package SmartForms
 */

@use '../_theme.scss' as *;

.wp-block-smartforms-buttons {
  /* Horizontal layout using our BEM class */
  .sf-buttons-group--horizontal {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .btn {
      min-width: 80px;
    }
  }

  /* Vertical layout using our BEM class */
  .sf-buttons-group--vertical {
    display: block;

    .btn {
      display: block;
      width: auto;
      min-width: 80px;
      margin-bottom: 10px;
    }
  }
}

/* In the chat UI container, ensure vertical styling applies */
.smartforms-chat-container {
  .sf-buttons-group--vertical {
    display: block;

    .btn {
      display: block;
      width: auto;
      min-width: 80px;
      margin-bottom: 10px;
    }
  }
}

```

# src/blocks/smartforms-checkbox/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/checkbox",
  "title": "Checkbox",
  "category": "smartforms",
  "description": "A checkbox field for selecting options.",
  "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><polyline points=\"6,12 10,16 18,8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": ""
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "helpText": {
      "type": "string",
      "default": ""
    },
    "options": {
      "type": "array",
      "default": [
        { "label": "Option 1", "value": "option-1" },
        { "label": "Option 2", "value": "option-2" }
      ]
    },
    "groupId": {
      "type": "string",
      "default": ""
    },
    "layout": {
      "type": "string",
      "default": "horizontal"
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "save": null
}

```

# src/blocks/smartforms-checkbox/edit.js

```js
/**
 * Edit component for the SmartForms Checkbox block.
 *
 * Renders a checkbox field group for the editor with InspectorControls
 * to add, remove, and modify options and inline editing for the field label and help text.
 *
 * With static blocks, the label is stored directly in JSON. To avoid extra formatting markup,
 * we set the FieldWrapper’s plainText prop to true.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  ToggleControl,
  Button,
  SelectControl,
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const { placeholders, defaultOptions } = blockDefaults;

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { label, helpText, required, options, groupId, layout } = attributes;
  const blockProps = useBlockProps();

  // Initialize attributes if not already set.
  useEffect(() => {
    if (!groupId) {
      setAttributes({ groupId: `sf-checkbox-${clientId}` });
    }
    if (!layout) {
      setAttributes({ layout: 'horizontal' });
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      setAttributes({ options: defaultOptions });
    }
  }, [groupId, layout, options, clientId, setAttributes]);

  /**
   * Updates an option's label and corresponding value.
   *
   * @param {number} index - The index of the option.
   * @param {string} newLabel - The new label.
   */
  const updateOption = (index, newLabel) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        return {
          label: newLabel,
          value: newLabel.toLowerCase().replace(/\s+/g, '-'),
        };
      }
      return option;
    });
    setAttributes({ options: newOptions });
  };

  /**
   * Adds a new checkbox option.
   *
   * Automatically assigns a sequential label "Option N" based on the current highest option number.
   */
  const addOption = () => {
    let maxNumber = 0;
    options.forEach((option) => {
      const match = option.label.match(/^Option (\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });
    const newLabel = `Option ${maxNumber + 1}`;
    const newValue = newLabel.toLowerCase().replace(/\s+/g, '-');
    const newOptions = [...options, { label: newLabel, value: newValue }];
    setAttributes({ options: newOptions });
  };

  /**
   * Removes an option by its index.
   *
   * @param {number} index - The index to remove.
   */
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setAttributes({ options: newOptions });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Checkbox Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
          <SelectControl
            label={__('Layout', 'smartforms')}
            value={layout}
            options={[
              { label: __('Horizontal', 'smartforms'), value: 'horizontal' },
              { label: __('Vertical', 'smartforms'), value: 'vertical' },
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
        </PanelBody>
        <PanelBody
          title={__('Checkbox Options', 'smartforms')}
          initialOpen={true}
        >
          {options &&
            options.map((option, index) => (
              <Fragment key={index}>
                <TextControl
                  label={`${__('Option', 'smartforms')} ${index + 1}`}
                  value={option.label}
                  onChange={(value) => updateOption(index, value)}
                />
                <Button
                  variant="secondary"
                  onClick={() => removeOption(index)}
                  size="small"
                >
                  {__('Remove Option', 'smartforms')}
                </Button>
              </Fragment>
            ))}
          <Button variant="primary" onClick={addOption}>
            {__('Add Option', 'smartforms')}
          </Button>
        </PanelBody>
      </InspectorControls>
      {/* FieldWrapper now uses plainText mode to ensure the label is stored as plain text */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(val) => setAttributes({ label: val })}
        setHelpText={(val) => setAttributes({ helpText: val })}
        labelPlaceholder={placeholders.label}
        helpPlaceholder={placeholders.helpText}
        plainText={true}
      >
        <div
          className={`sf-checkbox-group sf-checkbox-group-${layout || 'horizontal'}`}
          data-layout={layout || 'horizontal'}
        >
          {options &&
            options.map((option, index) => (
              <Fragment key={index}>
                <div
                  className={`sf-checkbox-option form-check${
                    layout === 'horizontal' ? ' form-check-inline' : ''
                  }`}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`${groupId}-${index}`}
                    name={groupId}
                    required={required}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${groupId}-${index}`}
                  >
                    {option.label}
                  </label>
                </div>
              </Fragment>
            ))}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-checkbox/editor.scss

```scss
@use "../_theme.scss" as *;

/**
 * Editor styles for the SmartForms Checkbox block.
 *
 * These styles control the layout of the checkbox options based on the
 * saved layout setting (stored in the data-layout attribute).
 * - For "horizontal", options are arranged in a flex row that wraps.
 * - For "vertical", options are arranged in a single column.
 *
 * This file only provides the necessary overrides for the block editor.
 * The primary layout styling is defined in style.scss.
 *
 * @package SmartForms
 */

.wp-block-smartforms-checkbox {
  border: 1px solid #ddd;
  padding: 10px;

  .sf-checkbox-group {
    // Default to horizontal (flex row) layout.
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;

    // If the saved layout is vertical, force a block (column) layout.
    &[data-layout="vertical"] {
      display: block;
    }
  }

  .sf-checkbox-option.form-check {
    display: flex;
    align-items: center;
  }

  .sf-checkbox-option.form-check label.form-check-label {
    margin-left: 5px;
    font-size: 1rem;
    line-height: 1.25;
    vertical-align: middle;
  }

  input.form-check-input:checked::before,
  input.form-check-input:checked::after {
    display: none;
  }

  .sf-checkbox-main-label {
    display: block;
    margin-bottom: 10px;
  }
}

```

# src/blocks/smartforms-checkbox/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

// Define a custom icon as a React element:
const customIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <polyline
      points="6,12 10,16 18,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

registerBlockType('smartforms/checkbox', {
  icon: customIcon,
  edit,
  save: () => null,
});

```

# src/blocks/smartforms-checkbox/style.scss

```scss
@use "../_theme.scss" as *;

/**
 * Frontend and shared styles for the SmartForms Checkbox block.
 *
 * In vertical layout the checkboxes will display one per line (default block stacking)
 * with a small bottom margin, and in horizontal mode the edit/save markup adds the
 * .form-check-inline class so the checkboxes align in one row.
 *
 * @package SmartForms
 */

.wp-block-smartforms-checkbox {
  padding: 10px;
}

/* No extra grid/flex styling here so that in vertical mode the default behavior applies.
   For horizontal mode, the block’s edit and save code adds .form-check-inline to each option. */
.sf-checkbox-group {
  /* You can optionally set a max-width or text alignment if needed, but by default it will use browser block layout. */
}

.sf-checkbox-option {
  /* For vertical stacking, add some bottom spacing */
  margin-bottom: 0.5rem;
}

```

# src/blocks/smartforms-number/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/number",
  "title": "Number Input",
  "category": "smartforms",
  "icon": "editor-table",
  "description": "A number input field for SmartForms.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": ""
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "className": {
      "type": "string"
    },
    "min": {
      "type": "number",
      "default": 0
    },
    "max": {
      "type": "number",
      "default": 100
    },
    "step": {
      "type": "number",
      "default": 1
    },
    "defaultValue": {
      "type": "number",
      "default": 0
    },
    "helpText": {
      "type": "string",
      "default": ""
    },
    "fieldSize": {
      "type": "string",
      "default": "medium"
    },
    "fieldAlignment": {
      "type": "string",
      "default": "left"
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "save": null
}

```

# src/blocks/smartforms-number/edit.js

```js
/**
 * Edit component for SmartForms Number block.
 *
 * 1. Uses the "fieldAlignment" attribute.
 * 2. Applies alignment using Bootstrap’s utility classes (text‑start, text‑center, text‑end).
 * 3. Applies size classes (form-control-sm or form-control-lg) based on the fieldSize attribute.
 *
 * The component wraps the input with FieldWrapper so that the label,
 * input container, and help text display consistently in the editor.
 *
 * @package SmartForms
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  ToggleControl,
  SelectControl,
} from '@wordpress/components';
import { blockDefaults } from '../../config/blockDefaults';
import FieldWrapper from '../components/FieldWrapper';

const Edit = ({ attributes, setAttributes }) => {
  const {
    label,
    required,
    min,
    max,
    step,
    defaultValue,
    helpText,
    fieldSize,
    fieldAlignment,
  } = attributes;

  // Determine the Bootstrap size class.
  const sizeClass =
    fieldSize === 'small'
      ? 'form-control-sm'
      : fieldSize === 'large'
        ? 'form-control-lg'
        : '';

  // Compute Bootstrap alignment class using fieldAlignment.
  const bootstrapAlignment =
    fieldAlignment === 'center'
      ? 'text-center'
      : fieldAlignment === 'right'
        ? 'text-end'
        : 'text-start';

  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Number Input Settings', 'smartforms')}>
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
          <TextControl
            type="number"
            label={__('Minimum Value', 'smartforms')}
            value={min}
            onChange={(value) => setAttributes({ min: Number(value) })}
          />
          <TextControl
            type="number"
            label={__('Maximum Value', 'smartforms')}
            value={max}
            onChange={(value) => setAttributes({ max: Number(value) })}
          />
          <TextControl
            type="number"
            label={__('Step', 'smartforms')}
            value={step}
            onChange={(value) => setAttributes({ step: Number(value) })}
          />
          <TextControl
            type="number"
            label={__('Default Value', 'smartforms')}
            value={defaultValue}
            onChange={(value) => setAttributes({ defaultValue: Number(value) })}
            help={__(
              'This value appears by default on the frontend',
              'smartforms',
            )}
          />
        </PanelBody>
        <PanelBody title={__('Appearance', 'smartforms')} initialOpen={true}>
          <SelectControl
            label={__('Field Size', 'smartforms')}
            value={fieldSize}
            options={[
              { label: __('Small', 'smartforms'), value: 'small' },
              { label: __('Medium', 'smartforms'), value: 'medium' },
              { label: __('Large', 'smartforms'), value: 'large' },
            ]}
            onChange={(value) => setAttributes({ fieldSize: value })}
          />
          <SelectControl
            label={__('Alignment', 'smartforms')}
            value={fieldAlignment}
            options={[
              { label: __('Left', 'smartforms'), value: 'left' },
              { label: __('Center', 'smartforms'), value: 'center' },
              { label: __('Right', 'smartforms'), value: 'right' },
            ]}
            onChange={(value) => setAttributes({ fieldAlignment: value })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Use FieldWrapper for consistent layout */}
      <FieldWrapper
        label={label}
        helpText={helpText}
        setLabel={(value) => setAttributes({ label: value })}
        setHelpText={(value) => setAttributes({ helpText: value })}
        labelPlaceholder={blockDefaults.placeholders.label}
        helpPlaceholder={blockDefaults.placeholders.helpText}
        alignment={fieldAlignment}
      >
        <input
          type="number"
          className={`form-control sf-number-input ${sizeClass}`}
          required={required}
          min={min}
          max={max}
          step={step}
          defaultValue={defaultValue}
          inputMode="numeric"
          pattern="[0-9]+([.,][0-9]+)?"
        />
      </FieldWrapper>
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-number/editor.scss

```scss
/**
 * Editor styles for the SmartForms Number block.
 *
 * Applies a border and padding to the block and styles the number container.
 *
 * @package SmartForms
 */
.wp-block-smartforms-number {
  border: 1px solid #ddd;
  padding: 10px;

  // Ensure the number input uses Bootstrap's default border style.
  .sf-number-input {
    border: 1px solid #ced4da;
  }
}

```

# src/blocks/smartforms-number/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/number', {
  edit,
  save: () => null,
});

```

# src/blocks/smartforms-number/style.scss

```scss
@use '../_theme.scss' as *;

/*
 * Frontend stylesheet for the Number block.
 *
 * We want the number field to appear exactly as it does when styled by Bootstrap.
 * Therefore, we remove any extra styling that might override Bootstrap’s defaults.
 *
 * The markup produced by our block gives the input the "form-control" class,
 * so Bootstrap will handle the border color, border radius, padding, etc.
 */
.wp-block-smartforms-number {
  .sf-number-container {
    display: block; // Ensure the container displays as a block-level element.
  }

  .sf-number-input {
    /* Do not override; let Bootstrap's .form-control styling apply. */
  }
}

```

# src/blocks/smartforms-progress/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/progress",
  "title": "Progress Indicator",
  "category": "smartforms",
  "icon": "chart-bar",
  "description": "A progress indicator for multi-step forms.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": "Progress Indicator"
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "className": {
      "type": "string"
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

# src/blocks/smartforms-progress/edit.js

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Progress Indicator Settings', 'smartforms')}>
          <TextControl
            label={__('Label', 'smartforms')}
            value={attributes.label}
            onChange={(value) => setAttributes({ label: value })}
          />
          
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={attributes.required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>
      </InspectorControls>
      <label>{attributes.label}</label>
      <input type="progress"  required={attributes.required} />
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-progress/editor.scss

```scss
.wp-block-smartforms-progress {
  border: 1px solid #ddd;
  padding: 10px;
}
```

# src/blocks/smartforms-progress/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/progress', {
  edit,
  save,
});

```

# src/blocks/smartforms-progress/save.js

```js
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      <label>{attributes.label}</label>
      <input type="progress"  required={attributes.required} />
    </div>
  );
};

export default Save;

```

# src/blocks/smartforms-progress/style.scss

```scss
.wp-block-smartforms-progress input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

# src/blocks/smartforms-radio/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/radio",
  "title": "Radio Buttons",
  "category": "smartforms",
  "icon": "button",
  "description": "A set of radio buttons for selecting an option.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": "Radio Buttons"
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "className": {
      "type": "string"
    },
    "placeholder": {
      "type": "string",
      "default": "Enter radio buttons..."
    },
    "options": {
      "type": "array",
      "default": [
        "Option 1",
        "Option 2"
      ]
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

# src/blocks/smartforms-radio/edit.js

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Radio Buttons Settings', 'smartforms')}>
          <TextControl
            label={__('Label', 'smartforms')}
            value={attributes.label}
            onChange={(value) => setAttributes({ label: value })}
          />
          <TextControl label={__('Placeholder', 'smartforms')} value={attributes.placeholder} onChange={(value) => setAttributes({ placeholder: value })} />
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={attributes.required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>
      </InspectorControls>
      <label>{attributes.label}</label>
      <input type="radio" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-radio/editor.scss

```scss
.wp-block-smartforms-radio {
  border: 1px solid #ddd;
  padding: 10px;
}
```

# src/blocks/smartforms-radio/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/radio', {
  edit,
  save,
});

```

# src/blocks/smartforms-radio/save.js

```js
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      <label>{attributes.label}</label>
      <input type="radio" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Save;

```

# src/blocks/smartforms-radio/style.scss

```scss
.wp-block-smartforms-radio input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

# src/blocks/smartforms-select/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/select",
  "title": "Dropdown",
  "category": "smartforms",
  "icon": "arrow-down",
  "description": "A dropdown select field.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": "Dropdown"
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "className": {
      "type": "string"
    },
    "placeholder": {
      "type": "string",
      "default": "Enter dropdown..."
    },
    "options": {
      "type": "array",
      "default": [
        "Option 1",
        "Option 2"
      ]
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

# src/blocks/smartforms-select/edit.js

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Dropdown Settings', 'smartforms')}>
          <TextControl
            label={__('Label', 'smartforms')}
            value={attributes.label}
            onChange={(value) => setAttributes({ label: value })}
          />
          <TextControl label={__('Placeholder', 'smartforms')} value={attributes.placeholder} onChange={(value) => setAttributes({ placeholder: value })} />
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={attributes.required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>
      </InspectorControls>
      <label>{attributes.label}</label>
      <input type="select" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-select/editor.scss

```scss
.wp-block-smartforms-select {
  border: 1px solid #ddd;
  padding: 10px;
}
```

# src/blocks/smartforms-select/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/select', {
  edit,
  save,
});

```

# src/blocks/smartforms-select/save.js

```js
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      <label>{attributes.label}</label>
      <input type="select" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Save;

```

# src/blocks/smartforms-select/style.scss

```scss
.wp-block-smartforms-select input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

# src/blocks/smartforms-slider/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/slider",
  "title": "Slider",
  "category": "smartforms",
  "icon": "slides",
  "description": "A slider input for selecting a range.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": "Slider"
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "className": {
      "type": "string"
    },
    "placeholder": {
      "type": "string",
      "default": "Enter slider..."
    },
    "min": {
      "type": "number",
      "default": 0
    },
    "max": {
      "type": "number",
      "default": 100
    },
    "step": {
      "type": "number",
      "default": 1
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

# src/blocks/smartforms-slider/edit.js

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Slider Settings', 'smartforms')}>
          <TextControl
            label={__('Label', 'smartforms')}
            value={attributes.label}
            onChange={(value) => setAttributes({ label: value })}
          />
          <TextControl label={__('Placeholder', 'smartforms')} value={attributes.placeholder} onChange={(value) => setAttributes({ placeholder: value })} />
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={attributes.required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>
      </InspectorControls>
      <label>{attributes.label}</label>
      <input type="range" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-slider/editor.scss

```scss
.wp-block-smartforms-slider {
  border: 1px solid #ddd;
  padding: 10px;
}
```

# src/blocks/smartforms-slider/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/slider', {
  edit,
  save,
});

```

# src/blocks/smartforms-slider/save.js

```js
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      <label>{attributes.label}</label>
      <input type="range" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Save;

```

# src/blocks/smartforms-slider/style.scss

```scss
.wp-block-smartforms-slider input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

# src/blocks/smartforms-text/block.json

```json
{
	"apiVersion": 2,
	"name": "smartforms/text",
	"title": "Text Input",
	"category": "smartforms",
	"icon": "editor-textcolor",
	"description": "A text input field for SmartForms.",
	"supports": {
		"html": false,
		"color": {
			"background": true,
			"text": true,
			"gradients": true
		},
		"spacing": {
			"margin": true,
			"padding": true
		},
		"typography": {
			"fontSize": true,
			"lineHeight": true
		}
	},
	"attributes": {
		"label": {
			"type": "string",
			"default": "Text Input"
		},
		"required": {
			"type": "boolean",
			"default": false
		},
		"className": {
			"type": "string"
		},
		"placeholder": {
			"type": "string",
			"default": "Enter text input..."
		},
		"defaultValue": {
			"type": "string",
			"default": ""
		},
		"helpText": {
			"type": "string",
			"default": "Only letters, numbers, punctuation, symbols & spaces allowed."
		},
		"inputId": {
			"type": "string",
			"default": ""
		}
	},
	"editorScript": "file:./index.js",
	"editorStyle": "file:./index.css",
	"style": "file:./style-index.css"
}

```

# src/blocks/smartforms-text/edit.js

```js
/**
 * Edit component for the SmartForms Text Input block.
 *
 * Renders a preview of the text input field in the editor along with InspectorControls
 * for adjusting the field's settings.
 *
 * @package SmartForms
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

const Edit = ({ attributes, setAttributes, clientId }) => {
	const blockProps = useBlockProps();

	// Generate a unique input ID for this block instance if not already set.
	useEffect(() => {
		if ( ! attributes.inputId ) {
			setAttributes({ inputId: 'smartforms-text-' + clientId });
		}
	}, []);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={ __( 'Text Input Settings', 'smartforms' ) }>
					<TextControl
						label={ __( 'Label', 'smartforms' ) }
						value={ attributes.label }
						onChange={ ( value ) => setAttributes({ label: value }) }
					/>
					<TextControl
						label={ __( 'Placeholder', 'smartforms' ) }
						value={ attributes.placeholder }
						onChange={ ( value ) => setAttributes({ placeholder: value }) }
					/>
					<ToggleControl
						label={ __( 'Required', 'smartforms' ) }
						checked={ attributes.required }
						onChange={ ( value ) => setAttributes({ required: value }) }
					/>
					<TextControl
						label={ __( 'Help Text', 'smartforms' ) }
						value={ attributes.helpText }
						onChange={ ( value ) => setAttributes({ helpText: value }) }
						help={ __( 'This hint appears below the field.', 'smartforms' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<label>{ attributes.label }</label>
			<input
				id={ attributes.inputId }
				type="text"
				placeholder={ attributes.placeholder }
				required={ attributes.required }
				// This pattern requires at least one letter or digit.
				pattern="^(?=.*[A-Za-z0-9]).+$"
				// Data attributes for potential front-end initialization.
				data-validate="true"
				data-validation-message={ attributes.helpText }
				className="smartforms-text-input"
			/>
			{ attributes.helpText && (
				<p style={ { color: '#999', fontSize: '12px', marginTop: '4px' } }>
					{ attributes.helpText }
				</p>
			) }
		</div>
	);
};

export default Edit;

```

# src/blocks/smartforms-text/editor.scss

```scss
.wp-block-smartforms-text {
  border: 1px solid #ddd;
  padding: 10px;
}
```

# src/blocks/smartforms-text/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/text', {
  edit,
  save,
});

```

# src/blocks/smartforms-text/save.js

```js
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useBlockProps } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const { label, required } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<label className="sf-text-main-label">{ label }</label>
			<input type="text" className="smartforms-text-input" required={ required } />
		</div>
	);
};

export default Save;

```

# src/blocks/smartforms-text/style.scss

```scss
.wp-block-smartforms-text input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

# src/blocks/smartforms-textarea/block.json

```json
{
  "apiVersion": 2,
  "name": "smartforms/textarea",
  "title": "Textarea",
  "category": "smartforms",
  "icon": "editor-paragraph",
  "description": "A multi-line text input field.",
  "supports": {
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "attributes": {
    "label": {
      "type": "string",
      "default": "Textarea"
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "className": {
      "type": "string"
    },
    "placeholder": {
      "type": "string",
      "default": "Enter textarea..."
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

# src/blocks/smartforms-textarea/edit.js

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Textarea Settings', 'smartforms')}>
          <TextControl
            label={__('Label', 'smartforms')}
            value={attributes.label}
            onChange={(value) => setAttributes({ label: value })}
          />
          <TextControl label={__('Placeholder', 'smartforms')} value={attributes.placeholder} onChange={(value) => setAttributes({ placeholder: value })} />
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={attributes.required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>
      </InspectorControls>
      <label>{attributes.label}</label>
      <input type="textarea" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Edit;

```

# src/blocks/smartforms-textarea/editor.scss

```scss
.wp-block-smartforms-textarea {
  border: 1px solid #ddd;
  padding: 10px;
}
```

# src/blocks/smartforms-textarea/index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('smartforms/textarea', {
  edit,
  save,
});

```

# src/blocks/smartforms-textarea/save.js

```js
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      <label>{attributes.label}</label>
      <input type="textarea" placeholder={attributes.placeholder} required={attributes.required} />
    </div>
  );
};

export default Save;

```

# src/blocks/smartforms-textarea/style.scss

```scss
.wp-block-smartforms-textarea input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

# src/chat-ui/index.js

```js
import './smartforms-chat.js';         // This contains your chat UI runtime logic

```

# src/chat-ui/inputRenderers.js

```js
/**
 * Creates an input control element based on the provided field configuration.
 * For each field type, we produce a structure that matches your block classes:
 *
 * <div class="sf-field-wrapper">
 *   <div class="sf-input-container">
 *     <div class="sf-...-container OR sf-...-group"> <!-- actual input(s) -->
 *       ...
 *     </div>
 *   </div>
 * </div>
 *
 * NOTE: We removed the appended <p class="sf-field-help"> so as not to
 * duplicate the help text that already appears in the submit button row.
 *
 * @param {Object}   field                   - Field configuration (type, placeholder, min, max, layout, etc.).
 * @param {Function} updateSubmitButtonState - Callback to enable/disable the submit button based on input.
 * @returns {HTMLElement} The outer .sf-field-wrapper element containing the actual input(s).
 */
export function createInputControl(field, updateSubmitButtonState) {
  // We'll build everything into an outer wrapper and return it.
  const wrapper = document.createElement('div');
  wrapper.className = 'sf-field-wrapper';

  // The .sf-input-container encloses the core UI for the field.
  const inputContainer = document.createElement('div');
  inputContainer.className = 'sf-input-container';

  let specificContainer; // This will be a .sf-*-container or .sf-*-group, etc.

  switch (field.type) {
    case 'text': {
      // For text fields, we'll do <div class="sf-text-container"><input type="text" ...></div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-text-container';

      const inputEl = document.createElement('input');
      inputEl.type = 'text';
      inputEl.className = 'form-control sf-text-input';
      inputEl.placeholder = field.placeholder || 'Type your answer here...';

      inputEl.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(inputEl);
      break;
    }

    case 'number': {
      // For number fields, we want to move only the field.
      // In the frontend, the Chat UI creates the field using this helper.
      // Instead of applying alignment classes to the inner container, we make the input container a flex container.
      // Determine the appropriate justify-content class based on field.fieldAlignment.
      const justifyClass =
        field.fieldAlignment === 'center'
          ? 'justify-content-center'
          : field.fieldAlignment === 'right'
            ? 'justify-content-end'
            : 'justify-content-start';
      // Add flex display and justification classes to the input container.
      inputContainer.classList.add('d-flex', justifyClass);

      // Create a container for the number input (without applying alignment here).
      specificContainer = document.createElement('div');
      // Determine the size class based on field.fieldSize.
      const sizeClass =
        field.fieldSize === 'small'
          ? 'form-control-sm'
          : field.fieldSize === 'large'
            ? 'form-control-lg'
            : '';
      const inputEl = document.createElement('input');
      inputEl.type = 'number';
      inputEl.className = `form-control sf-number-input ${sizeClass}`;
      if (typeof field.min !== 'undefined') {
        inputEl.min = field.min;
      }
      if (typeof field.max !== 'undefined') {
        inputEl.max = field.max;
      }
      if (typeof field.step !== 'undefined') {
        inputEl.step = field.step;
      }
      inputEl.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(inputEl);
      break;
    }

    case 'checkbox': {
      // <div class="sf-checkbox-group"> multiple <input type="checkbox" ...> </div>
      const checkboxLayout = field.layout || 'horizontal';
      specificContainer = document.createElement('div');
      specificContainer.className =
        'sf-checkbox-group sf-checkbox-group-' + checkboxLayout;
      specificContainer.setAttribute('data-layout', checkboxLayout);

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt, index) => {
          const optionWrapper = document.createElement('div');
          const inlineClass =
            checkboxLayout === 'horizontal' ? ' form-check-inline' : '';
          optionWrapper.className =
            'sf-checkbox-option form-check' + inlineClass;

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'form-check-input';
          checkbox.value = opt.value;
          checkbox.id = `cb-${index}-${(opt.value || '').replace(/\s+/g, '-')}`;

          const label = document.createElement('label');
          label.className = 'form-check-label';
          label.htmlFor = checkbox.id;
          label.textContent = opt.label;

          checkbox.addEventListener('change', () => {
            const selected = Array.from(
              specificContainer.querySelectorAll("input[type='checkbox']"),
            )
              .filter((cb) => cb.checked)
              .map((cb) => cb.value);
            updateSubmitButtonState(field, selected);
          });

          optionWrapper.appendChild(checkbox);
          optionWrapper.appendChild(label);
          specificContainer.appendChild(optionWrapper);
        });
      }
      break;
    }

    case 'buttons': {
      // <div class="sf-buttons-group [horizontal or vertical]"> multiple <button ...> </div>
      specificContainer = document.createElement('div');

      if (field.layout === 'vertical') {
        specificContainer.className =
          'sf-buttons-group sf-buttons-group--vertical';
        specificContainer.setAttribute('data-layout', 'vertical');
      } else {
        specificContainer.className =
          'sf-buttons-group sf-buttons-group--horizontal d-flex flex-wrap gap-2';
        specificContainer.setAttribute('data-layout', 'horizontal');
      }

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn-primary';
          btn.setAttribute('data-value', opt.value);
          btn.textContent = opt.label;

          btn.addEventListener('click', () => {
            if (field.multiple) {
              btn.classList.toggle('active');
              const activeButtons =
                specificContainer.querySelectorAll('button.active');
              const values = Array.from(activeButtons).map((b) =>
                b.getAttribute('data-value'),
              );
              updateSubmitButtonState(field, values);
            } else {
              Array.from(specificContainer.children).forEach((child) =>
                child.classList.remove('active'),
              );
              if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                updateSubmitButtonState(field, null);
              } else {
                btn.classList.add('active');
                updateSubmitButtonState(field, opt.value);
              }
            }
          });

          specificContainer.appendChild(btn);
        });
      }
      break;
    }

    case 'slider': {
      // <div class="sf-slider-container"><input type="range" ...></div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-slider-container';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'sf-slider-input';

      if (typeof field.min !== 'undefined') {
        slider.min = field.min;
      }
      if (typeof field.max !== 'undefined') {
        slider.max = field.max;
      }
      if (typeof field.step !== 'undefined') {
        slider.step = field.step;
      }

      slider.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(slider);
      break;
    }

    case 'select': {
      // <div class="sf-select-container"><select ...> <option> ...</div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-select-container';

      const selectEl = document.createElement('select');
      selectEl.className = 'sf-select-input form-control';

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt) => {
          // In your dynamic block you might have { label, value } objects
          const option = document.createElement('option');
          option.value = opt.value || opt;
          option.textContent = opt.label || opt;
          selectEl.appendChild(option);
        });
      }

      selectEl.addEventListener('change', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(selectEl);
      break;
    }

    case 'radio': {
      // <div class="sf-radio-group"><input type="radio" ...> ...</div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-radio-group';

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((opt, index) => {
          const radioWrapper = document.createElement('div');
          radioWrapper.className =
            'sf-radio-option form-check form-check-inline';

          const radioEl = document.createElement('input');
          radioEl.type = 'radio';
          radioEl.className = 'form-check-input';
          radioEl.value = opt.value || opt;
          radioEl.id = `radio-${index}-${(opt.value || '').replace(/\s+/g, '-')}`;
          radioEl.name = field.groupName || 'sf-radio-group';

          const labelEl = document.createElement('label');
          labelEl.className = 'form-check-label';
          labelEl.htmlFor = radioEl.id;
          labelEl.textContent = opt.label || opt;

          radioEl.addEventListener('change', () => {
            updateSubmitButtonState(field, radioEl.value);
          });

          radioWrapper.appendChild(radioEl);
          radioWrapper.appendChild(labelEl);
          specificContainer.appendChild(radioWrapper);
        });
      }
      break;
    }

    case 'textarea': {
      // <div class="sf-textarea-container"><textarea ...></div>
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-textarea-container';

      const textarea = document.createElement('textarea');
      textarea.className = 'form-control sf-textarea';
      textarea.rows = 4;
      textarea.placeholder = field.placeholder || 'Type your answer here...';

      textarea.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(textarea);
      break;
    }

    default: {
      // For any other block types, fallback to <textarea>.
      specificContainer = document.createElement('div');
      specificContainer.className = 'sf-default-container';

      const fallback = document.createElement('textarea');
      fallback.className = 'form-control sf-default-textarea';
      fallback.rows = 4;
      fallback.placeholder = field.placeholder || 'Type your answer here...';

      fallback.addEventListener('input', (e) => {
        updateSubmitButtonState(field, e.target.value);
      });

      specificContainer.appendChild(fallback);
      break;
    }
  }

  // Put the specific container inside .sf-input-container
  inputContainer.appendChild(specificContainer);

  // Then add .sf-input-container into the outer .sf-field-wrapper
  wrapper.appendChild(inputContainer);

  return wrapper;
}

/**
 * Replaces the current input control within a container with the provided new control.
 * This is used in smartforms-chat.js to swap out the old input for the new field’s wrapper.
 *
 * @param {HTMLElement} container - The container holding the input control.
 * @param {HTMLElement} newControl - The new input control element.
 */
export function replaceInputControl(container, newControl) {
  if (container.firstElementChild) {
    container.firstElementChild.remove();
  }
  container.insertBefore(newControl, container.firstElementChild);
}

```

# src/chat-ui/smartforms-chat.js

```js
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
      console.error("Error parsing smartforms configuration:", e);
      return null;
    }
  }
  return null;
}

// Use configuration from the DOM if available; otherwise, fall back to moduleConfig.
const smartformsConfig = getConfigFromDOM() || moduleConfig;

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const { formData, ajaxUrl, nonce, formId } = smartformsConfig;

  // Ensure we have valid form data with at least one field
  if (!formData || !formData.fields || formData.fields.length === 0) {
    console.error("No form data available for SmartForms chat flow.");
    return;
  }

  let currentStep = 0; // Index of the current field being processed
  const formResponses = {}; // Object to store user responses keyed by field ID or index
  let currentAnswer = null; // Holds the current answer (used for button groups)

  // Cache frequently accessed DOM elements
  const chatDialog = document.getElementById("smartforms-chat-dialog");
  const submitButton = document.getElementById("smartforms-chat-submit-button");
  const inputContainer = document.getElementById("smartforms-chat-input-box");
  const helpContainer = document.getElementById("smartforms-chat-help-container");

  /**
   * Appends a message bubble to the chat dialog.
   * @param {string} message - The text to display.
   * @param {string} sender - "bot" or "user" (affects styling).
   */
  function appendMessage(message, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("smartforms-chat-message", sender);
    const p = document.createElement("p");
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
      submitButton.classList.remove("disabled");
      // For buttons, also update the local variable.
      if (currentField.type === "buttons") {
        currentAnswer = answer;
      }
      return;
    }
    // For button fields, update the local currentAnswer.
    if (currentField.type === "buttons") {
      currentAnswer = answer;
    }
    // Disable if answer is null, an empty string, or an empty array.
    if (
      answer === null ||
      (typeof answer === "string" && answer.trim() === "") ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      submitButton.classList.add("disabled");
    } else {
      submitButton.classList.remove("disabled");
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
    appendMessage(currentField.label, "bot");
    const inputControl = createInputControl(currentField, updateSubmitButtonState);
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
      (
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0) ||
        answer === null
      )
    ) {
      // Show validation error message if required field is empty.
      helpContainer.textContent =
        currentField.requiredMessage || `${currentField.label} is required.`;
      helpContainer.classList.add("smartforms-error-message");
      setTimeout(() => {
        helpContainer.textContent = currentField.helpText || "Enter your help text";
        helpContainer.classList.remove("smartforms-error-message");
      }, 3000);
      return;
    }
    // Append the user's answer as a message bubble.
    appendMessage(displayText, "user");
    helpContainer.textContent = currentField.helpText || "Enter your help text";
    helpContainer.classList.remove("smartforms-error-message");
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
      data.append("action", "process_smartform");
      data.append("smartform_nonce", nonce);
      data.append("form_id", formId);
      data.append("form_data", JSON.stringify(formResponses));

      // Submit the form data using fetch.
      fetch(ajaxUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString()
      })
        .then(response => response.json())
        .then(result => {
          chatDialog.innerHTML = ""; // Clear conversation
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

          // Disable further input by replacing the input area with a disabled textarea.
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

  // Begin by displaying the first question.
  showCurrentQuestion();
  updateSubmitButtonState(formData.fields[currentStep], currentAnswer);

  // Set up the click event handler for the submit button.
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const currentField = formData.fields[currentStep];
    // If the field is required and the button is disabled, show the validation error.
    if (currentField.required && submitButton.classList.contains("disabled")) {
      helpContainer.textContent =
        currentField.requiredMessage || `${currentField.label} is required.`;
      helpContainer.classList.add("smartforms-error-message");
      setTimeout(() => {
        helpContainer.textContent = currentField.helpText || "Enter your help text";
        helpContainer.classList.remove("smartforms-error-message");
      }, 3000);
      return;
    }
    // Retrieve the answer based on the field type.
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

```

# src/chat-ui/smartforms-chat.scss

```scss
/**
 * File: assets/scss/smartforms-chat.scss
 *
 * This file centralizes all styling for the SmartForms Chat UI.
 * Form controls continue to use Bootstrap defaults, while these custom rules
 * style the chat container and layout.
 */

/* Outer wrapper for the chat UI */
.smartforms-chat-wrapper {
	width: 100%;
	margin: 0 auto;
}

/* Contextual adjustments for the wrapper */
.smartforms-chat-wrapper.admin-bar-present {
	/* No extra top margin if WordPress pushes content down already */
}
.smartforms-chat-wrapper.admin-display {
	/* Adjustments for admin area if needed; currently none */
}

/* Chat container */
.smartforms-chat-container {
	width: 100% !important;
	display: flex;
	flex-direction: column;
	max-width: 800px;
	margin: 20px auto;
	background-color: #ffffff;
	border: 1px solid #cccccc;
	border-radius: 10px;
	box-shadow: none;
	padding: 10px;
}

/* Chat header */
.smartforms-chat-header {
	flex: 0 0 auto;
	width: 100%;
	padding: 10px;
	border-bottom: 1px solid #cccccc;
	color: #000000;
	font-family: sans-serif;
	font-size: 1.125rem; /* 18px */
}

/* Chat dialog: Constrained to a maximum height so it scrolls when content exceeds */
.smartforms-chat-dialog {
	flex: 1 1 auto;
	width: 100%;
	max-height: 300px; /* Adjust as needed */
	overflow-y: auto;
	padding: 10px;
	display: flex;
	flex-direction: column;
}

/* Input container */
.smartforms-chat-input-container {
	flex: 0 0 auto;
	width: 100%;
	background-color: #ffffff;
	border: 1px solid #cccccc;
	border-radius: 5px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	padding: 10px;
	border-top: 1px solid #cccccc;
}

/* Input box */
.smartforms-chat-input-box {
	width: 100%;
	min-height: 100px;
	resize: vertical;
	max-height: 150px;
	overflow-y: auto;
}

/* Input control */
.smartforms-chat-input {
	width: 100%;
	border: none;
	background-color: transparent;
	resize: none;
	box-sizing: border-box;
}

/* Submit row */
.smartforms-chat-submit-row {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 5px;
}

/* Help container */
#smartforms-chat-help-container {
	flex-grow: 1;
	text-align: left;
	padding-right: 10px;
	font-size: 0.75rem; /* 12px */
	color: #6c757d;
}

/* Submit button */
.smartforms-chat-submit-button {
	background-color: #007bff;
	color: #ffffff;
	border: 1px solid #007bff;
	border-radius: 50%;
	width: 36px;
	height: 36px;
	font-size: 2.25rem; /* 36px */
	line-height: 2.25rem; /* 36px */
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.3s ease, opacity 0.3s ease;
}

/* Hover state for submit button: use a slightly darker blue */
.smartforms-chat-submit-button:hover {
	background-color: #006799;
	border-color: #006799;
}

/* Disabled state for submit button: reduce opacity while retaining background color */
#smartforms-chat-submit-button.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* Ensure disabled state on hover doesn't change color */
#smartforms-chat-submit-button.disabled:hover {
	background-color: #007bff !important;
	border-color: #007bff !important;
}

/* Submit icon */
.smartforms-chat-submit-icon {
	font-size: 1.8rem; /* 28.8px */
	line-height: 1.8rem;
}

/* Additional help text styling */
.smartforms-help-text {
	color: #999;
	font-size: 0.75rem;
	margin-top: 4px;
}

/* Validation error styling */
#smartforms-chat-help-container.smartforms-error-message {
	color: #dc3545;
	font-size: 0.875rem; /* 14px */
	font-weight: bold;
	margin-right: 10px;
	font-family: inherit;
}

/* Message bubble styles */
.smartforms-chat-message {
	margin-bottom: 10px;
	padding: 8px 12px;
	border-radius: 8px;
	max-width: 80%;
	word-wrap: break-word;
}

.smartforms-chat-message.bot {
	background-color: #ffffff;
	color: #000;
	align-self: flex-start;
}

.smartforms-chat-message.user {
	background-color: #f1f1f1; /* light grey background */
	color: #000;
	align-self: flex-end;
}

```

# src/config/blockDefaults.js

```js
// src/config/blockDefaults.js
export const blockDefaults = {
  placeholders: {
    label: 'Enter your question here',
    helpText: 'Enter your help text here',
  },
  options: [
    { label: 'Option 1', value: 'option-1' },
    { label: 'Option 2', value: 'option-2' },
  ],
};

```

# src/config/smartformsConfig.js

```js
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

```

# src/hooks/useFormState.js

```js
/**
 * useFormState hook for SmartForms.
 *
 * This is a placeholder hook. You can enhance it with your custom logic as needed.
 *
 * @param {Object} initialState The initial state.
 * @return {Object} The form state.
 */
export function useFormState(initialState) {
  // For now, just return the initial state unchanged.
  return initialState;
}

```

# src/hooks/useStepLogic.js

```js

```

# templates/index.php

```php
<?php
/**
 * Template for SmartForms.
 *
 * This file is intentionally left blank.
 *
 * @package SmartForms
 */

```

# templates/single-smart_form.php

```php
<?php
/**
 * Template for displaying SmartForms chatbot UI without theme elements.
 *
 * @package SmartForms
 */

\SmartForms\Core\SmartForms::log_error( 'single-smart_form.php loaded for Form ID: ' . get_the_ID() );

// Prevent WordPress from loading the default theme layout.
define( 'DONOTCACHEPAGE', true );
header( 'Content-Type: text/html; charset=' . get_bloginfo( 'charset' ) );

// Start output buffering.
ob_start();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<div class="smartforms-container">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            $form_id = get_the_ID();

            if ( empty( $form_id ) ) {
                $error = new \WP_Error( 'missing_form_id', __( 'Form ID is missing.', 'smartforms' ) );
                \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php failed: Missing form ID.', $error );
                echo '<p class="text-danger">' . esc_html__( 'Error: Form ID is missing.', 'smartforms' ) . '</p>';
                return;
            }

            \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php rendering Form ID: ' . $form_id );
            
            if ( method_exists( '\SmartForms\Core\ChatUI', 'render' ) ) {
                echo \SmartForms\Core\ChatUI::render( $form_id );
            } else {
                $error = new \WP_Error( 'function_not_found', __( 'ChatUI::render function not found.', 'smartforms' ) );
                \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php failed: ChatUI::render function missing.', $error );
                echo '<p class="text-danger">' . esc_html__( 'Error: Chat UI function missing.', 'smartforms' ) . '</p>';
            }
        endwhile;
    else :
        $error = new \WP_Error( 'no_posts_found', __( 'No form post found.', 'smartforms' ) );
        \SmartForms\Core\SmartForms::log_error( 'single-smart_form.php failed: No post found.', $error );
        echo '<p class="text-danger">' . esc_html__( 'Error: No form found.', 'smartforms' ) . '</p>';
    endif;
    ?>
</div>

<?php wp_footer(); ?>

</body>
</html>
<?php
// Flush the output buffer.
ob_end_flush();

```

# themes/dark.json

```json
{
	"label": "Dark",
	"styles": {
	  "smartforms_chat_container_background_color": "#333333",
	  "smartforms_chat_container_border_color": "#444444",
	  "smartforms_chat_container_border_style": "solid",
	  "smartforms_chat_container_border_width": 1,
	  "smartforms_chat_container_border_radius": 10,
	  "smartforms_chat_container_box_shadow": "none",
	  "smartforms_chat_container_padding": "10px",
	  "smartforms_chat_container_margin": "10px",
	  "smartforms_chat_container_max_width": "800px",
	  "smartforms_chat_container_flex_direction": "column",
	  "smartforms_chat_container_justify_content": "center",
	  "smartforms_chat_container_align_items": "center",
  
	  "smartforms_chat_header_background_color": "#222222",
	  "smartforms_chat_header_text_color": "#ffffff",
	  "smartforms_chat_header_font_family": "Helvetica, Arial, sans-serif",
	  "smartforms_chat_header_font_size": "18px",
	  "smartforms_chat_header_padding": "10px",
  
	  "smartforms_chat_dialog_background_color": "#444444",
	  "smartforms_chat_dialog_text_color": "#ffffff",
	  "smartforms_chat_dialog_font_family": "Helvetica, Arial, sans-serif",
	  "smartforms_chat_dialog_font_size": "14px",
	  "smartforms_chat_dialog_padding": "8px",
	  "smartforms_chat_dialog_border_color": "#555555",
	  "smartforms_chat_dialog_border_style": "solid",
	  "smartforms_chat_dialog_border_width": 1,
	  "smartforms_chat_dialog_border_radius": 5,
  
	  "smartforms_form_background_color": "#444444",
	  "smartforms_form_font_family": "Helvetica, Arial, sans-serif",
	  "smartforms_form_font_size": "14px",
	  "smartforms_form_text_color": "#ffffff",
	  "smartforms_form_padding": "15px",
  
	  "smartforms_button_background_color": "#0066cc",
	  "smartforms_button_text_color": "#ffffff",
	  "smartforms_button_border_color": "#0066cc",
	  "smartforms_button_border_style": "solid",
	  "smartforms_button_border_width": 1,
	  "smartforms_button_border_radius": 4,
	  "smartforms_button_hover_background_color": "#005bb5",
	  "smartforms_button_hover_text_color": "#ffffff",
  
	  "smartforms_chat_input_container_background_color": "#222222",
	  "smartforms_chat_input_container_border_color": "#666666",
	  "smartforms_chat_input_container_border_style": "solid",
	  "smartforms_chat_input_container_border_width": 1,
	  "smartforms_chat_input_container_border_radius": 5,
	  "smartforms_chat_input_container_box_shadow": "0 2px 5px rgba(0,0,0,0.2)",
  
	  "smartforms_chat_submit_button_background_color": "#0066cc",
	  "smartforms_chat_submit_button_text_color": "#ffffff",
	  "smartforms_chat_submit_button_border_color": "#0066cc",
	  "smartforms_chat_submit_button_border_style": "solid",
	  "smartforms_chat_submit_button_border_width": 1,
	  "smartforms_chat_submit_button_border_radius": "50%",
	  "smartforms_chat_submit_button_size": "36px",
	  "smartforms_chat_submit_icon_size": "24px",
	  "smartforms_chat_submit_button_icon": "fas fa-arrow-up"
	}
  }
  
```

# themes/light.json

```json
{
	"label": "Light (Bootstrap Default)",
	"styles": {
	  "smartforms_chat_container_background_color": "#ffffff",
	  "smartforms_chat_container_border_color": "#cccccc",
	  "smartforms_chat_container_border_style": "solid",
	  "smartforms_chat_container_border_width": 1,
	  "smartforms_chat_container_border_radius": 10,
	  "smartforms_chat_container_box_shadow": "none",
	  "smartforms_chat_container_padding": "10px",
	  "smartforms_chat_container_margin": "10px",
	  "smartforms_chat_container_max_width": "800px",
	  "smartforms_chat_container_flex_direction": "column",
	  "smartforms_chat_container_justify_content": "center",
	  "smartforms_chat_container_align_items": "center",
  
	  "smartforms_chat_header_background_color": "#f8f9fa",
	  "smartforms_chat_header_text_color": "#333333",
	  "smartforms_chat_header_font_family": "Helvetica, Arial, sans-serif",
	  "smartforms_chat_header_font_size": "18px",
	  "smartforms_chat_header_padding": "10px",
  
	  "smartforms_chat_dialog_background_color": "#ffffff",
	  "smartforms_chat_dialog_text_color": "#333333",
	  "smartforms_chat_dialog_font_family": "Helvetica, Arial, sans-serif",
	  "smartforms_chat_dialog_font_size": "14px",
	  "smartforms_chat_dialog_padding": "8px",
	  "smartforms_chat_dialog_border_color": "#dddddd",
	  "smartforms_chat_dialog_border_style": "solid",
	  "smartforms_chat_dialog_border_width": 1,
	  "smartforms_chat_dialog_border_radius": 5,
  
	  "smartforms_form_background_color": "#ffffff",
	  "smartforms_form_font_family": "Helvetica, Arial, sans-serif",
	  "smartforms_form_font_size": "14px",
	  "smartforms_form_text_color": "#333333",
	  "smartforms_form_padding": "15px",
  
	  "smartforms_button_background_color": "#007bff",
	  "smartforms_button_text_color": "#ffffff",
	  "smartforms_button_border_color": "#007bff",
	  "smartforms_button_border_style": "solid",
	  "smartforms_button_border_width": 1,
	  "smartforms_button_border_radius": 4,
	  "smartforms_button_hover_background_color": "#0056b3",
	  "smartforms_button_hover_text_color": "#ffffff",
  
	  "smartforms_chat_input_container_background_color": "#f8f8f8",
	  "smartforms_chat_input_container_border_color": "#cccccc",
	  "smartforms_chat_input_container_border_style": "solid",
	  "smartforms_chat_input_container_border_width": 1,
	  "smartforms_chat_input_container_border_radius": 5,
	  "smartforms_chat_input_container_box_shadow": "0 2px 5px rgba(0,0,0,0.1)",
  
	  "smartforms_chat_submit_button_background_color": "#007bff",
	  "smartforms_chat_submit_button_text_color": "#ffffff",
	  "smartforms_chat_submit_button_border_color": "#007bff",
	  "smartforms_chat_submit_button_border_style": "solid",
	  "smartforms_chat_submit_button_border_width": 1,
	  "smartforms_chat_submit_button_border_radius": "50%",
	  "smartforms_chat_submit_button_size": "32px",
	  "smartforms_chat_submit_icon_size": "24px",
	  "smartforms_chat_submit_button_icon": "fas fa-arrow-up"
	}
  }
  
```

# wp-scripts.chatui.config.js

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production', // or 'development' as needed
  entry: {
    'smartforms-chat': './src/chat-ui/smartforms-chat.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};

```

