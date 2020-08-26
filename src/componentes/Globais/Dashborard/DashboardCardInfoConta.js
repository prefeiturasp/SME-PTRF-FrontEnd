import React from "react";
import {exibeValorFormatadoPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";

export const DashboardCardInfoConta = ({acoesAssociacao, statusPeriodoAssociacao}) =>{
    console.log("acoesPorConta ", acoesAssociacao);
    let status = statusPeriodoAssociacao;
    let info = acoesAssociacao.info_conta;
    return(
        <>
            {info &&
                <>
                    <h1 className="titulo-itens-painel mt-3 mb-3">Conta {info.conta_associacao_nome}</h1>
                    <div className="row row-cols-1">
                        <div className="col mb-4 container-dashboard-card">
                            <div className="card h-100">
                                <div className="card-header bg-white">
                                    {info.conta_associacao_nome &&
                                        <span><strong>Resumo geral da conta</strong></span>
                                    }
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 col-md-6 mr-4 align-self-center container-lado-esquerdo">
                                            <p className="pt-1 mb-4">
                                                Saldo reprogramado: <strong>{exibeValorFormatadoPT_BR(info.saldo_reprogramado)}</strong>
                                            </p>
                                            <p className="pt-1 mb-4">
                                                Repasses no período: <strong>{exibeValorFormatadoPT_BR(info.repasses_no_periodo)}</strong>
                                            </p>
                                            <p className={`pt-1 mb-4 ${status==="EM_ANDAMENTO" && "texto-com-icone"}`}>
                                                Outras receitas: <strong>{exibeValorFormatadoPT_BR(info.outras_receitas_no_periodo)}</strong>
                                            </p>
                                            <p className={`pt-1 mb-0 ${status==="EM_ANDAMENTO" && "texto-com-icone"}`}>
                                                Despesa declarada: <strong>{exibeValorFormatadoPT_BR(info.despesas_no_periodo)}</strong>
                                            </p>
                                        </div>
                                        <div className="col-12 col-md-5 pt-1 pb-1 container-lado-direito d-flex align-items-center">
                                            <p className="texto-saldo">Saldo</p>
                                            <div className="row ">
                                                <div className="col-12">

                                                    <div className='mt-5'></div>
                                                    {info.saldo_atual_custeio ? (
                                                        <p className="pt-1">
                                                            Custeio: <strong>{exibeValorFormatadoPT_BR(info.saldo_atual_custeio)}</strong>
                                                        </p>
                                                    ) : null}
                                                    {info.saldo_atual_capital ? (
                                                        <p className="pt-1">
                                                            Capital: <strong>{exibeValorFormatadoPT_BR(info.saldo_atual_capital)}</strong>
                                                        </p>
                                                    ) : null}
                                                    {info.saldo_atual_livre ? (
                                                        <p className="pt-1">
                                                            RLA: <strong>{exibeValorFormatadoPT_BR(info.saldo_atual_livre)}</strong>
                                                        </p>
                                                    ) : null}
                                                    <p className="pt-0">
                                                        Total: <strong>{exibeValorFormatadoPT_BR(info.saldo_atual_total)}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

        </>
    )
}