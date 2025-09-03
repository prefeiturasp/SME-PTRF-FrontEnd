import React, {memo, useCallback, useEffect, useState} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faEye} from "@fortawesome/free-solid-svg-icons";
import {getDownloadArquivoDeReferencia} from "../../../../../services/dres/PrestacaoDeContas.service";
import ModalVisualizarArquivoDeReferencia from "../ModalVisualizarArquivoDeReferencia";
import { Tooltip as ReactTooltip } from "react-tooltip";

const ArquivosDeReferenciaVisualizacaoDownload = ({prestacaoDeContas, infoAta}) => {

    const {arquivos_referencia} = prestacaoDeContas

    const rowsPerPage = 10;

    const [showModalVisualizarArquivoDeRerefencia, setShowModalVisualizarArquivoDeRerefencia] = useState(false)
    const [uuidArquivoReferencia, setUuidArquivoReferencia] = useState('')
    const [tipoArquivoReferencia, setTipoArquivoReferencia] = useState('')
    const [nomeArquivoReferencia, setNomeArquivoReferencia] = useState('')
    const [arquivoReferenciaPorConta, setArquivoReferenciaPorConta] = useState([])

    const handleClickDownloadArquivoDeReferencia = useCallback(async (rowData) => {
        let nome_do_arquivo = `${rowData.nome}`
        try {
            await getDownloadArquivoDeReferencia(nome_do_arquivo, rowData.uuid, rowData.tipo);
            console.log("Download efetuado com sucesso");
        } catch (e) {
            console.log("Erro ao efetuar o download ", e.response);
        }
    }, [])

    const handleClickVisualizarArquivoDeReferencia = useCallback((rowData) => {
        setUuidArquivoReferencia(rowData.uuid)
        setTipoArquivoReferencia(rowData.tipo)
        setNomeArquivoReferencia(rowData.nome)
        setShowModalVisualizarArquivoDeRerefencia(true)
    }, [])

    const handleCloseModalVisualizarArquivoDeRerefencia = useCallback(() => {
        setShowModalVisualizarArquivoDeRerefencia(false)
    }, []);

    const acoesTemplate = useCallback((rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-start">
                <button onClick={() => handleClickVisualizarArquivoDeReferencia(rowData)} className="btn-editar-membro">
                    <span data-html={true} data-tooltip-content="Visualização">
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", marginTop: '2px', color: "#00585E"}}
                            icon={faEye}
                        />
                    </span>
                    <ReactTooltip html={true}/>
                </button>
                <span> | </span>
                <button onClick={() => handleClickDownloadArquivoDeReferencia(rowData)} className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faDownload}
                    />
                </button>
            </div>
        )
    }, [handleClickDownloadArquivoDeReferencia, handleClickVisualizarArquivoDeReferencia])

    const getArquivosApresentadosEmTodasAsContas = useCallback(() => {
        if (arquivos_referencia && arquivos_referencia.length > 0 && infoAta) {
            let arquivos_apresentados_em_todas_as_contas = arquivos_referencia.filter(element => element.arquivo_apresentado_em_todas_as_contas)

            return arquivos_apresentados_em_todas_as_contas;
        }

        return [];
    }, [arquivos_referencia, infoAta])

    const getArquivosReferenciaPorConta = useCallback(() => {
        let arquivos_apresentados_em_todas_as_contas = getArquivosApresentadosEmTodasAsContas();

        if (arquivos_referencia && arquivos_referencia.length > 0 && infoAta && infoAta.conta_associacao && infoAta.conta_associacao.uuid) {
            let arquivos = arquivos_referencia.filter(element => element.conta_uuid === infoAta.conta_associacao.uuid)
            arquivos = arquivos.filter(element => element.tipo !== "EB")

            arquivos = arquivos.concat(arquivos_apresentados_em_todas_as_contas);
            setArquivoReferenciaPorConta(arquivos)
        }
    }, [arquivos_referencia, infoAta])

    useEffect(() => {
        getArquivosReferenciaPorConta()
    }, [getArquivosReferenciaPorConta])

    return (
        <>
            {arquivoReferenciaPorConta && arquivoReferenciaPorConta.length > 0 ? (
                <>
                    <DataTable
                        value={arquivoReferenciaPorConta}
                        rows={rowsPerPage}
                        paginator={arquivos_referencia.length > rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        className='mt-4'
                    >
                        <Column field="nome" header="Nome do arquivo"/>
                        <Column
                            field="acoes"
                            header="Ações"
                            body={acoesTemplate}
                            style={{width: '150px'}}
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
            ) :
                <p className='fonte-18 mt-3'><strong>Não existem arquivos de referência para serem exibidos</strong></p>
            }
        </>
    )
}

export default memo(ArquivosDeReferenciaVisualizacaoDownload)