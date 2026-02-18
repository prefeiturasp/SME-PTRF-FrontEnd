import React, { memo } from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import { useNavigate } from "react-router-dom";
import IconeMarcarPublicacaoNoDiarioOficial from "./IconeMarcarPublicacaoNoDiarioOficial";
import { visoesService } from "../../../../services/visoes.service";
import { EditIconButton } from "../../../Globais/UI/Button";

const InfoPublicacaoNoDiarioOficial = ({ consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao }) => {
  const dataTemplate = useDataTemplate();
  const navigate = useNavigate();

  return (
    <>
      {consolidadoDre && consolidadoDre.data_publicacao && (
        <div className="mb-0 fonte-12 fonte-normal">
          <strong>Data da publicação:</strong> {dataTemplate(null, null, consolidadoDre.data_publicacao)}
          <IconeMarcarPublicacaoNoDiarioOficial
            consolidadoDre={consolidadoDre}
            carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
          />
        </div>
      )}
      {consolidadoDre && consolidadoDre?.eh_retificacao && !consolidadoDre.ja_publicado && (
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
