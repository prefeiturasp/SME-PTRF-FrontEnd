import React from "react";

export const ResumoFinanceiroTabelaTotais = ({infoAta, valorTemplate}) => {
    return (
        <>
            {infoAta.totais && Object.entries(infoAta.totais).length > 0 &&
            <>
                <p className='titulo-tabela mt-3'>Síntese do período de realização da despesa</p>
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
                        <td><strong>Saldo inicial  (reprogramado do período anterios)</strong></td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado)}</td>
                    </tr>
                    <tr>
                        <td><strong>Repasses</strong></td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td><strong>Demais créditos</strong></td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td><strong>Despesas</strong></td>
                        <td>{valorTemplate(infoAta.totais.despesas_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_no_periodo_capital)}</td>
                        <td>-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td><strong>Saldo final</strong></td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_custeio + infoAta.totais.despesas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_capital + infoAta.totais.despesas_nao_conciliadas_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_total + infoAta.totais.despesas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td><strong>Despesas não demonstradas</strong></td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_capital)}</td>
                        <td>-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td><strong>Saldo reprogramado  (para o próximo período)</strong></td>
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