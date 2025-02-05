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
