import React, { useState } from "react";

const FormField = ({
  name, label, type, isAutoFocus, fieldClassName,
  placeholder, onChange, className, fieldProps, disabled, value,
}) => (
  <div className={`app-form-group ${className}`}>
    {label && (
    <label className="app-form-label" htmlFor={name}>{label}</label>
    )}
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      id={name}
      fieldProps={fieldProps}
      className={`app-form-control ${fieldClassName}`}
      onChange={onChange}
      value={value}
      disabled={disabled}
      isAutoFocus={isAutoFocus}
    />
  </div>
);

export default FormField;