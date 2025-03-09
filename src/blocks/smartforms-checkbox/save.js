/* eslint-disable jsx-a11y/label-has-associated-control */
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const { label, options, required, groupId, layout } = attributes;
  return (
    <div {...useBlockProps.save()}>
      <label className="sf-checkbox-main-label">{label}</label>
      <div
        className={`sf-checkbox-group sf-checkbox-group-${layout || 'horizontal'}`}
        data-layout={layout || 'horizontal'}
        role="group"
        data-group-id={groupId}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`sf-checkbox-option form-check${layout === 'horizontal' ? ' form-check-inline' : ''}`}
          >
            <input
              className="form-check-input"
              type="checkbox"
              id={`${groupId}-${index}`}
              name={groupId}
              required={required}
            />
            <label className="form-check-label" htmlFor={`${groupId}-${index}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <input type="hidden" name={groupId} required={required} />
    </div>
  );
};

export default Save;
