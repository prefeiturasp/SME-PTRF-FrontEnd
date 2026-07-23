import React, {Fragment} from "react";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";


export const TabelaAprovadas = ({infoContas, status, exibirUltimoItem}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();
    const habilitaAprovacaoComRessalvas = recursoSelecionado?.habilita_aprovacao_com_ressalvas || false;    

    const listaVaziaAprovadas = (status_pc) => {
        if(status_pc === "aprovadas"){
            return (
                <p className="lista-vazia">Nenhuma prestação de contas aprovada.</p>
            )
        }
        return null;
    }

    const listaVaziaAprovadasRessalva = (status_pc) => {
        if(status_pc === "aprovadas_ressalva" && habilitaAprovacaoComRessalvas){
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
                <div className="titulo-tabelas" dangerouslySetInnerHTML={{__html: recursoSelecionado?.textos_ata?.letra_a }} />
            }

            {status === "aprovadas_ressalva" && habilitaAprovacaoComRessalvas &&
                <div className="titulo-tabelas" dangerouslySetInnerHTML={{__html: recursoSelecionado?.textos_ata?.letra_b }} />
            }

            {status === "reprovadas" &&
                <div className="titulo-tabelas" dangerouslySetInnerHTML={{__html: recursoSelecionado?.textos_ata?.letra_c }} />
            }


            {infoContas && infoContas.contas && infoContas.contas.length > 0 && status === "aprovadas"
                ?

                    infoContas.contas.map((conta, index) => 
                        <Fragment key={index}>
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

            {infoContas && infoContas.contas && infoContas.contas.length > 0 && status === "aprovadas_ressalva" && habilitaAprovacaoComRessalvas
                ?

                    infoContas.contas.map((conta, index) => 
                        <Fragment key={index}>
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

            {exibirUltimoItem && recursoSelecionado?.textos_ata?.letra_d &&
                <div className="titulo-tabelas" dangerouslySetInnerHTML={{__html: recursoSelecionado?.textos_ata?.letra_d }} />
            }
            
        </>

    )

    
}