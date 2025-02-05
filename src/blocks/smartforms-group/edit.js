import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Group Settings', 'smartforms')}>
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
      <input type="group"  required={attributes.required} />
    </div>
  );
};

export default Edit;
