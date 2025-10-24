import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

export const TooltipWrapper = ({ id, content, children }) => {
  return (
    <span data-tooltip-id={id} data-tooltip-html={content}>
      {children}
      <ReactTooltip id={id} />
    </span>
  );
};
