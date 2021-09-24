import React, {memo, useCallback, useState} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faDownload, faSearch} from "@fortawesome/free-solid-svg-icons";
import {getDownloadArquivoDeReferencia} from "../../../../../services/dres/PrestacaoDeContas.service";
import ModalVisualizarArquivoDeReferencia from "../ModalVisualizarArquivoDeReferencia";

const ArquivosDeReferenciaVisualizacaoDownload = ({prestacaoDeContas}) => {

    const {arquivos_referencia} = prestacaoDeContas

    const rowsPerPage = 10;

    const [showModalVisualizarArquivoDeRerefencia, setShowModalVisualizarArquivoDeRerefencia] = useState(false)
    const [uuidArquivoReferencia, setUuidArquivoReferencia] = useState('')
    const [tipoArquivoReferencia, setTipoArquivoReferencia] = useState('')
    const [nomeArquivoReferencia, setNomeArquivoReferencia] = useState('')

    const handleClickDownloadArquivoDeReferencia = useCallback(async (rowData) => {
        let nome_do_arquivo = `${rowData.nome}`
        try {
            await getDownloadArquivoDeReferencia(nome_do_arquivo, rowData.uuid, rowData.tipo);
            console.log("Download efetuado com sucesso");
        } catch (e) {
            console.log("Erro ao efetuar o download ", e.response);
        }
    }, [])

    const handleClickVisualizarArquivoDeReferencia = useCallback((rowData)=>{
        setUuidArquivoReferencia(rowData.uuid)
        setTipoArquivoReferencia(rowData.tipo)
        setNomeArquivoReferencia(rowData.nome)
        setShowModalVisualizarArquivoDeRerefencia(true)

    }, [])

    const handleCloseModalVisualizarArquivoDeRerefencia = useCallback(()=>{
        setShowModalVisualizarArquivoDeRerefencia(false)
    }, []);

    const acoesTemplate = useCallback((rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-start">
                <button onClick={()=>handleClickVisualizarArquivoDeReferencia(rowData)} className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", marginTop: '2px', color: "#00585E"}}
                        icon={faSearch}
                    />
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

    return (
        <>
            {arquivos_referencia && arquivos_referencia.length > 0 &&
            <>
                <DataTable
                    value={arquivos_referencia}
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
            }
        </>
    )
}

export default memo(ArquivosDeReferenciaVisualizacaoDownload)