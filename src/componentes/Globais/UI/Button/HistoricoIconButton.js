import { IconButton } from "./IconButton";

export const HistoricoIconButton = ({
   ...props 
}) => {
  return (
    <IconButton
      icon="faHistory"
      iconProps={{
        style: { fontSize: "20px", marginRight: "0", color: "var(--color-primary)" },
      }}
      aria-label="historico"
      tooltipMessage="Histórico"
      {...props}
    />
  );
};
