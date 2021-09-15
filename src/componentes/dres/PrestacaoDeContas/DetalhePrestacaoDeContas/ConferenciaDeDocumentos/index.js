import React, {memo, useCallback, useEffect, useState} from "react";
import {getDocumentosParaConferencia} from "../../../../../services/dres/PrestacaoDeContas.service";
import TabelaConferenciaDeDocumentos from "./TabelaConferenciaDeDocumentos";
import {gerarUuid} from "../../../../../utils/ValidacoesAdicionaisFormularios";

const ConferenciaDeDocumentos = ({prestacaoDeContas}) =>{

    const rowsPerPage =10

    const [listaDeDocumentosParaConferencia, setListaDeDocumentosParaConferencia] = useState([])
    const [loadingDocumentosParaConferencia, setLoadingDocumentosParaConferencia] = useState(true)

    const carregaListaDeDocumentosParaConferencia = useCallback(async () =>{
        setLoadingDocumentosParaConferencia(true)
        if (prestacaoDeContas && prestacaoDeContas.uuid && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid) {
            let docs = await getDocumentosParaConferencia(prestacaoDeContas.uuid, prestacaoDeContas.analise_atual.uuid)

            // Adicionando a propriedade selecionando todos os itens
            if (docs && docs.length > 0){
                let unis = docs.map((lancamento)=>{
                    return {
                        ...lancamento,
                        selecionado: false,
                        uuid_documento: gerarUuid()
                    }
                })
                setListaDeDocumentosParaConferencia(unis)
            }else {
                setListaDeDocumentosParaConferencia([])
            }
        }
        setLoadingDocumentosParaConferencia(false)
    }, [prestacaoDeContas])

    useEffect(()=>{
        carregaListaDeDocumentosParaConferencia()
    }, [carregaListaDeDocumentosParaConferencia])

    return(
        <>
            <hr id='conferencia_de_documentos' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Conferência de documentos</h4>
            <TabelaConferenciaDeDocumentos
                carregaListaDeDocumentosParaConferencia={carregaListaDeDocumentosParaConferencia}
                setListaDeDocumentosParaConferencia={setListaDeDocumentosParaConferencia}
                listaDeDocumentosParaConferencia={listaDeDocumentosParaConferencia}
                rowsPerPage={rowsPerPage}
                prestacaoDeContas={prestacaoDeContas}
                loadingDocumentosParaConferencia={loadingDocumentosParaConferencia}
            />
        </>
    )
}

export default memo(ConferenciaDeDocumentos)