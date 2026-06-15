import React, { useEffect, useMemo, useState } from "react";
import { Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useGetStatusGeracaoDocumentoPaa } from "./hooks/useGetStatusGeracaoDocumentoPaa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import chevronUp from "../../../../../../assets/img/icone-chevron-up.svg";
import chevronDown from "../../../../../../assets/img/icone-chevron-down.svg";
import { useGetTextosPaa } from "./hooks/useGetTextosPaa";
import { useGetPaaVigente } from "./hooks/useGetPaaVigente";
import { useGetAtaPaaVigente } from "./hooks/useGetAtaPaaVigente";
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";
import { RenderSecao } from "./RenderSecao";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import Loading from "../../../../../../utils/Loading";
import { TagRetificacao } from "../../../componentes/TagRetificacao";
import {
  getDownloadArquivoPrevia,
  getDownloadArquivoPreviaRetificacao,
  getDownloadArquivoFinal,
} from "../../../../../../services/escolas/Paa.service";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { usePaaContext } from "../../../componentes/PaaContext";
import { visoesService } from "../../../../../../services/visoes.service";
import { BtnGerarFinalOriginal } from "./components/BotoesGeracao/BtnGerarFinalOriginal";
import { BtnGerarPreviaOriginal } from "./components/BotoesGeracao/BtnGerarPreviaOriginal";
import { BtnGerarFinalRetificacao } from "./components/BotoesGeracao/BtnGerarFinalRetificacao";
import { BtnGerarPreviaRetificacao } from "./components/BotoesGeracao/BtnGerarPreviaRetificacao";

