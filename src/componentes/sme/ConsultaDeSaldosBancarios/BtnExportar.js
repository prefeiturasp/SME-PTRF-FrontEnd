import React from "react";
import { Icon } from "../../Globais/UI/Icon";

export const BtnExportar = ({ handleOnClickExportar }) => {
  return (
    <div style={{ display: "flex", paddingRight: 15 }}>
      <button
        onClick={handleOnClickExportar}
        type="button"
        className="btn btn btn-outline-success float-right"
        style={{ marginTop: "1.9em" }}
      >
        <Icon icon="faDownload" iconProps={{ style: { marginRight: 3 } }} />
        Exportar planilha
      </button>
    </div>
  );
};
