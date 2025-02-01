/**
 * SmartForms Block Build Script
 *
 * Dynamically detects and builds all blocks inside the `blocks/` directory,
 * including nested blocks inside subdirectories (e.g., fields/text-input).
 *
 * @package SmartForms
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BLOCKS_DIR = path.resolve(__dirname, 'blocks'); // Use absolute paths
const BUILD_DIR = path.resolve(__dirname, 'build');

console.log('[BUILD] Detecting block directories...');

/**
 * Recursively find all block directories.
 *
 * @param {string} dir The directory to scan.
 * @return {string[]} An array of block directory paths.
 */
const getBlockDirectories = (dir) => {
    return fs.readdirSync(dir).flatMap((subDir) => {
        const fullPath = path.resolve(dir, subDir);
        if (fs.statSync(fullPath).isDirectory()) {
            return [fullPath, ...getBlockDirectories(fullPath)];
        }
        return [];
    });
};

// Detect all blocks, excluding `blocks/fields` but keeping `blocks/fields/*`
const blockDirs = getBlockDirectories(BLOCKS_DIR).filter(dir => {
    return path.basename(dir) !== 'fields';
});

if (blockDirs.length === 0) {
    console.error('[ERROR] No blocks found in blocks/ directory.');
    process.exit(1);
}

console.log(`[BUILD] Found ${blockDirs.length} blocks:`);
blockDirs.forEach(block => console.log(` - ${block}`));

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Build each block dynamically
blockDirs.forEach((blockPath) => {
    const blockName = path.basename(blockPath);
    const indexJsPath = path.resolve(blockPath, 'index.js'); // Absolute path

    if (fs.existsSync(indexJsPath)) {
        console.log(`[BUILD] Building: ${blockName}`);

        try {
            // Use relative paths to prevent duplication errors
            const relativePath = path.relative(process.cwd(), indexJsPath);
            execSync(`wp-scripts build "${relativePath}"`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`[ERROR] Failed to build block: ${blockName}`);
            console.error(error.message);
            process.exit(1);
        }

        // Ensure the block's build directory exists
        const buildBlockDir = path.resolve(BUILD_DIR, blockName);
        if (!fs.existsSync(buildBlockDir)) {
            fs.mkdirSync(buildBlockDir, { recursive: true });
        }

        // Copy block.json to the build directory
        const blockJsonPath = path.resolve(blockPath, 'block.json');
        if (fs.existsSync(blockJsonPath)) {
            fs.copyFileSync(blockJsonPath, path.join(buildBlockDir, 'block.json'));
            console.log(`[BUILD] Copied block.json for: ${blockName}`);
        } else {
            console.warn(`[WARNING] block.json not found for: ${blockName}`);
        }
    } else {
        console.warn(`[WARNING] No index.js found for: ${blockName}`);
    }
});

console.log('[BUILD] All blocks compiled successfully.');
