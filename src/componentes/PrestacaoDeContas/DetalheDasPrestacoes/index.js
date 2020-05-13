import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
import {TabelaDeLancamentosReceitas} from "./TabelaDeLancamentosReceitas";
import {Justificativa} from "./Justivicativa";
import {getTabelasReceita} from "../../../services/Receitas.service";
import {getDespesasPrestacaoDeContas, getReceitasPrestacaoDeContas} from "../../../services/PrestacaoDeContas.service";

export const DetalheDasPrestacoes = () => {

    let history = useHistory();

    const [receitasNaoConferidas, setReceitasNaoConferidas] = useState([])
    const [receitasConferidas, setReceitasConferidas] = useState([])
    const [checkboxReceitas, setCheckboxReceitas] = useState(false)


    const [despesas, setDespesas] = useState([])
    const [acoesAssociacao, setAcoesAssociacao] = useState(false);
    const [acaoLancamento, setAcaoLancamento]= useState("")
    const [btnCadastrarTexto, setBtnCadastrarTexto]= useState("")
    const [btnCadastrarUrl, setBtnCadastrarUrl]= useState("")

    useEffect(()=> {
        getAcaoLancamento();
    }, [])

    useEffect(()=>{

        if (acaoLancamento.acao && acaoLancamento.lancamento){

            localStorage.setItem('acaoLancamento', JSON.stringify(acaoLancamento))

            if (acaoLancamento.lancamento === 'receitas-lancadas'){
                setBtnCadastrarTexto("Cadastrar Receita")
                setBtnCadastrarUrl("/cadastro-de-credito/tabela-de-lancamentos-receitas")
                setDespesas([])
                getReceitas();
            }else if (acaoLancamento.lancamento === 'despesas-lancadas'){
                setReceitasNaoConferidas([])
                setReceitasConferidas([])
                setBtnCadastrarTexto("Cadastrar Despesa")
                setBtnCadastrarUrl("/cadastro-de-despesa/tabela-de-lancamentos-despesas")
                getDespesas();
            }
        }else{
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
        }else {
            setAcaoLancamento({ acao: "", lancamento: "" })
        }
    }

    const getReceitas = async () => {
        //debugger;
        const naoConferidas =  await getReceitasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "False")
        console.log("getReceitas NÃO Conferidas", naoConferidas)
        setReceitasNaoConferidas(naoConferidas)

        const conferidas =  await getReceitasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "True")
        setReceitasConferidas(conferidas)
        console.log("getReceitas Conferidas", conferidas)

    }

    const conciliarReceitas = () => {

    }

    const getDespesas = async () => {
        const lista_retorno_api =  await getDespesasPrestacaoDeContas(localStorage.getItem("uuidPrestacaoConta"), acaoLancamento.acao, "False")
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

    const handleChangeCheckboxReceitas = (event) => {
        console.log("handleChangeCheckboxReceitas ", event.target.checked)
        //setCheckboxReceitas(!event.target.checked)

    }

    return(
        <div className="col-12 detalhe-das-prestacoes-container mb-5" >
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

            {receitasNaoConferidas && receitasNaoConferidas.length > 0 && (
                <TabelaDeLancamentosReceitas
                    conciliados={false}
                    receitas={receitasNaoConferidas}
                    checkboxReceitas={checkboxReceitas}
                    handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}

                />
            )}

            { receitasConferidas && receitasConferidas.length > 0 && (
                <TabelaDeLancamentosReceitas
                    conciliados={true}
                    receitas={receitasConferidas}
                    checkboxReceitas={checkboxReceitas}
                    handleChangeCheckboxReceitas={handleChangeCheckboxReceitas}
                />
            )}
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
            ): "Não existem lancamentos"
            }


            <Justificativa/>
        </div>
    )
}