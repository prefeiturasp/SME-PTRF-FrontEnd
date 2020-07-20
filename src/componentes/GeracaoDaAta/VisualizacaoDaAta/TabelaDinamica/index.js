import React from "react";
import {TextoDespesas} from "../TextoDespesas";

export const TabelaDinamica = ({infoAta, valorTemplate}) => {
    console.log("Tabela Dinamica ", infoAta)
    return (
        <>
            {infoAta.acoes && infoAta.acoes.length > 0 && infoAta.acoes.map((info) => (
                <div key={info.acao_associacao_uuid}>
                    <p className='titulo-tabela-acoes mt-5'>
                        {info.acao_associacao_nome}
                    </p>
                    <table className="table table-bordered tabela-acoes">
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
                            <td>{valorTemplate(info.saldo_reprogramado_custeio)}</td>
                            <td>{valorTemplate(info.saldo_reprogramado_capital)}</td>
                            <td>Saldo anterior - Livre aplicação</td>
                            <td>{valorTemplate(info.saldo_reprogramado)}</td>
                        </tr>
                        <tr>
                            <td>Recebimento</td>
                            <td>{valorTemplate(info.repasses_no_periodo_custeio)}</td>
                            <td>{valorTemplate(info.repasses_no_periodo_capital)}</td>
                            <td>Recebimento - Livre aplicação</td>
                            <td>{valorTemplate(info.repasses_no_periodo)}</td>
                        </tr>
                        <tr>
                            <td>Demais créditos (rendimento e outros)</td>
                            <td>{valorTemplate(info.outras_receitas_no_periodo_custeio)}</td>
                            <td>{valorTemplate(info.outras_receitas_no_periodo_capital)}</td>
                            <td>Demais créditos - Livre aplicação</td>
                            <td>{valorTemplate(info.outras_receitas_no_periodo)}</td>
                        </tr>
                        <tr>
                            <td>Despesas</td>
                            <td>{valorTemplate(info.despesas_no_periodo_custeio)}</td>
                            <td>{valorTemplate(info.despesas_no_periodo_capital)}</td>
                            <td className="td-livre-aplicacao-ausente">-</td>
                            <td>{valorTemplate(info.despesas_no_periodo)}</td>
                        </tr>
                        <tr>
                            <td>Saldo atual</td>
                            <td>{valorTemplate(info.saldo_atual_custeio)}</td>
                            <td>{valorTemplate(info.saldo_atual_capital)}</td>
                            <td>Saldo atual - Livre aplicação</td>
                            <td>{valorTemplate(info.saldo_atual_total)}</td>
                        </tr>
                        <tr>
                            <td>Pagamentos a compensar</td>
                            <td>{valorTemplate(info.despesas_nao_conciliadas_custeio)}</td>
                            <td>{valorTemplate(info.despesas_nao_conciliadas_capital)}</td>
                            <td className="td-livre-aplicacao-ausente">-</td>
                            <td>{valorTemplate(info.despesas_nao_conciliadas)}</td>
                        </tr>
                        <tr>
                            <td>Crédito não demonstrado</td>
                            <td>{valorTemplate(info.receitas_nao_conciliadas_custeio)}</td>
                            <td>{valorTemplate(info.receitas_nao_conciliadas_capital)}</td>
                            <td>Crédito não demonstrado - Livre aplicação</td>
                            <td>{valorTemplate(info.receitas_nao_conciliadas)}</td>
                        </tr>
                        <tr>
                            <td>Crédito futuros</td>
                            <td>{valorTemplate(info.repasses_nao_realizados_custeio)}</td>
                            <td>{valorTemplate(info.repasses_nao_realizados_capital)}</td>
                            <td>Crédito futuros - Livre aplicação</td>
                            <td>{valorTemplate(info.repasses_nao_realizados_custeio + info.repasses_nao_realizados_capital)}</td>
                        </tr>
                        </tbody>
                    </table>
                    <TextoDespesas
                        especificaoesDespesaCusteio={info.especificacoes_despesas_custeio}
                        especificaoesDespesaCapital={info.especificacoes_despesas_capital}
                        despesasPeriodoCusteio={info.despesas_no_periodo_custeio}
                        despesasPeriodoCapital={info.despesas_no_periodo_capital}
                        valorTemplate={valorTemplate}
                    />
                </div>
            ))}

        </>
    )
};