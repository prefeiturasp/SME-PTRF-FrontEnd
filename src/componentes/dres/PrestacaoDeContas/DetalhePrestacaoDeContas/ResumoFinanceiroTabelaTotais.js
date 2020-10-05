import React from "react";

export const ResumoFinanceiroTabelaTotais = ({infoAta, valorTemplate}) => {
    console.log("ResumoFinanceiroTabelaTotais ", infoAta)
    return (
        <>
            {infoAta.totais && Object.entries(infoAta.totais).length > 0 &&
            <>
                <p className='titulo-tabela-acoes mt-5'>
                    Totais
                </p>
                <table className="table table-bordered tabela-totais">
                    <thead>
                    <tr className="tr-titulo">
                        <th scope="col">&nbsp;</th>
                        <th scope="col">Custeio (R$)</th>
                        <th scope="col">Capital (R$)</th>
                        <th scope="col">Livre aplicação (R$)</th>
                        <th scope="col">Total (R$)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Saldo inicial (reprogramado do período anterios)</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado)}</td>
                    </tr>
                    <tr>
                        <td>Repasses</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td>Demais créditos</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td>Despesas</td>
                        <td>{valorTemplate(infoAta.totais.despesas_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_no_periodo_capital)}</td>
                        <td className="td-livre-aplicacao-ausente">-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td>Saldo final - Saldo atual</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_custeio + infoAta.totais.despesas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_capital + infoAta.totais.despesas_nao_conciliadas_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_total + infoAta.totais.despesas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td>Despesas não demonstradas</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_capital)}</td>
                        <td className="td-livre-aplicacao-ausente">-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td>Saldo reprogramado (para o próximo período)</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_total)}</td>
                    </tr>
                    </tbody>
                </table>
            </>
            }
        </>
    )
};