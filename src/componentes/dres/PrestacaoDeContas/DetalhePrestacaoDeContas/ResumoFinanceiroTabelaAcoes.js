import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";

export const ResumoFinanceiroTabelaAcoes = ({infoAta, valorTemplate, toggleBtnFaq, clickBtnFaq}) => {
    console.log("ResumoFinanceiroTabelaAcoes ", infoAta)
    return (
        <>
            <p className='titulo-tabela'>Ver dados por ação</p>

            <div className="accordion mt-5" id="accordionFaq">

                {infoAta.acoes && infoAta.acoes.length > 0 && infoAta.acoes.map((info, index) =>
                    <div className="card" key={info.acao_associacao_uuid}>

                        <div className="card-header" id="headingOne">
                            <h2 className="mb-0">
                                <div className="row">
                                    <div className="col-11">
                                        <button onClick={() => toggleBtnFaq(index)}
                                                className="btn btn-link btn-block text-left btn-container-pergunta pl-0"
                                                type="button" data-toggle="collapse"
                                                data-target={`#collapse${index}`} aria-expanded="true"
                                                aria-controls={`collapse${index}`}>
                                            {info.acao_associacao_nome}
                                        </button>
                                    </div>
                                    <div className="col-1">
                                        <button onClick={() => toggleBtnFaq(index)}
                                                className="btn btn-link btn-block text-left" type="button"
                                                data-toggle="collapse" data-target={`#collapse${index}`}
                                                aria-expanded="true" aria-controls={`collapse${index}`}>
                                            <span className='span-icone-toogle'>
                                                <FontAwesomeIcon
                                                    style={{marginRight: "0", color: 'black'}}
                                                    icon={clickBtnFaq[index] ? faChevronUp : faChevronDown}
                                                />
                                            </span>
                                        </button>
                                    </div>
                                </div>

                            </h2>
                        </div>


                        <div id={`collapse${index}`} className="collapse" aria-labelledby="headingOne" data-parent="#accordionFaq">
                            <div className="card-body p-0 border-0">
                                <table className="table table-bordered tabela-acoes border-0 mb-0">
                                    <thead>
                                    <tr className="tr-titulo-acoes">
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
                                        <td>{valorTemplate(info.saldo_reprogramado_livre)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado)}</td>
                                    </tr>
                                    <tr>
                                        <td>Recebimento</td>
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
                                        <td>{valorTemplate(info.saldo_atual_livre)}</td>
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
                                        <td>{valorTemplate(info.receitas_nao_conciliadas_livre)}</td>
                                        <td>{valorTemplate(info.receitas_nao_conciliadas)}</td>
                                    </tr>
                                    <tr>
                                        <td>Crédito futuros</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_custeio)}</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_capital)}</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_livre)}</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_custeio + info.repasses_nao_realizados_capital + info.repasses_nao_realizados_livre)}</td>
                                    </tr>
                                    <tr>
                                        <td>Devolução a conta do PTRF</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo)}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};