import React from "react";

export const TabelaExecucaoFinanceira = ({execucaoFinanceira, valorTemplate}) =>{
    return(
        <>
            <h5 className='mt-3 mb-3'>Execução Financeira</h5>
            {execucaoFinanceira && Object.entries(execucaoFinanceira).length > 0 &&
                <table className="table table-bordered tabela-execucao-financeira">
                    <thead>
                    <tr className='tr-titulo'>
                        <th scope="col">Tipo de recurso</th>
                        <th scope="col">Custeio</th>
                        <th scope="col">Capital</th>
                        <th scope="col">Recurso livre</th>
                        <th scope="col">Total (R$)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Saldo reprogramado período anterior</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_total ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Previsto Secretaria Municipal de Educação NÂO</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_total ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Transferido pela Diretoria Regional de Ensino no período NÂO</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_total ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Rendimentos de Aplicação Financeira NÂO</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_total ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Devolução à conta PTRF NÃO</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_capital) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_livre) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_periodo_anterior_total ? valorTemplate(execucaoFinanceira.saldo_reprogramado_periodo_anterior_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Demais créditos</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_custeio ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_capital ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_livre ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_total ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Valor total NÃO</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_custeio ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_capital ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_livre ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_total ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Despesa realizada NÃO</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_custeio ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_capital ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_livre ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_total ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Saldo reprogramado próximo período</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_proximo_periodo_custeio ? valorTemplate(execucaoFinanceira.saldo_reprogramado_proximo_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_proximo_periodo_capital ? valorTemplate(execucaoFinanceira.saldo_reprogramado_proximo_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_proximo_periodo_livre ? valorTemplate(execucaoFinanceira.saldo_reprogramado_proximo_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.saldo_reprogramado_proximo_periodo_total ? valorTemplate(execucaoFinanceira.saldo_reprogramado_proximo_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Devolução para o tesouro</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{execucaoFinanceira.devolucoes_ao_tesouro_no_periodo_total ? valorTemplate(execucaoFinanceira.devolucoes_ao_tesouro_no_periodo_total) :'-'}</td>
                    </tr>

                    </tbody>
                </table>
            }
        </>
    )
};