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
    getDesconciliarReceita
} from "../../../services/PrestacaoDeContas.service";
import Loading from "../../../utils/Loading";

export const DetalheDasPrestacoes = () => {

    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [receitasNaoConferidas, setReceitasNaoConferidas] = useState([])
    const [receitasConferidas, setReceitasConferidas] = useState([])
    const [checkboxReceitas, setCheckboxReceitas] = useState(false)


    const [despesas, setDespesas] = useState([])
    const [acoesAssociacao, setAcoesAssociacao] = useState(false);
    const [acaoLancamento, setAcaoLancamento] = useState("")
    const [btnCadastrarTexto, setBtnCadastrarTexto] = useState("")
    const [btnCadastrarUrl, setBtnCadastrarUrl] = useState("")

    useEffect(() => {
        getAcaoLancamento();
    }, [])

    useEffect(() => {

        if (acaoLancamento.acao && acaoLancamento.lancamento) {

            localStorage.setItem('acaoLancamento', JSON.stringify(acaoLancamento))
            setReceitasConferidas([])
            setReceitasNaoConferidas([])

            if (acaoLancamento.lancamento === 'receitas-lancadas') {
                setLoading(true)
                setBtnCadastrarTexto("Cadastrar Receita")
                setBtnCadastrarUrl("/cadastro-de-credito/tabela-de-lancamentos-receitas")
                setDespesas([])
                getReceitasNaoConferidas();
                getReceitasConferidas();
            } else if (acaoLancamento.lancamento === 'despesas-lancadas') {
                setReceitasNaoConferidas([])
                setReceitasConferidas([])
                setBtnCadastrarTexto("Cadastrar Despesa")
                setBtnCadastrarUrl("/cadastro-de-despesa/tabela-de-lancamentos-despesas")
                getDespesas();
            }
        } else {
            setReceitasNaoConferidas([])
            setReceitasConferidas([])
            setDespesas([])
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

    const conciliarReceitas = async (uuid_receita) => {
        const conciliar = await getConciliarReceita(uuid_receita)
    }

    const desconciliarReceitas = async (uuid_receita) => {
        const conciliar = await getDesconciliarReceita(uuid_receita)
    }

    const getDespesas = async () => {
        const lista_retorno_api = await getDespesasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "False")
        console.log("getDespesas ", lista_retorno_api)
        setDespesas(lista_retorno_api)
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
            let conciliar = await conciliarReceitas(uuid_receita);
        } else if (!event.target.checked) {
            let desconciliar = await desconciliarReceitas(uuid_receita)
        }

        await getReceitasNaoConferidas();
        await getReceitasConferidas();
    }

    return (
        <div className="col-12 detalhe-das-prestacoes-container mb-5">
            {console.log("LOADING ", loading)}
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
                />

                <SelectAcaoLancamento
                    acaoLancamento={acaoLancamento}
                    handleChangeSelectAcoes={handleChangeSelectAcoes}
                    acoesAssociacao={acoesAssociacao}
                />

                {/*<TabelaValoresPendentesPorAcao/>*/}

                {receitasNaoConferidas && receitasNaoConferidas.length > 0 ? (
                    <TabelaDeLancamentosReceitas
                        conciliados={false}
                        receitas={receitasNaoConferidas}
                        checkboxReceitas={checkboxReceitas}
                        handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}

                    />
                ) : <p className="mt-5"><strong>Não existem lançamentos não conciliados</strong></p>}

                {receitasConferidas && receitasConferidas.length > 0 ? (
                    <TabelaDeLancamentosReceitas
                        conciliados={true}
                        receitas={receitasConferidas}
                        checkboxReceitas={checkboxReceitas}
                        handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}
                    />
                ) : <p className="mt-5"><strong>Não existem lançamentos conciliados</strong></p>}
                {despesas && despesas.length > 0 ? (
                    <>
                        <TabelaDeLancamentosDespesas
                            conciliados={false}
                            despesas={despesas}
                        />
                        <TabelaDeLancamentosDespesas
                            conciliados={true}
                            despesas={despesas}
                        />
                    </>
                ) : null
                }


                <Justificativa/>
            </>
            }
        </div>

    )
}