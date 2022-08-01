import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {useSelector} from "react-redux";
import {TopoComBotoes} from "./TopoComBotoes";
import CabecalhoDocumento from "./CabecalhoDocumento";
import {getTiposDeAcertosDocumentos, getSolicitacaoDeAcertosDocumentos, postSolicitacoesParaAcertosDocumentos, getTabelas} from "../../../../../../services/dres/PrestacaoDeContas.service";
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

    const [tiposDeAcertoDocumentosAgrupados, setTiposDeAcertoDocumentosAgrupados] = useState([]);
    const [textoCategoria, setTextoCategoria] = useState([])
    const [corTextoCategoria, setCorTextoCategoria] = useState([])
    const [solicitacoesAcertosDocumentos, setSolicitacoesAcertosDocumentos] = useState({})

    const carregaTiposDeAcertoDocumentos = useCallback(async () =>{
        if (documentos && documentos[0]){
            let tabelas = await getTabelas(documentos[0].tipo_documento_prestacao_conta.uuid);
            let tipos_agrupados = tabelas.agrupado_por_categorias;
            setTiposDeAcertoDocumentosAgrupados(tipos_agrupados);
        }
    }, [documentos])

    useEffect(()=>{
        carregaTiposDeAcertoDocumentos()
    }, [carregaTiposDeAcertoDocumentos])

    const addTextoECorCategoriaTipoDeAcertoJaCadastrado = (acertos, tipos_de_acerto_documentos_agrupado) => {
        tipos_de_acerto_documentos_agrupado = tipos_de_acerto_documentos_agrupado.agrupado_por_categorias
    
        acertos.solicitacoes_de_ajuste_da_analise.map((acerto, index_array_acertos)=>{
            let id_categoria = acerto.tipo_acerto.categoria;
            let info_categoria = tipos_de_acerto_documentos_agrupado.find(element => element.id === id_categoria);
            if(info_categoria){
                let classe = info_categoria.cor === 1 ? 'texto-categoria-documento-verde' : 'texto-categoria-documento-vermelho';
                setTextoCategoria(prevState => [...prevState, [index_array_acertos] = info_categoria.texto]);
                setCorTextoCategoria(prevState => [...prevState, [index_array_acertos] = classe]);       
            }
            else{
                setTextoCategoria(prevState => [...prevState, [index_array_acertos] = ""]);
                setCorTextoCategoria(prevState => [...prevState, [index_array_acertos] = ""]);
            }
        })
    }

    const carregaSolicitacoesAcertosDocumentos = useCallback(async () => {
        if (documentos && documentos[0] && documentos[0].analise_documento && documentos[0].analise_documento.uuid){
            let acertos = await getSolicitacaoDeAcertosDocumentos(prestacao_conta_uuid, documentos[0].analise_documento && documentos[0].analise_documento.uuid)
            let tipos_de_acerto_documentos_agrupado = await getTabelas(documentos[0].tipo_documento_prestacao_conta.uuid);
            
            let _acertos = []
            if (acertos && acertos.solicitacoes_de_ajuste_da_analise && acertos.solicitacoes_de_ajuste_da_analise.length > 0) {
                acertos.solicitacoes_de_ajuste_da_analise.map((acerto) =>
                    _acertos.push({
                        tipo_acerto: acerto.tipo_acerto.uuid,
                        detalhamento: acerto.detalhamento,
                    })
                )
                addTextoECorCategoriaTipoDeAcertoJaCadastrado(acertos, tipos_de_acerto_documentos_agrupado);
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

    const removeTextoECorCategoriaTipoDeAcertoJaCadastrado = (index_array_acertos) => {
        setTextoCategoria(prevState => prevState.filter((acerto, i) => i !== index_array_acertos));
        setCorTextoCategoria(prevState => prevState.filter((acerto, i) => i !== index_array_acertos));
    }

    const adicionaTextoECorCategoriaVazio = () => {
        let lista_texto = textoCategoria;
        lista_texto.push("")
        setTextoCategoria(lista_texto)

        let lista_cor = corTextoCategoria;
        lista_cor.push("");
        setCorTextoCategoria(lista_cor)
    }

    const changeTextoECorCategoria = (info_categoria, index) => {
        if(info_categoria){
            let classe = info_categoria.cor === 1 ? 'texto-categoria-documento-verde' : 'texto-categoria-documento-vermelho';
            let lista_texto = textoCategoria
            let lista_cor = corTextoCategoria

            if(lista_texto[index] || lista_texto[index] === ""){
                lista_texto[index] = info_categoria.texto
            }
            else{
                lista_texto.push(info_categoria.texto)
            }

            if(lista_cor[index] || lista_cor[index] === ""){
                lista_cor[index] = classe
            }
            else{
                lista_cor.push(classe)
            }

            setTextoCategoria(lista_texto)
            setCorTextoCategoria(lista_cor)
        }
        else{
            let lista_texto = textoCategoria
            let lista_cor = corTextoCategoria

            if(lista_texto[index] || lista_texto[index] === ""){
                lista_texto[index] = ""
            }
            else{
                lista_texto.push("")
            }

            if(lista_cor[index] || lista_cor[index] === ""){
                lista_cor[index] = ""
            }
            else{
                lista_cor.push("")
            }

            setTextoCategoria(lista_texto)
            setCorTextoCategoria(lista_cor)
        }
    }

    const handleChangeTipoDeAcertoDocumento = (e, index) => {
        let id_categoria = e.target.options[e.target.selectedIndex].getAttribute('data-categoria')
        let info_categoria = tiposDeAcertoDocumentosAgrupados.find(element => element.id === id_categoria);
        changeTextoECorCategoria(info_categoria, index);
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
                        onSubmitFormAcertos={onSubmitFormAcertos}
                        formRef={formRef}
                        tiposDeAcertoDocumentosAgrupados={tiposDeAcertoDocumentosAgrupados}
                        handleChangeTipoDeAcertoDocumento={handleChangeTipoDeAcertoDocumento}
                        textoCategoria={textoCategoria}
                        corTextoCategoria={corTextoCategoria}
                        adicionaTextoECorCategoriaVazio={adicionaTextoECorCategoriaVazio}
                        removeTextoECorCategoriaTipoDeAcertoJaCadastrado={removeTextoECorCategoriaTipoDeAcertoJaCadastrado}
                    />
                </div>
            ):
                onClickBtnVoltar()
            }
        </PaginasContainer>
    )
}
export default memo(DetalharAcertosDocumentos)