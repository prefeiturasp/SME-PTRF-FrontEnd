import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";

export const ResumoFinanceiroTabelaAcoes = ({infoAta, valorTemplate, toggleBtnTabelaAcoes, clickBtnTabelaAcoes}) => {
    return (
        <>
            <p className='titulo-tabela'>Ver dados por ação</p>

            <div className="accordion" id="accordionFaq">
                {infoAta.acoes && infoAta.acoes.length > 0 && infoAta.acoes.map((info, index) =>
                    <div className="card" key={info.acao_associacao_uuid}>

                        <div className="card-header" id="headingOne">
                            <h2 className="mb-0">
                                <div className="row">
                                    <div className="col-11">
                                        <button onClick={() => toggleBtnTabelaAcoes(index)}
                                                className="btn btn-link btn-block text-left btn-container-titulo-acoes pl-0"
                                                type="button" data-toggle="collapse"
                                                data-target={`#collapse${index}`} aria-expanded="true"
                                                aria-controls={`collapse${index}`}>
                                            {info.acao_associacao_nome}
                                        </button>
                                    </div>
                                    <div className="col-1">
                                        <button onClick={() => toggleBtnTabelaAcoes(index)}
                                                className="btn btn-link btn-block text-left"
                                                type="button"
                                                data-toggle="collapse" data-target={`#collapse${index}`}
                                                aria-expanded="true" aria-controls={`collapse${index}`}>
                                            <span className='span-icone-toogle'>
                                                <FontAwesomeIcon
                                                    style={{marginRight: "0", color: 'black'}}
                                                    icon={clickBtnTabelaAcoes[index] ? faChevronUp : faChevronDown}
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
                                        <td><strong>Saldo inicial  (reprogramado do período anterios)</strong></td>
                                        <td>{valorTemplate(info.saldo_reprogramado_custeio)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado_capital)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado_livre)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Repasses</strong></td>
                                        <td>{valorTemplate(info.repasses_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.repasses_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.repasses_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.repasses_no_periodo)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Demais crédito</strong></td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Despesas</strong></td>
                                        <td>{valorTemplate(info.despesas_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.despesas_no_periodo_capital)}</td>
                                        <td>-</td>
                                        <td>{valorTemplate(info.despesas_no_periodo)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Saldo atual</strong></td>
                                        <td>{valorTemplate(info.saldo_atual_custeio + info.despesas_nao_conciliadas_custeio)}</td>
                                        <td>{valorTemplate(info.saldo_atual_capital + info.despesas_nao_conciliadas_capital)}</td>
                                        <td>{valorTemplate(info.saldo_atual_livre)}</td>
                                        <td>{valorTemplate(info.saldo_atual_total + info.despesas_nao_conciliadas)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Despesas não demonstradas</strong></td>
                                        <td>{valorTemplate(info.despesas_nao_conciliadas_custeio)}</td>
                                        <td>{valorTemplate(info.despesas_nao_conciliadas_capital)}</td>
                                        <td>-</td>
                                        <td>{valorTemplate(info.despesas_nao_conciliadas)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Saldo reprogramado  (para o próximo período)</strong></td>
                                        <td>{valorTemplate(info.saldo_atual_custeio)}</td>
                                        <td>{valorTemplate(info.saldo_atual_capital)}</td>
                                        <td>{valorTemplate(info.saldo_atual_livre)}</td>
                                        <td>{valorTemplate(info.saldo_atual_total)}</td>
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