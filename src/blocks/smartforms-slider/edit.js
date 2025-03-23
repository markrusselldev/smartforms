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
          <TextControl
            label={__('Placeholder', 'smartforms')}
            value={attributes.placeholder}
            onChange={(value) => setAttributes({ placeholder: value })}
          />
          <ToggleControl
            label={__('Required', 'smartforms')}
            checked={attributes.required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>
      </InspectorControls>
      <label>{attributes.label}</label>
      <input
        type="range"
        placeholder={attributes.placeholder}
        required={attributes.required}
      />
    </div>
  );
};

export default Edit;
