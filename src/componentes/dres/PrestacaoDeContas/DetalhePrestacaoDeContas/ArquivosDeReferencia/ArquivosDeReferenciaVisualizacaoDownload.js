import React, { memo, useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import {
    getDownloadArquivoDeReferencia,
    getDocumentosPaa,
} from '../../../../../services/dres/PrestacaoDeContas.service';
import ModalVisualizarArquivoDeReferencia from '../ModalVisualizarArquivoDeReferencia';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './scss/ArquivosDeReferenciaVisualizacaoDownload.scss';

const ArquivosDeReferenciaVisualizacaoDownload = ({ prestacaoDeContas, infoAta }) => {
    const { arquivos_referencia } = prestacaoDeContas;
    const { prestacao_conta_uuid } = useParams();

    const rowsPerPage = 10;

    const [showModalVisualizarArquivoDeRerefencia, setShowModalVisualizarArquivoDeRerefencia] =
        useState(false);
    const [uuidArquivoReferencia, setUuidArquivoReferencia] = useState('');
    const [tipoArquivoReferencia, setTipoArquivoReferencia] = useState('');
    const [nomeArquivoReferencia, setNomeArquivoReferencia] = useState('');
    const [arquivoReferenciaPorConta, setArquivoReferenciaPorConta] = useState([]);

    const [documentos, setDocumentos] = useState([]);

    const handleClickDownloadArquivoDeReferencia = useCallback(async (rowData) => {
        let nome_do_arquivo = `${rowData.nome}`;
        try {
            await getDownloadArquivoDeReferencia(nome_do_arquivo, rowData.uuid, rowData.tipo);
        } catch (e) {
            toast.error(`O download do arquivo falhou.`);
        }
    }, []);

    const handleClickVisualizarArquivoDeReferencia = useCallback((rowData) => {
        setUuidArquivoReferencia(rowData.uuid);
        setTipoArquivoReferencia(rowData.tipo);
        setNomeArquivoReferencia(rowData.nome);
        setShowModalVisualizarArquivoDeRerefencia(true);
    }, []);

    const handleCloseModalVisualizarArquivoDeRerefencia = useCallback(() => {
        setShowModalVisualizarArquivoDeRerefencia(false);
    }, []);

    const acoesTemplate = useCallback(
        (rowData) => {
            let disabled = true;
            if (rowData.uuid) disabled = false;
            return (
                <div className='d-flex align-items-center justify-content-start'>
                    <button
                        onClick={() => handleClickVisualizarArquivoDeReferencia(rowData)}
                        className='btn-editar-membro'
                        disabled={disabled}
                    >
                        <span
                            data-tooltip-id={`btn-visualizar-${rowData.uuid}`}
                            data-tooltip-html='Visualização'
                        >
                            <FontAwesomeIcon
                                style={{ 
                                    fontSize: '20px', 
                                    marginRight: '0',
                                    marginTop: '2px',
                                    opacity: disabled ? 0.4 : 1,
                                }}
                                icon={faEye}
                            />
                        </span>
                        <ReactTooltip id={`btn-visualizar-${rowData.uuid}`} />
                    </button>
                    <span> | </span>
                    <button
                        onClick={() => handleClickDownloadArquivoDeReferencia(rowData)}
                        className='btn-editar-membro'
                        disabled={disabled}
                    >
                        <span
                            data-tooltip-id={`btn-download-${rowData.uuid}`}
                            data-tooltip-html='Download'
                        >
                        <FontAwesomeIcon
                            style={{
                                fontSize: '20px',
                                marginRight: '0',
                                opacity: disabled ? 0.4 : 1,
                            }}
                            icon={faDownload}
                        />
                        </span>
                        <ReactTooltip id={`btn-download-${rowData.uuid}`} />
                    </button>
                </div>
            );
        },
        [handleClickDownloadArquivoDeReferencia, handleClickVisualizarArquivoDeReferencia],
    );

    const getArquivosApresentadosEmTodasAsContas = useCallback(() => {
        if (arquivos_referencia && arquivos_referencia.length > 0 && infoAta) {
            let arquivos_apresentados_em_todas_as_contas = arquivos_referencia.filter(
                (element) => element.arquivo_apresentado_em_todas_as_contas,
            );

            return arquivos_apresentados_em_todas_as_contas;
        }

        return [];
    }, [arquivos_referencia, infoAta]);

    const getArquivosReferenciaPorConta = useCallback(() => {
        let arquivos_apresentados_em_todas_as_contas = getArquivosApresentadosEmTodasAsContas();

        if (
            arquivos_referencia &&
            arquivos_referencia.length > 0 &&
            infoAta &&
            infoAta.conta_associacao &&
            infoAta.conta_associacao.uuid
        ) {
            let arquivos = arquivos_referencia.filter(
                (element) => element.conta_uuid === infoAta.conta_associacao.uuid,
            );
            arquivos = arquivos.filter((element) => element.tipo !== 'EB');

            arquivos = arquivos.concat(arquivos_apresentados_em_todas_as_contas);
            arquivos.push(...(documentos || []));
            setArquivoReferenciaPorConta(arquivos);
        }
    }, [arquivos_referencia, infoAta, documentos]);

    function nomeDocumentoTemplate(rowData) {
        const [tipo, nome] = rowData.nome.split('-')

        return (
            <div className="documento-paa">
                <span>{`${tipo} `}</span>
                <small>
                    {nome}
                </small>
            </div>
        )
    }
    
    useEffect(() => {
        getArquivosReferenciaPorConta();
    }, [getArquivosReferenciaPorConta]);

    useEffect(() => {
        async function carregarDocumentos() {
            try {
                const response = await getDocumentosPaa(prestacao_conta_uuid);
                setDocumentos(response);
            } catch (error) {
                console.error(error);
            }
        }

        if (prestacao_conta_uuid) {
            carregarDocumentos();
        }
    }, [prestacao_conta_uuid]);

    return (
        <>
            {arquivoReferenciaPorConta && arquivoReferenciaPorConta.length > 0 ? (
                <>
                    <DataTable
                        value={arquivoReferenciaPorConta}
                        rows={rowsPerPage}
                        paginator={arquivos_referencia.length > rowsPerPage}
                        paginatorTemplate='PrevPageLink PageLinks NextPageLink'
                        className='mt-4'
                    >
                        <Column field='nome' header='Nome do arquivo' body={nomeDocumentoTemplate} />
                        <Column
                            field='acoes'
                            header='Ações'
                            body={acoesTemplate}
                            style={{ width: '150px' }}
                        />
                    </DataTable>
                    <section>
                        <ModalVisualizarArquivoDeReferencia
                            show={showModalVisualizarArquivoDeRerefencia}
                            handleClose={handleCloseModalVisualizarArquivoDeRerefencia}
                            uuidArquivoReferencia={uuidArquivoReferencia}
                            nomeArquivoReferencia={nomeArquivoReferencia}
                            tipoArquivoReferencia={tipoArquivoReferencia}
                        />
                    </section>
                </>
            ) : (
                <small className='fonte-18 mt-3'>
                    <strong>Não existem arquivos de referência para serem exibidos</strong>
                </small>
            )}
        </>
    );
};

export default memo(ArquivosDeReferenciaVisualizacaoDownload);
