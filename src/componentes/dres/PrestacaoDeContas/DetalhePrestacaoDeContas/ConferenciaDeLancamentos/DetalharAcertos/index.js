import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {useSelector} from "react-redux";
import {getTiposDevolucao, getListaDeSolicitacaoDeAcertos, postSolicitacoesParaAcertos, getTiposDeAcertoLancamentosAgrupadoCategoria, getContasComMovimentoNaPc} from "../../../../../../services/dres/PrestacaoDeContas.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {TabelaDetalharAcertos} from "./TabelaDetalharAcertos";
import {FormularioAcertos} from "./FormularioAcertos";
import {trataNumericos} from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../../utils/Loading";
// Hooks Personalizados
import useDataTemplate from "../../../../../../hooks/Globais/useDataTemplate";
import {ProviderValidaParcial} from "../../../../../../context/DetalharAcertos";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import { ModalAntDesignConfirmacao } from "../../../../../Globais/ModalAntDesign";

export const DetalharAcertos = () => {

    const {prestacao_conta_uuid} = useParams();
    const formRef = useRef();
    const { lancamentos_para_acertos, origem } = useSelector(state => state.DetalharAcertos)
    const navigate = useNavigate();
    const { state } = useLocation();
    const aplicavelDespesasPeriodosAnteriores = state?.aplicavel_despesas_periodos_anteriores;
    const valorDocumento = lancamentos_para_acertos[0]?.valor_transacao_total ?? 0;

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
    const [showModalContaEncerrada, setShowModalContaEncerrada] = useState(false)

    const totalDelancamentosParaConferencia = useMemo(() => lancamentos_para_acertos.length, [lancamentos_para_acertos]);

    const verificaSeTemLancamentosDoTipoGasto = useCallback(() => {
        let tem_gasto, tem_gasto_conferido, tem_gasto_nao_conferido
        if (lancamentos_para_acertos) {
            tem_gasto_conferido = lancamentos_para_acertos.find(elemento => elemento.tipo_transacao === 'Gasto' && elemento.documento_mestre.conferido === true) !== undefined;
            tem_gasto_nao_conferido = lancamentos_para_acertos.find(elemento => elemento.tipo_transacao === 'Gasto' && elemento.documento_mestre.conferido === false) !== undefined;
            tem_gasto = tem_gasto_conferido || tem_gasto_nao_conferido
        }
        return [tem_gasto, tem_gasto_conferido, tem_gasto_nao_conferido]
    }, [lancamentos_para_acertos])

    useEffect(()=>{
        verificaSeTemLancamentosDoTipoGasto()
    }, [verificaSeTemLancamentosDoTipoGasto])

    const verificaSeEhRepasse = useCallback(() => {
        if (lancamentos_para_acertos) {

            // Lancamentos do tipo repasse não podem ser selecionados em lote
            let lancamento = lancamentos_para_acertos[0]
            if (lancamento){
                return lancamento.is_repasse;
            }
            
        }
        return false;
    }, [lancamentos_para_acertos])

    useEffect(()=>{
        verificaSeEhRepasse()
    }, [verificaSeEhRepasse])

    useEffect(() => {

        let mounted = true;

        const carregaTiposDeAcertoLancamentos = async () => {
            if (!mounted) {
                return;
            }

            const categoriasQueSoAceitamGatos = [
                'DEVOLUCAO',
                'CONCILIACAO_LANCAMENTO',
                'DESCONCILIACAO_LANCAMENTO'
            ];

            const categoriasQueSoAceitamConferidos= [
                'DESCONCILIACAO_LANCAMENTO'
            ];

            const categoriasQueSoAceitamNaoConferidos = [
                'CONCILIACAO_LANCAMENTO'
            ];

            setLoading(true)

            let is_repasse = verificaSeEhRepasse()
            let tipos_de_acerto_lancamentos_agrupado = await getTiposDeAcertoLancamentosAgrupadoCategoria(aplicavelDespesasPeriodosAnteriores, is_repasse);
            tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.agrupado_por_categorias

            let [tem_gasto, tem_gasto_conferido, tem_gasto_nao_conferido] = verificaSeTemLancamentosDoTipoGasto()
            if (!tem_gasto) {
                tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.filter(elemento => !categoriasQueSoAceitamGatos.includes(elemento.id))
            }

            // TODO comentado pois no FormularioAcertos não setava o item correto no select
            if (tem_gasto && !tem_gasto_conferido) {
                tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.filter(elemento => !categoriasQueSoAceitamConferidos.includes(elemento.id))
            }

            if (tem_gasto && !tem_gasto_nao_conferido) {
                tipos_de_acerto_lancamentos_agrupado = tipos_de_acerto_lancamentos_agrupado.filter(elemento => !categoriasQueSoAceitamNaoConferidos.includes(elemento.id))
            }

            setListaTiposDeAcertoLancamentosAgrupado(tipos_de_acerto_lancamentos_agrupado)
            setLoading(false)

        }

        carregaTiposDeAcertoLancamentos()

        return () =>{
            mounted = false;
        }

    }, [verificaSeTemLancamentosDoTipoGasto, verificaSeEhRepasse])

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
                        let is_repasse = verificaSeEhRepasse()
                        let tipos_de_acerto_lancamentos_agrupado = await getTiposDeAcertoLancamentosAgrupadoCategoria(null, is_repasse);
                        let _acertos = []
                        if (acertos && acertos.solicitacoes_de_ajuste_da_analise && acertos.solicitacoes_de_ajuste_da_analise.length > 0) {
                            acertos.solicitacoes_de_ajuste_da_analise.map((acerto) =>
                                _acertos.push({
                                    uuid: acerto.uuid,
                                    copiado: acerto.copiado,
                                    tipo_acerto: acerto.tipo_acerto.uuid,
                                    detalhamento: acerto.detalhamento,
                                    categoria: acerto.tipo_acerto.categoria,
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

    }, [lancamentos_para_acertos, prestacao_conta_uuid, totalDelancamentosParaConferencia, verificaSeEhRepasse])

    const onClickBtnVoltar = () => {
        if(origem && origem === "dre-detalhe-prestacao-de-contas-resumo-acertos"){
            navigate(`/dre-detalhe-prestacao-de-contas-resumo-acertos/${prestacao_conta_uuid}#tabela-acertos-lancamentos`)
        }
        else{
            navigate(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#conferencia_de_lancamentos`)
        }
        
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

    const validaContaAoSalvar = async() => {
        if (!formRef.current.errors.solicitacoes_acerto && formRef.current.values && formRef.current.values.solicitacoes_acerto) {
            let {solicitacoes_acerto} = formRef.current.values
            let conta_encerrada = await contaEncerrada();

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
    }

    const contaEncerrada = async() => {
        let conta_associacao_dos_lancamentos = null;

        if(lancamentos_para_acertos && lancamentos_para_acertos.length > 0){
            for(let i=0; i<=lancamentos_para_acertos.length-1; i++){
                conta_associacao_dos_lancamentos = lancamentos_para_acertos[i].conta;
                break
            }
        }

        let contas_com_movimento = await getContasComMovimentoNaPc(prestacaoDeContas.uuid)
        let conta_encontrada = contas_com_movimento.find(elemento => elemento.uuid === conta_associacao_dos_lancamentos)
        if (conta_encontrada) {
            return conta_encontrada.status === "INATIVA" ? true : false;
        } else {
            return null;
        }
    }

    const possuiAcertosQuePodemAlterarSaldo = (solicitacoes_acerto) => {
        const categoriasQuePodemAlterarSaldoDaConta = [
            'DEVOLUCAO',
            'EDICAO_LANCAMENTO',
            'CONCILIACAO_LANCAMENTO',
            'DESCONCILIACAO_LANCAMENTO',
            'EXCLUSAO_LANCAMENTO'
        ];

        let possui_acerto_que_altera_saldo = false;

        for(let index_solicitacao_acerto=0; index_solicitacao_acerto <= solicitacoes_acerto.length-1; index_solicitacao_acerto ++){
            let tipo_acerto_uuid = solicitacoes_acerto[index_solicitacao_acerto].tipo_acerto
            let categoria = retornaCategoriaTipoAcerto(tipo_acerto_uuid);

            if(categoriasQuePodemAlterarSaldoDaConta.includes(categoria.id)){
                possui_acerto_que_altera_saldo = true;
                break;
            }
        }

        return possui_acerto_que_altera_saldo;
    }

    const retornaCategoriaTipoAcerto = (tipo_acerto_uuid) => {
        let categoria_encontrada = null;

        for(let index_categoria=0; index_categoria <= listaTiposDeAcertoLancamentosAgrupado.length -1; index_categoria ++){
            let categoria = listaTiposDeAcertoLancamentosAgrupado[index_categoria]
            
            let tipo_acerto = categoria.tipos_acerto_lancamento.find(elemento => elemento.uuid === tipo_acerto_uuid);
            if(tipo_acerto){
                categoria_encontrada = categoria;
                break
            }
        }

        return categoria_encontrada;
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
                setShowModalContaEncerrada(false);
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
                    validaContaAoSalvar={validaContaAoSalvar}
                    onClickBtnVoltar={onClickBtnVoltar}
                    prestacaoDeContas={prestacaoDeContas}
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
                            setListaTiposDeAcertoLancamentosAgrupado={setListaTiposDeAcertoLancamentosAgrupado}
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
                            validaContaAoSalvar={validaContaAoSalvar}
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
                    </>
                }
                </ProviderValidaParcial>
            </div>
        </PaginasContainer>
    )
}