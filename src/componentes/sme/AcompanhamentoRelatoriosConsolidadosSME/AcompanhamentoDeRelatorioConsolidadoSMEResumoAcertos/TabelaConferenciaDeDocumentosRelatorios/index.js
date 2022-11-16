import React, { useState, useCallback, useEffect } from 'react';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { detalhamentoConferenciaDocumentos } from "../../../../../services/sme/AcompanhamentoSME.service"

import './styles.scss'

export const TabelaConferenciaDeDocumentosRelatorios = ({ resumoConsolidado, relatorioConsolidado }) => {
    const rowsPerPage = 5
    const [listaDeDocumentosRelatorio, setListaDeDocumentosRelatorio] = useState(null)
    const [expandedRowsDocumentos, setExpandedRowsDocumentos] = useState(null);

    const carregaListaDeDocumentosRelatorio = useCallback(async () => {
        if(!relatorioConsolidado?.analise_atual){
            return
        }
        const response = await detalhamentoConferenciaDocumentos(relatorioConsolidado?.analise_atual?.consolidado_dre, relatorioConsolidado?.analise_atual?.uuid)
        const documentosComAcertos = Object.values(response.data['lista_documentos']).filter((doc) => doc.analise_documento_consolidado_dre.resultado )
        setListaDeDocumentosRelatorio(documentosComAcertos)
    }, [relatorioConsolidado])

    useEffect(() => {
        carregaListaDeDocumentosRelatorio()
    }, [carregaListaDeDocumentosRelatorio])

    const rowExpansionTemplateDocumentos = (data) => {
        return (
            <div>
                <p className='pr-1'><strong> Comentários : </strong></p>
                <p className='pr-1 text-sm'>{data.analise_documento_consolidado_dre.detalhamento}</p>
            </div>
        )
    }

    return (
        <>
            <h5 className="mb-4 mt-4"><strong>Acertos nos documentos</strong></h5>
            <DataTable
                value={listaDeDocumentosRelatorio}
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
            </DataTable>
        </>
    )
}