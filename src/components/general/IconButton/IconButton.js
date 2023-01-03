/* eslint-disable complexity */
// Ayasdi Inc. Copyright 2017 - all rights reserved.

import React, { Component } from "react";
import { string } from "prop-types";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

class IconButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
  }

  render() {
    const { iconName, className, size, ...props } = this.props;

    let iconSize = "l";

    if (size === "m") {
      iconSize = "";
    } else if (size === "s") {
      iconSize = "s";
    }

    return (
      <Button className={`app-button__icon-button ${className || ""}`} size={size} {...props}>
        <Icon icon={iconName} icon_position="left" size={iconSize} />
      </Button>
    );
  }
}

IconButton.propTypes = {
  iconName: string.isRequired,
  className: string,
};

IconButton.defaultProps = {
  className: "",
};

export default IconButton;
