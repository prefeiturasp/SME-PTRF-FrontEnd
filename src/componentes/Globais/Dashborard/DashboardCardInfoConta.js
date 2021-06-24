import React from "react";
import {exibeValorFormatadoPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";

export const DashboardCardInfoConta = ({acoesAssociacao, corIconeFonte}) =>{
    let info = acoesAssociacao.info_conta;
    const getCorSaldo = (valor_saldo) => {
        return valor_saldo < 0 ? "texto-cor-vermelha" : "texto-cor-verde"
    };
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
                                    <div className="row ">
                                        <div className="col-12 col-md-5 mr-5 align-self-center container-lado-esquerdo">
                                            <p className="pt-1 mb-2">
                                                Saldo reprogramado: <strong>{exibeValorFormatadoPT_BR(info.saldo_reprogramado)}</strong>
                                            </p>
                                            <p className="pt-1 mb-2">
                                                Repasses no período: <strong>{exibeValorFormatadoPT_BR(info.repasses_no_periodo)}</strong>
                                            </p>
                                            <p className={`pt-1 mb-2 texto-com-icone-${corIconeFonte}`}>
                                                Outras receitas: <strong>{exibeValorFormatadoPT_BR(info.outras_receitas_no_periodo)}</strong>
                                            </p>
                                            <p className={`pt-1 mb-0 texto-com-icone-${corIconeFonte}`}>
                                                Despesa: <strong>{exibeValorFormatadoPT_BR(info.despesas_no_periodo)}</strong>
                                            </p>
                                        </div>
                                        <div className="col-12 col-md-6 pt-1 pb-1 ml-xl-4 container-lado-direito d-flex align-items-center">
                                            <p className="texto-saldo">Saldo</p>
                                            <div className="row w-100">
                                                <div className="col-12">
                                                    <div className='mt-5'>&nbsp;</div>
                                                    <div className="row">
                                                        {info.saldo_atual_custeio ? (
                                                            <div className="col-12 col-md-6">
                                                                <p className="pt-1">
                                                                    Custeio: <strong className={getCorSaldo(info.saldo_atual_custeio)}>{exibeValorFormatadoPT_BR(info.saldo_atual_custeio)}</strong>
                                                                </p>
                                                            </div>
                                                        ) : null}
                                                        {info.saldo_atual_capital ? (
                                                            <div className="col-12 col-md-6">
                                                                <p className="pt-1">
                                                                    Capital: <strong className={getCorSaldo(info.saldo_atual_capital)}>{exibeValorFormatadoPT_BR(info.saldo_atual_capital)}</strong>
                                                                </p>
                                                            </div>
                                                        ) : null}
                                                        {info.saldo_atual_livre ? (
                                                            <div className="col-12 col-md-6">
                                                                <p className="pt-1">
                                                                    RLA: <strong className={getCorSaldo(info.saldo_atual_livre)}>{exibeValorFormatadoPT_BR(info.saldo_atual_livre)}</strong>
                                                                </p>
                                                            </div>
                                                        ) : null}
                                                        <div className="col-12 col-md-6">
                                                            <p className="pt-0">
                                                                <strong>Total:</strong> <strong className={getCorSaldo(info.saldo_atual_total)}>{exibeValorFormatadoPT_BR(info.saldo_atual_total)}</strong>
                                                            </p>
                                                        </div>
                                                    </div>
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
};