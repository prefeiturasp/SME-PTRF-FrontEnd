import React from "react";
import { Icon } from "../../../../componentes/Globais/UI/Icon";

function useConferidoTemplate() {
  function retornaConferidoTemplate(rowData = null, column = null) {
    if (
      rowData[column.field] &&
      rowData[column.field]["resultado"] &&
      rowData[column.field]["resultado"] === "CORRETO"
    ) {
      return (
        <div className="p-2">
          <Icon
            icon="faCheckCircle"
            iconProps={{
              style: {
                fontSize: "16px",
                color: "#297805",
                marginRight: "3px",
              },
            }}
          />
          {rowData[column.field][
            "houve_considerados_corretos_automaticamente"
          ] === true && (
            <Icon
              icon="icon-conferido-automaticamente"
              iconProps={{
                "aria-label": "Conferido automaticamente",
                style: {
                  fontSize: "16px",
                  color: "#297805",
                },
              }}
            />
          )}
        </div>
      );
    } else if (
      rowData[column.field] &&
      rowData[column.field]["resultado"] &&
      rowData[column.field]["resultado"] === "AJUSTE"
    ) {
      return (
        <div className="p-2">
          <Icon
            icon="faCheckCircle"
            iconProps={{
              style: {
                fontSize: "16px",
                color: "#B40C02",
                marginRight: "3px",
              },
            }}
          />
          {rowData[column.field][
            "houve_considerados_corretos_automaticamente"
          ] === true && (
            <Icon
              icon="icon-conferido-automaticamente"
              iconProps={{
                "aria-label": "Conferido automaticamente",
                style: {
                  fontSize: "16px",
                  color: "#297805",
                },
              }}
            />
          )}
        </div>
      );
    } else {
      return <div className="p-2">-</div>;
    }
  }

  return retornaConferidoTemplate;
}
export default useConferidoTemplate;
