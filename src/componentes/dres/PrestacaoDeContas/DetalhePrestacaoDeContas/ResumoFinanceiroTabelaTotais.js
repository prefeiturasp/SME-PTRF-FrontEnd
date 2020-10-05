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
                        <td>Saldo anterior</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_reprogramado)}</td>
                    </tr>
                    <tr>
                        <td>Recebimento</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td>Demais créditos (rendimento e outros)</td>
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
                        <td>Saldo atual</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_total)}</td>
                    </tr>
                    <tr>
                        <td>Pagamentos a compensar</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_capital)}</td>
                        <td className="td-livre-aplicacao-ausente">-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td>Crédito não demonstrado</td>
                        <td>{valorTemplate(infoAta.totais.receitas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.receitas_nao_conciliadas_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.receitas_nao_conciliadas_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.receitas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td>Crédito futuros</td>
                        <td>{valorTemplate(infoAta.totais.repasses_nao_realizados_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_nao_realizados_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_nao_realizados_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.repasses_nao_realizados_custeio + infoAta.totais.repasses_nao_realizados_capital + infoAta.totais.repasses_nao_realizados_livre)}</td>
                    </tr>
                    <tr>
                        <td>Devolução a conta do PTRF</td>
                        <td>{valorTemplate(infoAta.totais.receitas_devolucao_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.receitas_devolucao_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.receitas_devolucao_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.receitas_devolucao_no_periodo_custeio + infoAta.totais.receitas_devolucao_no_periodo_capital + infoAta.totais.receitas_devolucao_no_periodo_livre)}</td>
                    </tr>
                    </tbody>
                </table>
            </>
            }
        </>
    )
};