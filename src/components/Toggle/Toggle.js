import React from 'react';
import PropTypes from 'prop-types';

const { func, bool } = PropTypes;

const Toggle = ({
  onText, offText, onChange, disabled, checked, ...otherProps
}) => (
  <div className={`app-form-toggle ${checked ? 'app-form-toggle__on' : ''} ${disabled ? 'app-form-toggle__disabled' : ''}`}>
    <label className="app-form-toggle--trigger">
      <input
        {...otherProps}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="app-form-toggle--switch" />
    </label>
  </div>
);

export default Toggle;

Toggle.defaultProps = {
  checked: true,
  disabled: false,
};

Toggle.propTypes = {
  disabled: bool,
  onChange: func.isRequired,
  checked: bool,
};
