import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
import {TabelaDeLancamentosReceitas} from "./TabelaDeLancamentosReceitas";
import {Justificativa} from "./Justivicativa";
import {getTabelasReceita} from "../../../services/Receitas.service";
import {
    getDespesasPrestacaoDeContas,
    getReceitasPrestacaoDeContas,
    getConciliarReceita,
    getDesconciliarReceita,
    getConciliarDespesa,
    getDesconciliarDespesa,
    getSalvarPrestacaoDeConta,
    getConcluirPrestacaoDeConta,
} from "../../../services/PrestacaoDeContas.service";
import Loading from "../../../utils/Loading";
import {ErroGeral} from "../../../utils/Modais";

export const DetalheDasPrestacoes = () => {

    let history = useHistory();

    const [showCancelar, setShowCancelar] = useState(false);
    const [showSalvar, setShowSalvar] = useState(false);
    const [showConcluir, setShowConcluir] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);


    const [loading, setLoading] = useState(false);

    const [receitasNaoConferidas, setReceitasNaoConferidas] = useState([])
    const [receitasConferidas, setReceitasConferidas] = useState([])
    const [checkboxReceitas, setCheckboxReceitas] = useState(false)

    const [despesasNaoConferidas, setDespesasNaoConferidas] = useState([])
    const [despesasConferidas, setDespesasConferidas] = useState([])
    const [checkboxDespesas, setCheckboxDespesas] = useState(false)

    const [acoesAssociacao, setAcoesAssociacao] = useState(false);
    const [acaoLancamento, setAcaoLancamento] = useState("")
    const [btnCadastrarTexto, setBtnCadastrarTexto] = useState("")
    const [btnCadastrarUrl, setBtnCadastrarUrl] = useState("")
    const [textareaJustificativa, setTextareaJustificativa] = useState("")

    useEffect(() => {
        getAcaoLancamento();
    }, [])

    useEffect(() => {

        localStorage.setItem('acaoLancamento', JSON.stringify(acaoLancamento))

        if (acaoLancamento.acao && acaoLancamento.lancamento) {
            setReceitasConferidas([])
            setReceitasNaoConferidas([])

            if (acaoLancamento.lancamento === 'receitas-lancadas') {
                setBtnCadastrarTexto("Cadastrar Receita")
                setBtnCadastrarUrl("/cadastro-de-credito/tabela-de-lancamentos-receitas")
                setDespesasNaoConferidas([]);
                setDespesasConferidas([]);
                getReceitasNaoConferidas();
                getReceitasConferidas();
            } else if (acaoLancamento.lancamento === 'despesas-lancadas') {
                setReceitasNaoConferidas([])
                setReceitasConferidas([])
                setBtnCadastrarTexto("Cadastrar Despesa")
                setBtnCadastrarUrl("/cadastro-de-despesa/tabela-de-lancamentos-despesas")
                getDespesasNaoConferidas();
                getDespesasConferidas();
            }
        } else {
            setReceitasNaoConferidas([])
            setReceitasConferidas([])
            setDespesasNaoConferidas([]);
            setDespesasConferidas([]);
        }


    }, [acaoLancamento])

    useEffect(() => {
        const carregaTabelas = async () => {
            await getTabelasReceita().then(response => {
                setAcoesAssociacao(response.data.acoes_associacao);
            }).catch(error => {
                console.log(error);
            });
        };
        carregaTabelas();
    }, [])

    const getAcaoLancamento = () => {
        if (localStorage.getItem('acaoLancamento')) {
            const files = JSON.parse(localStorage.getItem('acaoLancamento'))
            setAcaoLancamento(files)
        } else {
            setAcaoLancamento({acao: "", lancamento: ""})
        }
    }

    const getReceitasNaoConferidas = async () => {
        setLoading(true)
        const naoConferidas = await getReceitasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "False")
        setReceitasNaoConferidas(naoConferidas)
        setLoading(false)
    }

    const getReceitasConferidas = async () => {
        setLoading(true)
        const conferidas = await getReceitasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "True")
        setReceitasConferidas(conferidas)
        setLoading(false)
    }

    const getDespesasNaoConferidas = async () => {
        setLoading(true)
        const naoConferidas = await getDespesasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "False")
        setDespesasNaoConferidas(naoConferidas)
        setLoading(false)
    }

    const getDespesasConferidas = async () => {
        setLoading(true)
        const conferidas = await getDespesasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "True")
        setDespesasConferidas(conferidas)
        setLoading(false)
    }

    const conciliarReceitas = async (uuid_receita) => {
        await getConciliarReceita(uuid_receita)
    }

    const desconciliarReceitas = async (uuid_receita) => {
        await getDesconciliarReceita(uuid_receita)
    }

    const conciliarDespesas = async (uuid_receita) => {
        await getConciliarDespesa(uuid_receita)
    }

    const desconciliarDespesas = async (uuid_receita) => {
        await getDesconciliarDespesa(uuid_receita)
    }

    const handleChangeSelectAcoes = (name, value) => {
        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });
    }

    const handleClickCadastrar = () => {
        history.push(btnCadastrarUrl);
    }

    const handleChangeCheckboxReceitas = async (event, uuid_receita) => {
        if (event.target.checked) {
            await conciliarReceitas(uuid_receita);
        } else if (!event.target.checked) {
            await desconciliarReceitas(uuid_receita)
        }

        await getReceitasNaoConferidas();
        await getReceitasConferidas();
    }

    const handleChangeCheckboxDespesas = async (event, uuid_receita) => {
        if (event.target.checked) {
            await conciliarDespesas(uuid_receita);
        } else if (!event.target.checked) {
            await desconciliarDespesas(uuid_receita)
        }

        await getDespesasNaoConferidas();
        await getDespesasConferidas();
    }

    const handleChangeTextareaJustificativa = (event) => {
        setTextareaJustificativa(event.target.value)
    }

    const onShowCancelar = () => {
        setShowCancelar(true);
    }

    const onShowSalvar = () => {
        setShowSalvar(true);
    }

    const onShowConcluir = () => {
        setShowConcluir(true);
    }

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    }

    const onCancelarTrue = () => {
        setShowCancelar(false);
        history.push('/prestacao-de-contas')
    }

    const onSalvarTrue = async () => {
        setShowCancelar(false);
        setShowSalvar(false);
        setShowConcluir(false);
        let payload = {
            observacoes: textareaJustificativa,
        }
        try {
            let retorno = await getSalvarPrestacaoDeConta(localStorage.getItem("uuidPrestacaoConta"), payload)
            history.push('/prestacao-de-contas')
        } catch (e) {
            onShowErroGeral();
            console.log("Erro: ", e.message())
        }
    }

    const onConcluirTrue = async () => {
        setShowCancelar(false);
        setShowSalvar(false);
        setShowConcluir(false);
        let payload = {
            observacoes: textareaJustificativa,
        }

        try {
            let retorno = await getConcluirPrestacaoDeConta(localStorage.getItem("uuidPrestacaoConta"), payload)
            history.push('/prestacao-de-contas')
        } catch (e) {
            onShowErroGeral();
            console.log("Erro: ", e.message)
        }
    }

    const onHandleClose = () => {
        setShowCancelar(false);
        setShowSalvar(false);
        setShowConcluir(false);
        setShowErroGeral(false)
    }

    return (
        <div className="col-12 detalhe-das-prestacoes-container mb-5">
            {
                loading && (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="50"
                        marginBottom="0"
                    />
                )
            }
            {!loading &&
            <>
                <TopoComBotoes
                    handleClickCadastrar={handleClickCadastrar}
                    btnCadastrarTexto={btnCadastrarTexto}
                    showCancelar={showCancelar}
                    showSalvar={showSalvar}
                    showConcluir={showConcluir}
                    onShowCancelar={onShowCancelar}
                    onShowSalvar={onShowSalvar}
                    onShowConcluir={onShowConcluir}
                    onCancelarTrue={onCancelarTrue}
                    onSalvarTrue={onSalvarTrue}
                    onConcluirTrue={onConcluirTrue}
                    onHandleClose={onHandleClose}
                />

                <SelectAcaoLancamento
                    acaoLancamento={acaoLancamento}
                    handleChangeSelectAcoes={handleChangeSelectAcoes}
                    acoesAssociacao={acoesAssociacao}
                />

                {/*<TabelaValoresPendentesPorAcao/>*/}

                {!receitasNaoConferidas.length > 0 && !receitasConferidas.length > 0 && acaoLancamento.lancamento === "receitas-lancadas" &&
                <p className="mt-5"><strong>Não existem lançamentos conciliados/não conciliados...</strong></p>
                }

                {receitasNaoConferidas && receitasNaoConferidas.length > 0 && (
                    <TabelaDeLancamentosReceitas
                        conciliados={false}
                        receitas={receitasNaoConferidas}
                        checkboxReceitas={checkboxReceitas}
                        handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}

                    />
                )}

                {receitasConferidas && receitasConferidas.length > 0 && (
                    <TabelaDeLancamentosReceitas
                        conciliados={true}
                        receitas={receitasConferidas}
                        checkboxReceitas={checkboxReceitas}
                        handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}
                    />
                )}

                {!despesasNaoConferidas.length > 0 && !despesasConferidas.length > 0 && acaoLancamento.lancamento === "despesas-lancadas" &&
                <p className="mt-5"><strong>Não existem lançamentos conciliados/não conciliados...</strong></p>
                }

                {despesasNaoConferidas && despesasNaoConferidas.length > 0 &&

                <TabelaDeLancamentosDespesas
                    conciliados={false}
                    despesas={despesasNaoConferidas}
                    checkboxDespesas={checkboxDespesas}
                    handleChangeCheckboxDespesas={handleChangeCheckboxDespesas}
                />

                }

                {despesasConferidas && despesasConferidas.length > 0 &&
                <TabelaDeLancamentosDespesas
                    conciliados={true}
                    despesas={despesasConferidas}
                    checkboxDespesas={checkboxDespesas}
                    handleChangeCheckboxDespesas={handleChangeCheckboxDespesas}
                />
                }

                <Justificativa
                    textareaJustificativa={textareaJustificativa}
                    handleChangeTextareaJustificativa={handleChangeTextareaJustificativa}
                />
            </>
            }

            <section>
                <ErroGeral show={showErroGeral} handleClose={onHandleClose}/>
            </section>
        </div>

    )
}