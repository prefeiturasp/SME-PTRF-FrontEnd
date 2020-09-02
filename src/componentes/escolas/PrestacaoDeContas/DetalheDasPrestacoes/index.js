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
    const [periodoConta, setPeriodoConta] = useState("");
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [contaConciliacao, setContaConciliacao] = useState("")

    useEffect(()=>{
        getPeriodoConta();
        carregaTabelas();
        carregaPeriodos();
        carregaContas();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify(periodoConta))
        if (periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== "") {
            console.log('Estou aqui', localStorage.getItem('periodoConta'))
        }
    }, [periodoConta]);


    const getPeriodoConta = () => {
        if (localStorage.getItem('periodoConta')) {
            const files = JSON.parse(localStorage.getItem('periodoConta'))
            setPeriodoConta(files)
        } else {
            setPeriodoConta({periodo: "", conta: ""})
        }
    };

    const carregaTabelas = async () => {
        await getTabelasReceita().then(response => {
            setContasAssociacao(response.data.contas_associacao);
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


    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
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

            <>
                <SelectPeriodoConta
                    periodoConta={periodoConta}
                    handleChangePeriodoConta={handleChangePeriodoConta}
                    periodosAssociacao={periodosAssociacao}
                    contasAssociacao={contasAssociacao}
                />

                {periodoConta.periodo && periodoConta.conta &&
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
                }

            </>
        </div>

    )
}