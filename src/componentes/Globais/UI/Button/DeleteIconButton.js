import { IconButton } from "./IconButton";

export const DeleteIconButton = ({
   ...props 
}) => {
  return (
    <IconButton
      icon="faTrash"
      iconProps={{
        style: { fontSize: "18px", marginRight: "0", color: "#B40C02" },
      }}
      aria-label="Excluir"
      tooltipMessage="Excluir"
      {...props}
    />
  );
};
