import React from "react";
import { Tooltip } from "antd";
import icones from "./icones";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from "@fortawesome/free-solid-svg-icons";

export const Icon = ({ icon, tooltipMessage = "", iconProps = {} }) => {
  const isFontAwesome = faIcons[icon] !== undefined;

  const IconImg = () => {
    return <img src={icones[icon]} alt={icon} {...iconProps}></img>;
  };

  const renderIcon = () => {
    if (isFontAwesome) {
      return <FontAwesomeIcon icon={faIcons[icon]} {...iconProps} />;
    }
    return <IconImg />;
  };

  return tooltipMessage ? (
    <Tooltip title={tooltipMessage}>
      <span style={{ color: "var(--color-primary)" }}>{renderIcon()}</span>
    </Tooltip>
  ) : (
    renderIcon()
  );
};