const Relatorios = ({ initialExpandedSections }) => {
  const { paa, refetch } = usePaaContext();
  const { alteracoes: historicoAlteracoes } = paa;
  const podeEditar = useMemo(() => visoesService.getPermissoes(["custom_change_paa"]), []);
  const navigate = useNavigate();
  const defaultExpandedState = {
    planoAnual: false,
    introducao: false,
    objetivos: false,
    componentes: false,
    conclusao: false,
  };

  const [expandedSections, setExpandedSections] = useState(() => ({
    ...defaultExpandedState,
    ...(initialExpandedSections || {}),
  }));

  const associacaoUuid = useMemo(() => localStorage.getItem(ASSOCIACAO_UUID), []);
  const { textosPaa, isLoading, isError } = useGetTextosPaa();
  const { paaVigente, isLoading: isLoadingPaa } =
    useGetPaaVigente(associacaoUuid);
  const { ataPaa, isLoading: isLoadingAtaPaa } = useGetAtaPaaVigente(
    paaVigente?.uuid,
  );

  useEffect(() => {
    if (!paaVigente?.uuid) return;
    refetch();
  }, [paaVigente, refetch]);

  const {
    data: statusDocumento,
    isFetching: isLoadingStatusDocumento,
  } = useGetStatusGeracaoDocumentoPaa(paaVigente?.uuid);

  const downloadVersaoPrevia = async () => {
    try {
      await getDownloadArquivoPrevia(paaVigente?.uuid);
    } catch (e) {
      toastCustom.ToastCustomError(
        "Erro!",
        "Erro ao efetuar o download Prévia!",
      );
      console.error("Erro ao efetuar o download de versão Prévia", e);
    }
  };

  const downloadVersaoFinal = async () => {
    try {
      await getDownloadArquivoFinal(paaVigente?.uuid);
    } catch (e) {
      toastCustom.ToastCustomError(
        "Erro!",
        "Erro ao efetuar o download da versão final!",
      );
      console.error("Erro ao efetuar o download de versão Final", e);
    }
  };

  const downloadVersaoPreviaRetificacao = async () => {
    try {
      await getDownloadArquivoPreviaRetificacao(paaVigente?.uuid);
    } catch (e) {
      toastCustom.ToastCustomError(
        "Erro!",
        "Erro ao efetuar o download da Prévia de Retificação!",
      );
      console.error("Erro ao efetuar o download de prévia de retificação", e);
    }
  };

  const handleDownloadArquivo = () => {
    if (statusDocumento?.versao === "FINAL") {
      downloadVersaoFinal();
    } else if (statusDocumento?.versao === "PREVIA") {
      if (statusDocumento?.retificacao) {
        downloadVersaoPreviaRetificacao();
      } else {
        downloadVersaoPrevia();
      }
    } else {
      toastCustom.ToastCustomError(
        "Erro!",
        "Versão de arquivo não identificada.",
      );
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleVisualizarAta = () => {
    if (paaVigente?.uuid && ataPaa?.uuid) {
      navigate(`/relatorios-paa/visualizacao-da-ata-paa/${paaVigente.uuid}`);
    } else {
      toastCustom.ToastCustomError("Erro!", "Ata do PAA não encontrada.");
    }
  };

  const secoesConfig = useMemo(() => ({
    introducao: {
      titulo: (
        <>
          <span className="mr-2">I. Introdução</span>
          {!!historicoAlteracoes?.texto_introducao && <TagRetificacao />}
        </>
      ),
      chave: "introducao",
      campoPaa: "texto_introducao",
      textosPaa: ["introducao_do_paa_ue_1", "introducao_do_paa_ue_2"],
      temEditor: true,
    },
    objetivos: {
      titulo: (
        <>
          <span className="mr-2">II. Objetivos</span>
          {(!!historicoAlteracoes?.objetivos_paa || !!historicoAlteracoes?.objetivos_globais) && <TagRetificacao />}
        </>
      ),
      chave: "objetivos",
    },
    componentes: {
      titulo: "III. Componentes",
      chave: "componentes",
    },
    conclusao: {
      titulo: (
        <>
          <span className="mr-2">IV. Conclusão</span>
          {!!historicoAlteracoes?.texto_conclusao && <TagRetificacao />}
        </>
      ),
      chave: "conclusao",
      campoPaa: "texto_conclusao",
      textosPaa: ["conclusao_do_paa_ue_1", "conclusao_do_paa_ue_2"],
      temEditor: true,
    },
  }), [
    historicoAlteracoes?.texto_introducao,
    historicoAlteracoes?.objetivos_paa,
    historicoAlteracoes?.objetivos_globais,
    historicoAlteracoes?.texto_conclusao,
  ]);

  const renderSecao = (secaoKey, config) => {
    const isExpanded = expandedSections[secaoKey];

    return (
      <div key={secaoKey} className={`render-secao-${secaoKey}`}>
        <RenderSecao
          secaoKey={secaoKey}
          config={config}
          isExpanded={isExpanded}
          toggleSection={toggleSection}
          textosPaa={textosPaa}
          isLoading={isLoading}
          isError={isError}
          isLoadingPaa={isLoadingPaa}
          paaVigente={paaVigente}
          podeEditar={podeEditar}
        />
      </div>
    );
  };

  return (
    <div className="relatorios-container">
      <div className="documentos-card">
        {/* Header */}
        <div className="documentos-header">
          <h3 className="documentos-title">Documentos</h3>
        </div>

        {/* Documentos List */}
        <div className="documentos-list">
          {/* Plano anual */}
          <div className="documento-item">
            <div className="documento-info">
              <div className="documento-nome">Plano Anual</div>
              <div
                className="documento-status"
                style={{
                  color:
                    statusDocumento?.status === "CONCLUIDO"
                      ? "#297805"
                      : "#dc3545",
                }}
              >
                <Spin size="small" spinning={isLoadingStatusDocumento}>
                  {/* Mensagem de status da geração */}
                  {statusDocumento?.mensagem}

                  {/* Loading de geração */}
                  {statusDocumento?.status === "EM_PROCESSAMENTO" && (
                    <span className="mx-2">
                      <Spin
                        size="small"
                        spinning={
                          statusDocumento?.status === "EM_PROCESSAMENTO"
                        }
                      />
                    </span>
                  )}

                  {/* Botão de download */}
                  {statusDocumento?.status === "CONCLUIDO" && (
                    <button
                      onClick={handleDownloadArquivo}
                      type="button"
                      title="Download"
                      className="btn-editar-membro"
                    >
                      <FontAwesomeIcon
                        style={{
                          fontSize: "15px",
                          marginRight: "0",
                        }}
                        icon={faDownload}
                      />
                    </button>
                  )}
                </Spin>
              </div>
            </div>
            
            <div className="documento-actions">
              <Space>
                {paaVigente?.uuid && (
                  paaVigente.status === "EM_RETIFICACAO" ? (
                      <>
                        <BtnGerarPreviaRetificacao paa={paaVigente} />

                        <BtnGerarFinalRetificacao paa={paaVigente} />

                      </>
                    ) : (
                      <>
                        <BtnGerarPreviaOriginal paa={paaVigente} />

                        <BtnGerarFinalOriginal paa={paaVigente} />

                      </>
                    )
                )}

                <button
                  className="btn-dropdown"
                  onClick={() => toggleSection("planoAnual")}
                >
                  <img
                    src={expandedSections.planoAnual ? chevronUp : chevronDown}
                    alt={expandedSections.planoAnual ? "Fechar" : "Abrir"}
                    className="chevron-icon"
                  />
                </button>
              </Space>
            </div>
          </div>

          {/* Subseções do Plano anual */}
          {expandedSections.planoAnual && (
            <div className="plano-anual-subsecoes">
              {(isLoadingPaa || isLoadingAtaPaa) && (
                <Loading
                  corGrafico="black"
                  corFonte="dark"
                  marginTop="0"
                  marginBottom="0"
                />
              )}

              {!isLoadingPaa && !paaVigente?.uuid && (
                <div className="texto-error">PAA vigente não encontrado.</div>
              )}

              {!isLoadingPaa &&
                paaVigente?.uuid &&
                Object.entries(secoesConfig).map(([secaoKey, config]) =>
                  renderSecao(secaoKey, config),
                )}
            </div>
          )}

          {/* Ata */}
          <div className="documento-item">
            <div className="documento-info">
              <div className="documento-nome">
                {paaVigente?.status === "EM_RETIFICACAO" ? "Ata de Retificação do PAA" : "Ata de Apresentação do PAA"}
              </div>
            </div>
            <div className="documento-actions">
              <Space>
                <button
                  className="btn btn-outline-success"
                  onClick={handleVisualizarAta}
                  disabled={!ataPaa?.uuid}
                >
                  Visualizar prévia da ata
                </button>

                {/* Apenas botão informativo */}
                <button
                  className="btn btn-success"
                  type="button"
                  disabled={true}
                  {...{
                    "data-tooltip-content": "Gere o Plano anual antes de gerar a Ata",
                    "data-tooltip-id": "tooltip-gerar-ata",
                  }}
                >
                  Gerar ata
                </button>
              </Space>
            </div>
            <ReactTooltip id="tooltip-gerar-ata" place="top" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
