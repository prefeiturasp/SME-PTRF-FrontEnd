import React from 'react';
import { Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import './PaaLinhaDocumento.scss';

const MSG_EM_PROCESSAMENTO = 'Documento sendo gerado. Aguarde...';

const MAPA_COR_MENSAGEM = {
  green: '#0F7A6C',
  red: '#C22D2D',
  orange: '#D06D12',
  grey: '#60686A',
};

const corMensagemParaHex = (corMensagem) => MAPA_COR_MENSAGEM[corMensagem] || MAPA_COR_MENSAGEM.grey;

export const PaaLinhaDocumento = ({
  titulo,
  bloco,
  testIdPrefix = 'paa-doc',
  onVisualizar,
  onDownload,
  carregandoVisualizar = false,
}) => {
  const status = bloco?.status;
  const mensagem = status?.mensagem ?? '';
  const emProcessamento = status?.status_geracao === 'EM_PROCESSAMENTO';
  const textoExibido = emProcessamento ? MSG_EM_PROCESSAMENTO : mensagem;
  const cor = corMensagemParaHex(status?.cor_mensagem);
  const podeBaixarOuVer = bloco?.existe_arquivo && bloco?.url;

  return (
    <div>
      <h4 className="mb-2 paa-linha-documento__titulo">
        {titulo}
      </h4>
      <div className="d-flex align-items-center flex-wrap">
        <span
          className="paa-linha-documento__mensagem d-inline-flex align-items-center flex-wrap"
          style={{ color: cor }}
          data-testid={`${testIdPrefix}-mensagem`}
        >
          {textoExibido}
          {emProcessamento ? (
            <Spin className="ml-2 paa-linha-documento__spin-geracao" size="small" />
          ) : null}
        </span>
        {podeBaixarOuVer && (
          <>
            <button
              type="button"
              className="ml-3 p-0 btn btn-link d-flex align-items-center paa-linha-documento__btn-acao"
              disabled={carregandoVisualizar}
              onClick={onVisualizar}
            >
              <FontAwesomeIcon className="paa-linha-documento__icone" icon={faEye} title="Visualizar" />
            </button>
            <button
              type="button"
              className="ml-1 p-0 btn btn-link d-flex align-items-center paa-linha-documento__btn-acao"
              disabled={carregandoVisualizar}
              onClick={onDownload}
            >
              <FontAwesomeIcon className="paa-linha-documento__icone" icon={faDownload} title="Download" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
