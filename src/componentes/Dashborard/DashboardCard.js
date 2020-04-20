import React from "react";
import "./dashboard.scss"
import moment from "moment";

export const DashboardCard = ({acoesAssociacao}) => {
    console.log("Ollyver ", acoesAssociacao)

    const valorFormatado = (valor)  => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }
    return (
        <>
            {acoesAssociacao.info_acoes && acoesAssociacao.info_acoes.length > 0 ? acoesAssociacao.info_acoes.map((acao, index) =>
                <div key={index} className="col mb-4 container-dashboard-card">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            {acao.acao_associacao_nome ? (
                                <span><strong>{acao.acao_associacao_nome}</strong> </span>
                            ) : null }

                        </div>
                        <div className="card-body">
                            <div className='row'>
                                <div className="col-12 col-md-5 align-self-center">
                                    <div className="col-12 container-lado-esquerdo pt-1 pb-1">
                                        <p className="pt-1 mb-1" >Custeio: <strong>{valorFormatado(acao.saldo_atual_custeio)}</strong></p>
                                        <p className="pt-1 mb-1">Capital: <strong>{valorFormatado(acao.saldo_atual_capital)}</strong></p>
                                        <p className="pt-1 pb-1 mb-0">Total: <strong>{valorFormatado(acao.saldo_atual_total)}</strong></p>
                                    </div>
                                </div>

                                <div className="col-12 col-md-7 container-lado-direito align-self-center ">
                                    <p className="pt-1 mb-1" >Saldo reprogramado: <strong>{valorFormatado(acao.saldo_reprogramado)}</strong></p>
                                    <p className="pt-1 mb-1">Repasses no período: <strong>{valorFormatado(acao.repasses_no_periodo)}</strong></p>
                                    <p className="pt-1 pb-1 mb-0">Despesa declarada: <strong>{valorFormatado(acao.despesas_no_periodo)}</strong></p>
                                    {acao.acao_associacao_nome === "PTRF" ? (
                                        <p className="pt-1 pb-1 mb-0">Próx. repasse a partir de: <strong>{moment(new Date(acoesAssociacao.data_prevista_repasse), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY")}</strong></p>
                                    ) : null }

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : null}

        </>
    );
}