import React, {useEffect, useState} from "react";
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
import {TabelaDeLancamentosReceitas} from "./TabelaDeLancamentosReceitas";
import {TabelaValoresPendentesPorAcao} from "./TabelaValoresPendentesPorAcao";
import {Justificativa} from "./Justivicativa";
import {getTabelasReceita} from "../../../../services/escolas/Receitas.service";
import {
    getDespesasPrestacaoDeContas,
    getReceitasPrestacaoDeContas,
    getConciliarReceita,
    getDesconciliarReceita,
    getConciliarDespesa,
    getDesconciliarDespesa,
    getSalvarPrestacaoDeConta,
    getConcluirPrestacaoDeConta,
    getObservacoes, getStatus, getIniciarPrestacaoDeContas,
} from "../../../../services/escolas/PrestacaoDeContas.service";

import {getContas, getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../../services/escolas/Associacao.service";

import Loading from "../../../../utils/Loading";
import {ErroGeral} from "../../../../utils/Modais";
import {SelectPeriodoConta} from "../SelectPeriodoConta";

export const DetalheDasPrestacoes = () => {

    // Alteracoes
    const [showSalvar, setShowSalvar] = useState(false);
    const [periodoConta, setPeriodoConta] = useState("");
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [contaConciliacao, setContaConciliacao] = useState("");
    const [btnCadastrarTexto, setBtnCadastrarTexto] = useState("");
    const [btnCadastrarUrl, setBtnCadastrarUrl] = useState("");
    const [acaoLancamento, setAcaoLancamento] = useState("");
    const [acoesAssociacao, setAcoesAssociacao] = useState(false);

    const [receitasNaoConferidas, setReceitasNaoConferidas] = useState([])
    const [receitasConferidas, setReceitasConferidas] = useState([])
    const [checkboxReceitas, setCheckboxReceitas] = useState(false)

    const [despesasNaoConferidas, setDespesasNaoConferidas] = useState([])
    const [despesasConferidas, setDespesasConferidas] = useState([])
    const [checkboxDespesas, setCheckboxDespesas] = useState(false)

    useEffect(()=>{
        getPeriodoConta();
        getAcaoLancamento();
        carregaTabelas();
        carregaPeriodos();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify(periodoConta));
        if (periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== "") {
            console.log('Estou aqui', localStorage.getItem('periodoConta'));
        }
        carregaContas();
    }, [periodoConta]);

    useEffect(() => {

        localStorage.setItem('acaoLancamento', JSON.stringify(acaoLancamento));

        if (acaoLancamento.acao && acaoLancamento.lancamento) {
            setReceitasConferidas([]);
            setReceitasNaoConferidas([]);

            if (acaoLancamento.lancamento === 'receitas-lancadas') {
                setBtnCadastrarTexto("Cadastrar Receita");
                setBtnCadastrarUrl("/cadastro-de-credito/tabela-de-lancamentos-receitas");
                setDespesasNaoConferidas([]);
                setDespesasConferidas([]);
                getReceitasNaoConferidas();
                getReceitasConferidas();
            } else if (acaoLancamento.lancamento === 'despesas-lancadas') {
                setReceitasNaoConferidas([]);
                setReceitasConferidas([]);
                setBtnCadastrarTexto("Cadastrar Despesa");
                setBtnCadastrarUrl("/cadastro-de-despesa/tabela-de-lancamentos-despesas");
                getDespesasNaoConferidas();
                getDespesasConferidas();
            }
        } else {
            setBtnCadastrarTexto("")
            setReceitasNaoConferidas([])
            setReceitasConferidas([])
            setDespesasNaoConferidas([]);
            setDespesasConferidas([]);
        }


    }, [acaoLancamento])


    const getPeriodoConta = () => {
        if (localStorage.getItem('periodoConta')) {
            const files = JSON.parse(localStorage.getItem('periodoConta'))
            setPeriodoConta(files)
        } else {
            setPeriodoConta({periodo: "", conta: ""})
        }
    };

    const getAcaoLancamento = () => {
        if (localStorage.getItem('acaoLancamento')) {
            const files = JSON.parse(localStorage.getItem('acaoLancamento'))
            setAcaoLancamento(files)
        } else {
            setAcaoLancamento({acao: "", lancamento: ""})
        }
    }

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

    const getReceitasNaoConferidas = async () => {
        const naoConferidas = await getReceitasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao,"False")
        setReceitasNaoConferidas(naoConferidas);
    };

    const getReceitasConferidas = async () => {
        const conferidas = await getReceitasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao, "True")
        setReceitasConferidas(conferidas);
    };

    const getDespesasNaoConferidas = async () => {
        const naoConferidas = await getDespesasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao,"False")
        setDespesasNaoConferidas(naoConferidas);
    };


    const getDespesasConferidas = async () => {
        const conferidas = await getDespesasPrestacaoDeContas(periodoConta.periodo, periodoConta.conta, acaoLancamento.acao,"True")
        setDespesasConferidas(conferidas);
    };


    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    };

    const handleChangeSelectAcoes = (name, value) => {
        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });

        /*if (name === 'acao' && value !== '') {
            const obs = observacoes.find((acao) => acao.acao_associacao_uuid == value);
            setTextareaJustificativa(obs.observacao);
        } else if(name === 'acao') {
            setTextareaJustificativa('');
        }*/
    }


    const onSalvarTrue = async () => {
        setShowSalvar(false);

        console.log("onSalvarTrue ")

        /*let payload = {
            observacoes: observacoes,
        }
        try {
            let retorno = await getSalvarPrestacaoDeConta(localStorage.getItem("uuidPrestacaoConta"), payload)
            window.location.assign('/prestacao-de-contas')
        } catch (e) {

            console.log("Erro: ", e.message)
        }*/
    };

    const onHandleClose = () => {
        setShowSalvar(false);
    };

    const handleClickCadastrar = () => {
        window.location.assign(btnCadastrarUrl)
    }

    return (
        <div className="detalhe-das-prestacoes-container mb-5 mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="detalhe-das-prestacoes-texto-cabecalho mb-4">
                        <h1 className="mt-4">Conciliação Bancária</h1>
                    </div>
                </div>
            </div>

            <>
                <SelectPeriodoConta
                    periodoConta={periodoConta}
                    handleChangePeriodoConta={handleChangePeriodoConta}
                    periodosAssociacao={periodosAssociacao}
                    contasAssociacao={contasAssociacao}
                />

                {periodoConta.periodo && periodoConta.conta &&
                    <>
                    <TopoComBotoes
                        handleClickCadastrar={handleClickCadastrar}
                        btnCadastrarTexto={btnCadastrarTexto}
                        setShowSalvar={setShowSalvar}
                        showSalvar={showSalvar}
                        onSalvarTrue={onSalvarTrue}
                        onHandleClose={onHandleClose}
                        contaConciliacao={contaConciliacao}
                    />

                    <TabelaValoresPendentesPorAcao
                        periodo={periodoConta.periodo}
                        conta={periodoConta.conta}
                    />

                    <SelectAcaoLancamento
                        acaoLancamento={acaoLancamento}
                        handleChangeSelectAcoes={handleChangeSelectAcoes}
                        acoesAssociacao={acoesAssociacao}
                    />
                </>
                }

            </>
        </div>

    )
};