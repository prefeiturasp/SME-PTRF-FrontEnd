import React, { useEffect, useRef, useState } from "react";
import { Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useGetStatusGeracaoDocumentoPaa } from "./hooks/useGetStatusGeracaoDocumentoPaa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import chevronUp from "../../../../../../assets/img/icone-chevron-up.svg";
import chevronDown from "../../../../../../assets/img/icone-chevron-down.svg";
import { useGetTextosPaa } from "./hooks/useGetTextosPaa";
import { useGetPaaVigente } from "./hooks/useGetPaaVigente";
import { useGetAtaPaaVigente } from "./hooks/useGetAtaPaaVigente";
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";
import { RenderSecao } from "./RenderSecao";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import Loading from "../../../../../../utils/Loading";
import { getDownloadArquivoPrevia, getDownloadArquivoFinal } from "../../../../../../services/escolas/Paa.service";

import {
  usePostPaaGeracaoDocumentoPrevia,
  usePostPaaGeracaoDocumentoFinal } from "./hooks/usePostPaaGeracaoDocumento";

import {
  ModalInfoGeracaoDocumentoPrevia,
  ModalInfoGeracaoDocumentoFinal,
  ModalConfirmaGeracaoFinal,
  ModalInfoPendenciasGeracaoFinal,
} from "./ModalInfoGeracaoDocumento";


