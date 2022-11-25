import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {useSelector} from "react-redux";
import {getTiposDevolucao, getListaDeSolicitacaoDeAcertos, postSolicitacoesParaAcertos, getTiposDeAcertoLancamentosAgrupadoCategoria} from "../../../../../../services/dres/PrestacaoDeContas.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {TabelaDetalharAcertos} from "./TabelaDetalharAcertos";
import {FormularioAcertos} from "./FormularioAcertos";
import {trataNumericos} from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../../utils/Loading";
// Hooks Personalizados
import useDataTemplate from "../../../../../../hooks/Globais/useDataTemplate";
import {ProviderValidaParcial} from "../../../../../../context/DetalharAcertos";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import moment from "moment/moment";

export const DetalharAcertos = () => {

    const {prestacao_conta_uuid} = useParams();
    const formRef = useRef();
    const {lancamentos_para_acertos} = useSelector(state => state.DetalharAcertos)
    const valorDocumento = lancamentos_para_acertos[0]?.valor_transacao_total ?? 0;
    const history = useHistory();

    // Hooks Personalizados
    const dataTemplate = useDataTemplate()
    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacao_conta_uuid)

    const [listaTiposDeAcertoLancamentosAgrupado, setListaTiposDeAcertoLancamentosAgrupado] = useState([])
    const [textoCategoria, setTextoCategoria] = useState([])
    const [corTextoCategoria, setCorTextoCategoria] = useState([])
    const [acertos, setInitialAcertos] = useState({});
    const [exibeCamposCategoriaDevolucao, setExibeCamposCategoriaDevolucao] = useState({})
    const [tiposDevolucao, setTiposDevolucao] = useState([])
    const [bloqueiaSelectTipoDeAcerto, setBloqueiaSelectTipoDeAcerto] = useState([])
    const [loading, setLoading] = useState(true)

    const totalDelancamentosParaConferencia = useMemo(() => lancamentos_para_acertos.length, [lancamentos_para_acertos]);

    const verificaSeTemLancamentosDoTipoGasto = useCallback(() => {
        let tem_gasto
        if (lancamentos_para_acertos) {
            tem_gasto = lancamentos_para_acertos.find(elemento => elemento.tipo_transacao === 'Gasto')
        }
        return tem_gasto
    }, [lancamentos_para_acertos])

    useEffect(() => {

        let mounted = true;

        const carregaTiposDeAcertoLancamentos = async () => {
            if (mounted){
                setLoading(true)
                let tipos_de_acerto_lancamentos_agrupado = await getTiposDeAcertoLancamentosAgrupadoCategoria()
                tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.agrupado_por_categorias
                
                let tem_gasto = verificaSeTemLancamentosDoTipoGasto()
                if (!tem_gasto) {
                    tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.filter(elemento => elemento.id !== 'DEVOLUCAO')
                }

                setListaTiposDeAcertoLancamentosAgrupado(tipos_de_acerto_lancamentos_agrupado)
                setLoading(false)
            }
        }
        carregaTiposDeAcertoLancamentos()

        return () =>{
            mounted = false;
        }

    }, [verificaSeTemLancamentosDoTipoGasto])

    useEffect(() => {
        let mounted = true;
        const carregaTiposDevolucao = async () => {
            const resp = await getTiposDevolucao();
            if (mounted){
                setLoading(true)
                setTiposDevolucao(resp);
                setLoading(false)
            }
        };
        carregaTiposDevolucao();

        return () =>{
            mounted = false;
        }
    }, []);

    const addBloqueiaSelectTipoDeAcertoJaCadastrado = (acertos) => {
        setLoading(true)
        acertos.solicitacoes_de_ajuste_da_analise.map((acerto, index_array_acertos) =>
            setBloqueiaSelectTipoDeAcerto(prevState => [...prevState, {[index_array_acertos]: true}])
        )
        setLoading(false)
    }

    const addTextoECorCategoriaTipoDeAcertoJaCadastrado = (acertos, tipos_de_acerto_lancamentos_agrupado) => {
        tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.agrupado_por_categorias
    
        acertos.solicitacoes_de_ajuste_da_analise.map((acerto, index_array_acertos)=>{
            let id_categoria = acerto.tipo_acerto.categoria;
            let info_categoria = tipos_de_acerto_lancamentos_agrupado.find(element => element.id === id_categoria);
            if(info_categoria){
                let classe = info_categoria.cor === 1 ? 'texto-categoria-verde' : 'texto-categoria-vermelho';
                setTextoCategoria(prevState => [...prevState, [index_array_acertos] = info_categoria.texto]);
                setCorTextoCategoria(prevState => [...prevState, [index_array_acertos] = classe]);       
            }
            else{
                setTextoCategoria(prevState => [...prevState, [index_array_acertos] = ""]);
                setCorTextoCategoria(prevState => [...prevState, [index_array_acertos] = ""]);
            }
        })
    }

    const removeBloqueiaSelectTipoDeAcertoJaCadastrado = (index_array_acertos) => {
        setBloqueiaSelectTipoDeAcerto(prevState => prevState.filter((acerto, i) => i !== index_array_acertos));
    }

    const removeTextoECorCategoriaTipoDeAcertoJaCadastrado = (index_array_acertos) => {
        setTextoCategoria(prevState => prevState.filter((acerto, i) => i !== index_array_acertos));
        setCorTextoCategoria(prevState => prevState.filter((acerto, i) => i !== index_array_acertos));
    }

    useEffect(() => {
        let mounted = true;

        const carregaListaDeSolicicacaoDeAcertos = async () => {

            if (mounted){
                setLoading(true)
                if (totalDelancamentosParaConferencia === 1 && prestacao_conta_uuid) {
                    let analise_lancamento_uuid = lancamentos_para_acertos[0] && lancamentos_para_acertos[0].analise_lancamento && lancamentos_para_acertos[0].analise_lancamento.uuid ? lancamentos_para_acertos[0].analise_lancamento.uuid : null
                    if (analise_lancamento_uuid) {
                        let acertos = await getListaDeSolicitacaoDeAcertos(prestacao_conta_uuid, analise_lancamento_uuid)
                        let tipos_de_acerto_lancamentos_agrupado = await getTiposDeAcertoLancamentosAgrupadoCategoria();
                        let _acertos = []
                        if (acertos && acertos.solicitacoes_de_ajuste_da_analise && acertos.solicitacoes_de_ajuste_da_analise.length > 0) {
                            acertos.solicitacoes_de_ajuste_da_analise.map((acerto) =>
                                _acertos.push({
                                    uuid: acerto.uuid,
                                    copiado: acerto.copiado,
                                    tipo_acerto: acerto.tipo_acerto.uuid,
                                    detalhamento: acerto.detalhamento,
                                    devolucao_tesouro: acerto.devolucao_ao_tesouro && acerto.devolucao_ao_tesouro.uuid ? {
                                        uuid: acerto.devolucao_ao_tesouro.uuid,
                                        tipo: acerto.devolucao_ao_tesouro.tipo && acerto.devolucao_ao_tesouro.tipo.uuid ? acerto.devolucao_ao_tesouro.tipo.uuid : acerto.devolucao_ao_tesouro.tipo,
                                        data: acerto && acerto.devolucao_ao_tesouro && acerto.devolucao_ao_tesouro.data ? acerto.devolucao_ao_tesouro.data : "",
                                        devolucao_total: acerto.devolucao_ao_tesouro.devolucao_total,
                                        valor: acerto.devolucao_ao_tesouro.valor ? Number(acerto.devolucao_ao_tesouro.valor).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }) : ""
                                    } : {...acerto.devolucao_ao_tesouro}
                                })
                            )
                            addTextoECorCategoriaTipoDeAcertoJaCadastrado(acertos, tipos_de_acerto_lancamentos_agrupado)
                            addBloqueiaSelectTipoDeAcertoJaCadastrado(acertos)
                            
                        }
                        setInitialAcertos({solicitacoes_acerto: [..._acertos]})
                    }
                }
                setLoading(false)
            }
        }

        carregaListaDeSolicicacaoDeAcertos()

        return () =>{
            mounted = false;
        }

    }, [lancamentos_para_acertos, prestacao_conta_uuid, totalDelancamentosParaConferencia])

    const onClickBtnVoltar = () => {
        history.push(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#conferencia_de_lancamentos`)
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
            let classe = info_categoria.cor === 1 ? 'texto-categoria-verde' : 'texto-categoria-vermelho';
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

    const handleChangeTipoDeAcertoLancamento = (e, index) => {
        let id_categoria = e.target.options[e.target.selectedIndex].getAttribute('data-categoria')
        let info_categoria = listaTiposDeAcertoLancamentosAgrupado.find(element => element.id === id_categoria)
        let data_objeto = JSON.parse(e.target.options[e.target.selectedIndex].getAttribute('data-objeto'));

        changeTextoECorCategoria(info_categoria, index);

        if (data_objeto && data_objeto.uuid) {
            if (data_objeto && data_objeto.categoria === 'DEVOLUCAO') {
                setExibeCamposCategoriaDevolucao({
                    ...exibeCamposCategoriaDevolucao,
                    [data_objeto.uuid]: true
                })
            } else {
                setExibeCamposCategoriaDevolucao({
                    ...exibeCamposCategoriaDevolucao,
                    [data_objeto.uuid]: false
                })
            }
        }
    }

    const onSubmitFormAcertos = async () => {
        if (!formRef.current.errors.solicitacoes_acerto && formRef.current.values && formRef.current.values.solicitacoes_acerto) {

            let _lancamentos = []

            if (lancamentos_para_acertos && lancamentos_para_acertos.length > 0) {
                lancamentos_para_acertos.map((lancamento) =>
                    _lancamentos.push({
                        tipo_lancamento: lancamento.tipo_transacao === 'Gasto' ? 'GASTO' : 'CREDITO',
                        lancamento_uuid: lancamento.documento_mestre.uuid,

                    })
                )
            }
            let solicitacoes_acerto = {...formRef.current.values}
            let _solicitacoes_acerto = []

            if (solicitacoes_acerto.solicitacoes_acerto && solicitacoes_acerto.solicitacoes_acerto.length > 0) {
                solicitacoes_acerto.solicitacoes_acerto.map((solicitacao) =>
                    _solicitacoes_acerto.push({
                        uuid: solicitacao.uuid,
                        copiado: solicitacao.copiado,
                        tipo_acerto: solicitacao.tipo_acerto,
                        detalhamento: solicitacao.detalhamento,
                        devolucao_tesouro: solicitacao.devolucao_tesouro && solicitacao.devolucao_tesouro.tipo ? {
                            tipo: solicitacao.devolucao_tesouro.tipo && solicitacao.devolucao_tesouro.tipo.uuid ? solicitacao.devolucao_tesouro.tipo.uuid : solicitacao.devolucao_tesouro.tipo,
                            data: solicitacao.devolucao_tesouro.data ? dataTemplate(solicitacao.devolucao_tesouro.data) : null,
                            devolucao_total: !!(solicitacao.devolucao_tesouro.devolucao_total && solicitacao.devolucao_tesouro.devolucao_total === 'true'),
                            valor: solicitacao.devolucao_tesouro.valor ? trataNumericos(solicitacao.devolucao_tesouro.valor) : 0
                        } : null
                    })
                )
            }

            let payload = {
                analise_prestacao: prestacaoDeContas.analise_atual.uuid,
                lancamentos: [..._lancamentos],
                solicitacoes_acerto: [..._solicitacoes_acerto]
            }

            try {
                await postSolicitacoesParaAcertos(prestacao_conta_uuid, payload)
                console.log("Solicitações para acertos criadas com sucesso!")
                onClickBtnVoltar()
            } catch (e) {
                console.log("Erro ao criar solicitações para acertos! ", e.response)
            }
        }
    }

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_lancamento && rowData.analise_lancamento.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const ehSolicitacaoCopiada = (acerto) => {
        if(acerto.copiado){
            return true;
        }
        
        return false;
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                {lancamentos_para_acertos && lancamentos_para_acertos.length <= 0 &&
                    onClickBtnVoltar()
                }
                <ProviderValidaParcial>
                <>
                <TopoComBotoes
                    onSubmitFormAcertos={onSubmitFormAcertos}
                    onClickBtnVoltar={onClickBtnVoltar}
                />
                <TabelaDetalharAcertos
                    lancamemtosParaAcertos={lancamentos_para_acertos}
                    prestacaoDeContas={prestacaoDeContas}
                    rowClassName={rowClassName}
                />
                </>
                {loading ? (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) :
                    <>
                        <FormularioAcertos
                            solicitacoes_acerto={acertos}
                            listaTiposDeAcertoLancamentosAgrupado={listaTiposDeAcertoLancamentosAgrupado}
                            onSubmitFormAcertos={onSubmitFormAcertos}
                            formRef={formRef}
                            handleChangeTipoDeAcertoLancamento={handleChangeTipoDeAcertoLancamento}
                            exibeCamposCategoriaDevolucao={exibeCamposCategoriaDevolucao}
                            tiposDevolucao={tiposDevolucao}
                            setBloqueiaSelectTipoDeAcerto={setBloqueiaSelectTipoDeAcerto}
                            bloqueiaSelectTipoDeAcerto={bloqueiaSelectTipoDeAcerto}
                            removeBloqueiaSelectTipoDeAcertoJaCadastrado={removeBloqueiaSelectTipoDeAcertoJaCadastrado}
                            textoCategoria={textoCategoria}
                            corTextoCategoria={corTextoCategoria}
                            removeTextoECorCategoriaTipoDeAcertoJaCadastrado={removeTextoECorCategoriaTipoDeAcertoJaCadastrado}
                            adicionaTextoECorCategoriaVazio={adicionaTextoECorCategoriaVazio}
                            ehSolicitacaoCopiada={ehSolicitacaoCopiada}
                            valorDocumento={valorDocumento}
                            lancamentosParaAcertos={lancamentos_para_acertos}
                        />
                    </>
                }
                </ProviderValidaParcial>
            </div>
        </PaginasContainer>
    )
}