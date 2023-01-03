import React from "react";
import { string, func, bool, oneOfType } from "prop-types";
import Icon from "../Icon/Icon";

const getSVG = (value) =>
  value ? <Icon icon="check-square" size="l" /> : <Icon fontType="far" icon="square" size="l" />;

const Checkbox = ({
  value,
  disabled,
  label,
  name,
  onChange,
  theme,
  noEvent,
  required,
  index,
  color,
  className,
}) => {
  const noEventClass = noEvent ? "app-h-no-event" : "";
  const disabledClass = disabled ? "app-form-checkbox__disabled" : "";
  const checkedClass = value ? "app-form-checkbox__checked" : "";
  const additionalClass = className ? className : "";
  return (
    <label
      htmlFor={`${name}${index}`}
      className={`app-form-checkbox ${theme} ${noEventClass} ${disabledClass} ${checkedClass} ${additionalClass}`}
    >
      <input
        onChange={onChange}
        name={name}
        value={value}
        type="checkbox"
        disabled={disabled}
        required={required}
        id={`${name}${index}`}
      />
      <span style={{ color: color }} className="app-form-checkbox--icon">
        {getSVG(value)}
      </span>
      {label && <span className="app-form-checkbox--label">{label}</span>}
    </label>
  );
};

Checkbox.propTypes = {
  name: string.isRequired,
  onChange: func,
  value: oneOfType([bool, string]),
  label: string.isRequired,
  disabled: bool,
  theme: string,
  noEvent: bool,
  required: bool,
  index: string,
  color: string,
};
Checkbox.defaultProps = {
  disabled: false,
  theme: "light",
  noEvent: false,
  required: false,
  onChange: () => {},
  value: "",
  index: "",
  color: "",
};
export default Checkbox;
