import React, { memo } from "react";
import moment from "moment";
import { visoesService } from "../../../../services/visoes.service";
import { EditIconButton } from "../../../Globais/UI/Button";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";

const IconeEditarRetificacao = ({ consolidadoDre }) => {
  const { textDocumentConsolidadoPC, recursoSelecionado } = useRecursoSelecionadoContext();

  const retornaMsgToolTip = () => {
    let data_de_publicacao = moment(consolidadoDre.data_publicacao).format("DD/MM/YYYY");

    const textPage = recursoSelecionado?.habilita_exibicao_de_lauda
      ? `<p class='mb-1'>Página publicação: ${consolidadoDre.pagina_publicacao}</p>`
      : "";

    return `
            <div>
                <p class='mb-1'>Data ${textDocumentConsolidadoPC.texto_acao_simples()}: ${data_de_publicacao}</p>
                ${textPage}
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
