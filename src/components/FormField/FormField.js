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
  options,
  step,
}) => (
  <div className={`app-form-group ${className}`}>
    {label && (
      <label className="app-form-label" htmlFor={name}>
        {label}
      </label>
    )}
    {type === "select" ? (
      <select
        name={name}
        id={name}
        className={`app-form-control ${fieldClassName}`}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled selected>
            {placeholder}
          </option>
        )}
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    ) : (
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
        step={step}
      />
    )}
  </div>
);

export default FormField;
