import { IconButton } from "./IconButton";

export const VisualizarIconButton = ({
   ...props 
}) => {
  return (
    <IconButton
      icon="faEye"
      iconProps={{
        style: { fontSize: "20px", marginRight: "0", color: "var(--color-primary)" },
      }}
      aria-label="Visualizar"
      tooltipMessage="Visualizar"
      {...props}
    />
  );
};
