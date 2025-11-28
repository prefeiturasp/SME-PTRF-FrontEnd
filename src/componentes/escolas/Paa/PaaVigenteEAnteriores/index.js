import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaginasContainer } from '../../../../paginas/PaginasContainer';
import BreadcrumbComponent from '../../../Globais/Breadcrumb';
import chevronUp from '../../../../assets/img/icone-chevron-up.svg';
import chevronDown from '../../../../assets/img/icone-chevron-down.svg';
import { ASSOCIACAO_UUID } from '../../../../services/auth.service';
import Loading from '../../../../utils/Loading';
import { usePaaVigenteEAnteriores } from './hooks/usePaaVigenteEAnteriores';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import { ModalFormBodyTextCloseButtonCabecalho } from '../../../Globais/ModalBootstrap';
import { Spin } from 'antd';
import { useDocumentoFinalPaa } from './hooks/useDocumentoFinalPaa';

export const PaaVigenteEAnteriores = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [anterioresAberto, setAnterioresAberto] = useState({});
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
  const [modalPdf, setModalPdf] = useState({ show: false, url: null, titulo: "" });
  const associacaoUuid = useMemo(() => localStorage.getItem(ASSOCIACAO_UUID), []);
  const { data, isLoading, isError } = usePaaVigenteEAnteriores(associacaoUuid);
  const itemsBreadCrumb = [{ label: 'Plano Anual de Atividades', active: true }];

  const vigente = useMemo(() => data?.vigente || null, [data?.vigente]);
  const vigenteUuidOriginal = data?.vigente?.uuid;

  const anteriores = useMemo(() => data?.anteriores || [], [data?.anteriores]);

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

  const formatReferencia = (referencia) => {
    if (!referencia) return '';
    return referencia.replace(/\s*a\s*/i, '/');
  };

  const toggleAnterior = (uuid) => {
    setAnterioresAberto((prev) => ({
      ...prev,
      [uuid]: !prev[uuid],
    }));
  };

  const handleVisualizarAta = (paaUuid) => {
    if (!paaUuid) return;
    navigate(`/relatorios-paa/visualizacao-da-ata-paa/${paaUuid}`);
  };

  const handleDownloadPlano = async (paaUuid) => {
    if (!paaUuid) return;
    await baixarDocumentoFinal(paaUuid);
  };

  const handleVisualizarPlano = async (paaItem) => {
    if (!paaItem?.uuid) return;
    const url = await obterUrlDocumentoFinal(paaItem.uuid);
    if (!url) return;
    setModalPdf({
      show: true,
      url,
      titulo: formatReferencia(paaItem?.periodo_paa_objeto?.referencia),
    });
  };

  const handleFecharModalPdf = () => {
    if (modalPdf.url) {
      revogarUrlDocumento(modalPdf.url);
    }
    setModalPdf({ show: false, url: null, titulo: "" });
  };

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

  useEffect(() => {
    return () => {
      if (modalPdf.url) {
        revogarUrlDocumento(modalPdf.url);
      }
    };
  }, [modalPdf.url, revogarUrlDocumento]);

  const renderPaaConteudo = (paaItem) => (
    <div className="border border-top-0 p-3">
      <div>
        <h4 className="mb-2" style={{ fontSize: '14px', fontWeight: 700, color: '#3C4043' }}>
          Plano anual
        </h4>
        {statusCarregando[paaItem?.uuid] && (
          <div className="d-flex align-items-center mb-1" style={{ columnGap: '8px' }}>
            <Spin size="small" />
          </div>
        )}
        <div className="d-flex align-items-center">
          {(() => {
            const statusInfo = statusDocumento[paaItem?.uuid];
            const carregando = statusCarregando[paaItem?.uuid];
            const corStatus = statusInfo?.status ? (statusInfo.status !== "CONCLUIDO" ? '#C22D2D' : '#0F7A6C') : '#C22D2D';
            return carregando ? (
              <span style={{ color: '#0F7A6C', fontSize: '14px' }}>...</span>
            ) : (
              <span style={{ color: corStatus, fontWeight: 700, fontSize: '14px' }}>
                {statusInfo?.mensagem || 'Documento final ainda não gerado'}
              </span>
            );
          })()}
          <button
            type="button"
            className="ml-3 p-0 btn btn-link d-flex align-items-center"
            onClick={() => handleDownloadPlano(paaItem?.uuid)}
            disabled={
              !paaItem?.uuid ||
              statusCarregando[paaItem?.uuid] ||
              (statusDocumento[paaItem?.uuid]?.status !== "CONCLUIDO")
            }
            style={{ color: '#0F7A6C' }}
          >
            <FontAwesomeIcon
              style={{ fontSize: '16px' }}
              icon={downloadEmAndamento === paaItem?.uuid ? faCircleNotch : faDownload}
              spin={downloadEmAndamento === paaItem?.uuid}
            />
          </button>
          <button
            type="button"
            className="ml-3 p-0 btn btn-link d-flex align-items-center"
            onClick={() => handleVisualizarPlano(paaItem)}
            disabled={
              !paaItem?.uuid ||
              statusCarregando[paaItem?.uuid] ||
              (statusDocumento[paaItem?.uuid]?.status !== "CONCLUIDO")
            }
            style={{ color: '#0F7A6C' }}
          >
            <FontAwesomeIcon
              style={{ fontSize: '16px' }}
              icon={visualizacaoEmAndamento === paaItem?.uuid ? faCircleNotch : faEye}
              spin={visualizacaoEmAndamento === paaItem?.uuid}
            />
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap mt-4">
        <div>
          <h4 className="mb-2" style={{ fontSize: '14px', fontWeight: 700, color: '#3C4043' }}>
            Ata de apresentação do PAA
          </h4>
          <div style={{ color: '#C22D2D', fontWeight: 700, fontSize: '14px' }}>Documento pendente de geração</div>
        </div>
        <div className="d-flex mt-3 mt-md-0">
          <button
            type="button"
            className="btn btn-outline-success mr-3"
            onClick={() => handleVisualizarAta(paaItem?.uuid)}
            disabled={!paaItem?.uuid}
            style={{
              fontWeight: 600,
            }}
          >
            Visualizar ata
          </button>
          <button type="button" className="btn btn-success" style={{
            fontWeight: 600,
          }}>Gerar ata</button>
        </div>
      </div>

      <p className="mt-4 mb-0" style={{ color: '#60686A', fontSize: '14px' }}>
        Plano Anual de Atividades aprovado em Assembleia Geral em 28/10/2025 à 13h00.
      </p>
    </div>
  );

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
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => navigate(-1)}
            style={{
              fontWeight: 600,
            }}
          >
            Voltar
          </button>
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
    <ModalFormBodyTextCloseButtonCabecalho
      show={modalPdf.show}
      onHide={handleFecharModalPdf}
      titulo={`Documento final ${modalPdf.titulo ? `- ${modalPdf.titulo}` : ''}`}
      size="xl"
      bodyText={
        modalPdf.url ? (
          <div style={{ height: '70vh' }}>
            <iframe
              src={modalPdf.url}
              title="Documento Final PAA"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <div className="text-danger">Não foi possível carregar o PDF.</div>
        )
      }
    />
    </>
  );
};
