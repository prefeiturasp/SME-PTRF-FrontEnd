import React, { useState, useCallback } from 'react';
import { PaginasContainer } from '../../../../paginas/PaginasContainer';
import BreadcrumbComponent from '../../../Globais/Breadcrumb';
import { ASSOCIACAO_UUID } from '../../../../services/auth.service';
import { visoesService } from '../../../../services/visoes.service';
import Loading from '../../../../utils/Loading';
import { usePaaVigenteEAnteriores } from './hooks/usePaaVigenteEAnteriores';
import { PaaCardBarraTitulo } from './components/PaaCardBarraTitulo/PaaCardBarraTitulo';
import { PaaCard } from './components/PaaCard/PaaCard';
import { PaaListaVazia } from './components/PaaListaVazia/PaaListaVazia';
import { BotaoRetificarPaa } from './components/BotaoRetificarPaa/BotaoRetificarPaa';
import { tituloCardPaa } from './utils/formatReferenciaPaaTitulo';
import { podeExibirBotaoRetificar } from './utils/exibirBotaoRetificarPaa';
import './PaaVigenteEAnteriores.scss';

const BREADCRUMB_PAA = [{ label: 'Plano Anual de Atividades', active: true }];
const ANTERIORES_VAZIOS = [];

export const PaaVigenteEAnteriores = () => {
  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = usePaaVigenteEAnteriores(associacaoUuid);

  const [planoVigenteExpandido, setPlanoVigenteExpandido] = useState(true);
  const [anterioresAberto, setAnterioresAberto] = useState({});

  const vigente = data?.vigente ?? null;
  const anteriores = data?.anteriores ?? ANTERIORES_VAZIOS;
  const temAssociacao = Boolean(associacaoUuid);
  const exibirConteudoPrincipal = temAssociacao && !isLoading && !isError;

  const toggleAnterior = useCallback((uuid) => {
    setAnterioresAberto((prev) => ({
      ...prev,
      [uuid]: !prev[uuid],
    }));
  }, []);

  const statusDocumentoParaModal = vigente?.original?.documento?.status
    ? { mensagem: vigente.original.documento.status.mensagem }
    : undefined;

  const PaaRetificacaoFeatureFlag = visoesService.featureFlagAtiva('paa-retificacao');

  const exibirBotaoRetificar =
    Boolean(vigente)
    && PaaRetificacaoFeatureFlag
    && (podeExibirBotaoRetificar(vigente) || vigente.esta_em_retificacao);

  return (
    <PaginasContainer>
      <BreadcrumbComponent items={BREADCRUMB_PAA} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>

      {!temAssociacao && (
        <div className="mt-4 paa-vigente-e-anteriores__alerta">
          Associação não identificada. Selecione uma unidade para carregar o Plano Anual de Atividades.
        </div>
      )}

      {temAssociacao && (isLoading || isError) && (
        <div className="mt-4">
          {isLoading && <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />}
          {isError && (
            <div className="d-flex flex-column align-items-start gap-2">
              <div className="paa-vigente-e-anteriores__alerta">
                Não foi possível carregar os dados do PAA.
                {error?.message ? ` (${error.message})` : ''}
              </div>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => refetch()}>
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      )}

      {exibirConteudoPrincipal && (
        <div className="page-content-inner rounded">
          <div className="d-flex justify-content-between align-items-center pt-2">
            <h2 className="mb-0 paa-vigente-e-anteriores__titulo-secao">
              Plano Vigente
            </h2>
          </div>

          {!vigente && (
            <PaaListaVazia>
              <>
                A sua unidade ainda não possui Plano Vigente. <br /> Clique no menu &quot;Elaboração&quot; para iniciar o
                Plano Anual Vigente
              </>
            </PaaListaVazia>
          )}

          {vigente && (
            <div className="mt-4">
              <PaaCardBarraTitulo
                titulo={tituloCardPaa(vigente?.referencia)}
                isAberto={planoVigenteExpandido}
                onToggle={() => setPlanoVigenteExpandido((aberto) => !aberto)}
                acoesExtras={
                  exibirBotaoRetificar ? (
                    <BotaoRetificarPaa
                      paa={{
                        uuid: vigente.uuid,
                        status: vigente.esta_em_retificacao ? 'EM_RETIFICACAO' : 'GERADO',
                      }}
                      statusDocumento={statusDocumentoParaModal}
                    />
                  ) : null
                }
              />
              {planoVigenteExpandido && (
                <PaaCard dados={vigente} onDadosAtualizados={refetch} />
              )}
            </div>
          )}

          <div className="mt-5">
            <h3 className="paa-vigente-e-anteriores__titulo-secao">Planos anteriores</h3>

            {anteriores.length === 0 && (
              <PaaListaVazia>A sua unidade ainda não possui Planos anteriores.</PaaListaVazia>
            )}

            {anteriores.map((paaAnterior) => {
              const isOpen = anterioresAberto[paaAnterior.uuid];
              return (
                <div className="mt-3" key={paaAnterior.uuid}>
                  <PaaCardBarraTitulo
                    titulo={tituloCardPaa(paaAnterior?.referencia)}
                    isAberto={!!isOpen}
                    onToggle={() => toggleAnterior(paaAnterior.uuid)}
                  />
                  {isOpen && (
                    <PaaCard dados={paaAnterior} onDadosAtualizados={refetch} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PaginasContainer>
  );
};
