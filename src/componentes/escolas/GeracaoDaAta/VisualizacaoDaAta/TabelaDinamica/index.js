import React, {Fragment} from "react";
import {TextoDespesas} from "../TextoDespesas";
import {TabelaTotais} from "../TabelaTotais";
import {TextoDinamicoInferiorPorAcao} from "../TextoDinamicoInferiorPorAcao";

export const TabelaDinamica = ({infoAta, dadosAta, valorTemplate, retornaDadosAtaFormatado}) => {
    return (
        <>
            {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta, index) =>

                <Fragment key={index}>

                    <h5>Conta {conta.conta_associacao.nome}</h5>
                    <hr className="mt-1 mb-2"/>

                    {conta.acoes && conta.acoes.length > 0 && conta.acoes.map((info) =>
                        <div key={info.acao_associacao_uuid}>
                            <p className='titulo-tabela-acoes mt-3'>
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
                                    <td>Saldo reprogramado do período anterior</td>
                                    <td>{valorTemplate(info.saldo_reprogramado_custeio)}</td>
                                    <td>{valorTemplate(info.saldo_reprogramado_capital)}</td>
                                    <td>{valorTemplate(info.saldo_reprogramado_livre)}</td>
                                    <td>{valorTemplate(info.saldo_reprogramado)}</td>
                                </tr>
                                <tr>
                                    <td>Repasses</td>
                                    <td>{valorTemplate(info.repasses_no_periodo_custeio)}</td>
                                    <td>{valorTemplate(info.repasses_no_periodo_capital)}</td>
                                    <td>{valorTemplate(info.repasses_no_periodo_livre)}</td>
                                    <td>{valorTemplate(info.repasses_no_periodo)}</td>
                                </tr>
                                <tr>
                                    <td>Demais créditos (rendimento e outros)</td>
                                    <td>{valorTemplate(info.outras_receitas_no_periodo_custeio)}</td>
                                    <td>{valorTemplate(info.outras_receitas_no_periodo_capital)}</td>
                                    <td>{valorTemplate(info.outras_receitas_no_periodo_livre)}</td>
                                    <td>{valorTemplate(info.outras_receitas_no_periodo)}</td>
                                </tr>
                                <tr>
                                    <td>Despesas demonstradas</td>
                                    <td>{valorTemplate(info.despesas_conciliadas_custeio)}</td>
                                    <td>{valorTemplate(info.despesas_conciliadas_capital)}</td>
                                    <td className="td-livre-aplicacao-ausente">-</td>
                                    <td>{valorTemplate(info.despesas_conciliadas)}</td>
                                </tr>
                                <tr>
                                    <td>Despesas não demonstradas no período (Pagamentos a compensar)</td>
                                    <td>{valorTemplate(info.despesas_nao_conciliadas_custeio)}</td>
                                    <td>{valorTemplate(info.despesas_nao_conciliadas_capital)}</td>
                                    <td className="td-livre-aplicacao-ausente">-</td>
                                    <td>{valorTemplate(info.despesas_nao_conciliadas)}</td>
                                </tr>
                                <tr>
                                    <td>Saldo reprogramado para o próximo período</td>
                                    <td>{valorTemplate(info.saldo_atual_custeio)}</td>
                                    <td>{valorTemplate(info.saldo_atual_capital)}</td>
                                    <td>{valorTemplate(info.saldo_atual_livre)}</td>
                                    <td>{valorTemplate(info.saldo_atual_total)}</td>
                                </tr>
                                <tr>
                                    <td>Despesas não demonstradas de períodos anteriores (Pagamentos a compensar)</td>
                                    <td>{valorTemplate(info.despesas_nao_conciliadas_anteriores_custeio)}</td>
                                    <td>{valorTemplate(info.despesas_nao_conciliadas_anteriores_capital)}</td>
                                    <td className="td-livre-aplicacao-ausente">-</td>
                                    <td>{valorTemplate(info.despesas_nao_conciliadas_anteriores)}</td>
                                </tr>
                                <tr>
                                    <td>Saldo bancário ao final do período</td>
                                    <td>{valorTemplate(info.saldo_bancario_custeio)}</td>
                                    <td>{valorTemplate(info.saldo_bancario_capital)}</td>
                                    <td>{valorTemplate(info.saldo_bancario_livre)}</td>
                                    <td>{valorTemplate(info.saldo_bancario_total)}</td>
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
                    )}

                    <TabelaTotais
                        infoAta={conta}
                        valorTemplate={valorTemplate}
                    />

                    <TextoDinamicoInferiorPorAcao
                        dadosAta={dadosAta}
                        retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                        infoAta={conta}
                        valorTemplate={valorTemplate}
                    />

                </Fragment>
            )}


        </>
    )
};