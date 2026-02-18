import React, { memo } from "react";
import moment from "moment";
import { visoesService } from "../../../../services/visoes.service";
import { EditIconButton } from "../../../Globais/UI/Button";

const IconeEditarRetificacao = ({ consolidadoDre }) => {
  const retornaMsgToolTip = () => {
    let data_de_publicacao = moment(consolidadoDre.data_publicacao).format("DD/MM/YYYY");
    return `
            <div>
                <p class='mb-1'>Data publicação: ${data_de_publicacao}</p>
                <p class='mb-1'>Página publicação: ${consolidadoDre.pagina_publicacao}</p>
            </div>
            `;
  };

  return (
    <>
      {consolidadoDre &&
        consolidadoDre?.ja_publicado &&
        consolidadoDre?.data_publicacao &&
        consolidadoDre?.eh_retificacao && (
          <EditIconButton
            tooltipMessage={retornaMsgToolTip()}
            onClick={(e) => console.log(e)}
            disabled={!visoesService.getPermissoes(["change_relatorio_consolidado_dre"])}
          />
        )}
    </>
  );
};

export default memo(IconeEditarRetificacao);
