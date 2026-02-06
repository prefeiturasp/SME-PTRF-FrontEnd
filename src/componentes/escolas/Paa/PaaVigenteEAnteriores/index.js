import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaginasContainer } from '../../../../paginas/PaginasContainer';
import BreadcrumbComponent from '../../../Globais/Breadcrumb';
import chevronUp from '../../../../assets/img/icone-chevron-up.svg';
import chevronDown from '../../../../assets/img/icone-chevron-down.svg';
import { ASSOCIACAO_UUID } from '../../../../services/auth.service';
import Loading from '../../../../utils/Loading';
import { usePaaVigenteEAnteriores } from './hooks/usePaaVigenteEAnteriores';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faDownload, faEye as faEyeRegular } from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd';
import { useDocumentoFinalPaa } from './hooks/useDocumentoFinalPaa';
import { TooltipWrapper } from '../../../Globais/UI/Tooltip';
import { ModalVisualizarPdf } from '../../../Globais/ModalVisualizarPdf';
import { getStatusAtaPaa, postGerarAtaPaa, getDownloadAtaPaa } from '../../../../services/escolas/Paa.service';
import { iniciarAtaPaa, obterUrlAtaPaa } from '../../../../services/escolas/AtasPaa.service';
import { toastCustom } from '../../../Globais/ToastCustom';
import { ModalConfirmaGeracaoAta } from './ModalConfirmaGeracaoAta';
import { Tooltip as ReactTooltip } from "react-tooltip";

// Constantes
const STATUS_ATA = {
  NAO_GERADO: 'NAO_GERADO',
  EM_PROCESSAMENTO: 'EM_PROCESSAMENTO',
  CONCLUIDO: 'CONCLUIDO',
};

const CORES_STATUS = {
  ERRO: '#C22D2D',
  SUCESSO: '#0F7A6C',
  PROCESSANDO: '#D06D12',
};

const INTERVALO_POLLING = 10000; // 10 segundos
const DELAY_INICIO_POLLING = 2000; // 2 segundos

