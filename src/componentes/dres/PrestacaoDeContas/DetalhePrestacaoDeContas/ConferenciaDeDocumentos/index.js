import React, {memo, useCallback, useEffect, useState} from "react";
import {
    getDocumentosParaConferencia,
    getUltimaAnalisePc
} from "../../../../../services/dres/PrestacaoDeContas.service";
import TabelaConferenciaDeDocumentos from "./TabelaConferenciaDeDocumentos";
import {gerarUuid} from "../../../../../utils/ValidacoesAdicionaisFormularios";

const ConferenciaDeDocumentos = ({prestacaoDeContas, onUpdateListaDeDocumentosParaConferencia=null, editavel=true}) =>{

    const rowsPerPage =10

    const [listaDeDocumentosParaConferencia, setListaDeDocumentosParaConferencia] = useState([])
    const [loadingDocumentosParaConferencia, setLoadingDocumentosParaConferencia] = useState(true)

    const carregaListaDeDocumentosParaConferencia = useCallback(async () =>{
        setLoadingDocumentosParaConferencia(true)

        let docs;

        if (editavel){
            if (prestacaoDeContas && prestacaoDeContas.uuid && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid) {
                docs = await getDocumentosParaConferencia(prestacaoDeContas.uuid, prestacaoDeContas.analise_atual.uuid)
            }
        }else {
            if (prestacaoDeContas && prestacaoDeContas.uuid){
                let ultima_analise =  await getUltimaAnalisePc(prestacaoDeContas.uuid)

                if (ultima_analise && ultima_analise.uuid){
                    docs =  await getDocumentosParaConferencia(prestacaoDeContas.uuid, ultima_analise.uuid)
                }
            }
        }

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
        onUpdateListaDeDocumentosParaConferencia && onUpdateListaDeDocumentosParaConferencia()
        setLoadingDocumentosParaConferencia(false)
    }, [prestacaoDeContas, editavel])

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
                editavel={editavel}
            />
        </>
    )
}

export default memo(ConferenciaDeDocumentos)