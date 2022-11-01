import React, {memo, useCallback, useEffect, useState} from "react";
import { useParams } from 'react-router-dom'
import {detalhamentoConferenciaDocumentos} from "../../../../../services/sme/AcompanhamentoSME.service"

import TabelaConferenciaDeDocumentosRelatorios from "./TabelaConferenciaDeDocumentosRelatorios";

const ConferenciaDeDocumentos = ({relatorioConsolidado, editavel=true}) =>{
    const params = useParams()
    const rowsPerPage = 10

    const [listaDeDocumentosRelatorio, setListaDeDocumentosRelatorio] = useState([])
    const [loadingDocumentosRelatorio, setLoadingDocumentosRelatorio] = useState(true)

    const carregaListaDeDocumentosRelatorio = useCallback(async () =>{
        setLoadingDocumentosRelatorio(true)
        let {consolidado_dre_uuid} = params
        let uuid_analise_atual = relatorioConsolidado && relatorioConsolidado.analise_atual && relatorioConsolidado.analise_atual.uuid ? relatorioConsolidado.analise_atual.uuid : null

        const response = await detalhamentoConferenciaDocumentos(consolidado_dre_uuid, uuid_analise_atual)
        setListaDeDocumentosRelatorio(Object.values(response.data['lista_documentos']))
    }, [])

    useEffect(()=>{
        carregaListaDeDocumentosRelatorio()
    }, [carregaListaDeDocumentosRelatorio])

    return(
        <>
            <hr id='conferencia_de_documentos' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Conferência de documentos</h4>
            <TabelaConferenciaDeDocumentosRelatorios
                listaDeDocumentosRelatorio={listaDeDocumentosRelatorio}
                carregaListaDeDocumentosRelatorio={carregaListaDeDocumentosRelatorio}
                setListaDeDocumentosRelatorio={setListaDeDocumentosRelatorio}
                rowsPerPage={rowsPerPage}
                loadingDocumentosRelatorio={loadingDocumentosRelatorio}
                editavel={editavel}
            />
        </>
    )
}

export default memo(ConferenciaDeDocumentos)