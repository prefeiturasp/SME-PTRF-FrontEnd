import React, {Fragment} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp, faEdit, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";

export const TabelaMembros = ({titulo, clickIconeToogle, toggleIcon, cargos, converteNomeRepresentacao, retornaDadosAdicionaisTabela, onDeleteMembro, verificaSeExibeToolTip=null, visoesService}) => {
    const navigate = useNavigate();
    const podeEditarDadosMembros = (item) => {
        if(visoesService.getPermissoes(['change_associacao']) && item && item.infos && item.infos.associacao && item.infos.associacao.data_de_encerramento && item.infos.associacao.data_de_encerramento.pode_editar_dados_associacao_encerrada){
            return true;
        }
        return false;
    }
    
    return(
        <>
            <p><strong>{titulo}</strong></p>
            <table className="table table-bordered tabela-membros">
                <thead>
                <tr className="cabecalho">
                    <th scope="col">Cargo na associação</th>
                    <th scope="col">Nome completo</th>
                    <th scope="col">Representação na associação</th>
                    <th scope="col">&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                {cargos && cargos.length> 0 && cargos.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <tr>
                                <td>
                                    <div className="d-flex justify-content-start">
                                        <a onClick={()=>toggleIcon(index)} data-toggle="collapse" href={`#collapseExample_${index}`} role="button" aria-expanded="false" aria-controls="collapseExample">
                                            <FontAwesomeIcon
                                                style={{fontSize: '30px', marginRight:'5px'}}
                                                icon={clickIconeToogle[index] ? faAngleUp : faAngleDown}
                                            />
                                        </a>
                                        <span>{item.cargo} {verificaSeExibeToolTip && verificaSeExibeToolTip(item.id, item)}</span>
                                    </div>
                                </td>
                                <td><span>{item.infos && item.infos.nome ? item.infos.nome : ""}</span></td>
                                <td><span>{item.infos && item.infos.representacao ? converteNomeRepresentacao(item.infos.representacao) : ""}</span></td>
                                <td>
                                    <div className="d-flex justify-content-center">
                                        <button
                                            onClick={() => {
                                                navigate(`/cadastro-de-membros-da-associacao/${item && item.infos && item.infos.uuid ? item.infos.uuid : ''}`, {
                                                    state: {
                                                       ...item,
                                                    }
                                                });
                                            }}
                                            className="btn-editar-membro"
                                        >
                                            <FontAwesomeIcon
                                                style={{fontSize: '20px', marginRight: "0"}}
                                                icon={faEdit}
                                            />
                                        </button>

                                        {podeEditarDadosMembros(item) &&
                                            <button
                                                disabled={!podeEditarDadosMembros(item)}
                                                className="btn-editar-membro"
                                                onClick={() => onDeleteMembro(item)}
                                            >
                                                <FontAwesomeIcon
                                                    style={{fontSize: '20px', marginRight: "0", color: "#b41d00"}}
                                                    icon={faTimesCircle}
                                                />
                                            </button>
                                        }

                                    </div>

                                </td>
                            </tr>
                            <tr className="collapse cabecalho" id={`collapseExample_${index}`}>
                                <td colSpan="4" >
                                    {item.infos && retornaDadosAdicionaisTabela(item.infos) }
                                </td>
                            </tr>
                        </Fragment>
                    )
                })}
                </tbody>
            </table>
        </>
    );
};