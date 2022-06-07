import React, {Fragment} from "react";


export const TabelaAprovadas = ({infoContas, status, exibirUltimoItem}) => {
    const listaVaziaAprovadas = (status_pc) => {
        if(status_pc === "aprovadas"){
            return (
                <p className="lista-vazia">Nenhuma prestação de contas aprovada.</p>
            )
        }
        return null;
    }

    const listaVaziaAprovadasRessalva = (status_pc) => {
        if(status_pc === "aprovadas_ressalva"){
            return (
                <p className="lista-vazia">Nenhuma prestação de contas aprovada com ressalva.</p>
            )
        }
        return null;
    }

    const listaVaziaReprovadas = (status_pc) => {
        if(status_pc === "reprovadas"){
            return (
                <p className="lista-vazia">Nenhuma prestação de contas rejeitada.</p>
            )
        }
        return null;
    }

    const divideLista = (conta) => {
        let divisao = Math.ceil(conta.info.length / 3)
        let novo_array = [];
        let corte = divisao;
        let contador = 0;

        for (let i = 0; i < conta.info.length; i = i + corte) {
            let array_cortada = conta.info.slice(i, i + corte);

            for(let x=0; x<=array_cortada.length-1; x++){
                contador = contador + 1;
                
                array_cortada[x].ordem = contador
            }

            novo_array.push(array_cortada);
        }

        return novo_array;
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


            {infoContas && infoContas.contas && infoContas.contas.length > 0 && status === "aprovadas"
                ?

                    infoContas.contas.map((conta, index) => 
                        <Fragment key={index}>
                            <div className="titulo-tabelas-conta mb-3">
                                <p className='mb-1 font-weight-bold'>
                                    <strong>Conta {conta.nome}</strong>
                                </p>
                            </div>

                            <div className="row">
                                {divideLista(conta).map((dados, index_dados) =>
                                    <div className="col-4" key={`div-${index_dados}`}>
                                        <table key={`table-${index_dados}`} className="table table-bordered tabela-status-pc">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{width: '3%'}}>Ordem</th>
                                                    <th scope="col" style={{width: '97%'}}>Unidade educacional</th>
                                                </tr>
                                            </thead>

                                            {dados.map((dado, index_dado) => 
                                                <tbody key={`tbody-${index_dado}`}>
                                                    <tr>
                                                        <td>{dado.ordem}</td>
                                                        <td>{dado.unidade.codigo_eol} - {dado.unidade.tipo_unidade} {dado.unidade.nome}</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </table>
                                    </div>
                                )}
                            </div>
                            
                        </Fragment>
                    )       
                :
                    listaVaziaAprovadas(status)
            
            }

            {infoContas && infoContas.contas && infoContas.contas.length > 0 && status === "aprovadas_ressalva"
                ?

                    infoContas.contas.map((conta, index) => 
                        <Fragment key={index}>
                            <div className="titulo-tabelas-conta mb-3">
                                <p className='mb-1 font-weight-bold'>
                                    <strong>Conta {conta.nome}</strong>
                                </p>
                            </div>

                            <table key={`table-${index}`} className="table table-bordered tabela-status-pc">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{width: '3%'}}>Ordem</th>
                                        <th scope="col" style={{width: '35%'}}>Unidade educacional</th>
                                        <th scope="col" style={{width: '25%'}}>Motivos</th>
                                        <th scope="col" style={{width: '25%'}}>Recomendações</th>
                                    </tr>
                                </thead>

                                {conta.info.map((info, index_info) => 
                                    <tbody key={`tbody-${index_info}`}>
                                        <tr>
                                            <td>{index_info+1}</td>
                                            <td>{info.unidade.codigo_eol} - {info.unidade.tipo_unidade} {info.unidade.nome}</td>
                                            <td>
                                                {info.motivos_aprovada_ressalva.map((motivo, index) => 
                                                    <p key={`motivo-${index}`} className="mb-0">{motivo}</p>
                                                )}
                                            </td>
                                            <td>{info.recomendacoes}</td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </Fragment>
                    )       
                :
                    listaVaziaAprovadasRessalva(status)
            
            }

            {infoContas && infoContas.contas && infoContas.contas.length > 0 && status === "reprovadas"
                ?

                    infoContas.contas.map((conta, index) => 
                        <Fragment key={index}>
                            <div className="titulo-tabelas-conta mb-3">
                                <p className='mb-1 font-weight-bold'>
                                    <strong>Conta {conta.nome}</strong>
                                </p>
                            </div>

                            <table key={`table-${index}`} className="table table-bordered tabela-status-pc">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{width: '3%'}}>Ordem</th>
                                        <th scope="col" style={{width: '35%'}}>Unidade educacional</th>
                                        <th scope="col" style={{width: '50%'}}>Motivos</th>
                                    </tr>
                                </thead>

                                {conta.info.map((info, index_info) => 
                                    <tbody key={`tbody-${index_info}`}>
                                        <tr>
                                            <td>{index_info+1}</td>
                                            <td>{info.unidade.codigo_eol} - {info.unidade.tipo_unidade} {info.unidade.nome}</td>
                                            <td>
                                                {info.motivos_reprovacao.map((motivo, index) => 
                                                    <p key={`motivo-${index}`} className="mb-0">{motivo}</p>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </Fragment>
                    )       
                :
                    listaVaziaReprovadas(status)
            
            }

            {exibirUltimoItem &&
                <p className="titulo-tabelas">
                    d) Submeter ao Sr. Diretor Regional de Educação, a presente Ata, com o parecer conclusivo desta Comissão
                    atendendo ao inciso IV, do art. 34 da Portaria SME nº 6.634/2021, manter sob custódia até a publicação
                    do despacho no DOC.
                </p>
            }
            
        </>

    )

    
}