const Relatorios = ({ initialExpandedSections }) => {
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

  const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID);
  const { textosPaa, isLoading, isError } = useGetTextosPaa();
  const { paaVigente, isLoading: isLoadingPaa } = useGetPaaVigente(associacaoUuid);
  const { ataPaa, isLoading: isLoadingAtaPaa } = useGetAtaPaaVigente(paaVigente?.uuid);
  const apresentouToastErroPaaNaoEncontrado = useRef(false);
  const apresentouToastErroAtaNaoEncontrada = useRef(false);

  const timerRef = useRef(null);

  const [
    openModalInfoGeracaoDocumentoPrevia,
    setOpenModalInfoGeracaoDocumentoPrevia] = useState(false);

  const [
    pendenciasGeracaoFinal,
    setPendenciasGeracaoFinal] = useState('');

  const [
    openModalInfoGeracaoDocumentoFinal,
    setOpenModalInfoGeracaoDocumentoFinal] = useState(false);

  const [
    openModalConfirmarGeracaoFinal,
    setOpenModalConfirmarGeracaoFinal] = useState(false);

  const [
    openModalValidacoesGeracaoFinal,
    setOpenModalValidacoesGeracaoFinal] = useState(false);

  const {
    data: statusDocumento,
    isFetching: isLoadingStatusDocumento,
    refetch: refetchStatusDoc,
  } = useGetStatusGeracaoDocumentoPaa(paaVigente?.uuid);

  const verificaStatusAteConcluirGeracao = async () => {
    await refetchStatusDoc()

    setTimeout( () => {
      timerRef.current = setInterval(() => {
        refetchStatusDoc();
      }, 5000);
    }, 2000)
  }

  useEffect(() => {
    if (statusDocumento?.status !== "EM_PROCESSAMENTO") {
      clearInterval(timerRef.current);
    }
    if (statusDocumento?.status === "CONCLUIDO" &&
      statusDocumento?.versao === "FINAL") {
      navigate("/paa-vigente-e-anteriores");
    }
  }, [statusDocumento]);

  const checkStatusGeracaoDocumentoPrevia = async () => {
    setOpenModalInfoGeracaoDocumentoPrevia(true);
    verificaStatusAteConcluirGeracao();
  }

  const checkStatusGeracaoDocumentoFinal = async () => {
    // Habilitar se necessário a Modal de informação (semelhante à Geração de Prévia)
    // setOpenModalInfoGeracaoDocumentoFinal(true);
    verificaStatusAteConcluirGeracao();
  }

  const onErrorValidacoesPendentesDocumentoFinal = (data) => {
    if (data?.confirmar) {
      setOpenModalConfirmarGeracaoFinal(true);
    }else{
      setOpenModalValidacoesGeracaoFinal(true);
      setPendenciasGeracaoFinal(data?.mensagem);
    }
  }

  const downloadVersaoPrevia = async () => {
    try {
      await getDownloadArquivoPrevia(paaVigente?.uuid);
    } catch (e) {
      toastCustom.ToastCustomError("Erro!", "Erro ao efetuar o download Prévia!");
      console.error("Erro ao efetuar o download de versão Prévia", e);
    }
  }

  const downloadVersaoFinal = async () => {
    try {
      await getDownloadArquivoFinal(paaVigente?.uuid);
    } catch (e) {
      toastCustom.ToastCustomError("Erro!", "Erro ao efetuar o download Prévia!");
      console.error("Erro ao efetuar o download de versão Final", e);
    }
  }

  const handleDownloadArquivo = () => {
    if(statusDocumento?.versao === 'FINAL') {
      downloadVersaoFinal();
    } else if(statusDocumento?.versao === 'PREVIA') {
      downloadVersaoPrevia();
    } else {
      toastCustom.ToastCustomError("Erro!", "Versão de arquivo não identificada.");
    }
  }

  const mutationGerarDocumentoPrevia = usePostPaaGeracaoDocumentoPrevia(
    {
      onSuccessGerarDocumento: checkStatusGeracaoDocumentoPrevia
    });

  const mutationGerarDocumentoFinal = usePostPaaGeracaoDocumentoFinal(
    {
      onSuccessGerarDocumento: checkStatusGeracaoDocumentoFinal,
      onErrorGerarDocumento: onErrorValidacoesPendentesDocumentoFinal
    });

  const handleGerarDocumentoPrevia = () => {
    if (paaVigente?.uuid) {
      mutationGerarDocumentoPrevia.mutate(paaVigente.uuid);
    } else {
      toastCustom.ToastCustomError("Erro!", "PAA vigente não identificado para geração de prévia.");
    }
  };

  const handleGerarDocumentoFinal = async (confirmar=0) => {
    setOpenModalConfirmarGeracaoFinal(false);
    if (paaVigente?.uuid) {
      mutationGerarDocumentoFinal.mutate({
        uuid: paaVigente.uuid,
        payload: { confirmar }
      });
    } else {
      toastCustom.ToastCustomError("Erro!", "PAA vigente não identificado para geração final.");
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

  const secoesConfig = {
    introducao: {
      titulo: "I. Introdução",
      chave: "introducao",
      campoPaa: "texto_introducao",
      textosPaa: ["introducao_do_paa_ue_1", "introducao_do_paa_ue_2"],
      temEditor: true,
    },
    objetivos: {
      titulo: "II. Objetivos",
      chave: "objetivos",
    },
    componentes: {
      titulo: "III. Componentes",
      chave: "componentes",
    },
    conclusao: {
      titulo: "IV. Conclusão",
      chave: "conclusao",
      campoPaa: "texto_conclusao",
      textosPaa: ["conclusao_do_paa_ue_1", "conclusao_do_paa_ue_2"],
      temEditor: true,
    },
  };

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
        />
      </div>
    );
  };

  const botaoGeracaoPreviaDesabilitado = () => {
    const validacoes =[
      statusDocumento?.status === 'EM_PROCESSAMENTO',
      statusDocumento?.status === 'CONCLUIDO' && statusDocumento?.versao === 'FINAL'
    ]
    return validacoes.includes(true)
  }

  const botaoGeracaoFinalDesabilitado = () => {
    const validacoes =[
      statusDocumento?.status === 'EM_PROCESSAMENTO',
      statusDocumento?.status === 'CONCLUIDO' && statusDocumento?.versao === 'FINAL'
    ]
    return validacoes.includes(true)
  }

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
              <div className="documento-status"
                style={{color: statusDocumento?.status === 'CONCLUIDO' ? '#297805' : '#dc3545'}}>

                <Spin size="small" spinning={isLoadingStatusDocumento}>

                  {/* Mensagem de status da geração */}
                  {statusDocumento?.mensagem}

                  {/* Loading de geração */}
                  {statusDocumento?.status === 'EM_PROCESSAMENTO' &&
                    <span className="mx-2">
                      <Spin size="small" spinning={statusDocumento?.status === 'EM_PROCESSAMENTO'}/>
                    </span>
                  }

                  {/* Botão de download */}
                  {statusDocumento?.status === 'CONCLUIDO' &&
                    <button
                      onClick={handleDownloadArquivo}
                      type="button"
                      title="Download"
                      className="btn-editar-membro">
                      <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "0", color: "#00585E"}}
                        icon={faDownload}
                      />
                    </button>
                  }
                </Spin>
              </div>
            </div>
            <div className="documento-actions">
              <Space>
                  <button
                    className="btn btn-outline-success"
                    disabled={botaoGeracaoPreviaDesabilitado()}
                    onClick={handleGerarDocumentoPrevia}>
                    Prévia
                  </button>

                  <button
                    className="btn btn-success"
                    disabled={botaoGeracaoFinalDesabilitado()}
                    onClick={() => handleGerarDocumentoFinal(0)}>
                    Gerar
                  </button>

                  <button className="btn-dropdown" onClick={() => toggleSection("planoAnual")}>
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
                <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
              )}

              {!isLoadingPaa && !paaVigente?.uuid && (
                <div className="texto-error">PAA vigente não encontrado.</div>
              )}

              {!isLoadingPaa && paaVigente?.uuid && Object.entries(secoesConfig).map(([secaoKey, config]) => renderSecao(secaoKey, config))}
            </div>
          )}

          {/* Ata */}
          <div className="documento-item">
            <div className="documento-info">
              <div className="documento-nome">Ata de Apresentação do PAA</div>
              <div className="documento-status">Documento pendente de geração</div>
            </div>
            <div className="documento-actions">
              <button className="btn btn-outline-success" onClick={handleVisualizarAta} disabled={!ataPaa?.uuid}>
                Visualizar prévia da ata
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalInfoGeracaoDocumentoPrevia
        open={openModalInfoGeracaoDocumentoPrevia}
        onClose={() => setOpenModalInfoGeracaoDocumentoPrevia(false)}
      />

      <ModalInfoGeracaoDocumentoFinal
        open={openModalInfoGeracaoDocumentoFinal}
        onClose={() => setOpenModalInfoGeracaoDocumentoFinal(false)}
      />

      <ModalConfirmaGeracaoFinal
        open={openModalConfirmarGeracaoFinal}
        onClose={() => setOpenModalConfirmarGeracaoFinal(false)}
        onConfirm={() => handleGerarDocumentoFinal(1)}
      />

      <ModalInfoPendenciasGeracaoFinal
        open={openModalValidacoesGeracaoFinal}
        onClose={() => setOpenModalValidacoesGeracaoFinal(false)}
        pendencias={pendenciasGeracaoFinal}
      />
    </div>
  );
};

export default Relatorios;
