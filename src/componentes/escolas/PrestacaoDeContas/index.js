import React, {useEffect, useState, Fragment} from "react";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service"
import {getStatusPeriodoPorData} from "../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import {getAcoesAssociacaoPorConta} from "../../../services/Dashboard.service";
import {NavLink} from "react-router-dom";

export const PrestacaoDeContas = () => {

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState("");
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [statusPrestacaoDeConta, setStatusPrestacaoDeConta] = useState(false);
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [clickBtnEscolheCategoria, setClickBtnEscolheCategoria] = useState({0: true});


    useEffect(() => {
        getPeriodoPrestacaoDeConta();
        carregaPeriodos();
        carregaTabelas();
        getStatusPrestacaoDeConta();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodoPrestacaoDeConta));
    }, [periodoPrestacaoDeConta]);

    useEffect(() => {
        localStorage.setItem('statusPrestacaoDeConta', JSON.stringify(statusPrestacaoDeConta));
    }, [statusPrestacaoDeConta]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
        setPeriodosAssociacao(periodos);
    };

    const carregaTabelas = async () => {
        await getTabelasReceita().then(response => {
            console.log("Tabelas ", response.data.contas_associacao);
            setContasAssociacao(response.data.contas_associacao);
        }).catch(error => {
            console.log(error);
        });
    };

    const getPeriodoPrestacaoDeConta = () => {
        if (localStorage.getItem('periodoPrestacaoDeConta')) {
            const files = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
            setPeriodoPrestacaoDeConta(files)
        } else {
            setPeriodoPrestacaoDeConta({
                periodo_uuid: "",
                data_inicial: "",
            })
        }
    };

    const getStatusPrestacaoDeConta = () => {
        if (localStorage.getItem('statusPrestacaoDeConta')) {
            const files = JSON.parse(localStorage.getItem('statusPrestacaoDeConta'));
            setStatusPrestacaoDeConta(files)
        } else {
            setStatusPrestacaoDeConta({})
        }
    };

    const handleChangePeriodoPrestacaoDeConta = async (name, value) => {
        if (value){
            let valor = JSON.parse(value);
            setPeriodoPrestacaoDeConta(valor);
            let status = await getStatusPeriodoPorData(valor.data_inicial);
            setStatusPrestacaoDeConta(status)
        }
    };

    const retornaObjetoPeriodoPrestacaoDeConta = (periodo_uuid, data_inicial) => {
        return JSON.stringify({
            periodo_uuid: periodo_uuid,
            data_inicial: data_inicial,
        });
    };

    const toggleBtnEscolheCategoria = (id) => {
        setClickBtnEscolheCategoria({
            [id]: !clickBtnEscolheCategoria[id]
        });
    };

    const getAcoesPorConta = (uuid_conta) =>{
        console.log("getAcoesPorConta ", uuid_conta)
    };

    return (
        <>
            {statusPrestacaoDeConta && Object.entries(statusPrestacaoDeConta).length > 0  &&
                <BarraDeStatusPrestacaoDeContas
                    statusPrestacaoDeConta={statusPrestacaoDeConta}
                />
            }

            <TopoSelectPeriodoBotaoConcluir
                periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
                periodosAssociacao={periodosAssociacao}
                retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
                statusPrestacaoDeConta={statusPrestacaoDeConta}
            />

            {statusPrestacaoDeConta && Object.entries(statusPrestacaoDeConta).length > 0  &&

            <nav className="nav mb-4 mt-2 menu-interno">
                {contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, index) =>
                    <Fragment key={index}>
                        <li className="nav-item">
                            <button
                                onClick={() => {
                                    toggleBtnEscolheCategoria(index);
                                    getAcoesPorConta(conta.uuid);
                                }}
                                className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheCategoria[index] ? "btn-escolhe-acao-active" : ""}`}
                            >
                                Conta {conta.nome}
                            </button>
                        </li>
                    </Fragment>
                )}
            </nav>
            }
        </>
    )
};