import React from "react";

export const TabelaExecucaoFinanceira = ({execucaoFinanceira, valorTemplate, comparaValores, tipoConta}) =>{

    return(
        <>
            <h5 className='mt-3 mb-3'>Execução Financeira - Conta {tipoConta}</h5>
            {execucaoFinanceira && Object.entries(execucaoFinanceira).length > 0 &&
                <table className="table table-bordered tabela-execucao-financeira">
                    <thead>
                    <tr className='tr-titulo'>
                        <th scope="col" style={{width:'60%'}}>Tipo de recurso</th>
                        <th scope="col" style={{width:'10%'}}>Custeio</th>
                        <th scope="col" style={{width:'10%'}}>Capital</th>
                        <th scope="col" style={{width:'10%'}}>Livre Aplicação</th>
                        <th scope="col" style={{width:'10%'}}>Total (R$)</th>
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
                            <td><span className={comparaValores(execucaoFinanceira) ? "texto-aviso-associacoes-em-analise" : ""}><strong>Previsto Secretaria Municipal de Educação</strong></span></td>
                            <td>{execucaoFinanceira.repasses_previstos_sme_custeio ? valorTemplate(execucaoFinanceira.repasses_previstos_sme_custeio) :'-'}</td>
                            <td>{execucaoFinanceira.repasses_previstos_sme_capital ? valorTemplate(execucaoFinanceira.repasses_previstos_sme_capital) :'-'}</td>
                            <td>{execucaoFinanceira.repasses_previstos_sme_livre ? valorTemplate(execucaoFinanceira.repasses_previstos_sme_livre) :'-'}</td>
                            <td>{execucaoFinanceira.repasses_previstos_sme_total ? valorTemplate(execucaoFinanceira.repasses_previstos_sme_total) :'-'}</td>
                        </tr>
                        <tr>
                            <td><span className={comparaValores(execucaoFinanceira) ? "texto-aviso-associacoes-em-analise" : ""}><strong>Transferido pela Diretoria Regional de Ensino no período</strong></span></td>
                            <td>{execucaoFinanceira.repasses_no_periodo_custeio ? valorTemplate(execucaoFinanceira.repasses_no_periodo_custeio) :'-'}</td>
                            <td>{execucaoFinanceira.repasses_no_periodo_capital ? valorTemplate(execucaoFinanceira.repasses_no_periodo_capital) :'-'}</td>
                            <td>{execucaoFinanceira.repasses_no_periodo_livre ? valorTemplate(execucaoFinanceira.repasses_no_periodo_livre) :'-'}</td>
                            <td>{execucaoFinanceira.repasses_no_periodo_total ? valorTemplate(execucaoFinanceira.repasses_no_periodo_total) :'-'}</td>
                        </tr>
                    <tr>
                        <td>Rendimentos de Aplicação Financeira</td>
                        <td>{execucaoFinanceira.receitas_rendimento_no_periodo_custeio ? valorTemplate(execucaoFinanceira.receitas_rendimento_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_rendimento_no_periodo_capital ? valorTemplate(execucaoFinanceira.receitas_rendimento_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_rendimento_no_periodo_livre ? valorTemplate(execucaoFinanceira.receitas_rendimento_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_rendimento_no_periodo_total ? valorTemplate(execucaoFinanceira.receitas_rendimento_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Devolução à conta PTRF</td>
                        <td>{execucaoFinanceira.receitas_devolucao_no_periodo_custeio ? valorTemplate(execucaoFinanceira.receitas_devolucao_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_devolucao_no_periodo_capital ? valorTemplate(execucaoFinanceira.receitas_devolucao_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_devolucao_no_periodo_livre ? valorTemplate(execucaoFinanceira.receitas_devolucao_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_devolucao_no_periodo_total ? valorTemplate(execucaoFinanceira.receitas_devolucao_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Demais créditos</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_custeio ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_capital ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_livre ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.demais_creditos_no_periodo_total ? valorTemplate(execucaoFinanceira.demais_creditos_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Valor total</td>
                        <td>{execucaoFinanceira.receitas_totais_no_periodo_custeio ? valorTemplate(execucaoFinanceira.receitas_totais_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_totais_no_periodo_capital ? valorTemplate(execucaoFinanceira.receitas_totais_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_totais_no_periodo_livre ? valorTemplate(execucaoFinanceira.receitas_totais_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.receitas_totais_no_periodo_total ? valorTemplate(execucaoFinanceira.receitas_totais_no_periodo_total) :'-'}</td>
                    </tr>
                    <tr>
                        <td>Despesa realizada</td>
                        <td>{execucaoFinanceira.despesas_no_periodo_custeio ? valorTemplate(execucaoFinanceira.despesas_no_periodo_custeio) :'-'}</td>
                        <td>{execucaoFinanceira.despesas_no_periodo_capital ? valorTemplate(execucaoFinanceira.despesas_no_periodo_capital) :'-'}</td>
                        <td>{execucaoFinanceira.despesas_no_periodo_livre ? valorTemplate(execucaoFinanceira.despesas_no_periodo_livre) :'-'}</td>
                        <td>{execucaoFinanceira.despesas_no_periodo_total ? valorTemplate(execucaoFinanceira.despesas_no_periodo_total) :'-'}</td>
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