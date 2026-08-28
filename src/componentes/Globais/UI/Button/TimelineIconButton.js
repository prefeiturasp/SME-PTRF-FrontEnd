import { IconButton } from "./IconButton";

export const TimelineIconButton = ({
   ...props 
}) => {
  return (
    <IconButton
      icon="faHistory"
      iconProps={{
        style: { fontSize: "20px", marginRight: "0", color: "var(--color-primary)" },
      }}
      aria-label="linha-temporal"
      tooltipMessage="Linha temporal"
      {...props}
    />
  );
};
