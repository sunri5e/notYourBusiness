// Ayasdi Inc. Copyright 2017 - all rights reserved.

import React, { Component } from "react";
import { string, bool, func, node, arrayOf } from "prop-types";
import IconButton from "../IconButton/IconButton";
import Icon from "../Icon/Icon";

class Modal extends Component {
  componentDidMount() {
    window.addEventListener("keypress", this.keyPressSubmit);
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.keyPressSubmit);
  }

  keyPressSubmit = (e) => {
    const { isVisible, onSubmit } = this.props;
    if (isVisible && e && e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    }
  };

  render() {
    const {
      title,
      children,
      isVisible,
      className,
      onClose,
      footerButtons,
      icon,
      iconColor,
      dataTestId,
    } = this.props;

    return (
      <div
        className={`app-modal ${isVisible ? "app-modal__is-open" : ""} ${className}`}
        data-test-id={dataTestId}
      >
        <div className="app-modal--overlay" onClick={onClose} />
        <div className="app-modal--dialog" onClick={onClose}>
          <div className="app-modal--body" onClick={(e) => e.stopPropagation()}>
            {icon && (
              <div className={`app-modal--pic ${iconColor}`}>
                <Icon icon={icon} size="xxl" />
              </div>
            )}
            <div className="app-modal--header">
              {title && <h5 className="app-modal--title">{title}</h5>}
              <IconButton
                iconName="times"
                className="app-modal--close"
                tooltipProps={{ text: "Close", placement: "bottom" }}
                onClick={onClose}
                size="m"
              />
            </div>
            <div className="app-modal--content">{children}</div>
            {footerButtons.length > 0 && (
              <div className="app-modal--footer">
                {footerButtons.map((a, i) => {
                  const key = i;
                  return <span key={key}>{a}</span>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  /**
   * Modal name shown in header.
   */
  title: string,
  /**
   * Any text or markup.
   */
  children: node,
  /**
   * Condition to show/hide modal.
   */
  isVisible: bool,
  /**
   * Class will be added for modal wrapper `.app-modal`.
   */
  className: string,
  onClose: func.isRequired,
  onSubmit: func,
  /**
   * Not required. Designed to show additional controls in modals.
   */
  footerButtons: arrayOf(node),
  /** Font Awesome icon name. If empty content take full modal width. */
  icon: string,
  /** `.app-modal--pic__success`, `.app-modal--pic__warning`, `.app-modal--pic__danger` or any other color helpers. */
  iconColor: string,
  /**
   * 'create_project_modal', 'edit_project_modal'
   */
  dataTestId: string,
};

Modal.defaultProps = {
  title: "",
  children: null,
  isVisible: false,
  className: "",
  footerButtons: [],
  onSubmit: () => {},
  icon: "",
  iconColor: "",
  dataTestId: "dataTestId",
};

export default Modal;
