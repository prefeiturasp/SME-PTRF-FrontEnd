import React, {Fragment} from "react";


export const TabelaAprovadas = ({infoContas, valorTemplate, status, exibirUltimoItem, statusTemplate}) => {
    const listaVazia = (status_pc) => {
        if(status_pc === "aprovadas"){
            return (
                <p className="lista-vazia">Nenhuma associação aprovada.</p>
            )
        }
        else if(status_pc === "aprovadas_ressalva"){
            return (
                <p className="lista-vazia">Nenhuma associação aprovada com ressalva.</p>
            )
        }

        return null;
    }

    const listaVaziaReprovadas = (status_pc) => {
        if(status_pc === "reprovadas"){
            return (
                <p className="lista-vazia">Nenhuma associação rejeitada.</p>
            )
        }
        return null;
    }

    return (
        <>
            {status === "aprovadas" &&
                <p className="titulo-tabelas">
                    a) <span className="titulo-tabelas-aprovadas"><strong>APROVAR</strong></span> as prestações de contas das Associações das unidades abaixo relacionadas,
                    analisadas sob aspecto de exatidão numérica e obediência à legislação, conforme inciso
                    I do art. 36 da Portaria SME nº 6.634/2021:
                </p>
            }

            {status === "aprovadas_ressalva" &&
                <p className="titulo-tabelas">
                    b) <span className="titulo-tabelas-aprovadas"><strong>APROVAR COM RESSALVAS</strong></span> as prestações de contas das Associações das unidades abaixo relacionadas,
                    analisadas sob aspecto de exatidão numérica e obediência à legislação, conforme inciso
                    II do art. 36 da Portaria SME nº 6.634/2021:
                </p>
            }

            {status === "reprovadas" &&
                <p className="titulo-tabelas">
                    c) <span className="titulo-tabelas-reprovadas"><strong>REJEITAR</strong></span> as prestações de contas das Associações das unidades abaixo relacionadas,
                    conforme inciso III do art. 36 da Portaria SME nº 6.634/2021:
                </p>
            }

            {infoContas && infoContas.contas && infoContas.contas.length > 0
            ?   
                infoContas.contas.map((contas, index) => 
                    <Fragment key={index}>
                        <div className="titulo-tabelas-conta mb-3">
                            <p className='mb-1 font-weight-bold'>
                                <strong>Conta {contas.nome}</strong>
                            </p>
                        </div>

                        <table key={`table-${index}`} className="table table-bordered tabela-status-pc">
                            <thead>
                                <tr>
                                    <th scope="col" style={{width: '2%'}}>&nbsp;</th>
                                    <th scope="col" style={{width: '25%'}}>Unidade educacional</th>
                                    <th scope="col">Tipo de recurso</th>
                                    <th scope="col">Reprogramado</th>
                                    <th scope="col">Repasse</th>
                                    <th scope="col">Rendimentos</th>
                                    <th scope="col">Demais créditos</th>
                                    <th scope="col">Despesas</th>
                                    <th scope="col">Saldo</th>
                                    <th scope="col">Devolução ao tesouro</th>
                                    <th scope="col">Situação da Prest. de Contas</th>
                                </tr>
                            </thead>

                            {contas.info.map((info, index) => 
                                <tbody key={`tbody-${index}`}>
                                    <tr>
                                        <td rowSpan="3">{index+1}</td>
                                        <td rowSpan="3">{info.unidade.codigo_eol} - {info.unidade.tipo_unidade} {info.unidade.nome}</td>
                                        <td>Custeio</td>
                                        <td>{valorTemplate(info.valores.saldo_reprogramado_periodo_anterior_custeio)}</td>
                                        <td>{valorTemplate(info.valores.repasses_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.valores.repasses_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.valores.demais_creditos_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.valores.despesas_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.valores.saldo_reprogramado_proximo_periodo_custeio)}</td>
                                        <td>-</td>
                                        <td rowSpan="3" className="classe-status">{statusTemplate(info.status_prestacao_contas)}</td>
                                    </tr>

                                    <tr>
                                        <td>Capital</td>
                                        <td>{valorTemplate(info.valores.saldo_reprogramado_periodo_anterior_capital)}</td>
                                        <td>{valorTemplate(info.valores.repasses_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.valores.repasses_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.valores.demais_creditos_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.valores.despesas_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.valores.saldo_reprogramado_proximo_periodo_capital)}</td>
                                        <td>-</td>
                                    </tr>

                                    <tr>
                                        <td>RLA</td>
                                        <td>{valorTemplate(info.valores.saldo_reprogramado_periodo_anterior_livre)}</td>
                                        <td>{valorTemplate(info.valores.repasses_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.valores.repasses_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.valores.demais_creditos_no_periodo_livre)}</td>
                                        <td>-</td>
                                        <td>{valorTemplate(info.valores.saldo_reprogramado_proximo_periodo_livre)}</td>
                                        <td>{valorTemplate(info.valores.devolucoes_ao_tesouro_no_periodo_total)}</td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </Fragment>
                )         
            :
                listaVazia(status)         
            }

        
            {infoContas && infoContas.motivos && infoContas.motivos.length > 0
            ?
                <>
                    <p className="titulo-motivos">Motivos:</p>
                    <table className="table table-bordered tabela-status-pc">
                        <thead>
                            <tr>
                                <th scope="col" style={{width: '2%'}}>&nbsp;</th>
                                <th scope="col" style={{width: '35%'}}>Unidade educacional</th>
                                <th scope="col">Motivos</th>
                            </tr>
                        </thead>

                        {infoContas.motivos.map((info, index) => 
                            <tbody key={`tbody-motivo-${index}`}>
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{info.unidade.codigo_eol} - {info.unidade.tipo_unidade} {info.unidade.nome}</td>

                                    <td>
                                        {info.motivos.map((motivo, index) => 
                                            <p key={`motivo-${index}`} className="mb-0">{motivo}</p>
                                        )}
                                    </td>

                                    
                                </tr>
                            </tbody>
                        )}      
                    </table>
                </>
            :
                listaVaziaReprovadas(status)
            }

            {exibirUltimoItem &&
                <p className="titulo-tabelas">
                    d) Submeter ao Sr. Diretor Regional de Educação, a presente Ata, com o parecer conclusivo desta Comissão
                    atendendo ao inciso IV, do art. 34 da Portaria SME nº 6.634/2021, manter sob custódia até a publicação
                    do despacho no DOC e juntar a cópia desta Ata ao processo.
                </p>
            }
            
        </>

    )

    
}