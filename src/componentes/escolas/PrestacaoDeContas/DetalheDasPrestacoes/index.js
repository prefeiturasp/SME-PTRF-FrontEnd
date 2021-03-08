import React, {useCallback, useEffect, useState} from "react";
import {TopoComBotoes} from "./TopoComBotoes";
import TabelaValoresPendentesPorAcao from "./TabelaValoresPendentesPorAcao";
import {Justificativa} from "./Justivicativa";
import {getTabelasReceita} from "../../../../services/escolas/Receitas.service";
import {
    getConciliar,
    getDesconciliar,
    getSalvarPrestacaoDeConta,
    getObservacoes,
    getStatusPeriodoPorData,
    getTransacoes,
    getTransacoesFiltros,
    patchConciliarTransacao,
    patchDesconciliarTransacao,
} from "../../../../services/escolas/PrestacaoDeContas.service";
import {getContas, getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import {SelectPeriodoConta} from "../SelectPeriodoConta";
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import {ModalConfirmaSalvar} from "../../../../utils/Modais";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {tabelaValoresPendentes} from "../../../../services/escolas/TabelaValoresPendentesPorAcao.service";
import DataSaldoBancario from "./DataSaldoBancario";
import moment from "moment";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import TabelaTransacoes from "./TabelaTransacoes";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";
import {FiltrosTransacoes} from "./FiltrosTransacoes";

export const DetalheDasPrestacoes = () => {

    // Alteracoes
    const [loading, setLoading] = useState(true);
    const [showSalvar, setShowSalvar] = useState(false);
    const [periodoConta, setPeriodoConta] = useState("");
    const [periodoFechado, setPeriodoFechado] = useState(true);
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [contaConciliacao, setContaConciliacao] = useState("");
    const [acaoLancamento, setAcaoLancamento] = useState("");
    const [acoesAssociacao, setAcoesAssociacao] = useState(false);

    const [textareaJustificativa, setTextareaJustificativa] = useState("");

    useEffect(()=>{
        getPeriodoConta();
        getAcaoLancamento();
        carregaTabelas();
        carregaPeriodos();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify(periodoConta));
        carregaContas();
    }, [periodoConta]);

    useEffect(()=>{
        carregaObservacoes();
    }, [periodoConta, acoesAssociacao, acaoLancamento]);

    useEffect(()=>{
        setLoading(false)
    }, []);

    useEffect(() => {
            verificaSePeriodoEstaAberto(periodoConta.periodo)
        }, [periodoConta, periodosAssociacao]
    );

    const getPeriodoConta = () => {
        if (localStorage.getItem('periodoConta')) {
            const periodoConta = JSON.parse(localStorage.getItem('periodoConta'));
            setPeriodoConta(periodoConta)
        } else {
            setPeriodoConta({periodo: "", conta: ""})
        }
    };

    const getAcaoLancamento = () => {
        let acao_lancamento = JSON.parse(localStorage.getItem('acaoLancamento'));
        if (acao_lancamento) {
            const files = JSON.parse(localStorage.getItem('acaoLancamento'));
            setAcaoLancamento(files);
        } else {
            setAcaoLancamento({acao: "", lancamento: ""})
        }
    };

    const carregaTabelas = async () => {
        await getTabelasReceita().then(response => {
            setContasAssociacao(response.data.contas_associacao);
            setAcoesAssociacao(response.data.acoes_associacao);
        }).catch(error => {
            console.log(error);
        });
    };

    const carregaPeriodos = async () => {
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
        setPeriodosAssociacao(periodos);
    };

    const carregaContas = async () => {
        await getContas().then(response => {
            const files = JSON.parse(localStorage.getItem('periodoConta'));
            if (files && files.conta !== "") {
                const conta = response.find(conta => conta.uuid === files.conta);
                setContaConciliacao(conta.tipo_conta.nome);
            }
        }).catch(error => {
            console.log(error);
        })
    };

    const conciliar = useCallback(async (rateio_uuid) => {
        await getConciliar(rateio_uuid, periodoConta.periodo);
    }, [periodoConta.periodo]) ;

    const desconciliar = useCallback(async (rateio_uuid) => {
        await getDesconciliar(rateio_uuid, periodoConta.periodo);
    }, [periodoConta.periodo]) ;


    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    };

    const handleChangeTextareaJustificativa = (event) => {
        setTextareaJustificativa(event.target.value);
    };

    const carregaObservacoes = async () => {

        if (periodoConta.periodo && periodoConta.conta) {
            let periodo_uuid = periodoConta.periodo;
            let conta_uuid = periodoConta.conta;

            let observacao = await getObservacoes(periodo_uuid, conta_uuid);

            setTextareaJustificativa(observacao.observacao ? observacao.observacao : '');
            setDataSaldoBancario({
                data_extrato: observacao.data_extrato ? observacao.data_extrato : '',
                saldo_extrato: observacao.saldo_extrato ? observacao.saldo_extrato : '',
            })

        }
    };

    const onSalvarTrue = async () => {

        let payload = {
            "periodo_uuid": periodoConta.periodo,
            "conta_associacao_uuid": periodoConta.conta,
            "observacao": textareaJustificativa,
            "data_extrato": dataSaldoBancario.data_extrato ? moment(dataSaldoBancario.data_extrato, "YYYY-MM-DD").format("YYYY-MM-DD"): null,
            "saldo_extrato": dataSaldoBancario.saldo_extrato ? trataNumericos(dataSaldoBancario.saldo_extrato) : 0,
        };
        try {
            await getSalvarPrestacaoDeConta(periodoConta.periodo, periodoConta.conta, payload);
            setShowSalvar(true);
            await carregaObservacoes();
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    };

    const onHandleClose = () => {
        setShowSalvar(false);
    };

    const verificaSePeriodoEstaAberto = async (periodoUuid) => {
        if (periodosAssociacao) {
            const periodo = periodosAssociacao.find(o => o.uuid === periodoUuid);
            if (periodo) {
                const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)
                await getStatusPeriodoPorData(associacaoUuid, periodo.data_inicio_realizacao_despesas).then(response => {
                    const periodoBloqueado = response.prestacao_contas_status ? response.prestacao_contas_status.periodo_bloqueado : true
                    setPeriodoFechado(periodoBloqueado)
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };

    // Tabela ValoresPendentes por Ação
    const [valoresPendentes, setValoresPendentes] = useState({});

    const carregaValoresPendentes = useCallback(async ()=>{
        let valores_pendentes = await tabelaValoresPendentes(periodoConta.periodo, periodoConta.conta);
        setValoresPendentes(valores_pendentes)
    }, [periodoConta.periodo, periodoConta.conta]);

    useEffect(()=>{
        if (periodoConta.periodo && periodoConta.conta){
            carregaValoresPendentes()
        }

    }, [periodoConta.periodo, periodoConta.conta, carregaValoresPendentes]);

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    // Data Saldo Bancário
    const [dataSaldoBancario, setDataSaldoBancario]= useState({});

    const handleChangaDataSaldo = useCallback((name, value) => {
        setDataSaldoBancario({
            ...dataSaldoBancario,
            [name]: value
        });
    }, [dataSaldoBancario]);

    // Transacoes Conciliadas e Não Conciliadas
    const [transacoesConciliadas, setTransacoesConciliadas] = useState([]);
    const [transacoesNaoConciliadas, setTransacoesNaoConciliadas] = useState([]);
    const [checkboxTransacoes, setCheckboxTransacoes] = useState(false);
    const [tabelasDespesa, setTabelasDespesa] = useState([]);
    const [tabelasReceita, setTabelasReceita] = useState([]);

    const carregaTransacoes = useCallback(async ()=>{
        setLoading(true)
        if (periodoConta.periodo && periodoConta.conta){
            let transacoes_conciliadas = await getTransacoes(periodoConta.periodo, periodoConta.conta, 'True');
            setTransacoesConciliadas(transacoes_conciliadas);
            let transacoes_nao_conciliadas = await getTransacoes(periodoConta.periodo, periodoConta.conta, 'False');
            setTransacoesNaoConciliadas(transacoes_nao_conciliadas);
        }
        setLoading(false)
    }, [periodoConta]);

    useEffect(()=>{
        carregaTransacoes();
    }, [carregaTransacoes]);

    useEffect(() => {
        const carregaTabelasDespesa = async () => {
            const resp = await getDespesasTabelas();
            setTabelasDespesa(resp);
        };
        carregaTabelasDespesa();
    }, []);

    useEffect(() => {
        const carregaTabelasReceita = async () => {
            getTabelasReceita().then(response => {
                setTabelasReceita(response.data);
            }).catch(error => {
                console.log(error);
            });
        };
        carregaTabelasReceita()
    }, []);

    const handleChangeCheckboxTransacoes = useCallback(async (event, transacao_ou_rateio_uuid, documento_mestre=null, tipo_transacao) => {

        setCheckboxTransacoes(event.target.checked);
        if (event.target.checked) {
            if (!documento_mestre){
                await conciliar(transacao_ou_rateio_uuid);
            }else {
                if (tipo_transacao==='Crédito'){
                    await patchConciliarTransacao(periodoConta.periodo, periodoConta.conta, transacao_ou_rateio_uuid, 'CREDITO')
                }else {
                    await patchConciliarTransacao(periodoConta.periodo, periodoConta.conta, transacao_ou_rateio_uuid, 'GASTO')
                }
            }
        } else if (!event.target.checked) {
            if (!documento_mestre){
                await desconciliar(transacao_ou_rateio_uuid)
            }else {
                if (tipo_transacao==='Crédito'){
                    await patchDesconciliarTransacao(periodoConta.conta, transacao_ou_rateio_uuid, 'CREDITO')
                }else {
                    await patchDesconciliarTransacao(periodoConta.conta, transacao_ou_rateio_uuid, 'GASTO')
                }
            }
        }
        await carregaTransacoes()

    }, [periodoConta, carregaTransacoes, conciliar, desconciliar]);

    // Filtros Transacoes
    const [stateFiltros, setStateFiltros] = useState({});

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = useCallback(async (conciliado) => {
        if (conciliado=== 'CONCILIADO'){
            try {
                let transacoes = await getTransacoesFiltros(periodoConta.periodo, periodoConta.conta, 'True', stateFiltros.filtrar_por_acao_CONCILIADO, stateFiltros.filtrar_por_lancamento_CONCILIADO);
                setTransacoesConciliadas(transacoes)
            }catch (e) {
                console.log("Erro ao filtrar conciliados")
            }
        }else {
            try {
                let transacoes = await getTransacoesFiltros(periodoConta.periodo, periodoConta.conta, 'False', stateFiltros.filtrar_por_acao_NAO_CONCILIADO, stateFiltros.filtrar_por_lancamento_NAO_CONCILIADO);
                setTransacoesNaoConciliadas(transacoes);
            }catch (e) {
                console.log("Erro ao filtrar não conciliados")
            }
        }
    }, [periodoConta, stateFiltros]);

    const limpaFiltros = async (conciliado) => {
        setLoading(true);
        setStateFiltros({});
        await carregaTransacoes();
        setLoading(false);
    };

    return (
        <div className="detalhe-das-prestacoes-container mb-5 mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="detalhe-das-prestacoes-texto-cabecalho mb-4">
                        <h1 className="mt-4">Conciliação Bancária</h1>
                    </div>
                </div>
            </div>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <SelectPeriodoConta
                        periodoConta={periodoConta}
                        handleChangePeriodoConta={handleChangePeriodoConta}
                        periodosAssociacao={periodosAssociacao}
                        contasAssociacao={contasAssociacao}
                    />

                    {periodoConta.periodo && periodoConta.conta ? (
                        <>
                            <TopoComBotoes
                                setShowSalvar={setShowSalvar}
                                showSalvar={!periodoFechado}
                                onSalvarTrue={onSalvarTrue}
                                onHandleClose={onHandleClose}
                                contaConciliacao={contaConciliacao}
                            />

                            <TabelaValoresPendentesPorAcao
                                valoresPendentes={valoresPendentes}
                                valorTemplate={valorTemplate}
                            />

                            <DataSaldoBancario
                                valoresPendentes={valoresPendentes}
                                dataSaldoBancario={dataSaldoBancario}
                                handleChangaDataSaldo={handleChangaDataSaldo}
                                periodoFechado={periodoFechado}
                            />

                            <p className="detalhe-das-prestacoes-titulo-lancamentos mt-3 mb-3">Lançamentos pendentes de conciliação</p>
                            <FiltrosTransacoes
                                conciliado='NAO_CONCILIADO'
                                stateFiltros={stateFiltros}
                                tabelasDespesa={tabelasDespesa}
                                handleChangeFiltros={handleChangeFiltros}
                                handleSubmitFiltros={handleSubmitFiltros}
                                limpaFiltros={limpaFiltros}
                            />
                            {transacoesNaoConciliadas && transacoesNaoConciliadas.length > 0 ?(
                                <TabelaTransacoes
                                    transacoes={transacoesNaoConciliadas}
                                    checkboxTransacoes={checkboxTransacoes}
                                    periodoFechado={periodoFechado}
                                    handleChangeCheckboxTransacoes={handleChangeCheckboxTransacoes}
                                    tabelasDespesa={tabelasDespesa}
                                    tabelasReceita={tabelasReceita}
                                />
                            ):
                                <p className="mt-2"><strong>Não existem lançamentos não conciliados...</strong></p>
                            }

                            <p className="detalhe-das-prestacoes-titulo-lancamentos mt-3 mb-3">Lançamentos conciliados</p>
                            <FiltrosTransacoes
                                conciliado='CONCILIADO'
                                stateFiltros={stateFiltros}
                                tabelasDespesa={tabelasDespesa}
                                handleChangeFiltros={handleChangeFiltros}
                                handleSubmitFiltros={handleSubmitFiltros}
                                limpaFiltros={limpaFiltros}
                            />

                            {transacoesConciliadas && transacoesConciliadas.length > 0 ?(
                                <TabelaTransacoes
                                    transacoes={transacoesConciliadas}
                                    checkboxTransacoes={checkboxTransacoes}
                                    periodoFechado={periodoFechado}
                                    handleChangeCheckboxTransacoes={handleChangeCheckboxTransacoes}
                                    tabelasDespesa={tabelasDespesa}
                                    tabelasReceita={tabelasReceita}
                                />
                            ):
                                <p className="mt-2"><strong>Não existem lançamentos conciliados...</strong></p>
                            }
                            <Justificativa
                                textareaJustificativa={textareaJustificativa}
                                handleChangeTextareaJustificativa={handleChangeTextareaJustificativa}
                                periodoFechado={periodoFechado}
                            />
                        </>
                    ):
                        <MsgImgCentralizada
                            texto='Selecione um período e uma conta acima para visualizar os demonstrativos'
                            img={Img404}
                        />
                    }
                    <section>
                        <ModalConfirmaSalvar
                            show={showSalvar}
                            handleClose={()=>setShowSalvar(false)}
                            titulo="Salvar informações"
                            texto="Informações da conciliação bancária salvas com sucesso"
                            primeiroBotaoCss="success"
                            primeiroBotaoTexto="Fechar"
                        />
                    </section>
                </>
            }
        </div>
    )
};