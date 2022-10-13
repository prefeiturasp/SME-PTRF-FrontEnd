import React, {memo, useCallback, useEffect, useState} from "react";

import TabelaConferenciaDeDocumentosRelatorios from "./TabelaConferenciaDeDocumentosRelatorios";

const ConferenciaDeDocumentos = ({}) =>{

    const rowsPerPage = 10

    const [listaDeDocumentosRelatorio, setListaDeDocumentosRelatorio] = useState([])
    const [loadingDocumentosRelatorio, setLoadingDocumentosRelatorio] = useState(true)

    const carregaListaDeDocumentosRelatorio = useCallback(async () =>{
        setListaDeDocumentosRelatorio([
                {
                    "uuid": "d8d4f49e-dbbc-4f4a-a226-8838089be7b2",
                    "nome": "Demonstrativo da Execução Físico-Financeira",
                    "exibe_acoes": true
                },
                {
                    "uuid": "90cb2f54-7582-41a0-bcc3-03ad83d88702",
                    "nome": "Parecer Técnico Conclusivo",
                    "exibe_acoes": true
                },
                {
                    "uuid": "28383d53-c123-4d02-b850-3d15e40a0c23",
                    "nome": "Ata de retificação",
                    "exibe_acoes": false
                },
                {
                    "uuid": "d9ccd885-b755-4058-b179-fca1339837f8",
                    "nome": "Poder executivo em prática",
                    "exibe_acoes": false
                }
            ])
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
                editavel={true}
            />
        </>
    )
}

export default memo(ConferenciaDeDocumentos)