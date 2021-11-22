import React from "react";

export const TabelaTotais = ({infoAta, valorTemplate}) => {
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
                        <td>Saldo reprogramado do período anterior</td>
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
                        <td>Demais créditos (rendimento e outros)</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.outras_receitas_no_periodo)}</td>
                    </tr>
                    <tr>
                        <td>Despesas demonstradas</td>
                        <td>{valorTemplate(infoAta.totais.despesas_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_conciliadas_capital)}</td>
                        <td className="td-livre-aplicacao-ausente">-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td>Despesas não demonstradas no período (Pagamentos a compensar)</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_capital)}</td>
                        <td className="td-livre-aplicacao-ausente">-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas)}</td>
                    </tr>
                    <tr>
                        <td>Saldo reprogramado para o próximo período</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_atual_total)}</td>
                    </tr>
                    <tr>
                        <td>Despesas não demonstradas de períodos anteriores (Pagamentos a compensar)</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_anteriores_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_anteriores_capital)}</td>
                        <td className="td-livre-aplicacao-ausente">-</td>
                        <td>{valorTemplate(infoAta.totais.despesas_nao_conciliadas_anteriores)}</td>
                    </tr>
                    <tr>
                        <td>Saldo bancário ao final do período</td>
                        <td>{valorTemplate(infoAta.totais.saldo_bancario_custeio)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_bancario_capital)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_bancario_livre)}</td>
                        <td>{valorTemplate(infoAta.totais.saldo_bancario_total)}</td>
                    </tr>
                    </tbody>
                </table>
            </>
            }
        </>
    )
};