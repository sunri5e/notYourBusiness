// Ayasdi Inc. Copyright 2017 - all rights reserved.

import React from 'react';
import {
  string, bool, shape, oneOf,
} from 'prop-types';

const Icon = ({
  icon, className, custom, size, style, fontType,
}) => (
  custom ? (
    <svg className={`app-icon fa fa-${icon} ${className} ${size ? `app-icon__size-${size}` : ''}`} style={style}>
      <use xlinkHref={`#fa-${icon}`} />
    </svg>
  ) : (
    <span className={`app-icon ${className} ${size ? `app-icon__size-${size}` : ''}`} style={style}>
      <i className={`${fontType || 'fa'} fa-${icon}`} />
    </span>
  )
);

Icon.propTypes = {
  icon: string.isRequired,
  /**
   * Type of Font Awesome.
   */
  fontType: oneOf(['', 'far']),
  className: string,
  /**
   * Icon size. Empty mean default/medium.
   */
  size: oneOf(['', 'xxl', 'xl', 'l', 's', 'xs']),
  custom: bool,
  style: shape(),
};
Icon.defaultProps = {
  fontType: '',
  className: '',
  size: '',
  custom: false,
  style: {},
};

export default Icon;
