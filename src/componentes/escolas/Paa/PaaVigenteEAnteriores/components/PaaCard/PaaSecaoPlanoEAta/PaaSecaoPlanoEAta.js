import React from 'react';
import { PaaLinhaDocumento } from '../../PaaLinhaDocumento/PaaLinhaDocumento';
import { PaaAtaAcoes } from '../../PaaAtaAcoes/PaaAtaAcoes';

export const PaaSecaoPlanoEAta = ({
  tituloSecao,
  documento,
  ata,
  tituloAta,
  paaUuid,
  chaveVisualizacaoDocumento,
  visualizacaoEmAndamento,
  onVisualizarDocumento,
  onDownloadDocumento,
  onVisualizarAta,
  onDownloadAta,
  onDepoisDeGerarAta,
  resumoAssembleia,
}) => {
  const chaveDoc = chaveVisualizacaoDocumento(paaUuid, documento.status.retificacao);
  const chaveAta = ata?.uuid ? `ata:${ata.uuid}` : null;

  return (
    <div>
      {tituloSecao ? (
        <h3 className="mb-4 paa-card__titulo-versao">
          {tituloSecao}
        </h3>
      ) : null}
      <PaaLinhaDocumento
        titulo="Plano anual"
        bloco={documento}
        testIdPrefix="plano"
        onVisualizar={() => onVisualizarDocumento(documento)}
        onDownload={() => onDownloadDocumento(documento)}
        carregandoVisualizar={visualizacaoEmAndamento === chaveDoc}
      />
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div className="flex-grow-1 paa-card__col-ata">
            <PaaLinhaDocumento
              titulo={tituloAta}
              bloco={ata}
              testIdPrefix="ata"
              onVisualizar={() => onVisualizarAta(ata, tituloAta)}
              onDownload={() => onDownloadAta(ata)}
              carregandoVisualizar={Boolean(chaveAta && visualizacaoEmAndamento === chaveAta)}
            />
          </div>
          {ata?.apresenta_botoes_acao ? (
            <PaaAtaAcoes
              paaUuid={paaUuid}
              ata={ata}
              documentoPlano={documento}
              onDepoisDeGerar={onDepoisDeGerarAta}
            />
          ) : null}
        </div>
      </div>
      {resumoAssembleia ? (
        <p className="mt-4 mb-0 paa-card__resumo-assembleia">
          {resumoAssembleia}
        </p>
      ) : null}
    </div>
  );
};
