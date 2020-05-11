import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
import {TabelaDeLancamentosReceitas} from "./TabelaDeLancamentosReceitas";
import {Justificativa} from "./Justivicativa";
import {filtrosAvancadosReceitas, getTabelasReceita} from "../../../services/Receitas.service";
import {filtrosAvancadosRateios} from "../../../services/RateiosDespesas.service";

export const DetalheDasPrestacoes = () => {

    let history = useHistory();

    const [receitas, setReceitas] = useState([])
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
                setBtnCadastrarUrl("/cadastro-de-credito/tabela-de-lancamentos-despesas")
                setDespesas([])
                getReceitas();
            }else if (acaoLancamento.lancamento === 'despesas-lancadas'){
                setReceitas([])
                setBtnCadastrarTexto("Cadastrar Despesa")
                setBtnCadastrarUrl("/cadastro-de-despesa/tabela-de-lancamentos-despesas")
                getDespesas();
            }
        }else{
            setReceitas([])
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
        const lista_retorno_api =  await filtrosAvancadosReceitas("", "", acaoLancamento.acao, "")
        setReceitas(lista_retorno_api)
    }

    const getDespesas = async () => {
        const lista_retorno_api =  await filtrosAvancadosRateios("", '', acaoLancamento.acao, "")
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

            {receitas && receitas.length > 0 ? (
                <TabelaDeLancamentosReceitas
                    receitas={receitas}
                />
            ):
            despesas && despesas.length > 0 ? (
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