export const PaaVigenteEAnteriores = () => {
  const navigate = useNavigate();
  const associacaoUuid = useMemo(() => localStorage.getItem(ASSOCIACAO_UUID), []);
  const { data, isLoading, isError } = usePaaVigenteEAnteriores(associacaoUuid);
  
  // Estados de UI
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [anterioresAberto, setAnterioresAberto] = useState({});
  
  // Estados de documentos PAA
  const {
    statusDocumento,
    statusCarregando,
    downloadEmAndamento,
    visualizacaoEmAndamento,
    carregarStatusDocumento,
    baixarDocumentoFinal,
    obterUrlDocumentoFinal,
    revogarUrlDocumento,
  } = useDocumentoFinalPaa();
  
  // Estados de modais PDF
  const [modalPdf, setModalPdf] = useState({ show: false, url: null, titulo: "" });
  const [modalPdfAta, setModalPdfAta] = useState({ show: false, url: null, titulo: "" });
  
  // Estados de ata PAA
  const [atasPaa, setAtasPaa] = useState({});
  const [statusAtasPaa, setStatusAtasPaa] = useState({});
  const [isLoadingStatusAtaPaa, setIsLoadingStatusAtaPaa] = useState({});
  const [visualizacaoAtaEmAndamento, setVisualizacaoAtaEmAndamento] = useState({});
  const [openModalConfirmarGeracaoAta, setOpenModalConfirmarGeracaoAta] = useState({});
  const timerAtaRef = useRef({});

  // Dados derivados
  const vigente = useMemo(() => data?.vigente || null, [data?.vigente]);
  const vigenteUuidOriginal = data?.vigente?.uuid;
  const anteriores = useMemo(() => data?.anteriores || [], [data?.anteriores]);
  const itemsBreadCrumb = [{ label: 'Plano Anual de Atividades', active: true }];

  // ========== Funções auxiliares ==========
  
  const formatReferencia = useCallback((referencia) => {
    if (!referencia) return '';
    return referencia.replace(/\s*a\s*/i, '/');
  }, []);

  const obterCorStatusAta = useCallback((statusGeracaoPdf) => {
    if (!statusGeracaoPdf) return CORES_STATUS.ERRO;
    if (statusGeracaoPdf === STATUS_ATA.EM_PROCESSAMENTO) return CORES_STATUS.PROCESSANDO;
    if (statusGeracaoPdf === STATUS_ATA.CONCLUIDO) return CORES_STATUS.SUCESSO;
    return CORES_STATUS.ERRO;
  }, []);

  const obterCorStatusDocumento = useCallback((status) => {
    return status === 'CONCLUIDO' ? CORES_STATUS.SUCESSO : CORES_STATUS.ERRO;
  }, []);

  // ========== Funções de navegação e UI ==========
  
  const toggleAnterior = useCallback((uuid) => {
    setAnterioresAberto((prev) => ({
      ...prev,
      [uuid]: !prev[uuid],
    }));
  }, []);

  const handleVisualizarAta = useCallback((paaUuid) => {
    if (!paaUuid) return;
    navigate(`/relatorios-paa/visualizacao-da-ata-paa/${paaUuid}`, {
      state: { origem: 'paa-vigente-e-anteriores' }
    });
  }, [navigate]);

  // ========== Funções de documento PAA ==========
  
  const handleDownloadPlano = useCallback(async (paaUuid) => {
    if (!paaUuid) return;
    await baixarDocumentoFinal(paaUuid);
  }, [baixarDocumentoFinal]);

  const handleVisualizarPlano = useCallback(async (paaItem) => {
    if (!paaItem?.uuid) return;
    const url = await obterUrlDocumentoFinal(paaItem.uuid);
    if (!url) return;
    setModalPdf({
      show: true,
      url,
      titulo: formatReferencia(paaItem?.periodo_paa_objeto?.referencia),
    });
  }, [obterUrlDocumentoFinal, formatReferencia]);

  const handleFecharModalPdf = useCallback(() => {
    if (modalPdf.url) {
      revogarUrlDocumento(modalPdf.url);
    }
    setModalPdf({ show: false, url: null, titulo: "" });
  }, [modalPdf.url, revogarUrlDocumento]);

  // ========== Funções de ata PAA ==========
  
  const obterUrlAtaPaaLocal = useCallback(async (paaUuid) => {
    if (!paaUuid || !atasPaa[paaUuid]?.uuid) return null;
    setVisualizacaoAtaEmAndamento((prev) => ({ ...prev, [paaUuid]: true }));
    try {
      const url = await obterUrlAtaPaa(atasPaa[paaUuid].uuid);
      return url;
    } catch (error) {
      console.error("Erro ao visualizar a ata PAA:", error);
      return null;
    } finally {
      setVisualizacaoAtaEmAndamento((prev) => ({ ...prev, [paaUuid]: false }));
    }
  }, [atasPaa]);

  const handleVisualizarAtaPdf = useCallback(async (paaItem) => {
    if (!paaItem?.uuid) return;
    const url = await obterUrlAtaPaaLocal(paaItem.uuid);
    if (!url) return;
    setModalPdfAta({
      show: true,
      url,
      titulo: formatReferencia(paaItem?.periodo_paa_objeto?.referencia),
    });
  }, [obterUrlAtaPaaLocal, formatReferencia]);

  const handleFecharModalPdfAta = useCallback(() => {
    if (modalPdfAta.url) {
      window.URL.revokeObjectURL(modalPdfAta.url);
    }
    setModalPdfAta({ show: false, url: null, titulo: "" });
  }, [modalPdfAta.url]);

  // ========== Funções de gerenciamento de polling ==========
  
  const pararPollingAta = useCallback((paaUuid) => {
    if (timerAtaRef.current[paaUuid]) {
      clearInterval(timerAtaRef.current[paaUuid]);
      timerAtaRef.current[paaUuid] = null;
    }
  }, []);

  const atualizarStatusAta = useCallback((paaUuid, status) => {
    setStatusAtasPaa((prev) => ({
      ...prev,
      [paaUuid]: status,
    }));
    
    // Parar polling se concluído
    if (status?.status_geracao_pdf === STATUS_ATA.CONCLUIDO) {
      pararPollingAta(paaUuid);
    }
  }, [pararPollingAta]);

  const verificarStatusAtaPaa = useCallback(async (paaUuid, ataUuid) => {
    if (!paaUuid || !ataUuid) return;
    
    setIsLoadingStatusAtaPaa((prev) => ({ ...prev, [paaUuid]: true }));
    try {
      const status = await getStatusAtaPaa(ataUuid);
      atualizarStatusAta(paaUuid, status);
    } catch (error) {
      console.error("Erro ao verificar status da ata:", error);
    } finally {
      setIsLoadingStatusAtaPaa((prev) => ({ ...prev, [paaUuid]: false }));
    }
  }, [atualizarStatusAta]);

  const iniciarPollingAta = useCallback((paaUuid, ataUuid) => {
    pararPollingAta(paaUuid);
    
    timerAtaRef.current[paaUuid] = setInterval(async () => {
      try {
        const status = await getStatusAtaPaa(ataUuid);
        atualizarStatusAta(paaUuid, status);
      } catch (error) {
        console.error("Erro ao verificar status durante polling:", error);
      }
    }, INTERVALO_POLLING);
  }, [pararPollingAta, atualizarStatusAta]);

  const iniciarMonitoramentoAta = useCallback(async (paaUuid) => {
    let ataUuid = atasPaa[paaUuid]?.uuid;
    
    // Buscar ata se não existir
    if (!ataUuid) {
      try {
        const ata = await iniciarAtaPaa(paaUuid);
        if (ata?.uuid) {
          setAtasPaa((prev) => ({ ...prev, [paaUuid]: ata }));
          ataUuid = ata.uuid;
        } else {
          console.error('[iniciarMonitoramentoAta] Ata não encontrada após buscar');
          return;
        }
      } catch (error) {
        console.error('[iniciarMonitoramentoAta] Erro ao buscar ata:', error);
        return;
      }
    }
    
    // Verificação imediata
    await verificarStatusAtaPaa(paaUuid, ataUuid);
    
    // Aguardar e verificar novamente antes de iniciar polling
    setTimeout(async () => {
      try {
        const statusAtual = await getStatusAtaPaa(ataUuid);
        atualizarStatusAta(paaUuid, statusAtual);
        
        // Iniciar polling apenas se ainda estiver em processamento
        if (statusAtual?.status_geracao_pdf === STATUS_ATA.EM_PROCESSAMENTO) {
          iniciarPollingAta(paaUuid, ataUuid);
        }
      } catch (error) {
        console.error('[iniciarMonitoramentoAta] Erro ao verificar status:', error);
      }
    }, DELAY_INICIO_POLLING);
  }, [atasPaa, verificarStatusAtaPaa, atualizarStatusAta, iniciarPollingAta]);

  // ========== Funções de validação ==========
  
  const validarGeracaoAta = useCallback((paaUuid) => {
    const ataPaa = atasPaa[paaUuid];
    const statusDoc = statusDocumento[paaUuid];
    const statusAta = statusAtasPaa[paaUuid];

    if (!ataPaa) {
      return { isValid: false, mensagem: "Ata não encontrada." };
    }

    if (!ataPaa.completa) {
      return { isValid: false, mensagem: "Todos os dados da edição da ata devem estar preenchidos." };
    }

    if (!statusDoc || statusDoc.status !== 'CONCLUIDO' || statusDoc.versao !== 'FINAL') {
      return { isValid: false, mensagem: "O documento Plano Anual deve estar gerado." };
    }

    if (statusAta?.status_geracao_pdf === STATUS_ATA.CONCLUIDO) {
      return { isValid: false, mensagem: "A ata já foi gerada anteriormente." };
    }

    return { isValid: true };
  }, [atasPaa, statusDocumento, statusAtasPaa]);

  const botaoGerarAtaDesabilitado = useCallback((paaUuid) => {
    if (!paaUuid || !atasPaa[paaUuid]?.uuid) {
      return true;
    }
    
    const statusAta = statusAtasPaa[paaUuid];
    const statusGeracao = statusAta?.status_geracao_pdf;
    
    if (statusGeracao === STATUS_ATA.EM_PROCESSAMENTO || statusGeracao === STATUS_ATA.CONCLUIDO) {
      return true;
    }
    
    return !validarGeracaoAta(paaUuid).isValid;
  }, [atasPaa, statusAtasPaa, validarGeracaoAta]);

  const getMensagemTooltipGerarAta = useCallback((paaUuid) => {
    return botaoGerarAtaDesabilitado(paaUuid) 
      ? "Quando todos os dados estiverem preenchidos, a opção fica habilitada."
      : "";
  }, [botaoGerarAtaDesabilitado]);

  // ========== Funções de ações da ata ==========
  
  const handleGerarAta = useCallback((paaUuid) => {
    if (!paaUuid || !atasPaa[paaUuid]?.uuid) {
      toastCustom.ToastCustomError("Erro!", "PAA ou Ata não identificados.");
      return;
    }

    const validacoes = validarGeracaoAta(paaUuid);
    if (!validacoes.isValid) {
      toastCustom.ToastCustomError("Validação", validacoes.mensagem);
      return;
    }

    setOpenModalConfirmarGeracaoAta((prev) => ({
      ...prev,
      [paaUuid]: true,
    }));
  }, [atasPaa, validarGeracaoAta]);

  const handleConfirmarGeracaoAta = useCallback(async (paaUuid) => {
    setOpenModalConfirmarGeracaoAta((prev) => ({
      ...prev,
      [paaUuid]: false,
    }));

    if (!paaUuid) {
      toastCustom.ToastCustomError("Erro!", "PAA vigente não identificado.");
      return;
    }

    try {
      await postGerarAtaPaa(paaUuid, { confirmar: 1 });
      toastCustom.ToastCustomSuccess("Sucesso!", "Geração da ata iniciada. Aguarde o processamento.");
      iniciarMonitoramentoAta(paaUuid);
    } catch (error) {
      const mensagem = error?.response?.data?.mensagem || "Erro ao iniciar geração da ata.";
      toastCustom.ToastCustomError("Erro!", mensagem);
    }
  }, [iniciarMonitoramentoAta]);

  const handleDownloadAta = useCallback(async (paaUuid) => {
    if (!atasPaa[paaUuid]?.uuid) {
      toastCustom.ToastCustomError("Erro!", "Ata não identificada para download.");
      return;
    }

    try {
      await getDownloadAtaPaa(atasPaa[paaUuid].uuid);
    } catch (error) {
      toastCustom.ToastCustomError("Erro!", "Erro ao efetuar o download da ata!");
      console.error("Erro ao efetuar o download da ata", error);
    }
  }, [atasPaa]);

  // ========== useEffects ==========
  
  // Inicializar estado de abertura dos anteriores
  useEffect(() => {
    if (!anteriores.length) return;
    setAnterioresAberto((prev) => {
      const nextState = { ...prev };
      anteriores.forEach((anterior) => {
        if (nextState[anterior.uuid] === undefined) {
          nextState[anterior.uuid] = false;
        }
      });
      return nextState;
    });
  }, [anteriores]);

  // Carregar status dos documentos PAA
  useEffect(() => {
    if (vigenteUuidOriginal) {
      carregarStatusDocumento(vigenteUuidOriginal);
    }
    anteriores?.forEach((paaAnterior) => {
      if (paaAnterior?.uuid) {
        carregarStatusDocumento(paaAnterior.uuid);
      }
    });
  }, [vigenteUuidOriginal, anteriores, carregarStatusDocumento]);

  // Limpar URLs dos modais ao desmontar
  useEffect(() => {
    return () => {
      if (modalPdf.url) {
        revogarUrlDocumento(modalPdf.url);
      }
      if (modalPdfAta.url) {
        window.URL.revokeObjectURL(modalPdfAta.url);
      }
    };
  }, [modalPdf.url, modalPdfAta.url, revogarUrlDocumento]);

  // Buscar e inicializar atas PAA
  useEffect(() => {
    const buscarAtas = async () => {
      const uuidsParaBuscar = [];
      if (vigenteUuidOriginal) uuidsParaBuscar.push(vigenteUuidOriginal);
      anteriores?.forEach((paa) => {
        if (paa?.uuid) uuidsParaBuscar.push(paa.uuid);
      });

      for (const uuid of uuidsParaBuscar) {
        try {
          const ata = await iniciarAtaPaa(uuid);
          if (ata?.uuid) {
            setAtasPaa((prev) => ({ ...prev, [uuid]: ata }));
            verificarStatusAtaPaa(uuid, ata.uuid);
          }
        } catch (error) {
          console.error(`Erro ao buscar ata para PAA ${uuid}:`, error);
        }
      }
    };

    if (vigenteUuidOriginal || anteriores?.length > 0) {
      buscarAtas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigenteUuidOriginal, anteriores]);

  // Gerenciar polling automático para atas em processamento
  useEffect(() => {
    Object.keys(statusAtasPaa).forEach((paaUuid) => {
      const statusAta = statusAtasPaa[paaUuid];
      const ataUuid = atasPaa[paaUuid]?.uuid;
      const jaTemPolling = !!timerAtaRef.current[paaUuid];
      const estaEmProcessamento = statusAta?.status_geracao_pdf === STATUS_ATA.EM_PROCESSAMENTO;
      
      if (estaEmProcessamento && ataUuid && !jaTemPolling) {
        iniciarPollingAta(paaUuid, ataUuid);
      } else if (!estaEmProcessamento && jaTemPolling) {
        pararPollingAta(paaUuid);
      }
    });
  }, [statusAtasPaa, atasPaa, iniciarPollingAta, pararPollingAta]);

  // Limpar todos os timers ao desmontar
  useEffect(() => {
    return () => {
      Object.values(timerAtaRef.current).forEach((timer) => {
        if (timer) clearInterval(timer);
      });
    };
  }, []);


  // ========== Funções de renderização ==========
  
  const renderStatusDocumentoPlano = useCallback((paaItem) => {
    const statusInfo = statusDocumento[paaItem?.uuid];
    const carregando = statusCarregando[paaItem?.uuid];
    const documentoConcluido = statusInfo?.status === 'CONCLUIDO';
    const corStatus = obterCorStatusDocumento(statusInfo?.status);
    const desabilitado = !paaItem?.uuid || carregando || !documentoConcluido;

    if (carregando) {
      return (
        <div className="d-flex align-items-center mb-1">
          <Spin size="small" />
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center">
        <span style={{ color: corStatus, fontWeight: 700, fontSize: '14px' }}>
          {statusInfo?.mensagem || 'Documento final ainda não gerado'}
        </span>
        <button
          type="button"
          className="ml-3 p-0 btn btn-link d-flex align-items-center"
          onClick={() => handleVisualizarPlano(paaItem)}
          disabled={desabilitado}
          style={{ color: '#0F7A6C' }}
        >
          <TooltipWrapper
            id={`tooltip-visualizar-plano-${paaItem?.uuid || 'sem-uuid'}`}
            content="Visualizar Plano Anual"
          >
            <FontAwesomeIcon
              style={{ fontSize: '16px' }}
              icon={visualizacaoEmAndamento === paaItem?.uuid ? faCircleNotch : faEyeRegular}
              spin={visualizacaoEmAndamento === paaItem?.uuid}
            />
          </TooltipWrapper>
        </button>
        <button
          type="button"
          className="ml-1 p-0 btn btn-link d-flex align-items-center"
          onClick={() => handleDownloadPlano(paaItem?.uuid)}
          disabled={desabilitado}
          style={{ color: '#0F7A6C' }}
        >
          <FontAwesomeIcon
            style={{ fontSize: '16px' }}
            icon={downloadEmAndamento === paaItem?.uuid ? faCircleNotch : faDownload}
            spin={downloadEmAndamento === paaItem?.uuid}
          />
        </button>
      </div>
    );
  }, [statusDocumento, statusCarregando, visualizacaoEmAndamento, downloadEmAndamento, obterCorStatusDocumento, handleVisualizarPlano, handleDownloadPlano]);

  const renderStatusAta = useCallback((paaItem) => {
    const statusAta = statusAtasPaa[paaItem?.uuid];
    const carregando = isLoadingStatusAtaPaa[paaItem?.uuid];
    const statusGeracao = statusAta?.status_geracao_pdf;
    const corStatus = obterCorStatusAta(statusGeracao);

    if (carregando) {
      return (
        <div className="d-flex align-items-center mb-1">
          <Spin size="small" />
        </div>
      );
    }

    if (statusGeracao === STATUS_ATA.CONCLUIDO) {
      const dataGeracao = statusAta?.alterado_em 
        ? (() => {
            const date = new Date(statusAta.alterado_em);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            const hora = String(date.getHours()).padStart(2, '0');
            const minuto = String(date.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
          })()
        : '';
      
      return (
        <div className="d-flex align-items-center">
          <span style={{ color: corStatus, fontWeight: 700, fontSize: '14px' }}>
            Documento final gerado em {dataGeracao}
          </span>
          <button
            type="button"
            className="ml-3 p-0 btn btn-link d-flex align-items-center"
            onClick={() => handleVisualizarAtaPdf(paaItem)}
            disabled={visualizacaoAtaEmAndamento[paaItem?.uuid]}
            style={{ color: '#0F7A6C' }}
          >
            <TooltipWrapper
              id={`tooltip-visualizar-ata-${paaItem?.uuid || 'sem-uuid'}`}
              content="Visualizar Ata de Apresentação"
            >
              <FontAwesomeIcon
                style={{ fontSize: '16px' }}
                icon={visualizacaoAtaEmAndamento[paaItem?.uuid] ? faCircleNotch : faEyeRegular}
                spin={visualizacaoAtaEmAndamento[paaItem?.uuid]}
              />
            </TooltipWrapper>
          </button>
          <button
            type="button"
            className="ml-1 p-0 btn btn-link d-flex align-items-center"
            onClick={() => handleDownloadAta(paaItem?.uuid)}
            style={{ color: '#0F7A6C' }}
          >
            <FontAwesomeIcon style={{ fontSize: '16px' }} icon={faDownload} />
          </button>
        </div>
      );
    }

    if (statusGeracao === STATUS_ATA.EM_PROCESSAMENTO) {
      return (
        <div className="d-flex align-items-center">
          <span style={{ color: corStatus, fontWeight: 700, fontSize: '14px' }}>
            Documento sendo gerado. Aguarde...
          </span>
          <Spin size="small" className="ml-2" />
        </div>
      );
    }

    return (
      <span style={{ color: corStatus, fontWeight: 700, fontSize: '14px' }}>
        Documento pendente de geração
      </span>
    );
  }, [statusAtasPaa, isLoadingStatusAtaPaa, visualizacaoAtaEmAndamento, obterCorStatusAta, handleVisualizarAtaPdf, handleDownloadAta]);

  const renderBotoesAta = useCallback((paaItem) => {
    const statusGeracao = statusAtasPaa[paaItem?.uuid]?.status_geracao_pdf;
    const ataConcluida = statusGeracao === STATUS_ATA.CONCLUIDO;
    
    if (ataConcluida) {
      return null;
    }

    const isDisabled = botaoGerarAtaDesabilitado(paaItem?.uuid);
    const tooltipId = `tooltip-gerar-ata-${paaItem?.uuid || 'sem-uuid'}`;
    const temAta = !!atasPaa[paaItem?.uuid]?.uuid;

    return (
      <div className="d-flex mt-3 mt-md-0">
        <button 
          type="button" 
          className="btn btn-success mr-3" 
          onClick={() => handleGerarAta(paaItem?.uuid)}
          disabled={isDisabled}
          {...(isDisabled && {
            'data-tooltip-content': getMensagemTooltipGerarAta(paaItem?.uuid),
            'data-tooltip-id': tooltipId
          })}
          style={{ fontWeight: 600 }}
        >
          Gerar ata
        </button>
        {isDisabled && <ReactTooltip id={tooltipId} />}
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => handleVisualizarAta(paaItem?.uuid)}
          disabled={!paaItem?.uuid || !temAta}
          style={{ fontWeight: 600 }}
        >
          Visualizar ata
        </button>
      </div>
    );
  }, [statusAtasPaa, atasPaa, botaoGerarAtaDesabilitado, getMensagemTooltipGerarAta, handleGerarAta, handleVisualizarAta]);

  const renderPaaConteudo = useCallback((paaItem) => (
    <div className="border border-top-0 p-3">
      <div>
        <h4 className="mb-2" style={{ fontSize: '14px', fontWeight: 700, color: '#3C4043' }}>
          Plano anual
        </h4>
        {renderStatusDocumentoPlano(paaItem)}
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap mt-4">
        <div>
          <h4 className="mb-2" style={{ fontSize: '14px', fontWeight: 700, color: '#3C4043' }}>
            Ata de apresentação do PAA
          </h4>
          {renderStatusAta(paaItem)}
        </div>
        {renderBotoesAta(paaItem)}
      </div>

      {(() => {
        const statusAta = statusAtasPaa[paaItem?.uuid];
        const statusGeracao = statusAta?.status_geracao_pdf;
        
        if (statusGeracao === STATUS_ATA.CONCLUIDO && statusAta?.parecer_conselho && statusAta?.data_reuniao) {
          const [anoR, mesR, diaR] = statusAta.data_reuniao.split('-');
          const dataFormatada = `${diaR}/${mesR}/${anoR}`;
          const horaFormatada = statusAta.hora_reuniao || '00:00';
          const horaFormatadaComH = horaFormatada.replace(':', 'h');
          const parecer = statusAta.parecer_conselho === 'APROVADA' ? 'aprovado' : 'rejeitado';
          
          return (
            <p className="mt-4 mb-0" style={{ color: '#60686A', fontSize: '14px' }}>
              Plano Anual de Atividades {parecer} em Assembleia Geral em {dataFormatada} às {horaFormatadaComH}.
            </p>
          );
        }
        return null;
      })()}
    </div>
  ), [renderStatusDocumentoPlano, renderStatusAta, renderBotoesAta, statusAtasPaa]);

  return (
    <>
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb} />
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      {(isLoading || isError) && (
        <div className="mt-4">
          {isLoading && <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />}
          {isError && <div style={{ color: '#C22D2D' }}>Não foi possível carregar os dados do PAA.</div>}
        </div>
      )}

      <div className="page-content-inner rounded">
        <div className="d-flex justify-content-between align-items-center pt-2">
          <h2
            className="mb-0"
            style={{ fontSize: '20px', fontWeight: 700, color: '#42474A' }}
          >
            Plano Vigente
          </h2>
        </div>

        <div className="mt-4">
          <div
            className="d-flex justify-content-between align-items-center w-100"
            style={{
              backgroundColor: '#F3F3F3',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #DADADA',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#42474A' }}>
              {vigente ? `PAA ${formatReferencia(vigente?.periodo_paa_objeto?.referencia)}` : 'PAA vigente'}
            </span>
            <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => navigate(-1)}
              style={{
                fontWeight: 600,
                marginRight: '10px',
              }}
              disabled
            >
              Retificar o PAA
            </button>
              <button
                type="button"
                className="d-flex align-items-center justify-content-center"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                style={{
                  backgroundColor: '#DADADA',
                  border: '1px solid #DADADA',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  padding: 0,
                }}
              >
                <img
                  src={isDropdownOpen ? chevronUp : chevronDown}
                  alt={isDropdownOpen ? 'Fechar' : 'Abrir'}
                  style={{ width: '12px', height: '8px' }}
                />
              </button>
            </div>
          </div>
          {isDropdownOpen && renderPaaConteudo(vigente)}
        </div>

        <div className="mt-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#3C4043' }}>Planos anteriores</h3>

          {anteriores.length === 0 && !isLoading && (
            <p className="mt-3 mb-0" style={{ fontSize: '14px', color: '#60686A' }}>
              Não há PAAs anteriores registrados para esta unidade educacional.
            </p>
          )}

          {anteriores.map((paaAnterior) => {
            const isOpen = anterioresAberto[paaAnterior.uuid];
            const titulo = formatReferencia(paaAnterior?.periodo_paa_objeto?.referencia);
            return (
              <div className="mt-3" key={paaAnterior.uuid}>
                <div
                  className="d-flex justify-content-between align-items-center w-100"
                  style={{
                    backgroundColor: '#F3F3F3',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #DADADA',
                  }}
                >
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#42474A' }}>
                    {titulo ? `PAA ${titulo}` : 'PAA anterior'}
                  </span>
                  <button
                    type="button"
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => toggleAnterior(paaAnterior.uuid)}
                    style={{
                      backgroundColor: '#DADADA',
                      border: '1px solid #DADADA',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      padding: 0,
                    }}
                  >
                    <img
                      src={isOpen ? chevronUp : chevronDown}
                      alt={isOpen ? 'Fechar' : 'Abrir'}
                      style={{ width: '12px', height: '8px' }}
                    />
                  </button>
                </div>
                {isOpen && renderPaaConteudo(paaAnterior)}
              </div>
            );
          })}
        </div>
      </div>
    </PaginasContainer>
    <ModalVisualizarPdf
      show={modalPdf.show}
      onHide={handleFecharModalPdf}
      url={modalPdf.url}
      titulo={`Documento final ${modalPdf.titulo ? `- ${modalPdf.titulo}` : ''}`}
      iframeTitle="Documento Final PAA"
    />
    <ModalVisualizarPdf
      show={modalPdfAta.show}
      onHide={handleFecharModalPdfAta}
      url={modalPdfAta.url}
      titulo={`Ata de Apresentação do PAA ${modalPdfAta.titulo ? `- ${modalPdfAta.titulo}` : ''}`}
      iframeTitle="Ata de Apresentação do PAA"
    />
    {/* Modais de confirmação de geração de ata */}
    {vigenteUuidOriginal && (
      <ModalConfirmaGeracaoAta
        open={openModalConfirmarGeracaoAta[vigenteUuidOriginal] || false}
        onClose={() => setOpenModalConfirmarGeracaoAta((prev) => ({ ...prev, [vigenteUuidOriginal]: false }))}
        onConfirm={() => handleConfirmarGeracaoAta(vigenteUuidOriginal)}
      />
    )}
    {anteriores?.map((paaAnterior) => (
      paaAnterior?.uuid && (
        <ModalConfirmaGeracaoAta
          key={`modal-ata-${paaAnterior.uuid}`}
          open={openModalConfirmarGeracaoAta[paaAnterior.uuid] || false}
          onClose={() => setOpenModalConfirmarGeracaoAta((prev) => ({ ...prev, [paaAnterior.uuid]: false }))}
          onConfirm={() => handleConfirmarGeracaoAta(paaAnterior.uuid)}
        />
      )
    ))}
    </>
  );
};
