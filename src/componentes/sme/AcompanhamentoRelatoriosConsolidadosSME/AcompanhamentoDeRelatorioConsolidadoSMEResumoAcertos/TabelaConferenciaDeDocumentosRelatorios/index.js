import React, { useState, useCallback, useEffect } from 'react';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { detalhamentoConferenciaDocumentos } from "../../../../../services/sme/AcompanhamentoSME.service"

import './styles.scss'

export const TabelaConferenciaDeDocumentosRelatorios = ({ relatorioConsolidado, listaDocumentoHistorico, listaDeDocumentosRelatorio, setListaDeDocumentosRelatorio, tabAtual }) => {
    
    const rowsPerPage = 5
    const [expandedRowsDocumentos, setExpandedRowsDocumentos] = useState(null);
    const [loadingDocumento, setLoadingDocumento] = useState(null)
    
    const carregaListaDeDocumentosRelatorio = useCallback(async () => {
        if(!relatorioConsolidado?.analise_atual){
            return
        }
        const response = await detalhamentoConferenciaDocumentos(relatorioConsolidado?.analise_atual?.consolidado_dre, relatorioConsolidado?.analise_atual?.uuid)
        const documentosComAcertos = Object.values(response.data['lista_documentos']).filter((doc) => doc.analise_documento_consolidado_dre.resultado === "AJUSTE")
        setListaDeDocumentosRelatorio(documentosComAcertos)
    }, [relatorioConsolidado])

    useEffect(() => {
        carregaListaDeDocumentosRelatorio()
    }, [carregaListaDeDocumentosRelatorio])
    
    const rowExpansionTemplateDocumentos = (data) => {
        return (
            <div>
                <p className='pr-1'><strong> Detalhamento para acertos : </strong></p>
                <p className='pr-1 text-sm'>{data.analise_documento_consolidado_dre.detalhamento}</p>
            </div>
        )
    }

    return (
        <>
            <h5 className="mb-4 mt-4"><strong>Acertos nos documentos</strong></h5>
            {listaDocumentoHistorico?.length || listaDeDocumentosRelatorio?.length ? <DataTable
                value={tabAtual === 'historico' ? listaDocumentoHistorico : listaDeDocumentosRelatorio}
                paginator={
                    0 > rowsPerPage
                }
                rows={rowsPerPage}
                expandedRows={expandedRowsDocumentos}
                onRowToggle={(e) => setExpandedRowsDocumentos(e.data)}
                rowExpansionTemplate={rowExpansionTemplateDocumentos}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                stripedRows
                className=""
                autoLayout={true}>

                <Column header={'Nome do Documento'}
                    field='nome'
                    className="align-middle text-left borda-coluna"
                    style={
                        {
                            borderLeft: 'none',
                            width: '200px'
                        }
                    } />
                    <Column 
                    header=''
                    expander
                    style={{width: '4%'}}
                /> 
            </DataTable>: 
                <p>Exibindo <strong>0</strong> documentos</p>
                }
        </>
    )
}