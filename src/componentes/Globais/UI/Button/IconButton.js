import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon";
import "./style.css";

export const IconButton = ({
  icon = "",
  iconProps = {},
  iconPosition = "left",
  label = "",
  onClick,
  disabled = false,
  className = "",
  buttonStyle = {},
  variant = "primary",
  tooltipMessage = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${
        label !== "" ? "" : "btn-custom-iconbutton"
      } d-flex align-items-center ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ padding: "8px 12px", gap: "5px", ...buttonStyle }}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <Icon
          icon={icon}
          iconProps={iconProps}
          tooltipMessage={tooltipMessage}
        />
      )}
      {label}
      {icon && iconPosition === "right" && (
        <Icon
          icon={icon}
          iconProps={iconProps}
          tooltipMessage={tooltipMessage}
        />
      )}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string,
  iconProps: PropTypes.object,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  buttonStyle: PropTypes.object,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
  ]),
};
