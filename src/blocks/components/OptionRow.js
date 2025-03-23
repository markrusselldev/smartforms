import { __ } from '@wordpress/i18n';
import { TextControl, Button } from '@wordpress/components';
import PropTypes from 'prop-types';
import './option-row.scss';

const OptionRow = ({ index, value, onChange, onRemove }) => {
  return (
    <div className="option-row">
      <TextControl
        label={`${__('Option', 'smartforms')} ${index + 1}`}
        value={value}
        onChange={onChange}
      />
      <Button
        variant="secondary"
        onClick={onRemove}
        size="small"
        title={__('Remove Option', 'smartforms')}
      >
        <span className="dashicons dashicons-trash" aria-hidden="true"></span>
      </Button>
    </div>
  );
};

OptionRow.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default OptionRow;
