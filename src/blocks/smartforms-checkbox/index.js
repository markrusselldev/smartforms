/**
 * Registers the smartforms/checkbox block.
 *
 * This block allows users to add multiple checkbox options with custom labels.
 * We register it manually in JS to allow full control over the icon and functionality.
 *
 * @package SmartForms
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './editor.scss';
import './style.scss';

const CheckboxIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1" />
    <polyline points="7 12 11 16 17 8" fill="none" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

registerBlockType('smartforms/checkbox', {
  title: 'Checkbox',
  category: 'smartforms',
  icon: CheckboxIcon,
  description: 'A checkbox field for selecting options.',
  supports: {
    html: false,
    color: {
      background: true,
      text: true,
      gradients: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    typography: {
      fontSize: true,
      lineHeight: true
    }
  },
  attributes: {
    label: {
      type: 'string',
      default: 'Checkbox'
    },
    required: {
      type: 'boolean',
      default: false
    },
    className: {
      type: 'string'
    },
    options: {
      type: 'array',
      default: [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' }
      ]
    },
    groupId: {
      type: 'string',
      default: ''
    },
    layout: {
      type: 'string',
      default: 'horizontal'
    }
  },
  edit: Edit,
  save: Save,
});
