import React from "react";

const FormField = ({
  name,
  label,
  type,
  fieldClassName,
  onBlur,
  placeholder,
  onChange,
  className,
  disabled,
  value,
}) => (
  <div className={`app-form-group ${className}`}>
    {label && (
      <label className="app-form-label" htmlFor={name}>
        {label}
      </label>
    )}
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      id={name}
      className={`app-form-control ${fieldClassName}`}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      disabled={disabled}
    />
  </div>
);

export default FormField;
