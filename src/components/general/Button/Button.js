// Ayasdi Inc. Copyright 2017 - all rights reserved.

import React from 'react';
import {
  number, string, node, bool, func, oneOfType, oneOf,
} from 'prop-types';

const Button = ({
  className, children, disabled, onClick, size, width, ...buttonProps
}) => (
  <button
    type="button"
    className={`app-button ${className} ${size ? `app-button__size-${size}` : ''} ${width ? 'app-button__block' : ''}`}
    onClick={onClick}
    disabled={disabled}
    {...buttonProps}
  >
    <span className="app-button--text">
      {children}
    </span>
  </button>
);


Button.propTypes = {
  /**
   * For change view you can use buttons classes: `app-button__link` and `app-button__ghost`.
   * Or any other to defining eg. alignment.
   */
  className: string,
  /**
   * Button size. Empty mean default/large. Don't work with `app-button__link`.
   */
  size: oneOf(['', 'm', 's']),
  /**
   * Any value. This will trigger button 'block' mode.
   */
  width: oneOfType([number, string]),
  /**
   * Text or some simple markup
   */
  children: node,
  onClick: func,
  disabled: bool,
};

Button.defaultProps = {
  className: '',
  size: '',
  width: '',
  children: undefined,
  onClick: () => {},
  disabled: false,
};

export default Button;
