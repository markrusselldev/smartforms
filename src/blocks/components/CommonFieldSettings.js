import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import PropTypes from 'prop-types';

const CommonFieldSettings = ({
  required,
  alignment,
  onChangeRequired,
  onChangeAlignment,
}) => (
  <PanelBody title={__('Input Settings', 'smartforms')} initialOpen={true}>
    <ToggleControl
      label={__('Required', 'smartforms')}
      checked={required}
      onChange={onChangeRequired}
    />
    <SelectControl
      label={__('Alignment', 'smartforms')}
      value={alignment}
      options={[
        { label: __('Left', 'smartforms'), value: 'left' },
        { label: __('Center', 'smartforms'), value: 'center' },
        { label: __('Right', 'smartforms'), value: 'right' },
      ]}
      onChange={onChangeAlignment}
    />
  </PanelBody>
);

CommonFieldSettings.propTypes = {
  required: PropTypes.bool,
  alignment: PropTypes.string,
  onChangeRequired: PropTypes.func.isRequired,
  onChangeAlignment: PropTypes.func.isRequired,
};

export default CommonFieldSettings;
