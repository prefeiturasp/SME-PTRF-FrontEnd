import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {useSelector} from "react-redux";
import {TopoComBotoes} from "./TopoComBotoes";
import CabecalhoDocumento from "./CabecalhoDocumento";
import {getTiposDeAcertosDocumentos, getSolicitacaoDeAcertosDocumentos, postSolicitacoesParaAcertosDocumentos, getTabelas, getContasComMovimentoNaPc} from "../../../../../../services/dres/PrestacaoDeContas.service";
import FormularioAcertos from "./FormularioAcertos";
import { ModalAntDesignConfirmacao } from "../../../../../Globais/ModalAntDesign";

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
    const [showModalContaEncerrada, setShowModalContaEncerrada] = useState(false)

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
                        uuid: acerto.uuid,
                        copiado: acerto.copiado,
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

    const validaContaAoSalvar = async() => {
        if (!formRef.current.errors.solicitacoes_acerto && formRef.current.values && formRef.current.values.solicitacoes_acerto) {
            if(documentos && documentos[0] && documentos[0].tipo_documento_prestacao_conta && documentos[0].tipo_documento_prestacao_conta && documentos[0].tipo_documento_prestacao_conta.documento_por_conta){
                let conta_associacao = documentos[0].tipo_documento_prestacao_conta.conta_associacao;
                let {solicitacoes_acerto} = formRef.current.values
    
                if(conta_associacao){
                    let conta_encerrada = await contaEncerrada(conta_associacao);
        
                    if(conta_encerrada){
                        if(possuiAcertosQuePodemAlterarSaldo(solicitacoes_acerto)){
                            setShowModalContaEncerrada(true);
                        }
                        else{
                            await onSubmitFormAcertos();
                        }
                    }
                    else{
                        await onSubmitFormAcertos();
                    }
                }
            } else {
                await onSubmitFormAcertos();
            }
        }
    }

    const contaEncerrada = async(conta_associacao) => {
        let contas_com_movimento = await getContasComMovimentoNaPc(prestacaoDeContas.uuid)
        let conta_encontrada = contas_com_movimento.find(elemento => elemento.uuid === conta_associacao)

        return conta_encontrada.status === "INATIVA" ? true : false;
    }

    const possuiAcertosQuePodemAlterarSaldo = (solicitacoes_acerto) => {
        const categoriasQuePodemAlterarSaldoDaConta = [
            'INCLUSAO_CREDITO',
            'INCLUSAO_GASTO',
        ];

        let possui_acerto_que_altera_saldo = false;

        for(let index_solicitacao_acerto=0; index_solicitacao_acerto <= solicitacoes_acerto.length-1; index_solicitacao_acerto ++){
            let tipo_acerto_uuid = solicitacoes_acerto[index_solicitacao_acerto].tipo_acerto
            let categoria = retornaCategoriaTipoAcerto(tipo_acerto_uuid)

            if(categoriasQuePodemAlterarSaldoDaConta.includes(categoria.id)){
                possui_acerto_que_altera_saldo = true;
                break;
            }
        }

        return possui_acerto_que_altera_saldo;
    }

    const retornaCategoriaTipoAcerto = (tipo_acerto_uuid) => {
        let categoria_encontrada = null;

        for(let index_categoria=0; index_categoria <= tiposDeAcertoDocumentosAgrupados.length -1; index_categoria ++){
            let categoria = tiposDeAcertoDocumentosAgrupados[index_categoria]
            
            let tipo_acerto = categoria.tipos_acerto_documento.find(elemento => elemento.uuid === tipo_acerto_uuid);
            if(tipo_acerto){
                categoria_encontrada = categoria;
                break
            }
        }

        return categoria_encontrada;
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
                setShowModalContaEncerrada(false);
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

    const ehSolicitacaoCopiada = (acerto) => {
        if(acerto.copiado){
            return true;
        }
        
        return false;
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            {documentos && documentos.length > 0 ? (
                <div className="page-content-inner">
                    <TopoComBotoes
                        onClickBtnVoltar={onClickBtnVoltar}
                        validaContaAoSalvar={validaContaAoSalvar}
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <CabecalhoDocumento
                        documentos={documentos}
                    />
                    <FormularioAcertos
                        solicitacoes_acerto={solicitacoesAcertosDocumentos}
                        validaContaAoSalvar={validaContaAoSalvar}
                        formRef={formRef}
                        tiposDeAcertoDocumentosAgrupados={tiposDeAcertoDocumentosAgrupados}
                        handleChangeTipoDeAcertoDocumento={handleChangeTipoDeAcertoDocumento}
                        textoCategoria={textoCategoria}
                        corTextoCategoria={corTextoCategoria}
                        adicionaTextoECorCategoriaVazio={adicionaTextoECorCategoriaVazio}
                        removeTextoECorCategoriaTipoDeAcertoJaCadastrado={removeTextoECorCategoriaTipoDeAcertoJaCadastrado}
                        ehSolicitacaoCopiada={ehSolicitacaoCopiada}
                    />

                    <section>
                        <ModalAntDesignConfirmacao
                            handleShow={showModalContaEncerrada}
                            titulo={"A conta onde foram solicitados acertos foi encerrada"}
                            bodyText="As solicitações realizadas podem alterar o saldo da conta encerrada. Lembrando que para concluir a análise da PC, o saldo da referida conta deverá estar zerado. Deseja prosseguir com a inclusão do acerto?"
                            handleOk={(e) => onSubmitFormAcertos()}
                            okText="Confirmar"
                            handleCancel={(e) => setShowModalContaEncerrada(false)}
                            cancelText="Cancelar"
                        />
                    </section>
                </div>
            ):
                onClickBtnVoltar()
            }
        </PaginasContainer>
    )
}
export default memo(DetalharAcertosDocumentos)