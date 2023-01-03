import React from 'react';
import {
  bool, func, oneOfType, string,
} from 'prop-types';

const RadioInput = ({
  noEvent, disabled, value, onChange, label, name, notShow,
}) => {
  const noEventClass = noEvent ? 'app-h-no-event' : '';
  const notShowClass = notShow ? 'app-h-not-show' : '';
  const disabledClass = disabled ? 'app-form-radio__disabled' : '';
  const checkedClass = value ? 'app-form-radio__checked' : '';
  return (
    <label className={`app-form-radio ${noEventClass} ${disabledClass} ${checkedClass} ${notShowClass}`}>
      <input
        onChange={onChange}
        name={name}
        value={value}
        type="radio"
        disabled={disabled}
      />
      <span className="app-form-radio--icon" />
      {label && (
        <span className="app-form-radio--label">{label}</span>
      )}
    </label>
  );
};

RadioInput.propTypes = {
  name: string.isRequired,
  onChange: func,
  value: oneOfType([bool, string]),
  label: string.isRequired,
  disabled: bool,
  noEvent: bool,
  notShow: bool,
};
RadioInput.defaultProps = {
  disabled: false,
  noEvent: false,
  notShow: false,
  onChange: () => {},
  value: '',
};

export default RadioInput;
