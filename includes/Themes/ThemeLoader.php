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
