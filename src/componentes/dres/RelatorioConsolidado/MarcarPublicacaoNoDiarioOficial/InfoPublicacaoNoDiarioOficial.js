import React, { memo } from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import { useNavigate } from "react-router-dom";
import IconeMarcarPublicacaoNoDiarioOficial from "./IconeMarcarPublicacaoNoDiarioOficial";
import { visoesService } from "../../../../services/visoes.service";
import { EditIconButton } from "../../../Globais/UI/Button";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";

const InfoPublicacaoNoDiarioOficial = ({ consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao }) => {
  const dataTemplate = useDataTemplate();
  const navigate = useNavigate();
  const { recursoSelecionado } = useRecursoSelecionadoContext();

  const texto_documento_consolidado_pc = new TextoDocumentoConsolidadoPC(recursoSelecionado?.habilita_exibicao_lauda)

  const text_possessive = texto_documento_consolidado_pc.texto_acao_objeto();

  return (
    <>
      {consolidadoDre?.data_publicacao && (
        <div className="mb-0 fonte-12 fonte-normal">
          <strong>Data {text_possessive}:</strong> {dataTemplate(null, null, consolidadoDre.data_publicacao)}
          <IconeMarcarPublicacaoNoDiarioOficial
            consolidadoDre={consolidadoDre}
            carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
          />
        </div>
      )}
      
      {consolidadoDre?.eh_retificacao && !consolidadoDre.ja_publicado && (
        <EditIconButton
          tooltipMessage="Editar Retificação"
          disabled={!visoesService.getPermissoes(["change_relatorio_consolidado_dre"])}
          onClick={() =>
            navigate(`/dre-relatorio-consolidado-retificacao/${consolidadoDre.uuid}`, {
              state: {
                referencia_publicacao: consolidadoDre.titulo_relatorio,
                eh_edicao_retificacao: true,
              },
            })
          }
        />
      )}
    </>
  );
};

export default memo(InfoPublicacaoNoDiarioOficial);
