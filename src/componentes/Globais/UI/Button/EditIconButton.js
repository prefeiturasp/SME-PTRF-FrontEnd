import { IconButton } from "./IconButton";

export const EditIconButton = ({
   ...props 
}) => {
  return (
    <IconButton
      icon="faEdit"
      iconProps={{
        style: { fontSize: "20px", marginRight: "0", color: "var(--color-primary)" },
      }}
      aria-label="Editar"
      tooltipMessage="Editar"
      {...props}
    />
  );
};
