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
    getObservacoes,
} from "../../../../services/escolas/PrestacaoDeContas.service";

import {getContas} from "../../../../services/escolas/Associacao.service";

import Loading from "../../../../utils/Loading";
import {ErroGeral} from "../../../../utils/Modais";

export const DetalheDasPrestacoes = () => {

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
    const [observacoes, setObservacoes] = useState([])
    const [contaConciliacao, setContaConciliacao] = useState("")


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
            setBtnCadastrarTexto("")
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
                carregaObservacoes(response.data.acoes_associacao);
            }).catch(error => {
                console.log(error);
            });
        };

        const carregaObservacoes = async (acoes) => {
            await getObservacoes().then(response => {
                let observs = acoes.map((acao) => (
                    {
                        acao_associacao_uuid: acao.uuid,
                        observacao: ''
                    }
                ));

                if (response) {
                    observs = observs.map((obs, idx) => {
                        let obs_resp = response.find((acao) => acao.acao_associacao_uuid == obs.acao_associacao_uuid);

                        return {
                            ...obs,
                            observacao: obs_resp !== undefined ? obs_resp.observacao : obs.observacao
                        }
                    })

                    const files = JSON.parse(localStorage.getItem('acaoLancamento'));
                    if (files.acao !== "") {
                        const observacao = observs.find((acao) => acao.acao_associacao_uuid == files.acao);
                        setTextareaJustificativa(observacao.observacao);
                    }
                }
                setObservacoes(observs);

            }).catch(error => {
                console.log(error);
            });
        }

        const carregaContas = async () => {
            await getContas().then(response => {
                console.log(response);
                const files = JSON.parse(localStorage.getItem('periodoConta'));
                if (files && files.conta !== "") {
                    const conta = response.find(conta => conta.uuid === files.conta);
                    setContaConciliacao(conta.tipo_conta.nome);
                }
            }).catch(error => {
                console.log(error);
            })
        }

        carregaTabelas();
        carregaContas();
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
        await getConciliarReceita(uuid_receita, localStorage.getItem('uuidPrestacaoConta'))
    }

    const desconciliarReceitas = async (uuid_receita) => {
        await getDesconciliarReceita(uuid_receita)
    }

    const conciliarDespesas = async (uuid_receita) => {
        await getConciliarDespesa(uuid_receita, localStorage.getItem('uuidPrestacaoConta'))
    }

    const desconciliarDespesas = async (uuid_receita) => {
        await getDesconciliarDespesa(uuid_receita)
    }

    const handleChangeSelectAcoes = (name, value) => {
        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });

        if (name === 'acao' && value !== '') {
            const obs = observacoes.find((acao) => acao.acao_associacao_uuid == value);
            setTextareaJustificativa(obs.observacao);
        } else if(name === 'acao') {
            setTextareaJustificativa('');
        }
    }

    const handleClickCadastrar = () => {
        window.location.assign(btnCadastrarUrl)
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
        const obs = observacoes.map((acao) => (
            {
                ...acao,
                observacao: acao.acao_associacao_uuid == acaoLancamento.acao ? event.target.value : acao.observacao
            }
        ));
        setObservacoes(obs);
        setTextareaJustificativa(event.target.value);
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
        window.location.assign('/prestacao-de-contas')
    }

    const onSalvarTrue = async () => {
        setShowCancelar(false);
        setShowSalvar(false);
        setShowConcluir(false);
        let payload = {
            observacoes: observacoes,
        }
        try {
            let retorno = await getSalvarPrestacaoDeConta(localStorage.getItem("uuidPrestacaoConta"), payload)
            window.location.assign('/prestacao-de-contas')
        } catch (e) {
            onShowErroGeral();
            console.log("Erro: ", e.message)
        }
    }

    const onConcluirTrue = async () => {
        setShowCancelar(false);
        setShowSalvar(false);
        setShowConcluir(false);
        let payload = {
            observacoes: observacoes,
        }

        try {
            let retorno = await getConcluirPrestacaoDeConta(localStorage.getItem("uuidPrestacaoConta"), payload)
            window.location.assign('/prestacao-de-contas')
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
                    contaConciliacao={contaConciliacao}
                />

                <TabelaValoresPendentesPorAcao/>

                <SelectAcaoLancamento
                    acaoLancamento={acaoLancamento}
                    handleChangeSelectAcoes={handleChangeSelectAcoes}
                    acoesAssociacao={acoesAssociacao}
                />

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