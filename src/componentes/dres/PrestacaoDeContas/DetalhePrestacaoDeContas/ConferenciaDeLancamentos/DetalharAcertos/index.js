import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getPrestacaoDeContasDetalhe, getTiposDeAcertoLancamentos, getTiposDevolucao, getListaDeSolicitacaoDeAcertos, postSolicitacoesParaAcertos} from "../../../../../../services/dres/PrestacaoDeContas.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {TabelaDetalharAcertos} from "./TabelaDetalharAcertos";
import {FormularioAcertos} from "./FormularioAcertos";
import {trataNumericos} from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../../utils/Loading";
// Hooks Personalizados
import useDataTemplate from "../../../../../../hooks/Globais/useDataTemplate";

export const DetalharAcertos = () => {

    const {prestacao_conta_uuid} = useParams();
    const formRef = useRef();
    const {lancamentos_para_acertos} = useSelector(state => state.DetalharAcertos)
    const history = useHistory();
    const dataTemplate = useDataTemplate()

    const [prestacaoDeContas, setPrestacaoDeContas] = useState({})
    const [listaTiposDeAcertoLancamentos, setListaTiposDeAcertoLancamentos] = useState([])
    const [acertos, setInitialAcertos] = useState({});
    const [exibeCamposCategoriaDevolucao, setExibeCamposCategoriaDevolucao] = useState({})
    const [tiposDevolucao, setTiposDevolucao] = useState([])
    const [bloqueiaSelectTipoDeAcerto, setBloqueiaSelectTipoDeAcerto] = useState([])
    const [loading, setLoading] = useState(true)

    const totalDelancamentosParaConferencia = useMemo(() => lancamentos_para_acertos.length, [lancamentos_para_acertos]);

    const carregaPrestacaoDeContasPorUuid = useCallback(async () => {
        setLoading(true)
        let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
        setPrestacaoDeContas(prestacao)
        setLoading(false)
    }, [prestacao_conta_uuid])

    useEffect(() => {
        carregaPrestacaoDeContasPorUuid()
    }, [carregaPrestacaoDeContasPorUuid])

    const verificaSeTemLancamentosDoTipoGasto = useCallback(() => {
        let tem_gasto
        if (lancamentos_para_acertos) {
            tem_gasto = lancamentos_para_acertos.find(elemento => elemento.tipo_transacao === 'Gasto')
        }
        return tem_gasto
    }, [lancamentos_para_acertos])

    const carregaTiposDeAcertoLancamentos = useCallback(async () => {
        setLoading(true)
        let tipos_de_acerto_lancamentos = await getTiposDeAcertoLancamentos()
        let tem_gasto = verificaSeTemLancamentosDoTipoGasto()
        if (!tem_gasto) {
            tipos_de_acerto_lancamentos = tipos_de_acerto_lancamentos.filter(elemento => elemento.categoria !== 'DEVOLUCAO')
        }
        setListaTiposDeAcertoLancamentos(tipos_de_acerto_lancamentos)
        setLoading(false)
    }, [verificaSeTemLancamentosDoTipoGasto])

    useEffect(() => {
        carregaTiposDeAcertoLancamentos()
    }, [carregaTiposDeAcertoLancamentos])

    useEffect(() => {
        const carregaTiposDevolucao = async () => {
            setLoading(true)
            const resp = await getTiposDevolucao();
            setTiposDevolucao(resp);
            setLoading(false)
        };
        carregaTiposDevolucao();
    }, []);

    const addBloqueiaSelectTipoDeAcertoJaCadastrado = (acertos) => {
        setLoading(true)
        acertos.solicitacoes_de_ajuste_da_analise.map((acerto, index_array_acertos) =>
            setBloqueiaSelectTipoDeAcerto(prevState => [...prevState, {[index_array_acertos]: true}])
        )
        setLoading(false)
    }

    const removeBloqueiaSelectTipoDeAcertoJaCadastrado = (index_array_acertos) => {
        setBloqueiaSelectTipoDeAcerto(prevState => prevState.filter((acerto, i) => i !== index_array_acertos));
    }

    const carregaListaDeSolicicacaoDeAcertos = useCallback(async () => {
        setLoading(true)
        if (totalDelancamentosParaConferencia === 1 && prestacao_conta_uuid) {
            let analise_lancamento_uuid = lancamentos_para_acertos[0] && lancamentos_para_acertos[0].analise_lancamento && lancamentos_para_acertos[0].analise_lancamento.uuid ? lancamentos_para_acertos[0].analise_lancamento.uuid : null
            if (analise_lancamento_uuid) {
                let acertos = await getListaDeSolicitacaoDeAcertos(prestacao_conta_uuid, analise_lancamento_uuid)

                let _acertos = []
                if (acertos && acertos.solicitacoes_de_ajuste_da_analise && acertos.solicitacoes_de_ajuste_da_analise.length > 0) {
                    acertos.solicitacoes_de_ajuste_da_analise.map((acerto) =>
                        _acertos.push({
                            tipo_acerto: acerto.tipo_acerto.uuid,
                            detalhamento: acerto.detalhamento,
                            devolucao_tesouro: acerto.devolucao_ao_tesouro && acerto.devolucao_ao_tesouro.uuid ? {
                                uuid: acerto.devolucao_ao_tesouro.uuid,
                                tipo: acerto.devolucao_ao_tesouro.tipo && acerto.devolucao_ao_tesouro.tipo.uuid ? acerto.devolucao_ao_tesouro.tipo.uuid : acerto.devolucao_ao_tesouro.tipo,
                                data: acerto.devolucao_ao_tesouro.data ? dataTemplate(acerto.devolucao_ao_tesouro.data) : null,
                                devolucao_total: acerto.devolucao_ao_tesouro.devolucao_total,
                                valor: acerto.devolucao_ao_tesouro.valor ? Number(acerto.devolucao_ao_tesouro.valor).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }) : ""
                            } : {...acerto.devolucao_ao_tesouro}
                        })
                    )
                    addBloqueiaSelectTipoDeAcertoJaCadastrado(acertos)
                }
                setInitialAcertos({solicitacoes_acerto: [..._acertos]})
            }
        }
        setLoading(false)
    }, [totalDelancamentosParaConferencia, prestacao_conta_uuid, lancamentos_para_acertos])

    useEffect(() => {
        carregaListaDeSolicicacaoDeAcertos()
    }, [carregaListaDeSolicicacaoDeAcertos])

    const onClickBtnVoltar = () => {
        history.push(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#conferencia_de_lancamentos`)
    }

    const handleChangeTipoDeAcertoLancamento = (e) => {
        let data_objeto = JSON.parse(e.target.options[e.target.selectedIndex].getAttribute('data-objeto'));

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

        if (!formRef.current.errors.solicitacoes_acerto) {

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

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                {lancamentos_para_acertos && lancamentos_para_acertos.length <= 0 &&
                    onClickBtnVoltar()
                }
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
                            listaTiposDeAcertoLancamentos={listaTiposDeAcertoLancamentos}
                            onSubmitFormAcertos={onSubmitFormAcertos}
                            formRef={formRef}
                            handleChangeTipoDeAcertoLancamento={handleChangeTipoDeAcertoLancamento}
                            exibeCamposCategoriaDevolucao={exibeCamposCategoriaDevolucao}
                            tiposDevolucao={tiposDevolucao}
                            setBloqueiaSelectTipoDeAcerto={setBloqueiaSelectTipoDeAcerto}
                            bloqueiaSelectTipoDeAcerto={bloqueiaSelectTipoDeAcerto}
                            removeBloqueiaSelectTipoDeAcertoJaCadastrado={removeBloqueiaSelectTipoDeAcertoJaCadastrado}
                        />
                    </>
                }
            </div>
        </PaginasContainer>
    )
}