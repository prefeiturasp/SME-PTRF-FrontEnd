import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {useSelector} from "react-redux";
import {TopoComBotoes} from "./TopoComBotoes";
import CabecalhoDocumento from "./CabecalhoDocumento";
import {getTiposDeAcertosDocumentos, getSolicitacaoDeAcertosDocumentos, postSolicitacoesParaAcertosDocumentos} from "../../../../../../services/dres/PrestacaoDeContas.service";
import FormularioAcertos from "./FormularioAcertos";

// Hooks Personalizados
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";

const DetalharAcertosDocumentos = () =>{

    const {prestacao_conta_uuid} = useParams();
    const formRef = useRef();
    const history = useHistory();

    // Redux
    const {documentos} = useSelector(state => state.DetalharAcertosDocumentos)

    // Hooks Personalizados
    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacao_conta_uuid)

    const [tiposDeAcertoDocumentos, setTiposDeAcertoDocumentos] = useState([])
    const [solicitacoesAcertosDocumentos, setSolicitacoesAcertosDocumentos] = useState({})

    const carregaTiposDeAcertoDocumentos = useCallback(async () =>{
        if (documentos && documentos[0]){
            let tipos = await getTiposDeAcertosDocumentos(documentos[0].tipo_documento_prestacao_conta.uuid)
            setTiposDeAcertoDocumentos(tipos)
        }
    }, [documentos])

    useEffect(()=>{
        carregaTiposDeAcertoDocumentos()
    }, [carregaTiposDeAcertoDocumentos])

    const carregaSolicitacoesAcertosDocumentos = useCallback(async () => {
        if (documentos && documentos[0] && documentos[0].analise_documento && documentos[0].analise_documento.uuid){
            let acertos = await getSolicitacaoDeAcertosDocumentos(prestacao_conta_uuid, documentos[0].analise_documento && documentos[0].analise_documento.uuid)

            let _acertos = []
            if (acertos && acertos.solicitacoes_de_ajuste_da_analise && acertos.solicitacoes_de_ajuste_da_analise.length > 0) {
                acertos.solicitacoes_de_ajuste_da_analise.map((acerto) =>
                    _acertos.push({
                        tipo_acerto: acerto.tipo_acerto.uuid,
                    })
                )
            }
            setSolicitacoesAcertosDocumentos({solicitacoes_acerto: [..._acertos]})
        }
    }, [prestacao_conta_uuid, documentos])

    useEffect(()=>{
        carregaSolicitacoesAcertosDocumentos()
    }, [carregaSolicitacoesAcertosDocumentos])

    const onClickBtnVoltar = () => {
        history.push(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#conferencia_de_documentos`)
    }

    const onSubmitFormAcertos = async () =>{

        if (!formRef.current.errors.solicitacoes_acerto && formRef.current.values && formRef.current.values.solicitacoes_acerto) {

            let {solicitacoes_acerto} = formRef.current.values
            let tipo_documento = documentos && documentos[0] && documentos[0].tipo_documento_prestacao_conta && documentos[0].tipo_documento_prestacao_conta.uuid ? documentos[0].tipo_documento_prestacao_conta.uuid : null
            let conta_associacao = documentos && documentos[0] && documentos[0].tipo_documento_prestacao_conta && documentos[0].tipo_documento_prestacao_conta.conta_associacao ? documentos[0].tipo_documento_prestacao_conta.conta_associacao : null

            let payload = {
                analise_prestacao: prestacaoDeContas.analise_atual.uuid,
                documentos: [{
                    tipo_documento: tipo_documento,
                    conta_associacao: conta_associacao,
                }],
                solicitacoes_acerto: solicitacoes_acerto
            }
            try {
                await postSolicitacoesParaAcertosDocumentos(prestacao_conta_uuid, payload)
                console.log("Solicitações de Acertos em Documento efetuada com sucesso!")
                onClickBtnVoltar();
            } catch (e) {
                console.log("Erro ao fazer Solicitações de Acertos em Documento! ", e.response)
            }
        }
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            {documentos && documentos.length > 0 ? (
                <div className="page-content-inner">
                    <TopoComBotoes
                        onClickBtnVoltar={onClickBtnVoltar}
                        onSubmitFormAcertos={onSubmitFormAcertos}
                    />
                    <CabecalhoDocumento
                        documentos={documentos}
                    />
                    <FormularioAcertos
                        solicitacoes_acerto={solicitacoesAcertosDocumentos}
                        tiposDeAcertoDocumentos={tiposDeAcertoDocumentos}
                        onSubmitFormAcertos={onSubmitFormAcertos}
                        formRef={formRef}
                    />
                </div>
            ):
                onClickBtnVoltar()
            }
        </PaginasContainer>
    )
}
export default memo(DetalharAcertosDocumentos)